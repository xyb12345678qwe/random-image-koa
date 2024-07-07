export function getRandomArr(arr: any) {
    // 检查数组是否为空
    if (arr && arr.length) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        // 返回随机索引对应的数组元素
        return arr[randomIndex];
    } else {
        // 如果数组为空，返回null或抛出错误
        return null;
    }
}