import { Router } from 'express'
const router = Router();

// router.get('/test', (req, res) => res.send('hello world'))
import { createCategory, updateCategory, existCategoryByName,getCategories, getCategoryById, getCategoryByName } from '../controllers/categories.controller'

router.post('/createCategory', createCategory);
router.get('/categories', getCategories); // get todos las categorias
router.get('/categories/:id', getCategoryById); //get categoria por id
// router.get('/categories/get/lastId', getLastIdCategory);
router.get('/categories/name/:name', getCategoryByName); //get categoria por nombre
router.get('/categories/exist/:name', existCategoryByName); //get categoria por nombre
router.put('/categories/update/:id', updateCategory); // actualizar categoria

export default router;