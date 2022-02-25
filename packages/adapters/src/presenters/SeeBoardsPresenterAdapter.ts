import { SeeBoardsPresenter, SeeBoardsResponse, Board } from '@thullo/domain';
import { container, injectable } from 'tsyringe';
import { FieldErrors } from '@thullo/domain';

import short from 'short-uuid';

type BoardData = Array<{
    id: string;
    name: string;
    cover: {
        url: string;
        authorName: string;
        authorUserName: string;
    };
    participants: Array<{
        id: string;
        name: string;
        login: string;
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
                  cover: {
                      url: board.cover.smallURL,
                      authorName: board.cover.authorName,
                      authorUserName: board.cover.authorUserName
                  },
                  participants: board.participants.map(({ member }) => ({
                      id: short().fromUUID(member.id),
                      name: member.name,
                      login: member.login,
                      avatarURL: member.avatarURL
                  }))
              }));
    }
}

container.register('SeeBoardsPresenter', {
    useClass: SeeBoardsPresenterAdapter
});
