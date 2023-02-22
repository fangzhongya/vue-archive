// vite.config.ts
import { defineConfig } from "file:///D:/fangzhongya/vue-archive/node_modules/.pnpm/vite@4.1.4_hlkwzk2izwsolfmdrejei4vrty/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/fangzhongya/vue-archive/node_modules/.pnpm/@vitejs+plugin-vue@4.0.0_vite@4.1.4+vue@3.2.47/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import dts from "file:///D:/fangzhongya/vue-archive/node_modules/.pnpm/vite-plugin-dts@2.0.0-beta.3_ioavmsrnmolcnslmwd7yaa5uom/node_modules/vite-plugin-dts/dist/index.mjs";
import { resolve } from "node:path";
var __vite_injected_original_dirname = "D:\\fangzhongya\\vue-archive";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    dts({
      outputDir: resolve(__vite_injected_original_dirname, "./dist/es"),
      //指定使用的tsconfig.json为我们整个项目根目录下掉,如果不配置,你也可以在components下新建tsconfig.json
      tsConfigFilePath: "./tsconfig.json"
    }),
    //因为这个插件默认打包到es下，我们想让lib目录下也生成声明文件需要再配置一个
    dts({
      outputDir: resolve(__vite_injected_original_dirname, "./dist/lib"),
      tsConfigFilePath: "./tsconfig.json"
    })
  ],
  build: {
    target: "modules",
    //打包文件目录
    //压缩
    minify: true,
    outDir: "./dist",
    //输出文件名称
    //css分离
    //cssCodeSplit: true,
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["vue", "vue-router"],
      //忽略打包vue文件
      // input: [],
      output: [
        {
          format: "es",
          //不用打包成.es.js,这里我们想把它打包成.js
          entryFileNames: "[name].js",
          //让打包目录和我们目录对应
          preserveModules: true,
          //配置打包根目录
          dir: resolve(__vite_injected_original_dirname, "./dist/es"),
          preserveModulesRoot: "dist"
        },
        {
          format: "cjs",
          entryFileNames: "[name].js",
          //让打包目录和我们目录对应
          preserveModules: true,
          //配置打包根目录
          dir: resolve(__vite_injected_original_dirname, "./dist/lib"),
          preserveModulesRoot: "src"
        }
      ]
    },
    lib: {
      entry: "./packages/index.ts",
      formats: ["es", "cjs"]
    }
  },
  resolve: {
    alias: {
      vue: "vue/dist/vue.esm-bundler.js"
    }
  },
  server: {
    host: "0.0.0.0",
    // 可以外部访问
    hmr: true
    // 开启热更新
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxmYW5nemhvbmd5YVxcXFx2dWUtYXJjaGl2ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcZmFuZ3pob25neWFcXFxcdnVlLWFyY2hpdmVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2Zhbmd6aG9uZ3lhL3Z1ZS1hcmNoaXZlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cyc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAnbm9kZTpwYXRoJztcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIHBsdWdpbnM6IFtcbiAgICAgICAgdnVlKCksXG4gICAgICAgIGR0cyh7XG4gICAgICAgICAgICBvdXRwdXREaXI6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9kaXN0L2VzJyksXG4gICAgICAgICAgICAvL1x1NjMwN1x1NUI5QVx1NEY3Rlx1NzUyOFx1NzY4NHRzY29uZmlnLmpzb25cdTRFM0FcdTYyMTFcdTRFRUNcdTY1NzRcdTRFMkFcdTk4NzlcdTc2RUVcdTY4MzlcdTc2RUVcdTVGNTVcdTRFMEJcdTYzODksXHU1OTgyXHU2NzlDXHU0RTBEXHU5MTREXHU3RjZFLFx1NEY2MFx1NEU1Rlx1NTNFRlx1NEVFNVx1NTcyOGNvbXBvbmVudHNcdTRFMEJcdTY1QjBcdTVFRkF0c2NvbmZpZy5qc29uXG4gICAgICAgICAgICB0c0NvbmZpZ0ZpbGVQYXRoOiAnLi90c2NvbmZpZy5qc29uJyxcbiAgICAgICAgfSksXG4gICAgICAgIC8vXHU1NkUwXHU0RTNBXHU4RkQ5XHU0RTJBXHU2M0QyXHU0RUY2XHU5RUQ4XHU4QkE0XHU2MjUzXHU1MzA1XHU1MjMwZXNcdTRFMEJcdUZGMENcdTYyMTFcdTRFRUNcdTYwRjNcdThCQTlsaWJcdTc2RUVcdTVGNTVcdTRFMEJcdTRFNUZcdTc1MUZcdTYyMTBcdTU4RjBcdTY2MEVcdTY1ODdcdTRFRjZcdTk3MDBcdTg5ODFcdTUxOERcdTkxNERcdTdGNkVcdTRFMDBcdTRFMkFcbiAgICAgICAgZHRzKHtcbiAgICAgICAgICAgIG91dHB1dERpcjogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL2Rpc3QvbGliJyksXG4gICAgICAgICAgICB0c0NvbmZpZ0ZpbGVQYXRoOiAnLi90c2NvbmZpZy5qc29uJyxcbiAgICAgICAgfSksXG4gICAgXSxcbiAgICBidWlsZDoge1xuICAgICAgICB0YXJnZXQ6ICdtb2R1bGVzJyxcbiAgICAgICAgLy9cdTYyNTNcdTUzMDVcdTY1ODdcdTRFRjZcdTc2RUVcdTVGNTVcbiAgICAgICAgLy9cdTUzOEJcdTdGMjlcbiAgICAgICAgbWluaWZ5OiB0cnVlLFxuICAgICAgICBvdXREaXI6ICcuL2Rpc3QnLCAvL1x1OEY5M1x1NTFGQVx1NjU4N1x1NEVGNlx1NTQwRFx1NzlGMFxuICAgICAgICAvL2Nzc1x1NTIwNlx1NzlCQlxuICAgICAgICAvL2Nzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgICAgLy8gXHU3ODZFXHU0RkREXHU1OTE2XHU5MEU4XHU1MzE2XHU1OTA0XHU3NDA2XHU5MEEzXHU0RTlCXHU0RjYwXHU0RTBEXHU2MEYzXHU2MjUzXHU1MzA1XHU4RkRCXHU1RTkzXHU3Njg0XHU0RjlEXHU4RDU2XG4gICAgICAgICAgICBleHRlcm5hbDogWyd2dWUnLCAndnVlLXJvdXRlciddLFxuICAgICAgICAgICAgLy9cdTVGRkRcdTc1NjVcdTYyNTNcdTUzMDV2dWVcdTY1ODdcdTRFRjZcbiAgICAgICAgICAgIC8vIGlucHV0OiBbXSxcbiAgICAgICAgICAgIG91dHB1dDogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiAnZXMnLFxuICAgICAgICAgICAgICAgICAgICAvL1x1NEUwRFx1NzUyOFx1NjI1M1x1NTMwNVx1NjIxMC5lcy5qcyxcdThGRDlcdTkxQ0NcdTYyMTFcdTRFRUNcdTYwRjNcdTYyOEFcdTVCODNcdTYyNTNcdTUzMDVcdTYyMTAuanNcbiAgICAgICAgICAgICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdbbmFtZV0uanMnLFxuICAgICAgICAgICAgICAgICAgICAvL1x1OEJBOVx1NjI1M1x1NTMwNVx1NzZFRVx1NUY1NVx1NTQ4Q1x1NjIxMVx1NEVFQ1x1NzZFRVx1NUY1NVx1NUJGOVx1NUU5NFxuICAgICAgICAgICAgICAgICAgICBwcmVzZXJ2ZU1vZHVsZXM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIC8vXHU5MTREXHU3RjZFXHU2MjUzXHU1MzA1XHU2ODM5XHU3NkVFXHU1RjU1XG4gICAgICAgICAgICAgICAgICAgIGRpcjogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL2Rpc3QvZXMnKSxcbiAgICAgICAgICAgICAgICAgICAgcHJlc2VydmVNb2R1bGVzUm9vdDogJ2Rpc3QnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6ICdjanMnLFxuICAgICAgICAgICAgICAgICAgICBlbnRyeUZpbGVOYW1lczogJ1tuYW1lXS5qcycsXG4gICAgICAgICAgICAgICAgICAgIC8vXHU4QkE5XHU2MjUzXHU1MzA1XHU3NkVFXHU1RjU1XHU1NDhDXHU2MjExXHU0RUVDXHU3NkVFXHU1RjU1XHU1QkY5XHU1RTk0XG4gICAgICAgICAgICAgICAgICAgIHByZXNlcnZlTW9kdWxlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgLy9cdTkxNERcdTdGNkVcdTYyNTNcdTUzMDVcdTY4MzlcdTc2RUVcdTVGNTVcbiAgICAgICAgICAgICAgICAgICAgZGlyOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vZGlzdC9saWInKSxcbiAgICAgICAgICAgICAgICAgICAgcHJlc2VydmVNb2R1bGVzUm9vdDogJ3NyYycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIGxpYjoge1xuICAgICAgICAgICAgZW50cnk6ICcuL3BhY2thZ2VzL2luZGV4LnRzJyxcbiAgICAgICAgICAgIGZvcm1hdHM6IFsnZXMnLCAnY2pzJ10sXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICByZXNvbHZlOiB7XG4gICAgICAgIGFsaWFzOiB7XG4gICAgICAgICAgICB2dWU6ICd2dWUvZGlzdC92dWUuZXNtLWJ1bmRsZXIuanMnLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICAgIGhvc3Q6ICcwLjAuMC4wJywgLy8gXHU1M0VGXHU0RUU1XHU1OTE2XHU5MEU4XHU4QkJGXHU5NUVFXG4gICAgICAgIGhtcjogdHJ1ZSwgLy8gXHU1RjAwXHU1NDJGXHU3MEVEXHU2NkY0XHU2NUIwXG4gICAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzUSxTQUFTLG9CQUFvQjtBQUNuUyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsZUFBZTtBQUh4QixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTO0FBQUEsSUFDTCxJQUFJO0FBQUEsSUFDSixJQUFJO0FBQUEsTUFDQSxXQUFXLFFBQVEsa0NBQVcsV0FBVztBQUFBO0FBQUEsTUFFekMsa0JBQWtCO0FBQUEsSUFDdEIsQ0FBQztBQUFBO0FBQUEsSUFFRCxJQUFJO0FBQUEsTUFDQSxXQUFXLFFBQVEsa0NBQVcsWUFBWTtBQUFBLE1BQzFDLGtCQUFrQjtBQUFBLElBQ3RCLENBQUM7QUFBQSxFQUNMO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDSCxRQUFRO0FBQUE7QUFBQTtBQUFBLElBR1IsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBR1IsZUFBZTtBQUFBO0FBQUEsTUFFWCxVQUFVLENBQUMsT0FBTyxZQUFZO0FBQUE7QUFBQTtBQUFBLE1BRzlCLFFBQVE7QUFBQSxRQUNKO0FBQUEsVUFDSSxRQUFRO0FBQUE7QUFBQSxVQUVSLGdCQUFnQjtBQUFBO0FBQUEsVUFFaEIsaUJBQWlCO0FBQUE7QUFBQSxVQUVqQixLQUFLLFFBQVEsa0NBQVcsV0FBVztBQUFBLFVBQ25DLHFCQUFxQjtBQUFBLFFBQ3pCO0FBQUEsUUFDQTtBQUFBLFVBQ0ksUUFBUTtBQUFBLFVBQ1IsZ0JBQWdCO0FBQUE7QUFBQSxVQUVoQixpQkFBaUI7QUFBQTtBQUFBLFVBRWpCLEtBQUssUUFBUSxrQ0FBVyxZQUFZO0FBQUEsVUFDcEMscUJBQXFCO0FBQUEsUUFDekI7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0QsT0FBTztBQUFBLE1BQ1AsU0FBUyxDQUFDLE1BQU0sS0FBSztBQUFBLElBQ3pCO0FBQUEsRUFDSjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ0wsT0FBTztBQUFBLE1BQ0gsS0FBSztBQUFBLElBQ1Q7QUFBQSxFQUNKO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDSixNQUFNO0FBQUE7QUFBQSxJQUNOLEtBQUs7QUFBQTtBQUFBLEVBQ1Q7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
