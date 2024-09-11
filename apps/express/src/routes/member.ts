import router from 'express-promise-router';
import { SearchMemberController } from '../controllers/SearchMemberController';
import { getController } from '../lib/functions';

const Router = router();

Router.get('/search', getController(SearchMemberController));

export { Router as memberRouter };
