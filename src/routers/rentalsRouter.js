import { Router } from 'express';

import { getRentals, createRental, concludeRental, deleteRental } from '../controllers/rentalsController.js'

const router = Router();

router.get('/rentals', getRentals);
router.post('/rentals', createRental);
router.post('/rentals/:id/return', concludeRental);
router.delete('/rentals/:id', deleteRental);

export default router;