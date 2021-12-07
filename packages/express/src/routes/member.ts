import router from 'express-promise-router';
import { SearchMemberController } from '../controllers/SearchMemberController';
import { SeedController } from '../controllers/SeedController';
import { getController } from '../lib/functions';

const Router = router();

Router.get('/search', getController(SearchMemberController));
Router.post('/seed', getController(SeedController));

export { Router as memberRouter };
