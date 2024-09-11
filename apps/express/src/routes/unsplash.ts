import router from 'express-promise-router';
import { getController } from '../lib/functions';
// import { auth_middleware } from '../middleware/auth';
import { UnsplashSearchController } from '../controllers/UnsplashSearchController';
import { UnsplashListController } from '../controllers/UnsplashListController';
import { UnsplashRandomController } from '../controllers/UnsplashRandomController';

const Router = router();

Router.get('/list', getController(UnsplashListController));
Router.get('/search', getController(UnsplashSearchController));
Router.get('/random', getController(UnsplashRandomController));

export { Router as unsplashRouter };
