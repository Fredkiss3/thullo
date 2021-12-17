import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Get the token from the header which is formatted as: Bearer <token>
    // Verify that the the header is correctly formatted before attempting to get the token
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({
            data: null,
            errors: [
                {
                    message: 'Authorization header is missing',
                },
            ],
        });
    } else if (!header.startsWith('Bearer ')) {
        return res.status(401).json({
            data: null,
            errors: [
                {
                    message: 'Authorization header is malformed',
                },
            ],
        });
    } else {
        // Get the token from the header
        const token = header.split('Bearer ')[1].trim();

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
    }
};
