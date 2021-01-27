import { Request, Response } from 'express'
import { QueryResult } from 'pg'
// pool es la conexion a db tmb se puede llamar db en vez de pool
// en consola poner npm run dev (para iniciar el servidor?)
import { pool } from '../database'

export const createOrder = async (req: Request, res: Response): Promise<Response> => {

  // En orders.routes.ts, la ruta router.post('/orders/create', no recibe ningun parametro por url, sino que recibe todos los datos por el body, por esta razon se evalua como !req.body.id_user etc..
  // si por ejemplo tengo la ruta /user/:name, entonces la propidad "name" se evalúa como  !req.params.name y no como !req.body.name
  // pregunto si recibe valores null o undefined en el cuerpo
  if(!req.body.id_user || !req.body.adress || !req.body.phone_number || !req.body.total_price || !req.body.provincia || !req.body.localidad || !req.body.order_date){
    res.status(400).send('FALTA CONTENIDO EN EL CUERPO');
  }

  //recibo los datos (de un form, insomnia rest, etc..)
  const { id_user, adress, phone_number, total_price, provincia, localidad, order_date } = (req.body);
  console.log(id_user, adress, phone_number, total_price, provincia, localidad, order_date)
  // el id_order en la db es autonumerico no hace falta
  let idUser = parseInt(id_user);
  let totalPrice = parseInt(total_price);

  const response: QueryResult = await pool.query('INSERT INTO orders (id_user, adress, phone_number, total_price, provincia, localidad, order_date) VALUES ($1, $2, $3, $4, $5, $6, $7)', [idUser, adress, phone_number, totalPrice, provincia, localidad, order_date]);
  return res.json({
    message: 'La orden ah sido creado exitosamente!',
    body: {
      orders: {
        adress
      }
    }
  })
}

export const getLastIdOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response: QueryResult = await pool.query('select max(id_order) as "lastIdOrder" from orders');
    return res.status(200).json(response.rows[0]);
  }
  catch (e) {
    console.log(e);
    return res.status(500).json('Internal server error');
  }
}

export const getOrdersByUserId = async (req: Request, res: Response): Promise<Response> => {
  if(!req.params.id_user){
    res.status(400).send('FALTA CONTENIDO EN EL CUERPO');
  }
  
  try {
    const id = parseInt(req.params.id_user);
    const response: QueryResult = await pool.query('SELECT * FROM orders WHERE orders.id_user = $1', [id]);
    return res.status(200).json(response.rows);
  }
  catch (e) {
    console.log(e);
    return res.status(500).json('Internal server error');
  }
}


