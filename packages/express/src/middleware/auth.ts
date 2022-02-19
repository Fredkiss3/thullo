import type { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { container } from 'tsyringe';
import { MemberRepository } from '@thullo/domain';
import short from 'short-uuid';
import { ApiResult } from '../../lib/types';
import { getUser } from '../lib/functions';

export const authMiddleware = async (
    req: Request,
    res: Response<ApiResult<null>>,
    next: NextFunction
) => {
    // Get the token from the header which is formatted as: Bearer <token>
    // Verify that the header is correctly formatted before attempting to get the token
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({
            data: null,
            errors: {
                global: ['Authorization header is missing'],
            },
        });
    } else if (!header.startsWith('Bearer ')) {
        return res.status(401).json({
            data: null,
            errors: {
                global: ['Authorization header is malformed'],
            },
        });
    } else {
        res.locals.user = await getUser(req);
        if (res.locals.user !== null) {
            return next();
        } else {
            return res.status(401).json({
                data: null,
                errors: {
                    token: [
                        'Vous devez être connecté pour avoir accès à cette ressource',
                    ],
                },
            });
        }
    }
};
