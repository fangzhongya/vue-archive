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
import type { FTableList } from '../components/compo/index';

import {
    type FangMd,
    runDev,
} from '@fangzhongya/create/bins/md';

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

const mls: ComponentsObj[] = [];

export function nodeInit(
    c: NodeConfig,
    callback: (mls: ComponentsObj[]) => void,
) {
    configObj = userConfig(c);
    configObj._callback_ = callback;
    if (typeof c.setHtml === 'function') {
        setHtml = c.setHtml;
    }
    Fang = runDev(c?.create);
    getCompoNameObj().forEach((v) => {
        mls.push(v);
        getCompoData(v);
    });
}

/***
 * 获取组件数据
 */
function getCompoData(obj: ComponentsObj) {
    getData(obj);
}

/**
 * 获取示例数据
 * @param obj
 */
function gettests(obj: ComponentsObj, arr: string[]) {
    const tests = getTestName(obj.key);
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
                    getTopDom(titles, setHtml),
                );
                arr.push(...setDom(dom));
                arr.push(...setTestUrl(obj, zv));
                res();
            })
            .catch(() => {});
    }).then(() => {
        setMd(obj, arr);
    });
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

    if (mls.length == lss) {
        if (configObj._callback_) {
            configObj._callback_(mls);
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
    arr.push(`:::preview ${'test.name'}`);
    arr.push(`demo-preview=${url}`);
    arr.push(`:::`);
    //     :::preview 标题说明 || 使用说明
    // demo-preview=../examples/components/cs-title/cs/index.vue
    // :::
    return arr;
}

function setDom(dom: string) {
    const arr: string[] = [];
    // arr.push('```html');
    arr.push(prettierHtml(dom));
    // arr.push('```');
    return arr;
}

/**
 * 设置组件的页面md
 * @param obj
 */
function getData(value: ComponentsObj) {
    const arr: string[] = [];
    arr.push('# ' + value.name);
    getNotes(value.key).then((obj) => {
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
            getTopDom(titles, setHtml),
        );
        arr.push(...setDom(dom));

        /**
         * 设置列表
         */
        const list = [
            ...getlistDom(propss, '组件属性', tprops),
            ...getlistDom(emitss, '组件事件', temits),
            ...getlistDom(emitss, '组件方法', texpose),
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
            gettests(value, arr);
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
    return v.replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
        v = v.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        ths.push(setHtml('th', {}, [v]));
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
