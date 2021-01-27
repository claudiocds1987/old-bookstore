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
exports.existCategoryByName = exports.getCategoryByName = exports.getCategoryById = exports.getCategories = exports.updateCategory = exports.createCategory = void 0;
// pool es la conexion a db tmb se puede llamar db en vez de pool
// en consola poner npm run dev (para iniciar el servidor), npm run build para compilar
const database_1 = require("../database");
exports.createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check empty name
    if (!req.body.name) {
        return res.status(400).send({
            message: "FALTA CONTENIDO EN EL CUERPO PARA PODER AGREGAR UNA CATEGORIA"
        });
    }
    // guardo en const lo que llega en el request
    let { name } = (req.body);
    if (name.length > 50)
        return res.status(400).send({
            message: "NO PUEDE TENER UN NOMBRE DE CATEGORIA CON MAS DE 50 CARACTERES"
        });
    let id;
    /* nota: la columna id_category en la db no es de type serial(autoincremental), entonces 1ro consulto si hay registros. si hay, al id le sumo 1
       caso contrario, si no hay registros, el id = 1.*/
    // check si hay registros en la base de datos
    const categories = yield database_1.pool.query('select * from categories');
    // si hay registros
    if (categories.rowCount > 0) {
        // sumo 1 al id
        id = categories.rowCount + 1;
    }
    else {
        // si no hay registros, id = 1
        id = 1;
    }
    // insert en PostgreSQL
    const response = yield database_1.pool.query('INSERT INTO categories (id_category, name) VALUES ($1, $2)', [id, name]);
    return res.json({
        message: 'la categoria ah sido creado exitosamente!',
        body: {
            category: {
                name
            }
        }
    });
});
exports.updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check empty name
    if (!req.body.name || !req.body.id_category) {
        return res.status(400).send({
            message: "FALTA CONTENIDO EN EL CUERPO PARA ACTUALIZAR LA CATEGORIA"
        });
    }
    // recibo los datos (de un form, insomnia rest, etc..)
    const { name, id_category } = (req.body);
    if (name.length > 50)
        return res.status(400).send({
            message: "NO SE PUEDE TENER UN NOMBRE DE CATEGORIA CON MAS DE 50 CARACTERES"
        });
    let id_cat = parseInt(id_category);
    console.log('data recibida: ' + id_cat, name);
    // consulta a PostgreSQL
    yield database_1.pool.query('UPDATE categories set name = $1 WHERE id_category = $2', [name, id_cat]);
    return res.json({
        message: 'La categoria ah sido actualizada exitosamente!',
        body: {
            category: {
                name
            }
        }
    });
});
exports.getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.pool.query('SELECT * from categories');
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('Internal server error');
    }
});
exports.getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const response = yield database_1.pool.query('SELECT * FROM categories WHERE id_category = $1', [id]);
        return res.json(response.rows[0]);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send({
            message: 'Ha ocurrido un error al intentar obtener la categoria por id'
        });
        // return res.status(500).json('Internal server error');
    }
});
exports.getCategoryByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('valor recibido: ' + req.params.name);
    if (!req.params.name) {
        return res.status(400).send({
            message: "FALTA CONTENIDO EN EL CUERPO, falta el nombre para buscar la categoria"
        });
    }
    try {
        const response = yield database_1.pool.query(`SELECT * FROM categories WHERE name ILIKE '%${req.params.name}%'`);
        return res.json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('error al buscar la categoria por nombre');
    }
});
exports.existCategoryByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Nombre de la categoria para evaluar si existe categoria: ' + req.params.name);
    if (!req.params.name) {
        return res.status(400).send({
            message: "FALTA CONTENIDO EN EL CUERPO, falta el nombre para buscar la categoria"
        });
    }
    try {
        const response = yield database_1.pool.query(`SELECT * FROM categories WHERE name iLIKE '${req.params.name}'`);
        // si rowCount > 0 es porque hay coincidencia
        if (res.json(response.rowCount > 0)) {
            // si existe el nombre de categoria, en Angular devuelve true
            return res.status(200);
        }
        else {
            // devuelve false
            return res.status(400);
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('error al buscar la categoria por nombre');
    }
});
