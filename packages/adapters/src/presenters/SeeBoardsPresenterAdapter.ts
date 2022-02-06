import { SeeBoardsPresenter, SeeBoardsResponse, Board } from '@thullo/domain';
import { container, injectable } from 'tsyringe';
import { FieldErrors } from '@thullo/domain';

import short from 'short-uuid';

type BoardData = Array<{
    id: string;
    name: string;
    coverURL: string;
    participants: Array<{
        name: string;
        avatarURL: string | null;
    }>;
}>;

export interface SeeBoardsViewModel {
    data: BoardData | null;
    errors: FieldErrors;
}

@injectable()
export class SeeBoardsPresenterAdapter implements SeeBoardsPresenter {
    vm: SeeBoardsViewModel | null = null;

    present(response: SeeBoardsResponse): void {
        this.vm = {
            data: this.toBoardData(response.boards),
            errors: response.errors
        };
    }

    toBoardData(boards: Board[] | null): BoardData | null {
        return boards === null
            ? null
            : boards.map(board => ({
                  id: short().fromUUID(board.id),
                  name: board.name,
                  coverURL: board.coverURL,
                  participants: board.participants.map(({ member }) => ({
                      name: member.name,
                      avatarURL: member.avatarURL
                  }))
              }));
    }
}

container.register('SeeBoardsPresenter', {
    useClass: SeeBoardsPresenterAdapter
});
