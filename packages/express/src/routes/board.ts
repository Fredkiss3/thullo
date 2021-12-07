import router from 'express-promise-router';
import { getController } from '../lib/functions';
import { AddBoardController } from "../controllers/AddBoardController";

const Router = router();

Router.post('/create', getController(AddBoardController));

export { Router as boardRouter };
