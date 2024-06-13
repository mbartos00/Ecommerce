import { Request, Response } from 'express';
import mailjet, { PostResource } from 'node-mailjet';
import type { Dependecies } from '@src/config/dependencies';
import type { ResponseFormat } from '@src/types/response';
import { HttpError } from '@src/errors';

export function submitContactForm({ prisma }: Dependecies) {
  return async (
    req: Request,
    res: Response<ResponseFormat & { code?: string }>,
  ) => {
    const { name, email, subject, message } = req.body;

    try {
      const submission = await prisma.contactSubmission.create({
        data: {
          name,
          email,
          subject,
          message,
        },
      });

      const mailjetClient = mailjet.apiConnect(
        process.env.MAILJET_API_KEY,
        process.env.MAILJET_API_SECRET,
      );
      const request: PostResource.Post = mailjetClient.post('send', {
        version: 'v3.1',
      });

      const requestPayload = {
        Messages: [
          {
            From: {
              Email: email,
              Name: name,
            },
            To: [
              {
                Email: 'ecommcapstone@gmail.com',
                Name: 'E-commerce Capstone',
              },
            ],
            Subject: subject,
            TextPart: message,
          },
        ],
      };

      const result = await request.request(requestPayload);

      res.status(201).json({
        status: 'success',
        message: 'Contact form submission successful',
      });
    } catch (error) {
      console.error('Internal server error:', error);
      throw new HttpError('Internal server error', 500);
    }
  };
}
