import connection from '../databases/database.js';
import joi from 'joi';

export async function getGames (req, res) {

    try {
        const { rows: games } = await connection.query(
            'SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id;'
        );
        
        //TODO: "Caso seja passado um parâmetro name na query string da requisição,
        // os jogos devem ser filtrados para retornar somente os que começam com a string passada."

        // const name = await req.query.name

        // if(name){

        // }

        res.status(200).send(games);
    }catch(err){
        console.log(err);
        res.sendStatus(500); //internal server error
    }

}

export async function createGames (req, res) {
    try{
        const game = req.body;

        const gameSchema = joi.object({
            name: joi.string().required(),
            image: joi.string().required(),
            stockTotal: joi.string().required(),
            categoryId: joi.number().required(),
            pricePerDay: joi.string().required(),
        });

        const isBodyValid = gameSchema.validate(game);
        
        if ( isBodyValid.error ){
            return res.sendStatus(422); // unprocessable entity
        }
        
        const isIdExistent = await connection.query('SELECT id FROM categories WHERE id = $1;', [ game.categoryId ] );
        
        if(isIdExistent.rowCount === 0){
            return res.status(400).send("Categoria não localizada."); //bad request
        }
        
        const isNameExistent = await connection.query('SELECT name FROM games WHERE name = $1;', [ game.name ] );
        
        if(isNameExistent.rowCount > 0){
            return res.status(409).send("Já existe um jogo com esse nome."); //conflict
        }

        // TODO: stockTotal e pricePerDay devem ser maiores que 0; 

        // const stockTotal = await connection.query('SELECT "stockTotal" FROM games WHERE stockTotal = $1;', [ game.stockTotal ] );

        // if(Number(stockTotal) < 1){
        //     return res.status(409).send("batatinha");
        // }

        await connection.query('INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);', [ game.name, game.image, game.stockTotal, game.categoryId, game.pricePerDay ] );
        res.sendStatus(201); //created
    }catch(err){
        console.log(err)
        res.sendStatus(500); //internal server error
    }
    
}