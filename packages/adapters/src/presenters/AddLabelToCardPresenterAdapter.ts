import {
    AddLabelToCardPresenter,
    AddLabelToCardResponse,
    Label,
    FieldErrors
} from '@thullo/domain';
import { container, injectable } from 'tsyringe';
import short from 'short-uuid';

export interface AddLabelToCardViewModel {
    data: {
        labelId: string;
    } | null;
    errors: FieldErrors;
}

@injectable()
export class AddLabelToCardPresenterAdapter implements AddLabelToCardPresenter {
    vm: AddLabelToCardViewModel | null = null;

    present(response: AddLabelToCardResponse): void {
        this.vm = {
            data: this.toLabelData(response.label),
            errors: response.errors
        };
    }

    toLabelData(label: Label | null) {
        return label === null ? null : { labelId: short().fromUUID(label.id) };
    }
}

container.register('AddLabelToCardPresenter', {
    useClass: AddLabelToCardPresenterAdapter
});
