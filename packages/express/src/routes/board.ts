import router from 'express-promise-router';

import { auth_middleware } from '../middleware/auth';
import { getController } from '../lib/functions';

import { MoveCardController } from './../controllers/MoveCardController';
import { AddCardController } from './../controllers/AddCardController';
import { UpdateBoardDescriptionController } from './../controllers/UpdateBoardDescriptionController';
import { AddBoardController } from '../controllers/AddBoardController';
import { SetBoardVisibilityController } from '../controllers/SetBoardVisibilityController';
import { GetAllBoardsController } from '../controllers/GetAllBoardsController';
import { GetBoardDetailsController } from '../controllers/GetBoardDetailsController';
import { AddMemberToBoardController } from '../controllers/AddMemberToBoardController';
import { RemoveMemberFromBoardController } from '../controllers/RemoveMemberFromBoardController';
import { ChangeBoardNameController } from '../controllers/ChangeBoardNameController';
import { AddListToBoardController } from '../controllers/AddListToBoardController';

const Router = router();

Router.get('/', getController(GetAllBoardsController))
    .post('/', auth_middleware, getController(AddBoardController))
    .get('/:boardId', getController(GetBoardDetailsController))
    .put(
        '/:boardId/set-visibility',
        auth_middleware,
        getController(SetBoardVisibilityController)
    )
    .put(
        '/:boardId/participants/add',
        auth_middleware,
        getController(AddMemberToBoardController)
    )
    .put(
        '/:boardId/participants/remove',
        auth_middleware,
        getController(RemoveMemberFromBoardController)
    )
    .put(
        '/:boardId/set-name',
        auth_middleware,
        getController(ChangeBoardNameController)
    )
    .put(
        '/:boardId/set-description',
        auth_middleware,
        getController(UpdateBoardDescriptionController)
    )
    .put(
        '/:boardId/move-card',
        auth_middleware,
        getController(MoveCardController)
    )
    .post(
        '/:boardId/lists',
        auth_middleware,
        getController(AddListToBoardController)
    )
    .post(
        '/:boardId/lists/:listId/cards',
        auth_middleware,
        getController(AddCardController)
    );

export { Router as boardRouter };
