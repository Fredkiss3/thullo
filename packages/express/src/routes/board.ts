import router from 'express-promise-router';
import { getController } from '../lib/functions';
import { AddBoardController } from '../controllers/AddBoardController';
import { auth_middleware } from '../middleware/auth';
import { SetBoardVisibilityController } from '../controllers/SetBoardVisibilityController';
import { GetAllBoardsController } from '../controllers/GetAllBoardsController';
import { GetBoardDetailsController } from '../controllers/GetBoardDetailsController';
import { AddMemberToBoardController } from '../controllers/AddMemberToBoardController';
import { RemoveMemberFromBoardController } from "../controllers/RemoveMemberFromBoardController";

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
    );

export { Router as boardRouter };
