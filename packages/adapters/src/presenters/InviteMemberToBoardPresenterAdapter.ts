import {
    InviteMemberToBoardPresenter,
    InviteMemberToBoardResponse,
} from '@thullo/domain';
import { container, injectable } from 'tsyringe';
import { FieldErrors } from '@thullo/domain';

export interface InviteMemberToBoardViewModel {
    data: {
        success: boolean;
    };
    errors: FieldErrors;
}

@injectable()
export class InviteMemberToBoardPresenterAdapter
    implements InviteMemberToBoardPresenter
{
    vm: InviteMemberToBoardViewModel | null = null;

    present(response: InviteMemberToBoardResponse): void {
        this.vm = {
            data: {
                success: response.errors === null
            },
            errors: response.errors
        };
    }
}

container.register('InviteMemberToBoardPresenter', {
    useClass: InviteMemberToBoardPresenterAdapter
});
