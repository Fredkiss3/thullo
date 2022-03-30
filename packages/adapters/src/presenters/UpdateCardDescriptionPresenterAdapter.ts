import { container, injectable } from 'tsyringe';
import type {
    UpdateCardDescriptionPresenter,
    UpdateCardDescriptionResponse,
    FieldErrors
} from '@thullo/domain';

export interface UpdateCardDescriptionViewModel {
    data: { success: boolean };
    errors: FieldErrors;
}

@injectable()
export class UpdateCardDescriptionPresenterAdapter
    implements UpdateCardDescriptionPresenter
{
    vm: UpdateCardDescriptionViewModel | null = null;

    present(response: UpdateCardDescriptionResponse): void {
        this.vm = {
            data: { success: response.errors === null },
            errors: response.errors
        };
    }
}

container.register('UpdateCardDescriptionPresenter', {
    useClass: UpdateCardDescriptionPresenterAdapter
});
