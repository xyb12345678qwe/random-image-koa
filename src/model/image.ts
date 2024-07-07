import Path from "./Path.js";
import fs from 'fs'
import path from 'path'
import { getRandomArr } from "./random.js";
import fetch from 'node-fetch'
import urlmodule from 'valid-url'


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
        });

        if (imageNames.length > 0) {
            this.set('imageName', imageNames);
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
    async randomImage() {
        const imageArr = [this.get('imageName'), this.get('imageText')].filter(item => item !== null && item !== undefined && item.length > 0);
        const random = getRandomArr(imageArr);
        const randomimg = getRandomArr(random)
        if (this.isValidUrl(randomimg)) {
            logger.info(`随机到外链图片${randomimg}`);
            return {
                type: 'url',
                img: await fetch(randomimg || "https://img.mzbs.top/xiuxian.php")
            }
        } else {
            let img = path.join("public", "image", "image", randomimg || '')
            return {
                type: 'file',
                img
            }
        }
    }
    /**
     * 正则判断是否是Http或者Https网址
     */
    isValidUrl(url) {
        return urlmodule.isWebUri(url)

    }
}
export const Image = new image();
Image.setAllImageName()
Image.setAllImageText()