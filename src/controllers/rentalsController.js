import connection from '../databases/database.js';
import joi from 'joi';

export async function getRentals (req, res) {

    try{

        const {customerId, gameId} = req.query;

        if(customerId){
            const { rows: customerSearch } = await connection.query(
                `SELECT * FROM customers WHERE id=$1`, [customerId]
            )
            res.status(200).send(customerSearch);
        }

        if(gameId){
            const { rows: gameSearch } = await connection.query(
                `SELECT * FROM games WHERE id=$1`, [gameId]
            )
            res.status(200).send(gameSearch);
        }


        const { rows: rentalsList } = await connection.query(`
        SELECT rentals.*, games.id as "gameId", games.name as "gameName", games."categoryId" as "gameCategoryId", customers.name as "customerName", customers.id as "customerId", categories.id as "categoryId", categories.name as "categoryName" FROM rentals
        JOIN games
        ON rentals."gameId" = games.id
        JOIN customers
        ON rentals."customerId" = customers.id
        JOIN categories
        ON games."categoryId" = categories.id
        `)

        res.status(200).send(rentalsList);

    }catch(err){
        console.log(err);
        res.sendStatus(500); //internal server error
    }
}

export async function createRental (req, res){
    try{
        

    }catch(e){
        console.log(e);
        res.status(500).send("Ocorreu um erro ao obter a informação.")
    }
}