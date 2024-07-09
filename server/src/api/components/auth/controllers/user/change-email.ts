import type { Dependecies } from '@src/config/dependencies';
import type { LoginSchema } from '@src/schemas/auth';
import type { ResponseFormat } from '@src/types/response';
import type { Request, Response } from 'express';
import type Mail from 'nodemailer/lib/mailer';
import { HttpError } from '@src/errors';
import ejs from 'ejs';
import fs from 'fs';
import nodemailer from 'nodemailer';
import path from 'path';
import jwt from 'jsonwebtoken';
import { env } from '@src/config/env';

export function changeEmailRequest({ prisma }: Dependecies) {
  return async (
    req: Request<{}, {}, { email: string }>,
    res: Response<ResponseFormat>,
  ) => {
    const { id } = req.user!;
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new HttpError('User not found', 404);
    }

    const token = jwt.sign(
      { data: { email: user.email, newEmail: email } },
      env.JWT_SECRET,
      {
        expiresIn: '1d',
      },
    );

    const templateString = fs.readFileSync(
      path.join(process.cwd(), 'src/email-templates/verify-email.ejs'),
      'utf-8',
    );

    const logoPath = path.join(process.cwd(), 'src/email-templates/logo.png');
    const image = fs.readFileSync(logoPath);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailData = {
      name: `${user.name} ${user.lastName}`,
      link: `${process.env.FRONTEND_DOMAIN}:${process.env.FRONTEND_PORT}/account/profile/change-email?token=${token}`,
    };

    const html = ejs.render(templateString, emailData);

    const mailOptions: Mail.Options = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email verification',
      html: html,
      attachments: [
        {
          filename: 'image.png',
          content: image,
          encoding: 'base64',
          cid: 'logo',
        },
      ],
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('Error:', error);
      } else {
        console.log('Email sent: ', info.response);
      }
    });

    res.status(200).json({ status: 'success' });
  };
}
