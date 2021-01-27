import { Router } from 'express'
const router = Router();

import { createSale, getLastIdSale } from '../controllers/sales.controller'

router.post('/sales/create', createSale); 
router.get('/sales/lastIdSale', getLastIdSale); 

export default router;