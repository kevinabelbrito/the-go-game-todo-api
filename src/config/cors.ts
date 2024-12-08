import { NextFunction, Request, Response } from "express";
import dotenv from 'dotenv';

dotenv.config();

const allowedIPs = process.env?.ALLOWED_SITES || "";

export const cors = (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin as string;
    if (allowedIPs.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        res.setHeader('Access-Control-Allow-Origin', '');
    }
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // allow preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
}