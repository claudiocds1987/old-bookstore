import { Router } from 'express'
const router = Router();

// router.get('/test', (req, res) => res.send('hello world'))
import { createAuthor, filterAuthorsByName, updateAuthor, existAuthorByName,getAuthorById, getAuthors, getAuthorByName } from '../controllers/authors.controller'

router.post('/authors/create', createAuthor); // crear author
router.get('/authors', getAuthors); // get todos los autores
router.get('/authors/:id', getAuthorById); //get author por id
router.get('/authors/exist/:name', existAuthorByName); // devuelve true/false si existe el nombre del autor
router.get('/authors/name/:name', getAuthorByName); //get author por name
router.get('/authors/filter/:name', filterAuthorsByName);
router.put('/authors/update/:id', updateAuthor); // actualizar autor

export default router;