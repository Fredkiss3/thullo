import { AddBoardPresenter, AddBoardResponse, Board } from '@thullo/domain';
import { container, injectable } from 'tsyringe';
import { FieldErrors } from '@thullo/domain';

interface BoardData {
    id: string;
    name: string;
    coverURL: string;
    participants: Array<{
        name: string;
        avatarURL: string | null;
    }>;
}

export interface AddBoardViewModel {
    data: BoardData | null;
    errors: FieldErrors;
}

@injectable()
export class AddBoardPresenterAdapter implements AddBoardPresenter {
    vm: AddBoardViewModel | null = null;

    present(response: AddBoardResponse): void {
        this.vm = {
            data: this.toBoardData(response.board),
            errors: response.errors
        };
    }

    toBoardData(board: Board | null): BoardData | null {
        return board === null
            ? null
            : {
                  id: board.id,
                  name: board.name,
                  coverURL: board.coverURL,
                  participants: board.participants.map(({ member }) => ({
                      name: member.name,
                      avatarURL: member.avatarURL
                  }))
              };
    }
}

container.register('AddBoardPresenter', { useClass: AddBoardPresenterAdapter });
