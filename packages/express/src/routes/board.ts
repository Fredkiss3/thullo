import router from 'express-promise-router';
import { getController } from '../lib/functions';
import { AddBoardController } from '../controllers/AddBoardController';
import { auth_middleware } from '../middleware/auth';
import { SetBoardVisibilityController } from '../controllers/SetBoardVisibilityController';
import { GetAllBoardsController } from '../controllers/GetAllBoardsController';
import { GetBoardDetailsController } from '../controllers/GetBoardDetailsController';
import { InviteMemberToBoardController } from '../controllers/InviteMemberToBoardController';

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
        '/:boardId/invite',
        auth_middleware,
        getController(InviteMemberToBoardController)
    );

export { Router as boardRouter };
