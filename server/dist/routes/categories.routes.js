"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
// router.get('/test', (req, res) => res.send('hello world'))
const categories_controller_1 = require("../controllers/categories.controller");
router.post('/createCategory', categories_controller_1.createCategory);
router.get('/categories', categories_controller_1.getCategories); // get todos las categorias
router.get('/categories/:id', categories_controller_1.getCategoryById); //get categoria por id
// router.get('/categories/get/lastId', getLastIdCategory);
router.get('/categories/name/:name', categories_controller_1.getCategoryByName); //get categoria por nombre
router.get('/categories/exist/:name', categories_controller_1.existCategoryByName); //get categoria por nombre
router.put('/categories/update/:id', categories_controller_1.updateCategory); // actualizar categoria
exports.default = router;
