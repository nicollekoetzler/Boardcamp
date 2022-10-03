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

        // TODO
        // cpf não pode ser de um cliente já existente; ⇒ nesse caso deve retornar status 409

        res.sendStatus(201); //created
    }catch(err){
        console.log(err)
        res.sendStatus(500); //internal server error
    }
}
