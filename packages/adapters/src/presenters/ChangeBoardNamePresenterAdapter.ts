import {
    ChangeBoardNamePresenter,
    ChangeBoardNameResponse
} from '@thullo/domain';
import { container, injectable } from 'tsyringe';
import { FieldErrors } from '@thullo/domain';

export interface ChangeBoardNameViewModel {
    data: {
        success: boolean;
    };
    errors: FieldErrors;
}

@injectable()
export class ChangeBoardNamePresenterAdapter
    implements ChangeBoardNamePresenter
{
    vm: ChangeBoardNameViewModel | null = null;

    present(response: ChangeBoardNameResponse): void {
        this.vm = {
            data: {
                success: response.errors === null
            },
            errors: response.errors
        };
    }
}

container.register('ChangeBoardNamePresenter', {
    useClass: ChangeBoardNamePresenterAdapter
});
