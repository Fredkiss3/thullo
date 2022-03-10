import { auth_middleware } from './../middleware/auth';
import router from 'express-promise-router';
import { TestCreateUserController } from '../controllers/TestCreateUserController';
import { TestDeleteUserController } from '../controllers/TestDeleteUserController';
import { getController } from '../lib/functions';
const Router = router();

Router.post('/create-user', getController(TestCreateUserController)).delete(
    '/delete-user',
    auth_middleware,
    getController(TestDeleteUserController)
);

export { Router as testRouter };
