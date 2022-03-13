import { MoveCardPresenter, MoveCardResponse, Card } from '@thullo/domain';
import { container, injectable } from 'tsyringe';
import { FieldErrors } from '@thullo/domain';

export interface MoveCardViewModel {
    data: { success: boolean };
    errors: FieldErrors;
}

@injectable()
export class MoveCardPresenterAdapter implements MoveCardPresenter {
    vm: MoveCardViewModel | null = null;

    present(response: MoveCardResponse): void {
        this.vm = {
            data: {
                success: response.errors === null
            },
            errors: response.errors
        };
    }
}

container.register('MoveCardPresenter', {
    useClass: MoveCardPresenterAdapter
});
