import { Router } from 'express';

import { getCategories, createCategories } from '../controllers/categoriesController.js'

const router = Router();

router.get('/categories', getCategories);
router.post('/categories', createCategories);

export default router;