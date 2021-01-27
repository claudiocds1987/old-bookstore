"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const sales_controller_1 = require("../controllers/sales.controller");
router.post('/sales/create', sales_controller_1.createSale);
router.get('/sales/lastIdSale', sales_controller_1.getLastIdSale);
exports.default = router;
