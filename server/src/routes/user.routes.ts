import { Router } from 'express'
const router = Router();

// router.get('/test', (req, res) => res.send('hello world'))
import { getUsers, getUserByUserName, existUsername, existeUserEmail, deleteUser, updateUser } from '../controllers/user.controller'

router.get('/users', getUsers); // get todos los usuarios
router.get('/users/:username', getUserByUserName); //get usuario por username
//router.post('/users', createUser); // crear usuario
router.get('/users/exist/username/:username', existUsername); 
router.get('/users/exist/email/:email', existeUserEmail);
router.put('/users/:username', updateUser); // actualizar usuario
router.delete('/users/:username', deleteUser); // delete usuario

export default router;