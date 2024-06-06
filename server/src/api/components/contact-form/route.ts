import { Router } from 'express';
import type { Dependecies } from '@src/config/dependencies';
import { submitContactForm } from './controllers/submit-contact-form';
import { contactSchema } from '../../../schemas/contactSchema';
import validate from '../../middleware/validate';

export function contactRouter(deps: Dependecies) {
  const router = Router();

  router.post('/', validate(contactSchema), submitContactForm(deps));

  return router;
}
