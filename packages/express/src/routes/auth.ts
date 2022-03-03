import router from 'express-promise-router';
import { AuthController } from '../controllers/AuthController';
import { getController } from '../lib/functions';
import { auth_middleware } from '../middleware/auth';
const Router = router();

Router.post('/', getController(AuthController));
Router.get('/me', auth_middleware, async (_, res) => {
    return res
        .status(200)
        .json({ data: { user: res.locals.user }, errors: null });
});

export { Router as authRouter };
