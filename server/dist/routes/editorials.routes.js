"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const editorials_controller_1 = require("../controllers/editorials.controller");
router.post('/createEditorial', editorials_controller_1.createEditorial);
router.get('/editorials', editorials_controller_1.getEditorials); // get todas las editoriales
router.get('/editorials/:id', editorials_controller_1.getEditorialById); // get editorial por id
router.get('/editorials/exist/:name', editorials_controller_1.existEditorialByName); // get true/false if exist categorie por nombre
router.get('/editorials/name/:name', editorials_controller_1.getEditorialByName); //get editorial por nombre
router.put('/editorials/update/:id', editorials_controller_1.updateEditorial); // actualizar editorial
exports.default = router;
