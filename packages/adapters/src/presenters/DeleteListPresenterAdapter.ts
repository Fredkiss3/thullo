import { DeleteListPresenter, DeleteListResponse } from '@thullo/domain';
import { container, injectable } from 'tsyringe';
import { FieldErrors } from '@thullo/domain';

export interface DeleteListViewModel {
    data: { success: boolean };
    errors: FieldErrors;
}

@injectable()
export class DeleteListPresenterAdapter implements DeleteListPresenter {
    vm: DeleteListViewModel | null = null;

    present(response: DeleteListResponse): void {
        this.vm = {
            data: {
                success: response.errors === null
            },
            errors: response.errors
        };
    }
}

container.register('DeleteListPresenter', {
    useClass: DeleteListPresenterAdapter
});
