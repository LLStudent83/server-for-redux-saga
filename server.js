const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');

const koaBody = require('koa-body'); // в лекции нет
const app = new Koa();
app.use(cors());
app.use(koaBody({ json: true })); // в лекции нет

let nextId = 1;
const skills = [
  { id: nextId++, name: 'React' },
  { id: nextId++, name: 'Redux' },
  { id: nextId++, name: 'Redux Thunk' },
  { id: nextId++, name: 'RxJS' },
  { id: nextId++, name: 'Redux Observable' },
  { id: nextId++, name: 'Redux Saga' },
];
let isEven = true;
const router = new Router();

router.get('/api/search', async (ctx, next) => {
  if (Math.random() > 0.75) {
    ctx.response.status = 500;
    return;
  }
  const { q } = ctx.request.query;
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        const response = skills.filter((o) =>
          o.name.toLowerCase().startsWith(q.toLowerCase())
        );

        ctx.response.body = response;
        resolve();
      },
      isEven ? 1 * 1000 : 5 * 1000
    );
    isEven = !isEven;
  });
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());
server.listen(port);
