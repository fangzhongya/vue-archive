import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        dts({
            outputDir: resolve(__dirname, './dist/es'),
            //指定使用的tsconfig.json为我们整个项目根目录下掉,如果不配置,你也可以在components下新建tsconfig.json
            tsConfigFilePath: './tsconfig.json',
        }),
        //因为这个插件默认打包到es下，我们想让lib目录下也生成声明文件需要再配置一个
        dts({
            outputDir: resolve(__dirname, './dist/lib'),
            tsConfigFilePath: './tsconfig.json',
        }),
    ],
    build: {
        target: 'modules',
        //打包文件目录
        //压缩
        minify: true,
        outDir: './dist', //输出文件名称
        //css分离
        //cssCodeSplit: true,
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: ['vue', 'vue-router'],
            //忽略打包vue文件
            // input: [],
            output: [
                {
                    format: 'es',
                    //不用打包成.es.js,这里我们想把它打包成.js
                    entryFileNames: '[name].js',
                    //让打包目录和我们目录对应
                    preserveModules: true,
                    //配置打包根目录
                    dir: resolve(__dirname, './dist/es'),
                    preserveModulesRoot: 'dist',
                },
                {
                    format: 'cjs',
                    entryFileNames: '[name].js',
                    //让打包目录和我们目录对应
                    preserveModules: true,
                    //配置打包根目录
                    dir: resolve(__dirname, './dist/lib'),
                    preserveModulesRoot: 'src',
                },
            ],
        },
        lib: {
            entry: './packages/index.ts',
            formats: ['es', 'cjs'],
        },
        // 打包去掉日志与断点
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm-bundler.js',
        },
    },
});
