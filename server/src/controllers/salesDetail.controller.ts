import { Request, Response } from 'express'
import { QueryResult } from 'pg'
// pool es la conexion a db tmb se puede llamar db en vez de pool
// en consola poner npm run dev (para iniciar el servidor?)
import { pool } from '../database'


export const createSaleDetail = async (req: Request, res: Response): Promise<Response> => {
    
    //evalúo si hay datos null o undefined en el cuerpo
    if (!req.body.id_sale || !req.body.id_book || !req.body.quantity || !req.body.price) {
        res.status(400).send('FALTA CONTENIDO EN EL CUERPO');
    }

    //recibo los datos (de un form, insomnia rest, etc..)
    const { id_sale, id_book, quantity, price } = (req.body);
    console.log(id_sale, id_book, quantity, price)
    // el id_sale en la db es autonumerico no hace falta
    let idSale = parseInt(id_sale);
    let idBook = parseInt(id_book);
    let cantidad = parseInt(quantity);
    let precio = parseInt(price);

    try {
        const response: QueryResult = await pool.query('INSERT INTO sales_detail (id_sale, id_book, quantity, price) VALUES ($1, $2, $3, $4)', [idSale, idBook, cantidad, precio]);
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
        })
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('Error, no se pudo insertar el detalle de venta en la base de datos');
    }
}

