import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { Request, Response } from 'express';
import checkShippingMethod from '../utils/check-shipping-method';
import checkUser from '../utils/check-user';
import hasProductMismatches from '../utils/has-product-mismatches';
import type { CheckoutSchema } from '@src/schemas/checkout';
import createSoldProducts from '../utils/create-sold-products';
import calculateTotalPrice from '../utils/calculate-total-price';

export function checkout({ prisma }: Dependecies) {
  return async (req: Request<{}, {}, CheckoutSchema>, res: Response) => {
    const {
      products: cartProducts,
      addressId,
      paymentMethodId,
      discountId,
      shippingMethodId,
    } = req.body;

    const userId = req.user!.id;

    checkUser({ prisma, addressId, paymentMethodId, userId });

    const shippingMethod = await checkShippingMethod(prisma, shippingMethodId);

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: cartProducts.map((p) => p.id),
        },
        AND: [
          {
            variants: {
              some: {
                id: {
                  in: cartProducts.map((p) => p.variantId),
                },
              },
            },
          },
        ],
      },
      include: {
        variants: true,
        categories: true,
        discount: true,
      },
    });

    hasProductMismatches(cartProducts, products);

    const discount = discountId
      ? await prisma.discount.findFirst({
          where: {
            id: discountId,
          },
          select: {
            discountAmount: true,
            discountType: true,
          },
        })
      : null;

    const totalPrice = Number.parseFloat(
      calculateTotalPrice({
        products: cartProducts,
        shippingPrice: shippingMethod.shipping_price,
        discount,
      }).toFixed(2),
    );

    const order = await prisma.order
      .create({
        data: {
          userId: userId,
          products: {
            connect: cartProducts.map((p) => ({ id: p.id })),
          },
          shippingMethodId: shippingMethodId,
          orderPrice: totalPrice,
          addressId: addressId,
          paymentMethodId: paymentMethodId,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              birthday: true,
              gender: true,
              name: true,
              lastName: true,
              phone_number: true,
              profile_photo_url: true,
            },
          },
          products: true,
          shippingMethod: true,
        },
      })
      .catch((error) => {
        console.error(error);
        throw new HttpError('Error occured while creating order', 400);
      });

    await prisma.$transaction(async (prisma) => {
      try {
        for (const product of cartProducts) {
          const variant = await prisma.variant.findUnique({
            where: { id: product.variantId },
          });

          if (!variant) {
            throw new HttpError('Variant not found', 404);
          }

          if (product.availableQuantity - product.quantityToBuy === 0) {
            return await prisma.variant.delete({
              where: {
                id: product.variantId,
              },
            });
          }
          await prisma.variant.update({
            where: {
              id: product.variantId,
            },
            data: {
              quantity: product.availableQuantity - product.quantityToBuy,
            },
          });

          await prisma.orderProduct.create({
            data: {
              orderId: order.id,
              productId: product.id,
              variantId: product.variantId,
              quantityToBuy: product.quantityToBuy,
            },
          });
        }
      } catch (error) {
        console.error(error);
        throw new HttpError('Error updating product variants', 400);
      }
    });

    await prisma.soldProduct.createMany({
      data: createSoldProducts(cartProducts),
    });

    try {
      res.json({
        status: 'success',
        data: order,
      });
    } catch {
      throw new HttpError('Unexpected error occured', 500);
    }
  };
}
