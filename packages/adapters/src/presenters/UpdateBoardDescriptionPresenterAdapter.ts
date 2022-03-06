import {
    UpdateBoardDescriptionPresenter,
    UpdateBoardDescriptionResponse
} from '@thullo/domain';
import { container, injectable } from 'tsyringe';
import { FieldErrors } from '@thullo/domain';

export interface UpdateBoardDescriptionViewModel {
    data: {
        success: boolean;
    };
    errors: FieldErrors;
}

@injectable()
export class UpdateBoardDescriptionPresenterAdapter
    implements UpdateBoardDescriptionPresenter
{
    vm: UpdateBoardDescriptionViewModel | null = null;

    present(response: UpdateBoardDescriptionResponse): void {
        this.vm = {
            data: {
                success: response.errors === null
            },
            errors: response.errors
        };
    }
}

container.register('UpdateBoardDescriptionPresenter', {
    useClass: UpdateBoardDescriptionPresenterAdapter
});
