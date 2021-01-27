import { Router } from 'express'
const router = Router();

import { existEditorialByName, createEditorial, updateEditorial, getEditorialByName, getEditorials, getEditorialById } from '../controllers/editorials.controller'

router.post('/createEditorial', createEditorial);
router.get('/editorials', getEditorials); // get todas las editoriales
router.get('/editorials/:id', getEditorialById); // get editorial por id
router.get('/editorials/exist/:name', existEditorialByName); // get true/false if exist categorie por nombre
router.get('/editorials/name/:name', getEditorialByName); //get editorial por nombre
router.put('/editorials/update/:id', updateEditorial); // actualizar editorial

export default router;