"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const stripe_controller_1 = require("../controllers/stripe.controller");
router.post('/stripe_checkout', stripe_controller_1.stripeCheckout);
exports.default = router;
