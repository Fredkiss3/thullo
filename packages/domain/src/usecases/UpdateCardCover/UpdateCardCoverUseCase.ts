import { UpdateCardCoverRequest } from './UpdateCardCoverRequest';
import { UpdateCardCoverPresenter } from './UpdateCardCoverPresenter';
import { UpdateCardCoverResponse } from './UpdateCardCoverResponse';
import { FieldErrors, UnsplashPhoto } from '../../lib/types';
import Validator from 'validatorjs';
import { UnsplashGateway } from '../../lib/UnsplashGateway';
import { BoardAggregateRepository } from '../../entities/BoardAggregate';
Validator.useLang('fr');

export class UpdateCardCoverUseCase {
    RULES = {
        cardId: 'required|string',
        requestedBy: 'required|string',
        boardId: 'required|string',
        coverPhotoId: 'string'
    };

    constructor(
        private boardRepository: BoardAggregateRepository,
        private photoService: UnsplashGateway
    ) {}

    async execute(
        request: UpdateCardCoverRequest,
        presenter: UpdateCardCoverPresenter
    ): Promise<void> {
        let errors = this.validate(request);

        if (!errors) {
            const board = await this.boardRepository.getBoardAggregateById(
                request.boardId
            );

            if (!board) {
                errors = {
                    boardId: ['Board not found']
                };
            } else {
                if (!board.isParticipant(request.requestedBy)) {
                    errors = {
                        requestedBy: [
                            'You can not update card cover in a private' +
                                ' board if you are not a participant of the board'
                        ]
                    };
                } else {
                    try {
                        let cover: UnsplashPhoto | null = null;
                        const card = board.getCardById(request.cardId);

                        if (request.coverPhotoId === undefined) {
                            card.cover = cover;
                            await this.boardRepository.saveAggregate(board);
                        }

                        if (request.coverPhotoId !== undefined) {
                            cover = await this.photoService.getPhoto(
                                request.coverPhotoId
                            );

                            if (cover === null) {
                                errors = {
                                    coverPhotoId: ['Photo not found']
                                };
                            } else {
                                card.cover = cover;
                                await this.boardRepository.saveAggregate(board);
                            }
                        }
                    } catch (e) {
                        errors = {
                            cardId: ['Card not found']
                        };
                    }
                }
            }
        }

        presenter.present(new UpdateCardCoverResponse(errors));
    }

    validate(request: UpdateCardCoverRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {});

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
