import {
    AddListToBoardPresenter,
    AddListToBoardResponse,
    List
} from '@thullo/domain';
import { container, injectable } from 'tsyringe';
import { FieldErrors } from '@thullo/domain';
import short from 'short-uuid';

interface ListData {
    id: string;
    name: string;
    position: number;
}

export interface AddListToBoardViewModel {
    data: ListData | null;
    errors: FieldErrors;
}

@injectable()
export class AddListToBoardPresenterAdapter implements AddListToBoardPresenter {
    vm: AddListToBoardViewModel | null = null;

    present(response: AddListToBoardResponse): void {
        this.vm = {
            data: this.toListData(response.list),
            errors: response.errors
        };
    }

    toListData(list: List | null): ListData | null {
        return list === null
            ? null
            : {
                  id: short().fromUUID(list.id),
                  name: list.name,
                  position: list.position
              };
    }
}

container.register('AddListToBoardPresenter', {
    useClass: AddListToBoardPresenterAdapter
});
