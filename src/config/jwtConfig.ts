import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'your_secret_key';

export const generateToken = (email: string) => {
    return jwt.sign({ email }, secretKey, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (err) {
        throw new Error('Invalid token');
    }
};
