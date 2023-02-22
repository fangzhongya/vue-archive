// document 配置
import { nodeInit } from './dist/node/index.js';
import fastGlob from 'fast-glob';
import { resolve, join } from 'node:path';
import { runDev } from '@fangzhongya/create/bins/md';
import { readFileSync } from 'node:fs';
const Fang = runDev({});
const urls =
    fastGlob.sync('./src/components/**/*.vue', {
        onlyFiles: false,
        absolute: true,
    }) || [];
const exampleder = resolve(
    process.cwd(),
    './example/',
).replace(/\\/g, '/');
const ess =
    fastGlob.sync('./example/**/*.*', {
        onlyFiles: false,
        absolute: true,
    }) || [];
const exampleurls = ess.map((k) => {
    return k.replace(exampleder, './example');
});
function componentsRaw(obj) {
    return new Promise((resolve) => {
        const text = readFileSync(obj.key);
        resolve(text);
    });
}

function examplesRaw(obj) {
    let key = obj.key;
    key = key.replace(/^\.\/example/, exampleder);
    return new Promise((resolve) => {
        const text = readFileSync(key);
        resolve(text);
    });
}
const dir = resolve(process.cwd(), '').replace(/\\/g, '/');
const c = {
    router: '__document',
    redirect: true,
    // 目前只支持相对的路径
    outDir: './cs/components/',
    dir: dir,
    components: [
        {
            dir: './src/components/',
            comprops: '/common/props/',
            urls: urls,
            alias: 'com',
            // extensions: ['vue'],
            // /**
            //  * 匹配文件名称和文件类型
            //  */
            matchexts: ['/src/index.vue'],
            components: [],
            componentsRaw: componentsRaw,
        },
    ],
    example: {
        dir: './example/',
        /**
         * 0 : url 下面就是组件
         * 1 : dir 名称开始
         * 2 : 二级 aliass 目录
         * 3 : dir 名称开始 加上二级 aliass 目录
         */
        level: 1,

        /**
         * 0 : 不支持别名
         * 1 : 只支持一级别名
         * 2 : 只支持二级别名
         * 3 : 只支持一级别名+二级别名
         * 9 : 都支持
         */
        aliaslevel: 0,

        /**
         * 不区分首字母大小写
         * 0 : 只支持 el-input
         * 1 : 只支持 elInput
         * 2 : 都支持
         */
        componentName: 0,

        examples: '',
        urls: exampleurls,
        examplesRaw: examplesRaw,
        md: 'README',
    },
};

nodeInit(c);
