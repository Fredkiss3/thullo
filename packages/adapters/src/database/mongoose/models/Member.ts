import { container, singleton } from 'tsyringe';
import { Model, model, models, Schema } from 'mongoose';
import { Board, BoardId, Member } from '@thullo/domain';
import { MemberModel } from "../lib/types";

@singleton()
export class MemberEntityManager {
    model: MemberModel;
    constructor() {
        this.model =
            models.Member ??
            model(
                'Member',
                new Schema({
                    name: {
                        type: String,
                        required: true
                    },
                    login: {
                        type: String,
                        required: true
                    },
                    uuid: {
                        type: String,
                        required: true,
                        unique: true
                    },
                    avatarURL: {
                        type: String,
                        required: false
                    },
                    idToken: {
                        type: String,
                        required: true,
                        unique: true
                    }
                }),
              'members'
            );
    }
}

// register the model as a proxy from the entity to the mongoose model
container.register('MemberModel', {
    useValue: new Proxy<MemberEntityManager, Model<Board & { uuid: BoardId }>>(
        container.resolve(MemberEntityManager),
        {
            get: (target, prop) => {
                // @ts-ignore
                return target.model[prop];
            }
        }
    )
});
