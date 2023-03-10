/** @format */

import { getConfig } from '../config';
import type { AsyncComponentLoader } from 'vue';
import {
    getComponentsArr,
    isComprops,
    isCurprops,
    defaultExtensions,
    getRawValue,
} from './common';
import type {
    PropsObj,
    ComponentsObj,
    TestsObj,
    TextObj,
    MdObj,
    PropObj,
    ComponentsObjs,
} from './common';
import type {
    ExampleObj,
    Components,
    GetRaw,
    Globs,
} from '../config';
import {
    humpToLine,
    lineToLargeHump,
    firstLower,
    getSuffix,
    duplicateRemoval,
    asyncMergeArray,
} from './util';

import { getTextImport } from './index';

/***************components*********************/
const componentsObj = {} as {
    [key: string]: ComponentsObj;
};
const componentPropsObj = {} as {
    [key: string]: PropsObj;
};
const aliassComponentsObj = {} as {
    [key: string]: {
        [key: string]: Array<string>;
    };
};
const componentNameKeys: Array<{
    name: string;
    value: string;
}> = [];

/***************components*********************/

/*********************examples************************ */
interface ExamplesObj extends ExampleObj {
    exampless: Array<string>;
    examplessRaw: Array<string>;
}

interface ExamplessObj {
    [key: string]: ExamplesObj;
}

const exampleObj: ExamplessObj = {};

const examplesObj: {
    [key: string]: AsyncComponentLoader;
} = {};

const examplesRawObj: {
    [key: string]: GetRaw;
} = {};
/*********************examples************************ */

/*********************examples************************ */

function getTests() {
    return getConfig('example');
}

function setExampleObj(
    dir: string,
    example: ExampleObj,
    vexample?: ExampleObj,
) {
    const obj: ExamplesObj = Object.assign(
        {
            exampless: [],
            examplessRaw: [],
        },
        example,
        vexample,
    );
    const arr: Array<string> = [];
    const examples = obj.examples;
    if (examples) {
        Object.keys(examples).forEach((key) => {
            arr.push(key);
            examplesObj[key] = examples[key];
        });
    }
    const examplesRaw = obj.examplesRaw;
    const arrraw: Array<string> = [];
    if (obj.urls && obj.urls.length > 0) {
        obj.exampless = obj.urls;
        obj.urls.forEach((key) => {
            arrraw.push(key);
            if (examplesRaw) {
                examplesRawObj[key] = getexamplesRawObj(
                    examplesRaw,
                    key,
                );
            }
        });
    } else {
        obj.exampless = arr;
        if (examplesRaw) {
            Object.keys(examplesRaw).forEach((key) => {
                arrraw.push(key);
                if (examplesRaw) {
                    examplesRawObj[key] = getexamplesRawObj(
                        examplesRaw,
                        key,
                    );
                }
            });
        }
    }
    obj.examples = undefined;

    obj.examplessRaw = arrraw;
    obj.examplesRaw = undefined;

    exampleObj[dir] = obj;
}

function getexamplesRawObj(comRaw: Globs, key: string) {
    if (typeof comRaw == 'function') {
        return comRaw;
    } else if (comRaw) {
        return comRaw[key] || comRaw;
    } else {
        return comRaw;
    }
}

/**
 * ???????????????????????? import
 * @param {*} text ??????
 * @param {*} type ????????????
 * @returns
 */
async function getImport(text: string, type: string) {
    let jstext = '';
    if (type == 'vue') {
        const reg = new RegExp(
            /(<script([^>]*)>)((.|\n|\r)*)(<\/script>)/g,
        );
        let zz = reg.exec(text);
        if (zz) {
            jstext = zz[3];
        }
    } else if (type == 'js' || type == 'ts' || type == '') {
        jstext = text;
    }
    if (jstext) {
        const importss = await getTextImport(jstext);
        let arr = importss?.map((o) => o.n);
        const yrs: Array<string> = [];
        if (arr && arr.length > 0) {
            arr.forEach((key) => {
                if (key) {
                    if (
                        key.startsWith('./') ||
                        key.startsWith('../')
                    ) {
                        yrs.push(key);
                    }
                }
            });
        }
        return yrs;
    }
}

/**
 * ??????????????????????????????
 * @param {*} obj
 * @returns
 */
export function getLocalTextTests(
    obj: TestsObj,
): Promise<string> {
    return new Promise((resolve) => {
        if (obj) {
            if (obj.raw) {
                resolve(obj.raw);
            } else if (obj.getRaw) {
                obj.getRaw(obj).then((s) => {
                    const m = (s || '') + '';
                    obj.raw = m;
                    obj.getRaw = null;
                    resolve(m);
                });
            } else {
                resolve('');
            }
        } else {
            resolve('');
        }
    });
}

/**
 * 0 : url ??????????????????
 * 1 : dir ????????????
 * 2 : ?????? aliass ??????
 * 3 : dir ???????????? ???????????? aliass ??????
 */
export function getLevelUrl(
    key: string | number,
    obj: ComponentsObj,
) {
    key = (key || '') + '';
    let url = '';
    switch (key) {
        case '1':
            url = obj.tdir + '/';
            break;
        case '2':
            url = obj.adir + '/';
            break;
        case '3':
            url = obj.tdir + '/' + obj.adir + '/';
            break;
    }
    return url;
}

/**
 * aliaslevel
 * 0 : ???????????????
 * 1 : ?????????????????????
 * 2 : ?????????????????????
 * 3 : ?????????????????????+????????????
 * 4 : ???????????????
 * 9 : ?????????
 */
/**
 * componentName
 * 0 : ????????? el-input
 * ???????????????????????????
 * 1 : ????????? elInput
 * 2 : ?????????
 */
function getAliaslevelUrl(
    key: string | number,
    obj: ComponentsObj,
    componentName: string | number,
) {
    key = (key || '') + '';
    componentName = (componentName || '') + '';
    let vm = humpToLine(obj.name);
    let arr = [];
    const aliass = Object.values(obj.aliass || {});
    if (key === '1') {
        if (obj.alias) {
            arr.push(obj.alias + '-' + vm);
        }
    } else if (key === '2') {
        if (aliass && aliass.length > 0) {
            aliass.forEach((v) => {
                arr.push(v + '-' + vm);
            });
        }
    } else if (key === '3') {
        let a = '';
        if (obj.alias) {
            a = obj.alias + '-';
        }
        aliass?.forEach((v) => {
            arr.push(a + v + '-' + vm);
        });
    } else if (key === '4') {
        obj.aliasNames?.forEach((v) => {
            arr.push(humpToLine(v));
        });
    } else if (key == '9') {
        arr.push(vm);
        obj.aliasNames?.forEach((v) => {
            arr.push(humpToLine(v));
        });
    }
    if (arr.length == 0) {
        arr.push(vm);
    }
    let farr: Array<string> = [];
    if (componentName === '1') {
        arr.forEach((key) => {
            let s = lineToLargeHump(key);
            farr.push(s, firstLower(s));
        });
    } else if (componentName === '2') {
        arr.forEach((key) => {
            let s = lineToLargeHump(key);
            farr.push(key, s, firstLower(s));
        });
    } else {
        farr = [...arr];
    }
    farr = [...new Set(farr)];
    return farr;
}

function getTestMd(
    topurl: string,
    mlurl: Array<string>,
    exa: ExamplesObj,
    com: ComponentsObj,
) {
    const arr: Array<MdObj> = [];
    exa.examplessRaw.forEach((key: string) => {
        for (let index = 0; index < mlurl.length; index++) {
            const comName = mlurl[index];
            if (
                key ==
                topurl + comName + '/' + exa.md + '.md'
            ) {
                arr.push({
                    topurl: topurl,
                    comkey: com.key,
                    suffix: getSuffix(key),
                    name: com.name,
                    value: comName,
                    key: key,
                    raw: '',
                    getRaw: getRawValue(
                        examplesRawObj,
                        key,
                    ),
                });
                break;
            }
        }
    });
    return arr;
}

function getTestObj(key: string) {
    getCompoNameObj();
    const com = componentsObj[key];
    if (com.tests) {
        return com.tests;
    } else {
        const exa = exampleObj[com.dir];
        const topurl =
            exa.dir + getLevelUrl(exa.level || 0, com);

        const mlurl = getAliaslevelUrl(
            exa.aliaslevel || 0,
            com,
            exa.componentName || 0,
        );
        com.mds = getTestMd(topurl, mlurl, exa, com);

        const arr = {} as {
            [key: string]: TestsObj;
        };
        exa.exampless.forEach((key: string) => {
            for (
                let index = 0;
                index < mlurl.length;
                index++
            ) {
                const bname = mlurl[index];
                if (key.startsWith(topurl + bname + '/')) {
                    const reg = new RegExp(
                        '^\\' +
                            topurl +
                            bname +
                            '/(.*)' +
                            '/index\\.' +
                            defaultExtensions.join('|') +
                            '$',
                    );
                    let value = '';
                    let ms = key.match(reg);
                    if (ms && ms.length > 1) {
                        value = ms[1];
                    }
                    arr[key] = {
                        topurl: topurl,
                        name: bname,
                        value: value,
                        suffix: getSuffix(key),
                        comname: com.name,
                        comkey: com.key,
                        key: key,
                        component: examplesObj[key],
                        raw: '',
                        getRaw: getRawValue(
                            examplesRawObj,
                            key,
                        ),
                    };
                    break;
                }
            }
        });
        com.tests = arr;
        return arr;
    }
}

export function getTestName(url?: string) {
    if (url) {
        const testObj = getTestObj(url);
        return Object.values(testObj);
    } else {
        return [];
    }
}

export function getTestNameObj(
    name: string,
    key: string,
    comkey: string,
) {
    getCompoNameObj();
    const testObj = getTestObj(comkey);
    const arr: Array<TestsObj> = [];
    if (key) {
        let obj = testObj[key];
        if (obj) {
            arr.push(obj);
            return arr;
        }
    }
    Object.values(testObj).forEach((obj) => {
        if (obj.name + '/' + obj.value == name) {
            arr.push(obj);
        }
    });
    return arr;
}

export function getKeyMds(key: string) {
    getTestObj(key);
    return componentsObj[key].mds;
}

/**
 * ?????? getImport ?????? import ?????????
 * @param {*} url
 * @param {*} arr
 * @returns
 */
export async function getTestImportUrl(
    url: string,
    text: string,
    type: string,
    comprops?: string,
): Promise<Array<PropObj>> {
    let arr = (await getImport(text, type)) || [];
    let urs = url.split('/');
    return arr.map((key) => {
        if (key.startsWith('./')) {
            let head = urs
                .slice(0, urs.length - 1)
                .join('/');
            let v = key.substring(2);
            return {
                name: key,
                comprops: comprops || '',
                value: v,
                suffix: getSuffix(key),
                head,
                key: head + '/' + v,
            };
        } else {
            let ks = key.split('/');
            let z = 0;
            for (
                let index = 0;
                index < ks.length;
                index++
            ) {
                const element = ks[index];
                if (element != '..') {
                    z = index;
                    break;
                }
            }
            let vs = ks.slice(z, ks.length);
            let head = urs
                .slice(0, urs.length - z - 1)
                .join('/');
            let v = vs.join('/');
            return {
                name: key,
                comprops: comprops || '',
                value: v,
                suffix: getSuffix(key),
                head,
                key: head + '/' + v,
            };
        }
    });
}

export function getLocalTextArr(
    arr: Array<PropObj>,
): Promise<TextObj[]> {
    return new Promise((resolve) => {
        if (arr && arr.length > 0) {
            let arrs: Array<TextObj> = arr.map((o) => {
                return {
                    raw: '',
                    name: o.name,
                    value: o.value,
                    suffix: getSuffix(o.key),
                    key: o.key,
                    getRaw: getRawValue(
                        examplesRawObj,
                        o.key,
                    ),
                };
            });
            asyncMergeArray(
                arrs,
                (res, reject, value, index) => {
                    if (value.raw) {
                        res();
                    } else if (value.getRaw) {
                        value.getRaw(value).then((s) => {
                            const m = (s || '') + '';
                            value.raw = m;
                            value.getRaw = null;
                            res();
                        });
                    } else {
                        res();
                    }
                },
            ).then(() => {
                resolve(arrs);
            });
        } else {
            resolve([]);
        }
    });
}

/***************components*********************/

/**
 * ??????????????????????????????
 */
function getComponents() {
    const example = getTests() as ExampleObj;
    const arr = getConfig('components') as Components[];
    arr?.forEach((v) => {
        setForComponentsValue(v);
        let dir = v.dir || v?.resolver?.dir || '';
        setExampleObj(dir, example, v.example);
    });
}

export const defaultName = 'default';

function setComponentNameKeys(obj: ComponentsObj) {
    let vm = humpToLine(obj.name);
    let ass = [...obj.aliasNames];
    ass.push(vm);
    ass.forEach((v) => {
        componentNameKeys.push({
            name: v,
            value: obj.key,
        });
    });
}

function setComponentsObj(
    alias: string,
    arr: Array<ComponentsObj>,
) {
    const aliasss = {} as {
        [key: string]: Array<string>;
    };
    arr?.forEach((z) => {
        componentsObj[z.key] = z;
        setComponentNameKeys(z);
        const aliass = Object.values(z.aliass || {});
        if (aliass && aliass.length) {
            aliass.forEach((vs) => {
                aliasss[vs] = aliasss[vs] || [];
                aliasss[vs].push(z.key);
            });
        } else {
            aliasss[defaultName] =
                aliasss[defaultName] || [];
            aliasss[defaultName].push(z.key);
        }
    });
    aliassComponentsObj[alias] = aliasss;
}

function setForComponentsValue(v: Components) {
    let alias;
    let obj: ComponentsObjs;
    if (v.resolver) {
        alias = v.alias || v.resolver?.alias || defaultName;
        obj = getComponentsArr(
            v.resolver.urls || [],
            v.resolver,
            v.componentsRaw,
            v.components,
            v,
        );
    } else {
        alias = v.alias || defaultName;
        let urls = v?.urls || Object.keys(v.componentsRaw);
        obj = getComponentsArr(
            urls,
            v,
            v.componentsRaw,
            v.components,
            v,
        );
    }
    if (obj && obj?.props) {
        obj.props.forEach((z) => {
            componentPropsObj[z.key] = z;
        });
    }
    setComponentsObj(alias, obj.components);
}
export function getCompoNameKey(key: string) {
    getCompoNameObj();
    return componentsObj[key];
}

export function getCompoNameObj(): ComponentsObj[] {
    if (Object.keys(componentsObj).length == 0) {
        getComponents();
    }
    return Object.values(componentsObj);
}

export function getComponentPropsObjs() {
    getCompoNameObj();
    return componentPropsObj;
}

export function getCompoName(
    url: string,
    mfcx?: boolean,
    key?: string,
): Array<ComponentsObj> {
    getCompoNameObj();
    const arr: Array<ComponentsObj> = [];
    if (key) {
        let obj = componentsObj[key];
        if (obj && obj.key) {
            return [obj];
        }
    }
    let vm = humpToLine(url);
    componentNameKeys.forEach((obj) => {
        if (mfcx) {
            if (obj.name.includes(vm)) {
                arr.push(componentsObj[obj.value]);
            }
        } else {
            if (obj.name == vm) {
                arr.push(componentsObj[obj.value]);
            }
        }
    });
    return duplicateRemoval(arr, 'key');
}

async function getPropsImport(text: string, obj: PropObj) {
    let ts = text;
    if (text) {
        let arr = (
            await getTestImportUrl(
                obj.key,
                text,
                obj.suffix,
                obj.comprops,
            )
        ).filter((v) => {
            return (
                v.key.startsWith(obj.head) ||
                isComprops(v.name, obj.comprops || '')
            );
        });
        ts = (await getPropsTexts(arr)) + ts;
    }
    return ts;
}

export function getPropsRaws(
    arr: Array<PropObj>,
): Promise<PropsObj[]> {
    return new Promise((resolve) => {
        if (arr && arr.length > 0) {
            let arrs = arr.map((o) => {
                return (
                    componentPropsObj[o.key] ||
                    componentPropsObj[o.key + '.js'] ||
                    componentPropsObj[o.key + '.ts']
                );
            });
            asyncMergeArray(
                arrs,
                (res, rej, value, index) => {
                    if (value.raw) {
                        res();
                    } else if (value.getRaw) {
                        value
                            .getRaw(value)
                            .then(async (s) => {
                                const m = (s || '') + '';
                                let ts =
                                    await getPropsImport(
                                        m,
                                        arr[index],
                                    );
                                value.raw = ts;
                                value.getRaw = null;
                                res();
                            });
                    } else {
                        res();
                    }
                },
            ).then(() => {
                resolve(arrs);
            });
        } else {
            resolve([]);
        }
    });
}

async function getPropsTexts(arr: Array<PropObj>) {
    const arrs = await getPropsRaws(arr);
    const sts = arrs?.map((o) => o.raw) || [];
    return sts.join('\n');
}

async function getComponentsProps(
    text: string,
    obj: ComponentsObj,
) {
    let ts = text;
    if (text) {
        if (obj.comprops || obj.curprops) {
            let arr = (
                await getTestImportUrl(
                    obj.key,
                    text,
                    obj.suffix,
                    obj.comprops || '',
                )
            ).filter((v) => {
                return (
                    isComprops(
                        v.name,
                        obj.comprops || '',
                    ) ||
                    isCurprops(v.name, obj.curprops || '')
                );
            });
            let str = await getPropsTexts(arr);
            ts = str + ts;
        }
    }
    return ts;
}

export function getLocalTextComponents(
    u?: string,
): Promise<string> {
    return new Promise((resolve) => {
        if (u) {
            getCompoNameObj();
            const componentObj = componentsObj[u];
            if (componentObj) {
                if (componentObj.raw) {
                    resolve(componentObj.raw);
                } else if (componentObj.getRaw) {
                    componentObj
                        .getRaw(componentObj)
                        .then((s) => {
                            const m = (s || '') + '';
                            getComponentsProps(
                                m,
                                componentObj,
                            ).then((text) => {
                                componentObj.raw = text;
                                componentObj.getRaw = null;
                                resolve(text);
                            });
                        });
                } else {
                    resolve('');
                }
            } else {
                resolve('');
            }
        } else {
            resolve('');
        }
    });
}
