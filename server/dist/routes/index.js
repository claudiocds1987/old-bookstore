"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
// router.get('/test', (req, res) => res.send('hello world'))
const index_controller_1 = require("../controllers/index.controller");
router.get('/users', index_controller_1.getUsers); // get todos los usuarios
router.get('/users/:username', index_controller_1.getUserByUserName); //get usuario por username
router.post('/users', index_controller_1.createUser); // crear usuario
router.put('/users/:username', index_controller_1.updateUser); // actualizar usuario
router.delete('/users/:username', index_controller_1.deleteUser); // delete usuario
exports.default = router;
