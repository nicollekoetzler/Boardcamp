import connection from "../databases/database.js"

export async function getCategories (req, res) {
    try {
        const {rows: categories} = await connection.query('SELECT * FROM categories;');

        console.log(categories);
        res.status(503).send(categories);
    }catch(err){
        console.log(err)
        res.sendStatus(500);
    }
}

export async function createCategories (req, res) {
    
}