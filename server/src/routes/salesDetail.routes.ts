import { Router } from 'express'
const router = Router();

import { createSaleDetail } from '../controllers/salesDetail.controller'

router.post('/salesDetail/create', createSaleDetail);

export default router;