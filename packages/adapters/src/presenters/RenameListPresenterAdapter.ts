import { RenameListPresenter, RenameListResponse } from '@thullo/domain';
import { container, injectable } from 'tsyringe';
import { FieldErrors } from '@thullo/domain';

export interface RenameListViewModel {
    data: { success: boolean };
    errors: FieldErrors;
}

@injectable()
export class RenameListPresenterAdapter implements RenameListPresenter {
    vm: RenameListViewModel | null = null;

    present(response: RenameListResponse): void {
        this.vm = {
            data: {
                success: response.errors === null
            },
            errors: response.errors
        };
    }
}

container.register('RenameListPresenter', {
    useClass: RenameListPresenterAdapter
});
