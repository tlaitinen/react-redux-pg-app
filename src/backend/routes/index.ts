import {Context} from 'koa';
import Router from 'koa-router';
import * as dbRoutes from './database-routes';
import * as auth from './auth';
import * as session from './session';
import {api as usersApi} from '../db/users';
import {types as usersTypes} from '../../types/users';
import {api as userGroupsApi} from '../db/user-groups';
import {types as userGroupsTypes} from '../../types/user-groups';
import * as requests from './requests';
import db from '../db/connection';
import {IndexResult} from '../../types/index';
const router = new Router({prefix:'/api'});

router.get('/', async (ctx:Context) => {
  const user = await session.getAuth(db, ctx);
  const r:IndexResult = {
    user
  };
  ctx.body = r;
});
auth.mount(router, '/auth');
dbRoutes.mount(router, {
  types: usersTypes,
  api: usersApi
});
dbRoutes.mount(router, {
  types: userGroupsTypes,
  api: userGroupsApi
});
requests.mount(router);
export default router;
