import { Router } from 'express';
import { getTasks, addTask, updateTask, deleteTask, validateTask, toggleTaskStatus } from '../controllers/taskController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateJWT, getTasks);
router.post('/', authenticateJWT, validateTask, addTask);
router.put('/:taskId', authenticateJWT, validateTask, updateTask);
router.patch('/:taskId/status', authenticateJWT, toggleTaskStatus);
router.delete('/:taskId', authenticateJWT, deleteTask);

export default router;