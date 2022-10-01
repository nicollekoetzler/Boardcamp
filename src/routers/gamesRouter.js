import { Router } from 'express';

import { getGames, createGames } from '../controllers/gamesController.js'

const router = Router();

router.get('/categories', getGames);
router.post('/categories', createGames);

export default router;