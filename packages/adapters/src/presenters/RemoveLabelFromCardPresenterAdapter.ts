import {
    RemoveLabelFromCardPresenter,
    RemoveLabelFromCardResponse
} from '@thullo/domain';
import { container, injectable } from 'tsyringe';
import { FieldErrors } from '@thullo/domain';

export interface RemoveLabelFromCardViewModel {
    data: {
        success: boolean;
    };
    errors: FieldErrors;
}

@injectable()
export class RemoveLabelFromCardPresenterAdapter
    implements RemoveLabelFromCardPresenter
{
    vm: RemoveLabelFromCardViewModel | null = null;

    present(response: RemoveLabelFromCardResponse): void {
        this.vm = {
            data: {
                success: response.errors === null
            },
            errors: response.errors
        };
    }
}

container.register('RemoveLabelFromCardPresenter', {
    useClass: RemoveLabelFromCardPresenterAdapter
});
