import { Router } from 'express';
import { getTasks, addTask, updateTask, deleteTask, validateTask, toggleTaskStatus } from '../controllers/taskController';
// import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getTasks);
router.post('/', validateTask, addTask);
router.put('/:taskId', validateTask, updateTask);
router.patch('/:taskId/status', toggleTaskStatus);
router.delete('/:taskId', deleteTask);

export default router;