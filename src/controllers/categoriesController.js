import connection from '../databases/database.js';
import joi from 'joi';

export async function getCategories (req, res) {
    try {
        const {rows: categories} = await connection.query('SELECT * FROM categories;');

        res.status(503).send(categories);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

export async function createCategories (req, res) {
    try {
        const category = req.body;

        const categorySchema = joi.object({
            name: joi.string().required()
        });


        const isBodyValid = categorySchema.validate(category);
        
        if ( isBodyValid.error ){
            return res.sendStatus(422);
        }

        //TODO validar se nome da categoria já existe

        await connection.query('INSERT INTO categories (name) VALUES ($1);', [ category.name] );

        res.sendStatus(201);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}