import { OAuthPresenterAdapter } from '@thullo/adapters';
import { AuthenticateWithOauthUseCase } from '@thullo/domain';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { container, inject, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';

@injectable()
export class AuthController extends AbstractController {
    constructor(
        @inject('AuthenticateWithOauthPresenter')
        private presenter: OAuthPresenterAdapter
    ) {
        super();
    }

    // HTTP POST /api/auth
    async handle(req: Request, res: Response): Promise<Response> {
        const useCase = new AuthenticateWithOauthUseCase(
            container.resolve('OAuthGateway'),
            await container.resolve('MemberRepository')
        );

        await useCase.execute(
            {
                authCode: req.body.authCode,
            },
            this.presenter
        );

        let token: string | null = null;

        if (this.presenter.vm?.data) {
            token = jwt.sign(this.presenter.vm.data, process.env.JWT_SECRET!, {
                expiresIn: '7d', // 7 days
                algorithm: 'HS256',
            });
        }

        return this.getResult(
            {
                data: token == null ? null : { token },
                errors: this.presenter.vm?.errors ?? null,
            },
            res
        );
    }
}
