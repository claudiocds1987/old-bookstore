import { Request, Response } from 'express'
import { QueryResult } from 'pg'
// pool es la conexion a db tmb se puede llamar db en vez de pool
// en consola poner npm run dev (para iniciar el servidor?)
import { pool } from '../database'

const bcrypt = require('bcrypt'); // para encriptar passwords, se instala con npm install bcrypt.

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response: QueryResult = await pool.query('SELECT * from users');
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('Internal server error');
    }
}

export const existUsername = async (req: Request, res: Response): Promise<Response> => {

    if (!req.params.username) {
        res.status(400).send('FALTA CONTENIDO EN EL CUERPO');
        return
    }

    console.log('username recibido:' + req.params.username);

    try {
        const response: QueryResult = await pool.query(`SELECT * FROM users WHERE username LIKE '%${req.params.username}%'`);
        if (res.json(response.rowCount > 0)) {
             // en Angular obtengo true
             return res.status(200);
        }      
    }
    catch (e) {
        console.log(e);
        res.status(500).json('error al buscar el username');
    }
}


export const existeUserEmail = async (req: Request, res: Response): Promise<Response> => {

    if (!req.params.email) {
        res.status(400).send('FALTA CONTENIDO EN EL CUERPO');
        return
    }

    console.log('email recibido:' + req.params.email);

    try {
        const response: QueryResult = await pool.query(`SELECT * FROM users WHERE email LIKE '%${req.params.email}%'`);
        if (res.json(response.rowCount > 0)) {
             // si existe email en Angular obtengo true sino false
             return res.status(200);
        }      
    }
    catch (e) {
        console.log(e);
        res.status(500).json('error al buscar el email de usuario');
    }
}



export const getUserByUserName = async (req: Request, res: Response): Promise<Response> => {
    try {
        // const response: QueryResult = await pool.query(`SELECT * FROM users WHERE username LIKE '%${req.params.username}%'`);
        const response: QueryResult = await pool.query(`SELECT * FROM users WHERE username = '${req.params.username}'`);
        return res.json(response.rows);
        // return res.json(response.rows[0]);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('error al buscar el usuario por username');
    }
}

// esta hecho en auth.controller.ts
// export const createUser = async (req: Request, res: Response): Promise<Response> => {
//     // recibo los datos (de un form, insomnia rest, etc..)
//     const { pass, registration_date, email, username } = (req.body);
//     // el id_user es autonumerico en la db lo crea automaticamente
//     let password = pass;
//     const hash = await bcrypt.hash(password, 10); // encripta el password 
//     // insert en PostgreSQL
//     const response: QueryResult = await pool.query('INSERT INTO users (pass, registration_date, email, username) VALUES ($1, $2, $3, $4)', [hash, registration_date, email, username]);
//     return res.json({
//         message: 'El usuario ah sido creado exitosamente!',
//         body: {
//             user: {
//                 registration_date,
//                 email,
//                 username
//             }
//         }
//     })
// }

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
    // recibo los datos (de un form, insomnia rest, etc..)
    const { name, surname, birthdate, email, pass, adress, state, username } = (req.body);
    // consulta a PostgreSQL
    await pool.query('UPDATE users set name = $1, surname = $2, birthdate = $3, email = $4, pass = $5, adress = $6, state = $7 WHERE username = $8', [name, surname, birthdate, email, pass, adress, state, username]);
    // las comillas alt+96    
    return res.json(`El usuario ${req.params.username} ah sido actualizado exitosamente!`)
}

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    // console.log(req.params.username);
    // consulta a PostgreSQL
    await pool.query('DELETE FROM users WHERE username = $1', [req.params.username]);
    return res.json(`El usuario ${req.params.username} ah sido eliminado exitosamente!`);
}

