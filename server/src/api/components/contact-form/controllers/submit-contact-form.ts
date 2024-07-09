import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { ResponseFormat } from '@src/types/response';
import ejs from 'ejs';
import type { Request, Response } from 'express';
import fs from 'fs';
import nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import path from 'path';

export function submitContactForm({ prisma }: Dependecies) {
  return async (
    req: Request,
    res: Response<ResponseFormat & { code?: string }>,
  ) => {
    const { name, email, subject, message } = req.body;

    const templateString = fs.readFileSync(
      path.join(process.cwd(), 'src/email-templates/contact.ejs'),
      'utf-8',
    );

    const logoPath = path.join(process.cwd(), 'src/email-templates/logo.png');
    const image = fs.readFileSync(logoPath);

    const emailData = {
      name,
    };

    const html = ejs.render(templateString, emailData);

    try {
      await prisma.contactSubmission.create({
        data: {
          name,
          email,
          subject,
          message,
        },
      });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions: Mail.Options = {
        from: process.env.EMAIL_USER,
        to: email,
        subject,
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

      res.status(201).json({
        status: 'success',
      });
    } catch (error) {
      console.error('Internal server error:', error);
      throw new HttpError('Internal server error', 500);
    }
  };
}
