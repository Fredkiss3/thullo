import {
    AddCardToListPresenter,
    AddCardToListResponse,
    Card
} from '@thullo/domain';
import { container, injectable } from 'tsyringe';
import { FieldErrors } from '@thullo/domain';
import short from 'short-uuid';

interface CardData {
    id: string;
    title: string;
    position: number;
    coverURL: string | null;
    labels: string[];
    attachmentCount: number;
    commentCount: number;
}

export interface AddCardToListViewModel {
    data: CardData | null;
    errors: FieldErrors;
}

@injectable()
export class AddCardToListPresenterAdapter implements AddCardToListPresenter {
    vm: AddCardToListViewModel | null = null;

    present(response: AddCardToListResponse): void {
        this.vm = {
            data: this.toListData(response.card),
            errors: response.errors
        };
    }

    toListData(card: Card | null): CardData | null {
        return card === null
            ? null
            : {
                  id: short().fromUUID(card.id),
                  title: card.title,
                  position: card.position,
                  coverURL: null,
                  labels: card.labels.map(({ name }) => name),
                  attachmentCount: card.attachments.length,
                  commentCount: card.comments.length
              };
    }
}

container.register('AddCardToListPresenter', {
    useClass: AddCardToListPresenterAdapter
});
