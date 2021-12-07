import { container, singleton } from 'tsyringe';
import { Model, model, Schema, models } from 'mongoose';
import { Board, BoardId, Member } from '@thullo/domain';
import { BoardModel } from "../lib/types";

@singleton()
export class BoardEntityManager {
    model: BoardModel;

    constructor() {
        this.model =
            models.Board ??
            model(
                'Board',
                new Schema({
                    name: {
                        type: String,
                        required: true
                    },
                    uuid: {
                        type: String,
                        unique: true,
                        required: true
                    },
                    coverURL: {
                        type: String,
                        required: true
                    },
                    description: {
                        type: String,
                        required: false
                    },
                    private: {
                        type: Boolean,
                        required: true
                    },
                    participants: [
                        {
                            isAdmin: {
                                type: Boolean,
                                required: true,
                                default: false
                            },
                            member: {
                                type: Schema.Types.ObjectId,
                                ref: 'Member'
                            }
                        }
                    ]
                }),
                'boards'
            );
    }
}

// register the model as a proxy from the entity to the mongoose model
container.register('BoardModel', {
    useValue: new Proxy<BoardEntityManager, Model<Board & { uuid: BoardId }>>(
        container.resolve(BoardEntityManager),
        {
            get: (target, prop) => {
                // @ts-ignore
                return target.model[prop];
            }
        }
    )
});
