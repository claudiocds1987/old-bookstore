import { Router } from 'express'
const router = Router();

import { createOrder, getLastIdOrder, getOrdersByUserId } from '../controllers/orders.controller'

router.post('/orders/create', createOrder); 
router.get('/orders/lastIdOrder', getLastIdOrder);
router.get('/orders/getOrdersByUserId/:id_user', getOrdersByUserId); // get todas las ordenes por id user 

export default router;