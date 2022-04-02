import { RemoveLabelFromCardController } from './../controllers/RemoveLabelFromCardController';
import { AddLabelToCardController } from './../controllers/AddLabelToCardController';
import router from 'express-promise-router';

import { auth_middleware } from '../middleware/auth';
import { getController } from '../lib/functions';

import { MoveCardController } from '../controllers/MoveCardController';
import { AddCardController } from '../controllers/AddCardController';
import { UpdateBoardDescriptionController } from '../controllers/UpdateBoardDescriptionController';
import { AddBoardController } from '../controllers/AddBoardController';
import { SetBoardVisibilityController } from '../controllers/SetBoardVisibilityController';
import { GetAllBoardsController } from '../controllers/GetAllBoardsController';
import { GetBoardDetailsController } from '../controllers/GetBoardDetailsController';
import { AddMemberToBoardController } from '../controllers/AddMemberToBoardController';
import { RemoveMemberFromBoardController } from '../controllers/RemoveMemberFromBoardController';
import { ChangeBoardNameController } from '../controllers/ChangeBoardNameController';
import { AddListToBoardController } from '../controllers/AddListToBoardController';
import { RenameListController } from '../controllers/RenameListController';
import { DeleteListController } from '../controllers/DeleteListController';
import { RenameCardController } from '../controllers/RenameCardController';
import { ChangeCardDescriptionController } from '../controllers/ChangeCardDescriptionController';
import { GetCardDetailsController } from '../controllers/GetCardDetailsController';
import { ChangeCardCoverController } from '../controllers/ChangeCardCoverController';

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
    )
    .get('/:boardId/cards/:cardId', getController(GetCardDetailsController))
    .put(
        '/:boardId/cards/:cardId/set-cover',
        auth_middleware,
        getController(ChangeCardCoverController)
    )
    .put(
        '/:boardId/cards/:cardId/add-label',
        auth_middleware,
        getController(AddLabelToCardController)
    )
    .put(
        '/:boardId/cards/:cardId/remove-label',
        auth_middleware,
        getController(RemoveLabelFromCardController)
    )
    .put(
        '/:boardId/cards/:cardId/rename',
        auth_middleware,
        getController(RenameCardController)
    )
    .put(
        '/:boardId/cards/:cardId/set-description',
        auth_middleware,
        getController(ChangeCardDescriptionController)
    )
    .put(
        '/:boardId/lists/:listId/rename',
        auth_middleware,
        getController(RenameListController)
    )
    .delete(
        '/:boardId/lists/:listId',
        auth_middleware,
        getController(DeleteListController)
    );
export { Router as boardRouter };
