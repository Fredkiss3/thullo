import { container, injectable } from 'tsyringe';
import type {
    UpdateCardCoverPresenter,
    UpdateCardCoverResponse,
    FieldErrors
} from '@thullo/domain';

export interface UpdateCardCoverViewModel {
    data: { success: boolean };
    errors: FieldErrors;
}

@injectable()
export class UpdateCardCoverPresenterAdapter
    implements UpdateCardCoverPresenter
{
    vm: UpdateCardCoverViewModel | null = null;

    present(response: UpdateCardCoverResponse): void {
        this.vm = {
            data: { success: response.errors === null },
            errors: response.errors
        };
    }
}

container.register('UpdateCardCoverPresenter', {
    useClass: UpdateCardCoverPresenterAdapter
});
