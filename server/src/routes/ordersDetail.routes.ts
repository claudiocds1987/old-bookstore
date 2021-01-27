import { Router } from 'express'
const router = Router();

import { createOrderDetail, getOrderDetail } from '../controllers/ordersDetail.controller'

router.post('/ordersDetail/create', createOrderDetail); 
router.get('/getOrderDetail/:id_order', getOrderDetail)
export default router;