import { container, injectable } from 'tsyringe';
import type {
    RenameCardPresenter,
    RenameCardResponse,
    FieldErrors
} from '@thullo/domain';

export interface RenameCardViewModel {
    data: { success: boolean };
    errors: FieldErrors;
}

@injectable()
export class RenameCardPresenterAdapter
    implements RenameCardPresenter
{
    vm: RenameCardViewModel | null = null;

    present(response: RenameCardResponse): void {
        this.vm = {
            data: { success: response.errors === null },
            errors: response.errors
        };
    }
}

container.register('RenameCardPresenter', {
    useClass: RenameCardPresenterAdapter
});
