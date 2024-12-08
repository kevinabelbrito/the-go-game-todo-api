import { Router } from 'express';
import { getUserByEmail, addUser, validateUser, validateToken } from '../controllers/userController';
import { param } from 'express-validator';

const router = Router();

router.get('/:email', param('email').isEmail().withMessage('Invalid email format'), getUserByEmail);
router.post('/', validateUser, addUser);
router.post('/validate-token', validateToken);

export default router;
