import { AddBoardPresenter, AddBoardResponse } from '@thullo/domain';

export interface AddBoardViewModel {
    id: string;
    name: string;
    coverURL: string;
    participants: Array<{
        name: string;
        avatarURL: string | null;
    }>;
}

export class AddBoardPresenterImpl implements AddBoardPresenter {
    vm: AddBoardViewModel | null = null;

    present(response: AddBoardResponse): void {
        if (response.board) {
            this.vm = {
                id: response.board.id,
                name: response.board.name,
                participants: response.board.participants.map(
                    (participant) => ({
                        name: participant.member.name,
                        avatarURL: participant.member.avatarURL
                    })
                ),
                coverURL: response.board.coverURL
            };
        }
    }
}
