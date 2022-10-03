import { Router } from 'express';

import { getCustomers } from '../controllers/customersController.js'

const router = Router();

router.get('/customers', getCustomers);
// router.get('/customers/:id', x);
// router.post('/customers', createCustomers);
// router.put('/customers/:id', x);

export default router;