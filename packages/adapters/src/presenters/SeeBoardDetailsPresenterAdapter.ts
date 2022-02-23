import {
    SeeBoardDetailsPresenter,
    SeeBoardDetailsResponse,
    BoardAggregate
} from '@thullo/domain';
import short from 'short-uuid';
import { container, injectable } from 'tsyringe';
import { FieldErrors } from '@thullo/domain';

interface BoardAggregateData {
    id: string;
    name: string;
    description: string | null;
    isPrivate: boolean;
    admin: {
        id: string;
        name: string;
        avatarURL: string | null;
    };
    participants: Array<{
        id: string;
        name: string;
        avatarURL: string | null;
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

export interface SeeBoardDetailsViewModel {
    data: BoardAggregateData | null;
    errors: FieldErrors;
}

@injectable()
export class SeeBoardDetailsPresenterAdapter
    implements SeeBoardDetailsPresenter
{
    vm: SeeBoardDetailsViewModel | null = null;

    present(response: SeeBoardDetailsResponse): void {
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
                  id: board.boardId,
                  name: board.name,
                  description: board.description,
                  isPrivate: board.isPrivate,
                  participants: board.participants
                      .filter(({ isAdmin }) => !isAdmin)
                      .map(({ member }) => ({
                          id: member.id,
                          name: member.name,
                          avatarURL: member.avatarURL
                      })),
                  admin: {
                      id: short().fromUUID(admin!.id),
                      name: admin!.name,
                      avatarURL: admin!.avatarURL
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

container.register('SeeBoardDetailsPresenter', {
    useClass: SeeBoardDetailsPresenterAdapter
});
