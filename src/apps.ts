import './utils/index.js'
import Koa from 'koa';
import router from './router/image.js'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'
// 创建服务对象


const app = new Koa();
app.use(cors())
// 使用 koa-bodyparser 中间件
app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods());
// 启动服务
app.use(async (ctx) => {
    ctx.body = 'Hello World'
})
app.listen(process.env.SERVER_PORT, () => {
    logger.info(`Server running on 127.0.0.1:${process.env.SERVER_PORT}`)
});

