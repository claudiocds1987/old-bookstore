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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdmins = exports.login = void 0;
// pool es la conexion a db tmb se puede llamar db en vez de pool
// en consola poner npm run dev (para iniciar el servidor?)
const database_1 = require("../database");
const bcrypt = require('bcrypt'); // para encriptar passwords, se instala con npm install bcrypt.
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.pass || !req.body.state) {
        return res.status(400).send({
            message: "FALTA CONTENIDO EN EL CUERPO, falta email o pass o state"
        });
    }
    try {
        // recibo los datos (de un form, insomnia rest, etc..)
        const { email, pass, state } = (req.body);
        console.log(email, pass, state);
        const query = 'SELECT * FROM admins WHERE email = $1 AND pass = $2 AND admins.state = $3';
        const response = yield database_1.pool.query(query, [email, pass, state]);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('Error de login admin');
    }
});
exports.getAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.pool.query('SELECT * from admins');
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('error al traer todos los admins');
    }
});
