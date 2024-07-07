import './utils/index.js'
import Koa from 'koa';
import router from './router/image.js'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'
import cluster from 'cluster';
import os from 'os'
import staticFiles from 'koa-static'
import { DirPath } from '../config.js';
import path from 'path'
//是否主进程
const app = new Koa();
//设置静态文件
app.use(staticFiles(path.join(DirPath + 'public')))
app.use(cors())
// 使用 koa-bodyparser 中间件
app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods());
// 启动服务
app.use(async (ctx) => {
    ctx.body = 'Hello World'
})
if (cluster.isPrimary) {
    /* 多少个cpu启动多少个子进程 */
    for (let i = 0; i < os.cpus().length; i++) {
        let timer = null;
        /* 记录每一个woker */
        const worker = cluster.fork()

        /* 记录心跳次数 */
        let missedPing = 0;

        /* 每五秒发送一个心跳包 并记录次数加1 */
        timer = setInterval(() => {
            missedPing++
            worker.send('ping')

            /* 如果大于5次都没有得到响应说明可能挂掉了就退出 并清楚定时器 */
            if (missedPing > 5) {
                process.kill(worker.process.pid)
                worker.send('ping')
                clearInterval(timer)
            }
        }, 5000);
        /* 如果接收到心跳响应就让记录值-1回去 */
        worker.on('message', (msg) => {
            msg === 'pong' && missedPing--
        })
    }
    /* 如果有线程退出了，我们重启一个 */
    cluster.on('exit', () => {
        cluster.fork()
    })
}
else {
    app.listen(process.env.SERVER_PORT, () => {
        logger.info(`Server running on 127.0.0.1:${process.env.SERVER_PORT}`)
    });

    process.on('uncaughtException', (err) => {
        console.error(err)
        /* 进程错误上报 */
        /* 如果程序内存大于xxxm了让其退出 */
        if (process.memoryUsage().rss > 734003200) {
            logger.info('大于700m了,退出程序');
            process.exit(1)
        }
        /* 退出程序 */
        process.exit(1)
    })
}
