import { Member, MemberRepository } from '@thullo/domain';

export class MemberRepositoryBuilder {
    private getMemberByLogin: (login: string) => Promise<Member | null> = () =>
        Promise.resolve(null);
    private getAll: () => Promise<Member[]> = () => Promise.resolve([]);
    private register: (member: Member) => Promise<void> = () =>
        Promise.resolve();

    withGetMemberByLogin(
        getMemberByLogin: (login: string) => Promise<Member | null>
    ) {
        this.getMemberByLogin = getMemberByLogin;
        return this;
    }

    withGetAll(getAll: () => Promise<Member[]>) {
        this.getAll = getAll;
        return this;
    }

    withRegister(register: (member: Member) => Promise<void>) {
        this.register = register;
        return this;
    }

    build(): MemberRepository {
        return {
            getMemberByLogin: this.getMemberByLogin,
            getAll: this.getAll,
            register: this.register
        };
    }
}
