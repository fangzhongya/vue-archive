import { userConfig } from '../config';
import type { Config } from '../config';
import type { SpecObjs } from '../utils/index';
import { prettierHtml } from '../components/use/util';
import { join } from 'node:path';
import type {
    ComponentsObj,
    TestsObj,
} from '../utils/common';

import { getNotes as getTestNotes } from '../components/test/index';
import { asyncMergeArray } from '../utils/util';
import { isArray } from '@fangzhongya/utils/basic/array/isArray';
import { getImportUrl } from '@fangzhongya/utils/urls/getImportUrl';
import { lineToLargeHump } from '@fangzhongya/utils/name/lineToLargeHump';
import {
    getCompoNameObj,
    getTestName,
    getLocalTextTests,
} from '../utils/glob';

import {
    getNotes,
    getKeyMds,
} from '../components/compo/index';
import { getTopDom } from '../components/compo/top';

import {
    tprops,
    temits,
    texpose,
    tslot,
} from '../components/compo/index';
import type {
    FTableList,
    NotesObj,
} from '../components/compo/index';

import {
    type FangMd,
    runDev,
} from '@fangzhongya/create/bins/md';
import { htmlEscape } from '@fangzhongya/utils/html/htmlEscape';
let Fang: FangMd;

/**
 * 生成对应的html
 * @param div
 * @param sx
 * @param v
 * @returns
 */
function h(
    div: string,
    sx?: { [key: string]: string },
    v?: string | string[],
): string {
    if (isArray(v)) {
        v = (v as string[]).join('');
    }
    const st: string[] = [];
    if (sx) {
        Object.keys(sx).forEach((z) => {
            st.push(z + '="' + sx[z] + '"');
        });
    }
    return `<${div} ${st.join(' ')}>${v || ''}</${div}>`;
}

let setHtml: (
    div: string,
    sx?: { [key: string]: string },
    v?: string | string[],
) => string = h;

let configObj: {
    [key: string]: any;
};

interface NodeConfig extends Config {
    [key: string]: any;
}

let comps: ComponentsObj[] = [];

export async function nodeInit(
    c: NodeConfig,
    callback: (mls: ComponentsObj[]) => void,
) {
    configObj = userConfig(c);
    configObj._callback_ = callback;
    if (typeof c.setHtml === 'function') {
        setHtml = c.setHtml;
    }
    Fang = runDev(c?.create);
    comps = getCompoNameObj();
    for (let index = 0; index < comps.length; index++) {
        const element = comps[index];
        await getCompoData(element);
    }
}
import { getLevelUrl } from '../utils/glob';

function getName(obj: ComponentsObj) {
    let name = obj.value;
    if (configObj.usealias) {
        name = obj.alias + '-' + name;
    }
    return lineToLargeHump(name);
}

/**
 * 获取示例数据
 * @param obj
 */
function gettests(
    obj: ComponentsObj,
    arr: string[],
    n: NotesObj,
) {
    const tests = getTestName(obj.key);
    if (tests && tests.length > 0) {
        asyncMergeArray(tests, (res, _reject, zv, inde) => {
            getLocalTextTests(zv)
                .then((text) => {
                    arr.push(`### 示例` + inde + 1);
                    const { titles } = getTestNotes(text);
                    /**
                     * 设置头部
                     */
                    const dom = setHtml(
                        'div',
                        {
                            class: 'compo-top',
                        },
                        getTestTopDom(
                            titles,
                            setHtml,
                            true,
                        ),
                    );
                    arr.push(...setDom(dom));
                    arr.push(...setTestUrl(obj, zv));
                    res();
                })
                .catch(() => {});
        }).then(() => {
            setMd(obj, arr);
        });
    } else {
        const name = 'cs';
        let key =
            configObj.example.dir +
            '/' +
            getLevelUrl(configObj.example.level, obj) +
            '/' +
            obj.value +
            '/' +
            name +
            '/index.vue';
        key = key
            .replace(/\/\//g, '/')
            .replace(/\/\//g, '/');
        arr.push(
            ...setTestUrl(obj, {
                key: key,
                name: name,
            } as TestsObj),
        );
        setVue(getName(obj), n, join(configObj.dir, key));
        setMd(obj, arr);
    }
}

import {
    getPropsValue,
    getEmitsValue,
} from '../utils/props';
import { firstUpper } from '../utils/util';

import {
    getHmtl,
    getSpecType,
} from '../components/use/code';

import type { Spec } from '../utils/index';
import type { ObjUnk } from '../config';

import { getFunctionFormat } from '../components/use/util';

function getFFParam(str: string) {
    str = str.trim();
    if (str && str.length > 2) {
        return str
            .substring(1, str.length - 1)
            .split(',')
            .map((k) => {
                return (k.split(':')[0] || '').trim();
            });
    }
    return [];
}

function getObjValue(d: unknown) {
    return new Function(
        '',
        `{
            return ${d}
        }`,
    )();
}

function getDefaultValue(obj: Spec) {
    const vo = getSpecType(obj).zdtype;
    const d = (obj.default || '').trim();
    if (vo == 'function') {
        let fb = getFunctionFormat(d);
        if (fb) {
            return new Function(
                ...getFFParam(fb.param),
                fb.body,
            );
        }
        return new Function('', '{}');
    } else if (vo == 'array') {
        return getObjValue(d || '[]');
    } else if (vo == 'object') {
        return getObjValue(d || '{}');
    } else if (vo == 'number') {
        return getObjValue(d || '1');
    } else if (vo == 'boolean') {
        return getObjValue(d || 'true');
    } else {
        return d;
    }
}

function setVue(
    propsname: string,
    param: NotesObj,
    url: string,
) {
    const ps = getPropsValue(param.propss);
    const es = getEmitsValue(param.emitss);
    const propsObj = {} as ObjUnk;
    ps.forEach((val) => {
        let name = val.name;
        if (!name.includes('.')) {
            let arr = name.split('/');
            name = (arr[0] || '').trim();
            if (name) {
                propsObj[name] = getDefaultValue(val);
                if (arr && arr.length > 1) {
                    es.push({
                        name: 'update:' + name,
                        description: val.description,
                        selectable:
                            'value:[' + val.type + ']',
                    } as Spec);
                }
            }
        }
    });
    es.forEach((val) => {
        let knam = val.name;
        if (knam.includes('-')) {
            let arr = knam.split('-');
            arr = arr.map((vs, i) => {
                return firstUpper(vs);
            });
            knam = arr.join('');
        } else {
            knam = firstUpper(knam);
        }
        const name = 'on' + knam;
        propsObj[name] = (...arr: unknown[]) => {};
    });
    const html = getHmtl(propsname, propsObj);

    Fang.fileOpen(url, html);
}

let lss = 0;
function setMd(obj: ComponentsObj, arr: string[]) {
    lss++;
    const sc = join(
        configObj.dir,
        configObj.outDir,
        '/' + obj.value + '/index.md',
    );
    Fang.fileOpen(sc, arr.join('\n\n'));

    if (comps.length == lss) {
        if (configObj._callback_) {
            configObj._callback_(comps);
        }
    }
}

function setTestUrl(obj: ComponentsObj, test: TestsObj) {
    const arr: string[] = [];
    const tu = join(configObj.dir, test.key);
    const sc = join(
        configObj.dir,
        configObj.outDir,
        '/' + obj.value + '/index.md',
    );
    const url = getImportUrl(sc, tu);

    if (configObj.setTest) {
        arr.push(...configObj.setTest(url, test, obj));
    } else {
        arr.push(`:::preview ${test.name} || `);
        arr.push(`demo-preview=${url}`);
        arr.push(`:::`);
    }
    return arr;
}

function setDom(dom: string) {
    const arr: string[] = [];
    // arr.push('```html');
    arr.push(prettierHtml(dom));
    // arr.push('```');
    return arr;
}

import { getTestTopDom } from '../components/test/top';

/**
 * 获取组件数据 设置组件的页面md
 * @param obj
 */
async function getCompoData(value: ComponentsObj) {
    const arr: string[] = [];
    arr.push('# ' + getName(value));
    await getNotes(value.key).then((obj) => {
        let { titles, propss, slots, emitss, exposes } =
            obj;

        /**
         * 设置头部
         */
        const dom = setHtml(
            'div',
            {
                class: 'compo-top',
            },
            getTopDom(titles, setHtml, true),
        );

        arr.push(...setDom(dom));

        /**
         * 设置列表
         */
        const list = [
            ...getlistDom(propss, '组件属性', tprops),
            ...getlistDom(emitss, '组件事件', temits),
            ...getlistDom(exposes, '组件方法', texpose),
            ...getlistDom(slots, '组件插槽', tslot),
        ];

        arr.push(...list);

        arr.push(`## 说明文档`);

        const mds = getKeyMds(value.key) || [];

        asyncMergeArray(mds, (res, _reject, zv) => {
            getLocalTextTests(zv as TestsObj)
                .then((text) => {
                    arr.push(text);
                    res();
                })
                .catch(() => {});
        }).then(() => {
            arr.push(`## 示例`);
            gettests(value, arr, obj);
        });
    });
}

function setValue(
    data: SpecObjs,
    item: FTableList,
    index: number,
    key: number,
) {
    let v;
    if (item.formatter) {
        v = item.formatter(data, item, index, key);
    } else if (item.prop) {
        v = data[item.prop];
    } else {
        v = '';
    }
    v = v.toString();
    return htmlEscape(v);
}

function getlistDom(
    arr: SpecObjs[],
    t: string,
    list: FTableList[],
) {
    const arrs: string[] = [];
    const ths: string[] = [];
    list.forEach((item) => {
        let v = item?.label || '';
        ths.push(setHtml('th', {}, [htmlEscape(v)]));
    });

    let trli: string[];
    if (arr && arr.length > 0) {
        trli = [];
        arr.forEach((data, index) => {
            const vs: string[] = [];
            list.forEach((item, key) => {
                vs.push(
                    setHtml('td', {}, [
                        setValue(
                            data,
                            item,
                            index,
                            key,
                        ) as string,
                    ]),
                );
            });
            trli.push(
                setHtml(
                    'tr',
                    { class: 'compo-talbe-li' },
                    vs,
                ),
            );
        });
    } else {
        trli = [
            setHtml(
                'tr',
                {
                    class: 'compo-talbe-zw',
                },
                [
                    setHtml(
                        'td',
                        {
                            colspan: '5',
                        },
                        ['暂无'],
                    ),
                ],
            ),
        ];
    }
    const dom = setHtml(
        'table',
        {
            class: 'compo-talbe-body',
        },
        [
            setHtml('thead', {}, [
                setHtml(
                    'tr',
                    {
                        class: 'compo-talbe-top',
                    },
                    ths,
                ),
            ]),
            setHtml('tbody', {}, trli),
        ],
    );
    arrs.push(`## ${t}`);

    arrs.push(...setDom(dom));

    return arrs;
}
