import { Router } from 'express';

import { getCustomers, createCustomer, getCustomerId, customersUpdate } from '../controllers/customersController.js'

const router = Router();

router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerId);
router.post('/customers', createCustomer);
router.put('/customers/:id', customersUpdate);

export default router;