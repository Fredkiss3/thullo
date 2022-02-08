import router from 'express-promise-router';
import { getController } from '../lib/functions';
import { authMiddleware } from '../middleware/auth';
import { UnsplashSearchController } from '../controllers/UnsplashSearchController';
import { UnsplashListController } from "../controllers/UnsplashListController";
import { UnsplashRandomController } from "../controllers/UnsplashRandomController";

const Router = router();

Router.get('/list', authMiddleware, getController(UnsplashListController));
Router.get('/search', authMiddleware, getController(UnsplashSearchController));
Router.get('/random', authMiddleware, getController(UnsplashRandomController));

export { Router as unsplashRouter };
