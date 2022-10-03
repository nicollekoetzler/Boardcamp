import { Router } from 'express';

import { getRentals, createRental } from '../controllers/rentalsController.js'

const router = Router();

router.get('/rentals', getRentals);
router.post('/rentals', createRental);
//router.post('/rentals/:id/return', x);
//router.delete('/rentals/:id', x);

export default router;