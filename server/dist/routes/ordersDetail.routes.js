"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const ordersDetail_controller_1 = require("../controllers/ordersDetail.controller");
router.post('/ordersDetail/create', ordersDetail_controller_1.createOrderDetail);
router.get('/getOrderDetail/:id_order', ordersDetail_controller_1.getOrderDetail);
exports.default = router;
