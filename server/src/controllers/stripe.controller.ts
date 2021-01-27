import { Request, Response } from 'express'
// import { QueryResult } from 'pg'

// stripe api para pagos online
const stripe = require('stripe')('sk_test_51HtFjbBJjkabJhWP1I8nUDPLKDfNtK3nSRxSqIfqR8LZUzIxPYdSvNMUKpuIE75lCm8C7jGYNUsGSqX2b8RfWTFo00xPoPW6j2'); 

export const stripeCheckout = async (req: Request, res: Response) => {
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
    const chargeObject = await stripe.charges.create({
        amount: cantidadInEur,
        currency: 'eur', // formato de moneda en euros
        // con este stripeToken, stripe sabe a que tarjeta hay que cargarle el pago
        source: stripeToken,
        capture: false,
        description: 'Probando stripe',
        // envia el recibo al email
        receipt_email: 'cla8787@gmail.com'
    });
    // aca puedo enviar la transaccion a la base de datos ?
    try{
        // hago la transaccion
        await stripe.charges.capture(chargeObject.id);
        res.json(chargeObject); // devuelvo la respuesta de transacción exitosa
    } catch(error){
        // si hay un error en la transacción se devuelve el dinero 
        await stripe.refunds.create({ charge: chargeObject.id });
        res.json(chargeObject); // devuelvo la respuesta de error de transacción
    }

  }