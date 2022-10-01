import connection from '../databases/database.js';
import joi from 'joi';

export async function getGames (req, res) {

    //TODO verify if it is working correctly

    try {
        const { rows: games } = await connection.query(
            'SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id;'
        );

        res.status(503).send(games);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }

}

export async function createGames (req, res) {

    
}