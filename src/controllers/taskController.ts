import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../config/firebaseConfig';
import { Task } from '../interfaces/task';

export const validateTask = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
];

export const getTasks = async (req: Request, res: Response) => {
  try {
    // const userId = (req as any).user.email;
    const snapshot = await db.collection('tasks')
      // .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    const tasks: Task[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      tasks.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        createdAt: data.createdAt.toDate().toISOString(),
        status: data.status,
        userId: data.userId,
      });
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

export const addTask = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    // const userId = (req as any).user.email;
    const { title, description } = req.body;
    const taskRef = db.collection('tasks').doc();
    const newTask = {
      title,
      description,
      createdAt: new Date(),
      status: 'pending',
      // userId,
    };
    await taskRef.set(newTask);
    res.status(201).json({
      id: taskRef.id,
      ...newTask,
      createdAt: newTask.createdAt.toISOString(),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add task' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    // const userId = (req as any).user.email;
    const { taskId } = req.params;
    const { title, description } = req.body;
    const taskRef = db.collection('tasks').doc(taskId);
    const task = await taskRef.get();

    if (!task.exists /*|| task.data()?.userId !== userId*/) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await taskRef.update({ title, description });
    res.json({ id: taskId, title, description });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    // const userId = (req as any).user.email;
    const { taskId } = req.params;
    const taskRef = db.collection('tasks').doc(taskId);
    const task = await taskRef.get();

    if (!task.exists /*|| task.data()?.userId !== userId*/) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await taskRef.delete();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task' });
  }
};

export const toggleTaskStatus = async (req: Request, res: Response) => {
  try {
    // const userId = (req as any).user.email;
    const { taskId } = req.params;
    const taskRef = db.collection('tasks').doc(taskId);
    const task = await taskRef.get();

    if (!task.exists /*|| task.data()?.userId !== userId*/) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const currentStatus = task.data()?.status;
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';

    await taskRef.update({ status: newStatus });
    res.json({ id: taskId, status: newStatus });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task status' });
  }
};
