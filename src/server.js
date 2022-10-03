import express , { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import categoriesRouter from './routers/categoriesRouter.js'
import gamesRouter from './routers/gamesRouter.js'
import customersRouter from './routers/customersRouter.js'
import rentalsRouter from './routers/rentalsRouter.js'

dotenv.config();

const server = express();

server.use(cors());
server.use(json());

server.use(categoriesRouter);
server.use(gamesRouter);
server.use(customersRouter);
server.use(rentalsRouter);

server.listen(process.env.PORT, () => {
    console.log("server running on port " + process.env.PORT);
}
);