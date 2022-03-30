import { container, injectable } from 'tsyringe';
import type {
    Card,
    ColorType,
    SeeCardDetailsPresenter,
    SeeCardDetailsResponse
} from '@thullo/domain';
import type { FieldErrors } from '@thullo/domain';

export interface CardData {
    id: string;
    title: string;
    description: string;
    coverURL: string | null;
    attachments: {}[];
    labels: {
        id: string;
        name: string;
        color: ColorType;
    }[];
    comments: {}[];
}

export interface SeeCardDetailsViewModel {
    data: CardData | null;
    errors: FieldErrors;
}

@injectable()
export class SeeCardDetailsPresenterAdapter implements SeeCardDetailsPresenter {
    vm: SeeCardDetailsViewModel | null = null;

    present(response: SeeCardDetailsResponse): void {
        this.vm = {
            data: this.toCardData(response.card),
            errors: response.errors
        };
    }

    toCardData(card: Card | null): CardData | null {
        return card === null
            ? null
            : {
                  id: card.id,
                  title: card.title,
                  description: card.description,
                  coverURL: card.cover === null ? null : card.cover.regularURL,
                  attachments: [],
                  labels: [],
                  comments: []
              };
    }
}

container.register('SeeCardDetailsPresenter', {
    useClass: SeeCardDetailsPresenterAdapter
});
