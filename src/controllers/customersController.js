import connection from "../databases/database.js"

export async function getCustomers (req, res) {
    try {
        const {rows: customers} = await connection.query('SELECT * FROM customers;');

        res.status(200).send(customers);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }

    // TODO 
    // Caso seja passado um parâmetro cpf na query string da requisição, 
    // os clientes devem ser filtrados para retornar somente os com CPF que comecem com a string passada.
}

