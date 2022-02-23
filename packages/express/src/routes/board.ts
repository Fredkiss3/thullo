import router from 'express-promise-router';
import { getController } from '../lib/functions';
import { AddBoardController } from '../controllers/AddBoardController';
import { authMiddleware } from '../middleware/auth';
import { GetAllBoardsController } from '../controllers/GetAllBoardsController';
import { GetBoardDetailsController } from '../controllers/GetBoardDetailsController';

const Router = router();

Router.get('/:boardId', getController(GetBoardDetailsController));
Router.get('/', getController(GetAllBoardsController));
Router.post('/', authMiddleware, getController(AddBoardController));

export { Router as boardRouter };
