import router from 'express-promise-router';
import { getController } from '../lib/functions';
import { AddBoardController } from '../controllers/AddBoardController';
import { authMiddleware } from '../middleware/auth';
import { GetAllBoardsController } from '../controllers/GetAllBoardsController';

const Router = router();

Router.post('/create', authMiddleware, getController(AddBoardController));
Router.get('/', authMiddleware, getController(GetAllBoardsController));

export { Router as boardRouter };
