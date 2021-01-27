import { Request, Response } from 'express'
import { QueryResult } from 'pg'
// pool es la conexion a db tmb se puede llamar db en vez de pool
// en consola poner npm run dev (para iniciar el servidor?)
import { pool } from '../database'


export const createSale = async (req: Request, res: Response): Promise<Response> => {

  // En mi sales.routes, la router.post('router.post('/sales/create', no recibe ningun parametro por url, sino que recibe todos los datos por el body, por esta razon se evalua como !req.body.id_user etc..
  // si por ejemplo tengo la ruta /user/:name, entonces la propidad "name" se evalúa como !req.params.name y no como !req.body.name
  // pregunto si recibe valores null o undefined en el cuerpo
  if (!req.body.id_user || !req.body.total_price || !req.body.date) {
    res.status(400).send('FALTA CONTENIDO EN EL CUERPO');
  }

  //recibo los datos (de un form, insomnia rest, etc..)
  const { id_user, total_price, date } = (req.body);
  console.log(id_user, total_price, date)
  // el id_sale en la db es autonumerico no hace falta
  let idUser = parseInt(id_user);
  let totalPrice = parseInt(total_price);

  try {
    const response: QueryResult = await pool.query('INSERT INTO sales (id_user, total_price, date) VALUES ($1, $2, $3)', [idUser, totalPrice, date]);
    return res.json({
      message: 'La venta ah sido creada exitosamente!',
      body: {
        orders: {
          idUser,
          totalPrice,
          date
        }
      }
    })
  }
  catch (e) {
    console.log(e);
    return res.status(500).json('Error, no se pudo insertar la venta en la base de datos');
  }

}

export const getLastIdSale = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response: QueryResult = await pool.query('select max(id_sale) as "lastIdSale" from sales');
    return res.status(200).json(response.rows[0]);
  }
  catch (e) {
    console.log(e);
    return res.status(500).json('Internal server error');
  }
}