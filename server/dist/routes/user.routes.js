"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
// router.get('/test', (req, res) => res.send('hello world'))
const user_controller_1 = require("../controllers/user.controller");
router.get('/users', user_controller_1.getUsers); // get todos los usuarios
router.get('/users/:username', user_controller_1.getUserByUserName); //get usuario por username
//router.post('/users', createUser); // crear usuario
router.get('/users/exist/username/:username', user_controller_1.existUsername);
router.get('/users/exist/email/:email', user_controller_1.existeUserEmail);
router.put('/users/:username', user_controller_1.updateUser); // actualizar usuario
router.delete('/users/:username', user_controller_1.deleteUser); // delete usuario
exports.default = router;
