import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Use Token stored in cookie
    const token = req.cookies.token;

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        // If token is valid, continue
        res.locals.user = decoded;
        return next();
    } catch (error) {
        return res.status(401).json({
            data: null,
            errors: {
                token: 'Vous devez être connecté pour avoir accès à cette ressource',
            },
        });
    }
};
