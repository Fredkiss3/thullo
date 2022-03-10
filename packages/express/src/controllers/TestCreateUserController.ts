import { MemberRepository } from '@thullo/domain';
import type { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';
// get uuid from crypto
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import short from 'short-uuid';

@injectable()
export class TestCreateUserController extends AbstractController {
    constructor() {
        super();
    }

    // HTTP POST /api/test/create-user
    async handle(req: Request, res: Response) {
        // get the user from the user repository
        const repository: MemberRepository = await container.resolve(
            'MemberRepository'
        );

        const id = crypto.randomUUID();

        // create a new user
        await repository.register({
            id,
            name: 'CyPress Test User',
            login: 'cypress-test-user',
            email: 'test@cypress.io',
            avatarURL: 'https://placekitten.com/g/200/200',
        });

        const token = jwt.sign(
            {
                id: short().fromUUID(id),
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: '7d', // 7 days
                algorithm: 'HS256',
            }
        );

        return res.json({
            data: { token },
            errors: null,
        });
    }
}
