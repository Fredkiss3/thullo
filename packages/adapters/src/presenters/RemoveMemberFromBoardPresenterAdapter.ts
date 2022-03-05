import {
    RemoveMemberFromBoardPresenter,
    RemoveMemberFromBoardResponse
} from '@thullo/domain';
import { container, injectable } from 'tsyringe';
import { FieldErrors } from '@thullo/domain';

export interface RemoveMemberFromBoardViewModel {
    data: {
        success: boolean;
    };
    errors: FieldErrors;
}

@injectable()
export class RemoveMemberFromBoardPresenterAdapter
    implements RemoveMemberFromBoardPresenter
{
    vm: RemoveMemberFromBoardViewModel | null = null;

    present(response: RemoveMemberFromBoardResponse): void {
        this.vm = {
            data: {
                success: response.errors === null
            },
            errors: response.errors
        };
    }
}

container.register('RemoveMemberFromBoardPresenter', {
    useClass: RemoveMemberFromBoardPresenterAdapter
});
