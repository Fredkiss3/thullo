import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.headers.authorization) {
        return res
            .status(403)
            .json({ data: null, errors: { token: 'Non connecté.' } });
    }

    // Split token into 2 parts : Bearer and token
    const [bearer, token] = req.headers.authorization!.split(' ');

    if (token === undefined || bearer !== 'Bearer') {
        return res
            .status(403)
            .json({ data: null, errors: { token: 'Token invalide.' } });
    } else {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);

        // If token is valid, send 200 response
        if (decodedToken) {
            return next();
        } else {
            return res
                .status(401)
                .json({ data: null, errors: { token: 'Non connecté.' } });
        }
    }
};
