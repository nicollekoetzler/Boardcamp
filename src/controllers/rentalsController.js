import connection from '../databases/database.js';
import joi from 'joi';

export async function getRentals (req, res) {

    const { customerId, gameId } = req.query;

    try{

        if(customerId){
            const { rows: customerSearch } = await connection.query(
                `SELECT * FROM customers WHERE id LIKE $1`, [`${customerId}%`]
            )
            res.status(200).send(customerSearch);
        }

        if(gameId){
            const { rows: gameSearch } = await connection.query(
                `SELECT * FROM games WHERE id LIKE $1`, [`${gameId}%`]
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
        const { customerId, gameId, daysRented } = req.body;

        const isCustomerIdExistent = await connection.query('SELECT * FROM customers WHERE id = $1;', [ customerId ] );
        
        if(isCustomerIdExistent.rowCount === 0){
            res.status(400).send("Cliente não encontrado");
        }

        const isGameIdExistent = await connection.query('SELECT * FROM games WHERE id = $1;', [ gameId ] );
        
        if(isGameIdExistent.rowCount === 0){
            res.status(400).send("Jogo não encontrado");
        }

        const isGameAvaliable = await connection.query('SELECT "stockTotal" FROM games WHERE id = $1;', [ gameId ] );
        
        if(isGameAvaliable.rows[0].stockTotal === 0){
            res.status(400).send("Jogo não disponível");
        }

        const rentDate = new Date()
        const pricePerDay = await connection.query(`SELECT "pricePerDay" FROM games WHERE id=$1`,[gameId])
        const originalPrice = (pricePerDay.rows[0].pricePerDay)*daysRented;   
        await connection.query(`
            INSERT INTO rentals ("customerId","gameId","rentDate","daysRented","returnDate","originalPrice","delayFee") 
            VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            [customerId, gameId,rentDate, daysRented, null, originalPrice, null]
        )
    
        res.sendStatus(201);

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

export async function concludeRental (req, res) {
    try{
        const { id } = req.params;

        const isRentIdExistent = await connection.query('SELECT * FROM rentals WHERE id = $1;', [ id ] );
        
        if(isRentIdExistent.rowCount === 0){
            res.status(404).send("Aluguel não encontrado");
        }

        const rental = isRentIdExistent.rows[0];
        if(rental.returnDate){
            res.status(400).send("Aluguel finalizado")
        }else{
            const difference = new Date().getTime() - new Date(rental.rentDate).getTime();
            const differenceDays = (difference / (24 * 3600 * 1000));
    
            let fee = 0;
            if(differenceDays > rental.daysRented){
                const extraDays = differenceDays - rental.daysRented;
                fee = extraDays * rental.originalPrice;
            }
        }

        await connection.query('UPDATE rentals SET "returnDate" = NOW(), "fee" = $1 WHERE id = $2',[ fee, id ] );

        res.sendStatus(200);

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

export async function deleteRental (req, res) {

    const { id } = req.params;

    try{
        
        const rentalId = await connection.query('SELECT * FROM rentals WHERE id = $1', [ id ] )

        if (rentalId.rows.length === 0 || rentalId.rows[0].returnDate !== null){
            res.status(400).send("Aluguel finalizado ou inexistente")
        }

        await connection.query('DELETE FROM rentals WHERE id = $1', [ id ] )
        res.sendStatus(200);

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}