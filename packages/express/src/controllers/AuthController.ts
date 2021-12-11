import { OAuthPresenterAdapter } from '@thullo/adapters';
import { AuthenticateWithOauthUseCase } from '@thullo/domain';
import { Request, Response } from 'express';
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

    // HTTP POST /api/boards
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
        return res.status(200).json(this.presenter.vm);
    }
}
