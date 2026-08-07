import { Router } from 'express';
import {
  createContact,
  createPrayer,
  createDonation,
  createReview,
  subscribeNewsletter,
  createTestimony,
  registerForEvent,
  createVolunteer,
  createPartnership,
} from '../controllers/submissionController.js';

const router = Router();

router.post('/contacts', createContact);
router.post('/prayers', createPrayer);
router.post('/donations', createDonation);
router.post('/reviews', createReview);
router.post('/newsletter', subscribeNewsletter);
router.post('/testimonies', createTestimony);
router.post('/events/register', registerForEvent);
router.post('/volunteers', createVolunteer);
router.post('/partnerships', createPartnership);

export default router;
