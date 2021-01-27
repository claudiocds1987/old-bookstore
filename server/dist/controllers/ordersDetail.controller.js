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
exports.getOrderDetail = exports.createOrderDetail = void 0;
// pool es la conexion a db tmb se puede llamar db en vez de pool
// en consola poner npm run dev (para iniciar el servidor?)
const database_1 = require("../database");
exports.createOrderDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // En mi ordersDetail.routes.ts, la ruta router.post('router.post('/ordersDetail/create', no recibe ningun parametro por url, sino que recibe todos los datos por el body, por esta razon se evalua como !req.body.id_order etc..
    // si por ejemplo tengo la ruta /user/:name, entonces la propidad "name" se evalúa como !req.params.name y no como !req.body.name
    // pregunto si recibe valores null o undefined en el cuerpo
    if (!req.body.id_order || !req.body.id_product || !req.body.product_price || !req.body.product_quantity) {
        res.status(400).send('FALTA CONTENIDO EN EL CUERPO');
    }
    // recibo los datos (de un form, insomnia rest, etc..)
    const { id_order, id_product, product_price, product_quantity } = (req.body);
    console.log(id_order, id_product, product_price, product_quantity);
    let idOrder = parseInt(id_order);
    let idProduct = parseInt(id_product);
    let price = parseInt(product_price);
    let cantidad = parseInt(product_quantity);
    const response = yield database_1.pool.query('INSERT INTO orders_detail (id_order, id_product, product_price, product_quantity) VALUES ($1, $2, $3, $4)', [idOrder, idProduct, price, cantidad]);
    return res.json({
        message: 'El detalle de la orden ah sido creada exitosamente!',
        body: {
            orders: {
                idOrder
            }
        }
    });
});
exports.getOrderDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id_order) {
        res.status(400).send('FALTA CONTENIDO EN EL CUERPO');
    }
    try {
        const id = parseInt(req.params.id_order);
        const response = yield database_1.pool.query('SELECT * FROM orders_detail WHERE orders_detail.id_order = $1', [id]);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('Internal server error');
    }
});
