import { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { db } from '../config/firebaseConfig';
import { generateToken, verifyToken } from '../config/jwtConfig';
import { User } from '../interfaces/user';

export const validateUser = [
    body('email').notEmpty().isEmail().withMessage('Invalid email format'),
];

export const getUserByEmail = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const { email } = req.params;
        const userSnapshot = await db.collection('users').where('email', '==', email).get();

        if (userSnapshot.empty) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userSnapshot.docs[0].data() as User;
        const token = generateToken(email);
        res.json({ user: {...user, id: userSnapshot.docs[0].id}, token });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user' });
    }
};

export const addUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const { email } = req.body;
        const userRef = db.collection('users').doc();
        const newUser = { email };

        const existingUserSnapshot = await db.collection('users').where('email', '==', email).get();
        if (!existingUserSnapshot.empty) {
            return res.status(400).json({ message: 'User already exists' });
        }

        await userRef.set(newUser);
        const token = generateToken(email);
        res.status(201).json({ user: {id: userRef.id, ...newUser}, token });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add user' });
    }
};

export const validateToken = (req: Request, res: Response) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ valid: false, message: 'Token is required' });
    }

    try {
        verifyToken(token);
        return res.json({ valid: true });
    } catch (err) {
        return res.status(403).json({ valid: false, message: 'Invalid token' });
    }
}
