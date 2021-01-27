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
exports.stripeCheckout = void 0;
// import { QueryResult } from 'pg'
// stripe api para pagos online
const stripe = require('stripe')('sk_test_51HtFjbBJjkabJhWP1I8nUDPLKDfNtK3nSRxSqIfqR8LZUzIxPYdSvNMUKpuIE75lCm8C7jGYNUsGSqX2b8RfWTFo00xPoPW6j2');
exports.stripeCheckout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check empty name
    // if(!req.body.name){
    //     return res.status(400).send({
    //         message: "FALTA CONTENIDO EN EL CUERPO PARA PODER AGREGAR UN AUTOR"
    //     });
    // }
    const stripeToken = req.body.stripeToken;
    const cantidad = req.body.cantidad; // es la cantidad de plata
    const cantidadInEur = Math.round(cantidad * 100);
    // creo objeto para almacenar la respuesta que devuelve stripe al hacer la carga del pago
    const chargeObject = yield stripe.charges.create({
        amount: cantidadInEur,
        currency: 'eur',
        // con este stripeToken, stripe sabe a que tarjeta hay que cargarle el pago
        source: stripeToken,
        capture: false,
        description: 'Probando stripe',
        // envia el recibo al email
        receipt_email: 'cla8787@gmail.com'
    });
    // aca puedo enviar la transaccion a la base de datos ?
    try {
        // hago la transaccion
        yield stripe.charges.capture(chargeObject.id);
        res.json(chargeObject); // devuelvo la respuesta de transacción exitosa
    }
    catch (error) {
        // si hay un error en la transacción se devuelve el dinero 
        yield stripe.refunds.create({ charge: chargeObject.id });
        res.json(chargeObject); // devuelvo la respuesta de error de transacción
    }
});
