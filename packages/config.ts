import { mergeObject } from './utils/util';
import type { AsyncComponentLoader } from 'vue';

export interface ObjStr {
    [key: string]: string;
}

export interface ObjUnk {
    [key: string]: unknown;
}
export type GetRaw = () => Promise<unknown>;

export type Globs = Record<string, () => Promise<unknown>>;

export interface GlobComs {
    [key: string]: AsyncComponentLoader;
}

export interface Component {
    dir: string;
    extensions?: Array<string>;
    alias?: string;
    aliass?: ObjStr;
    matchs?: Array<string>;
    matchexts?: Array<string>;
    directives?: string;
}

export interface Resolver extends Component {
    urls?: Array<string>;
    dirUrls?: Array<string>;
}

export interface Components extends Component {
    resolver?: Resolver;
    comprops?: string;
    components: GlobComs;
    componentsRaw: Globs;
    example?: ExampleObj;
}

export interface ExampleObj {
    dir: string;
    /**
     * 0 : url 下面就是组件
     * 1 : dir 名称开始
     * 2 : 二级 aliass 目录
     * 3 : dir 名称开始 加上二级 aliass 目录
     */
    level: string | number;

    /**
     * 0 : 不支持别名
     * 1 : 只支持一级别名
     * 2 : 只支持二级别名
     * 3 : 只支持一级别名+二级别名
     * 9 : 都支持
     */
    aliaslevel: string | number;

    /**
     * 不区分首字母大小写
     * 0 : 只支持 el-input
     * 1 : 只支持 elInput
     * 2 : 都支持
     */
    componentName: string | number;
    examples?: GlobComs;
    examplesRaw?: Globs;
    md?: string;
}

export interface Config {
    router?: string;
    redirect?: boolean;
    // 目前只支持相对的路径
    components: Array<Components>;
    example?: ExampleObj;
}
const config: Config = {
    components: [],
};
export function userConfig(defaultConfig: Config): Config {
    return mergeObject(config, defaultConfig, 2);
}
export function getConfig(
    key: 'router' | 'redirect' | 'components' | 'example',
) {
    return config[key];
}
