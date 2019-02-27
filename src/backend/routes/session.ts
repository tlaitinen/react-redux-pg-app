import {Context} from 'koa';
import * as sessionToken from './session-token';
import {SessionToken} from './session-token';
import cfg from '../config';
import {AccessDenied, validationFailedArg} from './errors';
import * as users from '../db/users';
import {User} from '../../types/users';
import {DB} from '../db/connection';

function getBearerToken(ctx:Context):string | undefined {
  const authHeader = ctx.headers['authorization'];
  if (authHeader) {
    const [domain, token] = authHeader.split(' ');
    if (domain === 'Bearer') {
      return token;
    }
  }
}

export async function getSessionToken(ctx:Context):Promise<SessionToken> {

  const tokenStr = getBearerToken(ctx) || ctx.cookies.get(cfg.cookieName) || ctx.query.auth;
  if (!tokenStr) {
    throw new AccessDenied(`Cookie ${cfg.cookieName} not set`);
  }

  const mtoken = await sessionToken.decode(tokenStr);
  return mtoken.fold(validationFailedArg<SessionToken>(), async (token:SessionToken) => token);
}

export async function getAuth(db:DB, ctx:Context):Promise<User> {
  const token = await getSessionToken(ctx);
  const auth = await users.selectById(db, token.userId);
  return auth;
}
