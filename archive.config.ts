// document 配置
import { defineConfig } from './packages/index';
export default defineConfig({
    router: '__document',
    redirect: true,
    // 目前只支持相对的路径
    components: [
        {
            dir: './src/components/',
            comprops: '/common/props/',
            alias: 'com',
            // extensions: ['vue'],
            // /**
            //  * 匹配文件名称和文件类型
            //  */
            matchexts: ['/src/index.vue'],
            components: import.meta.glob(
                './src/components/**/src/index.(js|vue)',
            ),
            componentsRaw: import.meta.glob(
                './src/components/**/*.(js|vue)',
                {
                    as: 'raw',
                },
            ),
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

        examples: import.meta.glob(
            `./example/**/index.(js|vue)`,
        ),
        examplesRaw: import.meta.glob('./example/**', {
            as: 'raw',
        }),
        md: 'README',
    },
});
