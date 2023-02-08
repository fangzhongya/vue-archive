# vue-archive

vue 组件文档展示 采用 Vite 导入本地文件，

用路由进行展示的

用 comment-parser 解析文件中的注释 解析注释生成文档

用 es-module-lexer 解析测试文件中引用，展示代码

用 highlight.js 展示代码高亮

用 markdown-it 解析 md 文件

开发一个可以用来 只要写一次代码注释就可以，自动生成查看文档
页面的

写组件示例代码 可以自动展示 ，提供错误，和需求的示例

当前项目用 vue + vite 开发的 用 pnpm 引入

### 组件文件

> 组件文件说明

```js
/**
 * @title 标题
 * @name 组件名称 组件中文名称
 * @author 作者
 * @description 组件介绍
 * @date 组件更新时间
 */
```

> 组件 props 组件属性

```js
/**
 * 多标签
 * @props 是props属性标识
 * @name 属性名
 * @type 类型
 * @default 默认值
 * @selectable 可选值
 * @description 说明
 */
/**
 * 单标签
 * @props {类型} 属性名=默认值 (可选值) 说明
 */
```

> 组件 slot 组件插槽

```js
/**
 * 多标签
 * @slot 是slot插槽标识
 * @name 插槽名
 * @selectable 子标签
 * @description 说明
 */
/**
 * 单标签
 * @props 插槽名 (可选值) 说明
 */
```

> 组件 emits 组件事件

```js
/**
 * 多标签
 * @emits 是emits事件标识
 * @name 事件名
 * @selectable 回调参数
 * @description 说明
 */
/**
 * 单标签
 * @emits 事件名 (回调参数) 说明
 */
```

> 组件 expose 组件方法

```js
/**
 * 多标签
 * @expose 是expose方法标识
 * @name 方法名
 * @selectable 参数
 * @description 说明
 */
/**
 * 单标签
 * @expose 方法名 (参数) 说明
 */
```

### 示例文件

示例代码标识

> 用组件出问题了的标识

```js
/**
 * @error 问题说明
 */
```

> 用组件给出的建议，和改进

```js
/**
 * @proposal 建议说明
 */
```

## 配置文件

document.config.js

```js
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
```

### 组件写法说明

在 components 目录下的文件夹通过 index.js 和 index.vue 文件
都会自动全局注册的成为公共组件的，其他的文件都不会，也只读取
index.js 和 index.vue 中的文件注释，生成文档

注册的名称是通过 index 的上级文件夹名称来命名的如：

1. 文件夹名称 aside 那组件名称 Aside
2. 文件夹名称 asideDiv 那组件名称 AsideDiv
3. 文件夹名称 AsideDiv 那组件名称 AsideDiv
4. 文件夹名称 aside-div 那组件名称 AsideDiv
5. 文件夹名称 aside-div-div 那组件名称 AsideDivDiv

### 示例文件写法说明

示例文件目前在 /example 文件夹中 你先创建对应的组件名称的文
件夹，用来放当前组件的示例 支持多个实例的，也只会读取文件夹
下的 index.js 和 index.vue 文件来当示例展示的
