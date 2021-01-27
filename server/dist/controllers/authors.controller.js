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
exports.existAuthorByName = exports.filterAuthorsByName = exports.getAuthorById = exports.getAuthorByName = exports.getAuthors = exports.updateAuthor = exports.createAuthor = void 0;
// pool es la conexion a db tmb se puede llamar db en vez de pool
// en consola poner npm run build (para compilar)
// en consola poner npm run dev (para iniciar el servidor)
const database_1 = require("../database");
exports.createAuthor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check empty name
    if (!req.body.name) {
        return res.status(400).send({
            message: "FALTA CONTENIDO EN EL CUERPO PARA PODER AGREGAR UN AUTOR"
        });
    }
    // guardo en const name lo que llega en el request
    const { name } = (req.body);
    if (name.length > 50)
        return res.status(400).send({
            message: "NO PUEDE TENER UN NOMBRE DE AUTOR CON MAS DE 50 CARACTERES"
        });
    // insert en PostgreSQL
    const response = yield database_1.pool.query('INSERT INTO authors (name) VALUES ($1)', [name]);
    return res.json({
        message: 'El author ah sido creado exitosamente!',
        body: {
            author: {
                name
            }
        }
    });
});
exports.updateAuthor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check empty name
    if (!req.body.name || !req.body.id_author) {
        return res.status(400).send({
            message: "FALTA CONTENIDO EN EL CUERPO PARA ACTUALIZAR EL AUTOR"
        });
    }
    // recibo los datos (de un form, insomnia rest, etc..)
    const { name, id_author } = (req.body);
    if (name.length > 50)
        return res.status(400).send({
            message: "NO SE PUEDE TENER UN NOMBRE DE AUTOR CON MAS DE 50 CARACTERES"
        });
    let id_aut = parseInt(id_author);
    console.log('data recibida: ' + id_aut, name);
    // consulta a PostgreSQL
    yield database_1.pool.query('UPDATE authors set name = $1 WHERE id_author = $2', [name, id_aut]);
    return res.json({
        message: 'El autor ah sido actualizado exitosamente!',
        body: {
            author: {
                name
            }
        }
    });
});
exports.getAuthors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.pool.query('SELECT * from authors order by name asc');
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('Internal server error');
    }
});
exports.getAuthorByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('valor recibido: ' + req.params.name);
    if (!req.params.name) {
        return res.status(400).send({
            message: "FALTA CONTENIDO EN EL CUERPO, falta el nombre para buscar el autor por nombre"
        });
    }
    try {
        const response = yield database_1.pool.query(`SELECT * FROM authors WHERE name ILIKE '%${req.params.name}%'`);
        return res.json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('error al buscar el autor por nombre');
    }
});
exports.getAuthorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const response = yield database_1.pool.query('SELECT * FROM authors WHERE id_author = $1', [id]);
        return res.json(response.rows[0]);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send({
            message: 'Ha ocurrido un error al intentar obtener el autor por id'
        });
        // return res.status(500).json('Internal server error');
    }
});
exports.filterAuthorsByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.name) {
        return res.status(400).send({
            message: "FALTA CONTENIDO EN EL CUERPO, falta el nombre de autor para buscar el autor"
        });
    }
    try {
        const response = yield database_1.pool.query(`SELECT * from authors WHERE authors.name iLIKE '%${req.params.name}%'`);
        return res.json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('Error, no se pudo filtrar autores por el nombre');
    }
});
exports.existAuthorByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Nombre de el autor para evaluar si existe autor: ' + req.params.name);
    if (!req.params.name) {
        return res.status(400).send({
            message: "FALTA CONTENIDO EN EL CUERPO, falta el nombre para buscar el autor"
        });
    }
    try {
        const response = yield database_1.pool.query(`SELECT * FROM authors WHERE name iLIKE '${req.params.name}'`);
        // si hay coincidencia
        if (res.json(response.rowCount > 0)) {
            // en Angular obtengo true
            return res.status(200);
        }
        else {
            // devuelve false
            return res.status(400);
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('error al buscar el autor por nombre');
    }
});
