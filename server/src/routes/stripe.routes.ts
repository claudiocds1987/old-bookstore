import { Router } from 'express'
const router = Router();

import { stripeCheckout } from '../controllers/stripe.controller'

router.post('/stripe_checkout', stripeCheckout); 

export default router;