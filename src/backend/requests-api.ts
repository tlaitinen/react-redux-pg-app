import {DB} from './db/connection';
import * as types from '../types/requests-api';
import {User} from '../types/users';
import * as users from './db/users';

export function processRequest(db:DB, auth:User, request:types.Request):Promise<types.Response> {
  return db.tx(async tx => {
    if (request.type === 'set-password') {
      await users.setPassword(tx, auth, request.props);
    }
    const r:types.Response = {
      type: 'no-result'
    };
    return r;
  });
}
