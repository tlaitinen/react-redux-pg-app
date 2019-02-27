import Koa from 'koa';
import serve from 'koa-static';
import {Context} from 'koa';
import cfg from './config';
import router from './routes';
import {AccessDenied, NotFound, InvalidRequest} from './db/errors';
import {ValidationError} from './routes/errors';
import send from 'koa-send';

const app = new Koa();
 
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof ValidationError || err instanceof InvalidRequest) {
      ctx.status = 400;
    } else if (err instanceof AccessDenied) {
      ctx.status = 403;
    } else if (err instanceof NotFound) {
      ctx.status = 404;
    } else {
      ctx.status = 500 | err.status;
    }
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});
app.use(async (ctx:Context, next:() => void) => {
  const req = ctx.request;
  const proto = req.get('X-Forwarded-Proto');
  if (proto && proto !== 'https') {
    ctx.redirect('https://' + req.get('Host') + req.url);
  } else {
    await next();
  }
});
app.use(async (ctx:Context, next:() => void) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});
app.use(serve('./dist/frontend'));

app.use(router.routes());
app.use(async (ctx:Context) => {
  if (ctx.request.method == 'GET') {
    await send(ctx, './dist/frontend/index.html');  
  }
});
app.listen(cfg.port);
console.log(`Server running on port ${cfg.port}`);


