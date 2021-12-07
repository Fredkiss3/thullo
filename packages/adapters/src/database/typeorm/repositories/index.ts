import { container } from 'tsyringe';
import { getCustomRepository } from 'typeorm';
import { TypeormDatabaseAdapter } from '../adapter/TypeormDatabaseAdapter';
import { TypeORMBoardRepository } from './TypeORMBoardRepository';
import { TypeORMMemberRepository } from './TypeORMMemberRepository';

container.register('BoardRepository', {
    useFactory: async () => {
        await container.resolve(TypeormDatabaseAdapter).connect();
        return getCustomRepository(TypeORMBoardRepository);
    }
});

container.register('MemberRepository', {
    useFactory: async () => {
        await container.resolve(TypeormDatabaseAdapter).connect();
        return await getCustomRepository(TypeORMMemberRepository);
    }
});

export { TypeORMBoardRepository, TypeORMMemberRepository };
