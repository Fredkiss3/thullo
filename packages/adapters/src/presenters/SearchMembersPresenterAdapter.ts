import { container, injectable } from 'tsyringe';
import { FieldErrors } from '@thullo/domain';
import {
    Member,
    SearchMembersPresenter,
    SearchMembersResponse
} from '@thullo/domain';

type MemberData = Array<{
    id: string;
    name: string;
    avatarURL: string | null;
}>;

export interface SearchMembersViewModel {
    data: MemberData;
    errors: FieldErrors;
}

@injectable()
export class SearchMembersPresenterAdapter implements SearchMembersPresenter {
    vm: SearchMembersViewModel | null = null;

    present(response: SearchMembersResponse): void {
        this.vm = {
            data: this.toMemberData(response.members),
            errors: response.errors
        };
    }

    toMemberData(members: Member[]): MemberData {
        return members.map((member) => ({
            id: member.id,
            name: member.name,
            avatarURL: member.avatarURL
        }));
    }
}

container.register('SearchMembersPresenter', {
    useClass: SearchMembersPresenterAdapter
});
