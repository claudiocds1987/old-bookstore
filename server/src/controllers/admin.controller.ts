import { Request, Response } from 'express'
import { QueryResult } from 'pg'
// pool es la conexion a db tmb se puede llamar db en vez de pool
// en consola poner npm run dev (para iniciar el servidor?)
import { pool } from '../database'

const bcrypt = require('bcrypt'); // para encriptar passwords, se instala con npm install bcrypt.

export const login = async (req: Request, res: Response): Promise<Response> => {
    
    if(!req.body.email || !req.body.pass || !req.body.state){
        return res.status(400).send({
            message: "FALTA CONTENIDO EN EL CUERPO, falta email o pass o state"
        });
    }

    try{
        // recibo los datos (de un form, insomnia rest, etc..)
        const { email, pass, state } = (req.body);
        console.log(email, pass, state);
        const query = 'SELECT * FROM admins WHERE email = $1 AND pass = $2 AND admins.state = $3';
        const response: QueryResult = await pool.query(query, [email, pass, state]);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).json('Error de login admin');
    } 
    
}

export const getAdmins = async (req: Request, res: Response): Promise<Response> => {
    try{
        const response: QueryResult = await pool.query('SELECT * from admins');
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).json('error al traer todos los admins');
    }    
}
