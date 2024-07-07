import Path from "./Path.js";
import fs from 'fs'
import path from 'path'
import { getRandomArr } from "./random.js";
import fetch from 'node-fetch'
import urlmodule from 'valid-url'
import { compressImage } from "./comp.js";
import { DirPath } from "../../config.js";

class image {
    private dataMap: Map<string, any> = new Map();
    private names = new Set([".bmp", ".jpg", ".png", ".tif", ".gif", ".pcx", ".tga", ".exif", ".fpx", ".svg", ".psd", ".cdr", ".pcd", ".dxf", ".ufo", ".eps", ".ai", ".raw", ".WMF", ".webp", ".jpeg"]);

    get(key: string): any {
        if (!this.dataMap.has(key)) {
            logger.error(`Key '${key}' does not exist.`);
            return undefined;
        }
        return this.dataMap.get(key);
    }

    set(key: string, data: any | string | number): void {
        this.dataMap.set(key, data);
    }

    setAllImageName() {
        const imageDirectory = Path.image;
        const files = fs.readdirSync(imageDirectory);
        const imageNames = files.filter(file => {
            const extension = path.extname(file).toLowerCase();
            return this.names.has(extension);
        }).map(file => {
            if (path.extname(file).toLowerCase() === '.bmp') {
                const newFileName = path.basename(file, '.bmp') + '.jpg';
                fs.renameSync(path.join(imageDirectory, file), path.join(imageDirectory, newFileName));
                return newFileName;
            }
            return file;
        });
        this.set('imageName', imageNames);
        if (imageNames.length > 0) {
            logger.info(`设置全部图片文件名，共 ${imageNames.length} 个文件`);
        } else {
            logger.info(`没有找到符合条件的图片文件`);
        }
    }

    setAllImageText() {
        const imageDirectory = Path.imageText;
        const data = fs.readFileSync(imageDirectory, 'utf-8');
        const texts = data.split(/\r?\n/).filter(text => text.trim() !== '')
        this.set('imageText', texts);
        logger.info(`设置全部图片外链，共 ${texts.length} 条文本`);
    }
    /**
     * 设置本地图片压缩后的buffer
     */
    async setAllImageBuffer() {
        logger.info(`进行本地图片压缩处理`);
        const names = this.get('imageName') || []
        const imageBuffer: any[] = [] // 存储压缩后的buffer
        const imageCompressDirectory: any[] = [] // 存储压缩后的图片路径
        const imageDirectory: any[] = [] // 存储源图片路径
        for (const name of names) {
            if (name) {
                const imgPath = `public/image/image/${name}`
                if (!fs.existsSync(imgPath)) {
                    logger.error(`图片不存在：${imgPath},请更改文件名，符号用英文`);
                    continue;
                }
                const imageData = (await compressImage(imgPath))[0]
                if (imageData) {
                    imageBuffer.push(Buffer.from(imageData.data))
                    imageDirectory.push(imageData.sourcePath) //图片原路径
                    // 将结果路径添加到imageCompressDirectory数组中,文件后缀名为webp
                    imageCompressDirectory.push(imageData.destinationPath) //图片压缩后路径
                }
            }
        }
        this.set('imageBuffer', imageBuffer)
        this.set('imageCompressDirectory', imageCompressDirectory)
        this.set('imageDirectory', imageDirectory)
    }
    async randomImage() {
        const imageArr = [this.get('imageBuffer'), this.get('imageText')].filter(item => item !== null && item !== undefined && item.length > 0);
        const random = getRandomArr(imageArr);
        const randomimg = getRandomArr(random)
        if (this.isValidUrl(randomimg)) {
            logger.info(`随机到外链图片${randomimg}`);
            return {
                type: 'url',
                img: await fetch(randomimg || "https://img.mzbs.top/xiuxian.php")
            }
        } else if (Buffer.isBuffer(randomimg)) {
            // let img = path.join("public", "image", "image", randomimg || '')
            // return {
            //     type: 'file',
            //     img
            // }
            return {
                type: 'buffer',
                img: randomimg
            }

        } else {
            return {
                type: 'file',
                img: randomimg
            }
        }
    }
    /**
     * 正则判断是否是Http或者Https网址
     */
    isValidUrl(url: string) {
        return urlmodule.isWebUri(url)
    }
}
export const Image = new image();
Image.setAllImageName()
Image.setAllImageText()
await Image.setAllImageBuffer()