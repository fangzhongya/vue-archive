import { setSession, getSession } from './storage';
import type { AsyncComponentLoader } from 'vue';
import {
    humpToLine,
    getSuffix,
    appearNum,
    lineToLargeHump,
} from './util';

import type {
    ObjStr,
    Component,
    Resolver,
    Components,
    Globs,
    GlobComs,
    GetRaw,
} from '../config';

export const defaultExtensions = ['vue', 'js'];

/**
 * 判断是否匹配
 */
export function isUrlsMatchistarts(
    key: string,
    arr: Array<string>,
) {
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if (key.startsWith(element)) {
            return true;
        }
    }
    return false;
}

export interface TextObj {
    // 组件文件名称
    value: string;
    suffix: string;
    // 唯一文件地址key
    key: string;
    // 文件内容
    raw: string;
    // 读取文件方法
    getRaw: GetRaw | null;
}

export interface PropObj {
    name: string;
    value: string;
    suffix: string;
    head: string;
    key: string;
}

export interface PropsObj extends TextObj {
    comprops: string;
    curprops: string;
    dir: string;
    tdir: string;
    key: string;
}

export interface MdObj extends TextObj {
    // 头文件地址
    topurl: string;
    // 对应组件的key
    comkey: string;
    // 组件的名称
    name: string;
}

/**
 * 调试文件对象
 */
export interface TestsObj extends TextObj {
    // 头文件地址
    topurl: string;
    //示例的名称
    name: string;
    // 组件名称
    comname: string;
    // 组件key
    comkey: string;

    component: AsyncComponentLoader;
}

export interface ComponentsObj extends Component, TextObj {
    name: string;
    tdir: string;
    adir: string;
    aliasNames: Array<string>;
    component?: AsyncComponentLoader;
    curprops?: string;
    comprops?: string;
    tests:
        | {
              [key: string]: TestsObj;
          }
        | undefined;
    mds?: MdObj[];
}

/**
 * 获取别名数组
 * @param obj
 * @returns
 */
function getAliassNames(
    obj: ComponentsObj,
    arr: Array<string>,
): Array<string> {
    let vm = humpToLine(obj.name);
    let ass = [];
    if (obj.alias) {
        ass.push(obj.alias + '-' + vm);
    }
    if (arr && arr.length > 0) {
        arr.forEach((key) => {
            if (obj.alias) {
                ass.push(obj.alias + '-' + key + '-' + vm);
            }
            ass.push(key + '-' + vm);
        });
    }
    return ass;
}

function pxMatchs(matchs: Array<string>) {
    matchs.sort((a, b) => {
        let al = appearNum(a, '/');
        let bl = appearNum(b, '/');
        if (al == bl) {
            return b.length - a.length;
        } else {
            return bl - al;
        }
    });
    return matchs;
}

export function getMatchs(
    matchexts: Array<string> = [],
    extensions: Array<string> = [],
    matchs: Array<string> = [],
) {
    let es = extensions;
    if (!es || es.length == 0) {
        es = defaultExtensions;
    }
    let pps: Array<string> = [];
    if (matchexts && matchexts.length > 0) {
        pps = matchexts;
    }
    if (matchs && matchs.length > 0) {
        matchs.forEach((v) => {
            es?.forEach((t) => {
                pps.push(v + '.' + t);
            });
        });
    }
    pps = [...new Set(pps)];
    return pxMatchs(pps);
}

/**
 * 通过url 地址获取对应数据
 * @param url
 * @param pps
 * @param raliass
 * @param alias
 * @returns
 */
export function getUrlName(
    url: string,
    pps: Array<string>,
    raliass: ObjStr = {},
    alias: string = '',
) {
    for (let index = 0; index < pps.length; index++) {
        const val = pps[index];
        const reg = new RegExp('^.*/([^/]+)' + val + '$');
        let ms = url.match(reg);
        if (ms) {
            const aliass: Array<string> = [];
            const aliasss: ObjStr = {};
            let adir = '';
            Object.keys(raliass).forEach((key) => {
                let vv = raliass[key];
                if (url.startsWith(vv + '/')) {
                    adir = vv;
                    aliasss[key] = vv;
                    aliass.push(key);
                }
            });
            let value = ms[1];
            let rsobj: ComponentsObj = {
                dir: '',
                suffix: getSuffix(url),
                name: lineToLargeHump(value),
                value,
                key: '',
                tdir: '',
                adir,
                alias,
                aliass: aliasss,
                aliasNames: [],
                raw: '',
                getRaw: null,
                mds: [],
                tests: undefined,
            };
            rsobj.aliasNames = getAliassNames(
                rsobj,
                aliass,
            );
            return rsobj;
        }
    }
    return;
}

export function setAsideKey(key: string) {
    setSession('aside.key', key);
}
export function getAsideKey() {
    return getSession('aside.key') as string;
}

function getTDir(key: string) {
    let arr = key.match(/\/([^\/]+)\/$/);
    if (arr && arr.length > 1) {
        return arr[1];
    } else {
        return '';
    }
}

export function isComprops(url: string, comprops: string) {
    if (comprops) {
        const reg = new RegExp(
            comprops + '.+(\\.(js|ts))?$',
        );
        return reg.test(url);
    } else {
        return false;
    }
}

export function isCurprops(url: string, comprops: string) {
    if (comprops) {
        const reg = new RegExp(
            '/' + comprops + '(\\.(js|ts))?$',
        );
        return reg.test(url);
    } else {
        return false;
    }
}

export interface ComponentsObjs {
    props: Array<PropsObj>;
    components: Array<ComponentsObj>;
}

export function getComponentsArr(
    urls: Array<string>,
    v: Resolver,
    comRaw: Globs,
    com: GlobComs,
    config: Components,
): ComponentsObjs {
    const props: Array<PropsObj> = [];
    const arr: Array<ComponentsObj> = [];
    const ppz = getMatchs(
        v.matchexts,
        v.extensions,
        v.matchs,
    );
    const tdir = getTDir(v.dir);
    urls.forEach((key) => {
        const reg = new RegExp('^' + v.dir);
        let k = key.replace(reg, '');
        if (
            (config.comprops &&
                isComprops(k, config.comprops)) ||
            (config.curprops &&
                isCurprops(k, config.curprops))
        ) {
            let value = {} as PropsObj;
            value.comprops = config.comprops || '';
            value.curprops = config.curprops || '';
            value.value = k;
            value.dir = v.dir;
            value.suffix = getSuffix(key);
            value.tdir = tdir;
            value.key = key;
            value.raw = '';
            value.getRaw = getRawValue(comRaw, key);
            props.push(value);
        } else {
            let value = getUrlName(
                k,
                ppz,
                v.aliass,
                v.alias,
            );
            if (value) {
                value.comprops = config.comprops;
                value.curprops = config.curprops;
                value.dir = v.dir;
                value.tdir = tdir;
                value.key = key;
                value.component = com[key];
                value.getRaw = getRawValue(comRaw, key);
                arr.push(value);
            }
        }
    });
    return {
        props,
        components: arr,
    };
}

export function getRawValue(comRaw: Globs, key: string) {
    if (typeof comRaw == 'function') {
        return comRaw;
    } else if (comRaw) {
        return comRaw[key];
    } else {
        return null;
    }
}
