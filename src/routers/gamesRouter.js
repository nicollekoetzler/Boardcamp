import { Router } from 'express';

import { getGames, createGames } from '../controllers/gamesController.js'

const router = Router();

router.get('/games', getGames);
router.post('/games', createGames);

export default router;