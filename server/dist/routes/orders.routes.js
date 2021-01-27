"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const orders_controller_1 = require("../controllers/orders.controller");
router.post('/orders/create', orders_controller_1.createOrder);
router.get('/orders/lastIdOrder', orders_controller_1.getLastIdOrder);
router.get('/orders/getOrdersByUserId/:id_user', orders_controller_1.getOrdersByUserId); // get todas las ordenes por id user 
exports.default = router;
