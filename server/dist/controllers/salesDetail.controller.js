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
exports.createSaleDetail = void 0;
// pool es la conexion a db tmb se puede llamar db en vez de pool
// en consola poner npm run dev (para iniciar el servidor?)
const database_1 = require("../database");
exports.createSaleDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //evalúo si hay datos null o undefined en el cuerpo
    if (!req.body.id_sale || !req.body.id_book || !req.body.quantity || !req.body.price) {
        res.status(400).send('FALTA CONTENIDO EN EL CUERPO');
    }
    //recibo los datos (de un form, insomnia rest, etc..)
    const { id_sale, id_book, quantity, price } = (req.body);
    console.log(id_sale, id_book, quantity, price);
    // el id_sale en la db es autonumerico no hace falta
    let idSale = parseInt(id_sale);
    let idBook = parseInt(id_book);
    let cantidad = parseInt(quantity);
    let precio = parseInt(price);
    try {
        const response = yield database_1.pool.query('INSERT INTO sales_detail (id_sale, id_book, quantity, price) VALUES ($1, $2, $3, $4)', [idSale, idBook, cantidad, precio]);
        return res.json({
            message: 'El detalle de venta ah sido creado exitosamente!',
            body: {
                orders: {
                    idSale,
                    idBook,
                    cantidad,
                    precio
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('Error, no se pudo insertar el detalle de venta en la base de datos');
    }
});
