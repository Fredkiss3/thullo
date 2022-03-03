import {
    RemoveMemberFromBoardPresenter,
    RemoveMemberFromBoardResponse,
    BoardAggregate
} from '@thullo/domain';
import { container, injectable } from 'tsyringe';
import { FieldErrors } from '@thullo/domain';

import short from 'short-uuid';

interface BoardAggregateData {
    id: string;
    name: string;
    description: string | null;
    isPrivate: boolean;
    admin: {
        id: string;
        name: string;
        avatarURL: string | null;
        login: string;
    };
    participants: Array<{
        id: string;
        name: string;
        avatarURL: string | null;
        login: string;
    }>;
    lists: Array<{
        id: string;
        name: string;
        cards: Array<{
            id: string;
            title: string;
            coverURL: string | null;

            // TODO: add more fields
            // labels: [];
            // comments: [];
            // attachments: [];
        }>;
    }>;
}
export interface RemoveMemberFromBoardViewModel {
    data: BoardAggregateData | null;
    errors: FieldErrors;
}

@injectable()
export class RemoveMemberFromBoardPresenterAdapter
    implements RemoveMemberFromBoardPresenter
{
    vm: RemoveMemberFromBoardViewModel | null = null;

    present(response: RemoveMemberFromBoardResponse): void {
        this.vm = {
            data: this.toBoardAggregateData(response.aggregate),
            errors: response.errors
        };
    }

    toBoardAggregateData(
        board: BoardAggregate | null
    ): BoardAggregateData | null {
        const admin = board?.participants.find(
            ({ isAdmin }) => isAdmin
        )!.member;

        return board === null
            ? null
            : {
                  id: short().fromUUID(board.boardId),
                  name: board.name,
                  description: board.description,
                  isPrivate: board.isPrivate,
                  participants: board.participants
                      .filter(({ isAdmin }) => !isAdmin)
                      .map(({ member }) => ({
                          id: member.id,
                          name: member.name,
                          avatarURL: member.avatarURL,
                          login: member.login
                      })),
                  admin: {
                      id: short().fromUUID(admin!.id),
                      name: admin!.name,
                      avatarURL: admin!.avatarURL,
                      login: admin!.login
                  },
                  lists: Object.entries(board.cardsByLists).map(
                      ([id, cards]) => ({
                          id,
                          name: board.listsByIds[id].name,
                          cards: cards.map(({ id, title, cover }) => ({
                              id,
                              title,
                              coverURL: cover?.smallURL ?? null
                          }))
                      })
                  )
              };
    }
}

container.register('RemoveMemberFromBoardPresenter', {
    useClass: RemoveMemberFromBoardPresenterAdapter
});
