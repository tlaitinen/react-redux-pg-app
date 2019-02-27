import {Context} from 'koa';
import Router from 'koa-router';
import db from '../db/connection';
import {DB} from '../db/connection';
import {getAuth} from './session';
import {validationFailed, InvalidRequest} from './errors';
import {User} from '../../types/users';
import {CrudTypes} from '../../types/crud';
import koaBody from 'koa-body';
export interface DatabaseAPI<I,IO,O,OO,Q,QO> {
  types: CrudTypes<I,IO,O,OO,Q,QO>;
  api: {
    insert: (db:DB, auth:User, input:I) => Promise<O>;
    update: (db:DB, auth:User, id:string, input:O) => Promise<O>;
    select: (db:DB, auth:User, query:Q) => Promise<O[]>;
  }
}
export function create<I,IO,O,OO,Q,QO>(api:DatabaseAPI<I,IO,O,OO,Q,QO>) {
  return api;
}

export function mount<I,IO,O,OO,Q,QO>(router:Router, api:DatabaseAPI<I,IO,O,OO,Q,QO>) {

  const {base} = api.types;
  router.get(base, async (ctx:Context) => {
    const query = ctx.request.query.query;
    if (!query) {
      throw new InvalidRequest('Missing QUERY_STRING parameter "query"');
    }
    let q;
    try {
      q = JSON.parse(query);
    } catch (e) {
      throw new InvalidRequest('Could not decode JSON from QUERY_STRING parameter "query"');
    }

    return api.types.query.decode(q).fold(validationFailed, async query => {
      return db.tx(async tx => {
        const auth = await getAuth(tx, ctx);
        ctx.body = await api.api.select(tx, auth, query); 
      });
    });
  });
  if (api.types.entityIn) {
    router.post(base, koaBody(), async (ctx:Context) => {
      if (api.types.entityIn) {
        return api.types.entityIn.decode(ctx.request.body).fold(validationFailed, async input => {
          return db.tx(async tx => {
            const auth = await getAuth(tx, ctx);
            ctx.body = await api.api.insert(tx, auth, input);
          });
        });
      }
    });
  }
  router.put(`${base}/:id`, koaBody(), async (ctx:Context) => {
    return api.types.entity.decode(ctx.request.body).fold(validationFailed, async input => {
      return db.tx(async tx => {
        const auth = await getAuth(tx, ctx);
        ctx.body = await api.api.update(tx, auth, ctx.params.id, input);
      });
    });
  });
}

