import connection from "../databases/database.js"
import joi from 'joi';

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

export async function getCustomerId (req, res) {
    const { id } = req.params;

    try{
        const isIdExistent = await connection.query('SELECT * FROM customers WHERE id = $1;', [ id ] );
        
        if(isIdExistent.rowCount === 0){
            return res.status(404).send("Id não localizado."); // not found
        }
        
        res.send(isIdExistent.rows[0]);

    }catch(err){
        console.log(err)
        res.sendStatus(500); //internal server error
    }
}

export async function createCustomer (req, res) {

    const customer = req.body;

    const customerSchema = joi.object({
        name: joi.string().required(),
        phone: joi.string().min(10).max(11).required(),
        cpf: joi.string().length(11).required(),
        birthday: joi.date().required()
    });

    try{
        const isBodyValid = customerSchema.validate(customer);
        
        if ( isBodyValid.error ){
            return res.sendStatus(400); // bad request
        }

        const isCpfExistent = await connection.query('SELECT id FROM customers WHERE cpf = $1;', [ customer.cpf ] );
        
        if(isCpfExistent.rowCount > 0){
            return res.status(409).send("Cliente já cadastrado."); //conflict
        }

        await connection.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);', [ customer.name, customer.phone, customer.cpf, customer.birthday ] );

        res.sendStatus(201); //created
    }catch(err){
        console.log(err)
        res.sendStatus(500); //internal server error
    }
}
