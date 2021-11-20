import { Member, MemberRepository, SearchMembersResult } from "@thullo/domain";

export class MemberRepositoryBuilder {
    private getMemberByLogin: (login: string) => Promise<Member | null> = () =>
        Promise.resolve(null);
    private getMemberById: (id: string) => Promise<Member | null> = () =>
        Promise.resolve(null);
    private register: (member: Member) => Promise<void> = () =>
        Promise.resolve();

    private searchMembersNotInBoard: (
        boardId: string,
        loginOrName: string
    ) => Promise<SearchMembersResult[]> = () => Promise.resolve([]);

    withGetMemberByLogin(
        getMemberByLogin: (login: string) => Promise<Member | null>
    ) {
        this.getMemberByLogin = getMemberByLogin;
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
        ) => Promise<SearchMembersResult[]>
    ) {
        this.searchMembersNotInBoard = searchMembersNotInBoard;
        return this;
    }

    build(): MemberRepository {
        return {
            getMemberById: this.getMemberById,
            getMemberByLogin: this.getMemberByLogin,
            register: this.register,
            searchMembersNotInBoard: this.searchMembersNotInBoard
        };
    }
}
