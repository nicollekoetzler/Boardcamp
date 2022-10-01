import connection from '../databases/database.js';
import joi from 'joi';

export async function getCategories (req, res) {
    try {
        const {rows: categories} = await connection.query('SELECT * FROM categories;');

        res.status(200).send(categories);
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

        const isNameExistent = await connection.query('SELECT name FROM categories WHERE name = $1;', [ category.name ]);

        console.log(isNameExistent.rowCount)

        if(isNameExistent.rowCount > 0){
            return res.status(409).send("Já existe uma categoria com esse nome."); //conflict
        }

        await connection.query('INSERT INTO categories (name) VALUES ($1);', [ category.name ] );

        res.sendStatus(201);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}