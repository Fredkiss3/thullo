import router from 'express-promise-router';
import { AuthController } from '../controllers/AuthController';
import { getController } from '../lib/functions';

const Router = router();

Router.post('/', getController(AuthController));

export { Router as authRouter };
