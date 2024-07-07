import imagemin from 'imagemin'
import imageminWebp from 'imagemin-webp'
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminGifsicle from 'imagemin-gifsicle';
import path from 'path'
import fs from 'fs'

interface CompressResult {
    data: Buffer;
    sourcePath: string;
    destinationPath: string;
}

const DESTINATION = "public/compressed-images";
/**
 * 
 * @param filePath 文件路径
 * @returns 
 */
export async function compressImage(filePath: string): Promise<CompressResult> {
    const ext = path.extname(filePath).toLowerCase().slice(1);
    console.log(ext);

    const outputFilename = path.basename(filePath);
    const outputPath = path.join(DESTINATION, outputFilename);
    const img = ['webp', 'jpg', 'jpeg', 'png', 'gif'];
    if (img.includes(ext)) {
        let compfile = await imagemin([filePath], {
            destination: DESTINATION,
            plugins: getImageminPlugins(ext),// 压缩质量50%
        });
        return compfile;
    }


}
function getImageminPlugins(ext: string) {
    const commonPlugins = [
        imageminWebp({ quality: 50 }),
        imageminMozjpeg({ quality: 50 }),
        imageminPngquant({ quality: [0.5, 0.65] }),
        imageminJpegtran({ progressive: true, arithmetic: true, optimize: true }),
    ];

    if (ext === 'gif') {
        return [...commonPlugins, imageminGifsicle({
            optimizationLevel: 3,
            interlaced: true,
            colors: 128
        })];
    }

    return commonPlugins;
}
