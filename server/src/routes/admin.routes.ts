import { Router } from 'express'
const router = Router();

// router.get('/test', (req, res) => res.send('hello world'))
import { login, getAdmins } from '../controllers/admin.controller'

router.post('/admin/login', login); 
router.get('/admins', getAdmins);

export default router;