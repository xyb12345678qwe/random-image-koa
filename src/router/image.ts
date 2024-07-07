import koaRouter from 'koa-router'
const router = new koaRouter()
import { Image } from '../model/index.js'
import send from 'koa-send';
router.get('/image', async (ctx) => {
    const imageobj = await Image.randomImage()
    if (imageobj.type == 'url') {
        const response: any = imageobj.img
        if (!response.ok) {
            ctx.status = 400;
            ctx.body = 'image not found';
        }
        ctx.type = response.headers['content-type'] || 'image/png';;
        ctx.body = await response.buffer(); // 使用 buffer 方法来获取图片数据
    } else if (imageobj.type == 'file') {
        if (!imageobj.img) {
            ctx.status = 400;
            ctx.body = 'image not found';
        }
        logger.info(`访问:${imageobj.img}`)
        await send(ctx, imageobj.img);
    }
    return
})
router.get('/', async ctx => ctx.body = 'Hello world!');


export default router