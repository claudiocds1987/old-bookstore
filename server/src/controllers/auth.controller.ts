import { Request, Response } from 'express'
import { QueryResult } from 'pg'
// pool es la conexion a db tmb se puede llamar db en vez de pool
// en consola poner npm run dev (para iniciar el servidor)
import { pool } from '../database'
const bcrypt = require('bcrypt'); // para encriptar passwords, se instala con npm install bcrypt.
// instale npm i jsonwebtoken y tambien npm i @types/jsonwebtoken -D (para que reconosca los metodos)
import jwt from 'jsonwebtoken';
//--------------------------------------------------------------------------------------------
// PARA EL TOKEN fijarse en el archivo server.ts los modulos que instale y el archivo .env
//--------------------------------------------------------------------------------------------

// metodo para registrar usuario
export const signup = async (req: Request, res: Response) => {
    if (!req.body.pass || !req.body.registration_date || !req.body.email || !req.body.username) {
        res.status(400).send('FALTA CONTENIDO EN EL CUERPO');
        return
    }
    //guardo en constantes los datos recibidos de un form, insomnia rest, etc..
    const { pass, registration_date, email, username } = (req.body);
    console.log('Datos recibidos: ' + pass, registration_date, email, username);
    // el id_user es autonumerico en la db lo crea automaticamente
    const hash = await bcrypt.hash(pass, 10); // encripta el password 
    // insert en PostgreSQL
    await pool.query('INSERT INTO users (pass, registration_date, email, username) VALUES ($1, $2, $3, $4) RETURNING id_user', [hash, registration_date, email, username])
        .then(data => {
            res.status(200).send({ message: 'El usuario fue insertado en la db exitosamente' });
            const idUser = JSON.stringify(data.rows[0].id_user);
            console.log('El id de usuario insertado recientemente es: ' + idUser);
        })
        .catch(error => {
            res.status(400).send({ message: 'Error no se pudo insertar al usuario en la base de datos ' + error });
        });
}

// metodo para hacer login
export const signin = async (req: Request, res: Response) => {

    if (!req.body.username || !req.body.password) {
        res.status(400).send('FALTA CONTENIDO EN EL CUERPO');
        return
    }
    // recibo los datos (de un form, insomnia rest, etc..)
    // const { username, password, } = (req.body);
    // console.log('Data recibida: ' + username, password);

    await pool.query(`SELECT * FROM users WHERE username = '${req.body.username}'`)
        .then(data => {
            // obtengo el pass que devolvio la query
            const password = data.rows[0].pass;
            // obtengo el id_user que devolvio la query
            const idUser = data.rows[0].id_user;
            // console.log('password del usuario: ' + password);
            // console.log('ID usuario: ' + idUser);
            // comparo las contraseñas
            const resultPassword = bcrypt.compareSync(req.body.password, password);
            if (resultPassword) {
                //genero el token
                const token: string = jwt.sign({ _id: idUser }, process.env.TOKEN_SECRET || 'tokentest', {
                    // duracion del token
                    expiresIn: 60 * 60 * 24
                });
                // crea un objeto dataUser
                const dataUser = {
                    id: data.rows[0].id_user,
                    username: data.rows[0].username,
                    email: data.rows[0].email,
                    token: token,
                };

                console.log('usuario logeado con token: ' + token);
                // enviando el token a los headers
                res.header('auth-token', token).json(dataUser);
            }
            else {
                console.log('las contraseñas no son iguales');
                // la contraseña es incorrecta
                return res.status(400).send({ message: 'La contraseña es incorrecta!' });
            }


        })
        .catch(error => {
            res.status(400).send({ message: 'Error el nombre de usuario no es valido! ' + error });
        });   
}

// metodo para devolver los datos del usuario
// export const profile = (req: Request, res: Response) => {
//     res.send('profile');
// };



