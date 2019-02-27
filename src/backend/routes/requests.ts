import {Context} from 'koa';
import Router from 'koa-router';
import koaBody from 'koa-body';
import {processRequest} from '../requests-api';
import db from '../db/connection';
import {validationFailed} from './errors';
import {getAuth} from './session';
import {RequestT} from '../../types/requests-api';
export function mount(router:Router) {
  router.post('/requests/:requestType', koaBody(), async (ctx:Context) => {
    const payload = Object.assign({}, ctx.request.body, {type: ctx.params.requestType});
    await RequestT.decode(payload).fold(validationFailed, async request => {
      return db.tx(async tx => {
        const auth = await getAuth(tx, ctx);
        const r = await processRequest(db, auth, request);
        ctx.status = 200;
        ctx.body = r;

      });
    });
  });
}

