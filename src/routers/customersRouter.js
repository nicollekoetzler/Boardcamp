import { Router } from 'express';

import { getCustomers, createCustomer } from '../controllers/customersController.js'

const router = Router();

router.get('/customers', getCustomers);
// router.get('/customers/:id', x);
router.post('/customers', createCustomer);
// router.put('/customers/:id', x);

export default router;