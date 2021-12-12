import { Member, MemberRepository } from '@thullo/domain';

export class MemberRepositoryBuilder {
    private getMemberByEmail: (email: string) => Promise<Member | null> = () =>
        Promise.resolve(null);

    private getMemberById: (id: string) => Promise<Member | null> = () =>
        Promise.resolve(null);
    private register: (member: Member) => Promise<void> = () =>
        Promise.resolve();

    private searchMembersNotInBoard: (
        boardId: string,
        loginOrName: string
    ) => Promise<Member[]> = () => Promise.resolve([]);

    withGetMemberByEmail(
        getMemberByEmail: (email: string) => Promise<Member | null>
    ): MemberRepositoryBuilder {
        this.getMemberByEmail = getMemberByEmail;
        return this;
    }

    withGetMemberById(getMemberById: (id: string) => Promise<Member | null>) {
        this.getMemberById = getMemberById;
        return this;
    }

    withRegister(register: (member: Member) => Promise<void>) {
        this.register = register;
        return this;
    }

    withSearchMembersNotInBoard(
        searchMembersNotInBoard: (
            boardId: string,
            loginOrName: string
        ) => Promise<Member[]>
    ) {
        this.searchMembersNotInBoard = searchMembersNotInBoard;
        return this;
    }

    build(): MemberRepository {
        return {
            getMemberById: this.getMemberById,
            register: this.register,
            searchMembersNotInBoard: this.searchMembersNotInBoard,
            getMembersByEmail: this.getMemberByEmail
        };
    }
}
