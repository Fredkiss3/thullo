import type {
    TypeORMBoardRepository,
    TypeORMMemberRepository,
} from '@thullo/adapters';
import type { Request, Response } from 'express';
import { container, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';
import { getUser } from '../lib/functions';
import short from 'short-uuid';

@injectable()
export class TestDeleteUserController extends AbstractController {
    constructor() {
        super();
    }

    // HTTP DELETE /api/test/delete-user
    async handle(req: Request, res: Response) {
        // get the user from the user repository
        const repository: TypeORMMemberRepository = await container.resolve(
            'MemberRepository'
        );
        const boardRepository: TypeORMBoardRepository = await container.resolve(
            'BoardRepository'
        );

        const member = await getUser(req);
        // delete the user where the uuid is the same as the uuid in the token
        await repository.delete({
            uuid: short().toUUID(member!.id),
        });

        // delete each board where the user participates in
        const boards = await boardRepository.find({
            where: {
                'participants.member.uuid': short().toUUID(member!.id),
            },
        });

        for (const board of boards) {
            await boardRepository.delete({
                uuid: board.uuid,
            });
        }

        return res.status(204).json({
            data: {
                success: true,
            },
            errors: null,
        });
    }
}
