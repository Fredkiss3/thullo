import router from 'express-promise-router';
import { AuthController } from '../controllers/AuthController';
import { getController } from '../lib/functions';
import { authMiddleware } from '../middleware/auth';
const Router = router();

Router.post('/', getController(AuthController));
Router.post('/logout', authMiddleware, async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });
    return res.status(200).json({ data: { success: true }, errors: null });
});

Router.get('/me', authMiddleware, async (req, res) => {
    return res
        .status(200)
        .json({ data: { user: res.locals.user }, errors: null });
});

export { Router as authRouter };
