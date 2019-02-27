import Router from 'koa-router';
import koaBody from 'koa-body';
import cfg from '../config';
import db from '../db/connection';
import {Context} from 'koa';
import {SessionToken} from './session-token';
import * as users from '../db/users';
import * as t from 'io-ts';
import {validationFailed} from './errors';
import * as sessionToken from './session-token';
export const LoginRequest = t.type({
  email: t.string,
  password: t.string,
  jwt: t.union([t.undefined, t.boolean])
});
async function login(ctx:Context) {
  return LoginRequest.decode(ctx.request.body).fold(validationFailed, async req => {
    const l = await users.login(db, req.email, req.password);
    const token = await sessionToken.encode({
      userId: l.auth.id,
      key: l.sessionKey
    });
    ctx.status = 200;
    if (req.jwt) {
      ctx.body = {jwt:token};
    } else {
      ctx.cookies.set(cfg.cookieName, token);
      ctx.body = {};
    }
  });
}
function logout(ctx:Context) {
  ctx.cookies.set(cfg.cookieName, '');      
  ctx.status = 200;
  ctx.body = {};
}
async function tokenLogin(ctx:Context) {
  const decodeResult = await sessionToken.decode(ctx.params.token);
  return decodeResult.fold(validationFailed, async (decodedToken:SessionToken) => {
    const sessionKey = await users.createSessionKey();
    const token = await sessionToken.encode({
      userId:decodedToken.userId,
      key: sessionKey
    });
    if (ctx.query.jwt) {
      ctx.body = {jwt:token};
    } else {
      ctx.cookies.set(cfg.cookieName, token);
      ctx.redirect('/');
    }
  });
}
export function mount(router:Router, base:string) {
  router.post(base + '/login', koaBody(), login);
  router.post(base + '/logout', logout);
  router.get(base + '/token-login/:token', tokenLogin);
}
