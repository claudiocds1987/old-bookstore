"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
// router.get('/test', (req, res) => res.send('hello world'))
const admin_controller_1 = require("../controllers/admin.controller");
router.post('/admin/login', admin_controller_1.login);
router.get('/admins', admin_controller_1.getAdmins);
exports.default = router;
