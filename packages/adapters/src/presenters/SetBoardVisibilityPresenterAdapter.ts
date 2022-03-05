import {
    SetBoardVisibilityPresenter,
    SetBoardVisibilityResponse
} from '@thullo/domain';
import { container, injectable } from 'tsyringe';
import { FieldErrors } from '@thullo/domain';

export interface SetBoardVisibilityViewModel {
    data: {
        success: boolean;
    };
    errors: FieldErrors;
}

@injectable()
export class SetBoardVisibilityPresenterAdapter
    implements SetBoardVisibilityPresenter
{
    vm: SetBoardVisibilityViewModel | null = null;

    present(response: SetBoardVisibilityResponse): void {
        this.vm = {
            data: {
                success: response.errors === null
            },
            errors: response.errors
        };
    }
}

container.register('SetBoardVisibilityPresenter', {
    useClass: SetBoardVisibilityPresenterAdapter
});
