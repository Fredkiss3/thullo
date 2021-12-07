import { TypeORMMemberRepository } from '@thullo/adapters';
import { Member } from '@thullo/domain';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { container, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';

@injectable()
export class SeedController extends AbstractController {

    // HTTP GET /api/members/seed
    async handle(req: Request, res: Response): Promise<Response> {
        const repository: TypeORMMemberRepository = await container.resolve(
            'MemberRepository'
        );

        console.log('Seeding members ...');
        // create 10 members as Greek gods & goddesses
        const members: Member[] = [
            {
                name: 'Aphrodite',
                login: 'aphrodite',
                avatarURL: 'https:/picsum.photos/seed/aphrodite/500/500/',
                idToken: 'token-for-aphrodite',
                id: randomUUID(),
            },
            {
                name: 'Zeus',
                login: 'zeus',
                avatarURL: 'https:/picsum.photos/seed/zeus/500/500/',
                idToken: 'token-for-zeus',
                id: randomUUID(),
            },
            {
                name: 'Hera',
                login: 'hera',
                avatarURL: 'https:/picsum.photos/seed/hera/500/500/',
                idToken: 'token-for-hera',
                id: randomUUID(),
            },
            {
                name: 'Athena',
                login: 'athena',
                avatarURL: 'https:/picsum.photos/seed/athena/500/500/',
                idToken: 'token-for-athena',
                id: randomUUID(),
            },
            {
                name: 'Apollo',
                login: 'apollo',
                avatarURL: 'https:/picsum.photos/seed/apollo/500/500/',
                idToken: 'token-for-apollo',
                id: randomUUID(),
            },
            {
                name: 'Artemis',
                login: 'artemis',
                avatarURL: 'https:/picsum.photos/seed/artemis/500/500/',
                idToken: 'token-for-artemis',
                id: randomUUID(),
            },
            {
                name: 'Hermes',
                login: 'hermes',
                avatarURL: 'https:/picsum.photos/seed/hermes/500/500/',
                idToken: 'token-for-hermes',
                id: randomUUID(),
            },
            {
                name: 'Hephaestus',
                login: 'hephaestus',
                avatarURL: 'https:/picsum.photos/seed/hephaestus/500/500/',
                idToken: 'token-for-hephaestus',
                id: randomUUID(),
            },
            {
                name: 'Ares',
                login: 'ares',
                avatarURL: 'https:/picsum.photos/seed/ares/500/500/',
                idToken: 'token-for-ares',
                id: randomUUID(),
            },
            {
                name: 'Poseidon',
                login: 'poseidon',
                avatarURL: 'https:/picsum.photos/seed/poseidon/500/500/',
                idToken: 'token-for-poseidon',
                id: randomUUID(),
            },
        ];

        for (const member of members) {
            await repository.register(member);
        }
        console.log('Seeding completed');

        return res.status(200).send(await repository.find());
    }
}
