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
            // position: number;

            labels: { name: string; color: string }[];
            commentCount: number;
            attachmentCount: number;
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
                  id: short().fromUUID(board.boardId),
                  name: board.name,
                  description: board.description,
                  isPrivate: board.isPrivate,
                  participants: board.participants
                      .filter(({ isAdmin }) => !isAdmin)
                      .map(({ member }) => ({
                          id: short().fromUUID(member.id),
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
                  lists: Object.entries(board.cardsByLists)
                      .sort(([idA], [idB]) => {
                          const a = board.listsByIds[idA];
                          const b = board.listsByIds[idB];
                          return a.position - b.position;
                      })
                      .map(([id, cards]) => {
                          return {
                              id: short().fromUUID(id),
                              name: board.listsByIds[id].name,
                              cards: cards.map(
                                  ({
                                      id,
                                      title,
                                      cover,
                                      comments,
                                      attachments,
                                      labels
                                  }) => ({
                                      id: short().fromUUID(id),
                                      title,
                                      coverURL: cover?.smallURL ?? null,
                                      labels: labels.map(({ name, color }) => ({
                                          name,
                                          color
                                      })),
                                      commentCount: comments.length,
                                      attachmentCount: attachments.length
                                  })
                              )
                          };
                      })
              };
    }
}

container.register('SeeBoardDetailsPresenter', {
    useClass: SeeBoardDetailsPresenterAdapter
});
