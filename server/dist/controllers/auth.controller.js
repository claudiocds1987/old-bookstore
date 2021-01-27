"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
// pool es la conexion a db tmb se puede llamar db en vez de pool
// en consola poner npm run dev (para iniciar el servidor)
const database_1 = require("../database");
const bcrypt = require('bcrypt'); // para encriptar passwords, se instala con npm install bcrypt.
// instale npm i jsonwebtoken y tambien npm i @types/jsonwebtoken -D (para que reconosca los metodos)
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//--------------------------------------------------------------------------------------------
// PARA EL TOKEN fijarse en el archivo server.ts los modulos que instale y el archivo .env
//--------------------------------------------------------------------------------------------
// metodo para registrar usuario
exports.signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.pass || !req.body.registration_date || !req.body.email || !req.body.username) {
        res.status(400).send('FALTA CONTENIDO EN EL CUERPO');
        return;
    }
    //guardo en constantes los datos recibidos de un form, insomnia rest, etc..
    const { pass, registration_date, email, username } = (req.body);
    console.log('Datos recibidos: ' + pass, registration_date, email, username);
    // el id_user es autonumerico en la db lo crea automaticamente
    const hash = yield bcrypt.hash(pass, 10); // encripta el password 
    // insert en PostgreSQL
    yield database_1.pool.query('INSERT INTO users (pass, registration_date, email, username) VALUES ($1, $2, $3, $4) RETURNING id_user', [hash, registration_date, email, username])
        .then(data => {
        res.status(200).send({ message: 'El usuario fue insertado en la db exitosamente' });
        const idUser = JSON.stringify(data.rows[0].id_user);
        console.log('El id de usuario insertado recientemente es: ' + idUser);
    })
        .catch(error => {
        res.status(400).send({ message: 'Error no se pudo insertar al usuario en la base de datos ' + error });
    });
});
// metodo para hacer login
exports.signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.username || !req.body.password) {
        res.status(400).send('FALTA CONTENIDO EN EL CUERPO');
        return;
    }
    // recibo los datos (de un form, insomnia rest, etc..)
    // const { username, password, } = (req.body);
    // console.log('Data recibida: ' + username, password);
    yield database_1.pool.query(`SELECT * FROM users WHERE username = '${req.body.username}'`)
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
            const token = jsonwebtoken_1.default.sign({ _id: idUser }, process.env.TOKEN_SECRET || 'tokentest', {
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
});
// metodo para devolver los datos del usuario
// export const profile = (req: Request, res: Response) => {
//     res.send('profile');
// };
