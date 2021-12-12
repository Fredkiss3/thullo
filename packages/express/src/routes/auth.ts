import router from 'express-promise-router';
import { AuthController } from '../controllers/AuthController';
import { getController } from '../lib/functions';
import { authMiddleware } from '../middleware/auth';
const Router = router();

Router.post('/', getController(AuthController));
Router.get('/check-jwt', authMiddleware, async (req, res) => {
    return res.status(200).json({ data: { success: true }, errors: null });
});

export { Router as authRouter };
