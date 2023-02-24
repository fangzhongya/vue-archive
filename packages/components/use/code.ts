import {
    firstLower,
    humpToLine,
    firstUpper,
} from '../../utils/util';
import type { ObjStr, ObjUnk } from '../../config';
import {
    getFunctionFormat,
    prettierFormat,
    vueFormat,
    getFunBody,
} from './util';

export function getHmtl(
    propsname: string,
    value: ObjUnk,
    slotValue?: ObjStr,
    propsText?: ObjStr,
) {
    const tarr: string[] = [];
    const sarr: string[] = [];
    let is = true;
    Object.keys(value).forEach((key) => {
        let val = value[key];
        if (
            /^on[A-Z]/.test(key) &&
            typeof val == 'function'
        ) {
            let name = key.substring(2);
            const knam = key.split(':');
            let strs: string;
            if (knam.length > 1) {
                strs =
                    knam[0] +
                    knam
                        .slice(1)
                        .map((o) => firstUpper(o))
                        .join('');
                name = firstLower(name);
            } else {
                strs = knam[0];
                name = humpToLine(name);
            }
            if (knam.includes('-')) {
                let arr = strs.split('-');
                arr = arr.map((vs, i) => {
                    if (i != 0) {
                        return firstUpper(vs);
                    } else {
                        return vs;
                    }
                });
                strs = arr.join('');
            }
            tarr.push(
                '            @' + name + '="' + strs + '"',
            );
            sarr.push('function ' + strs + '(...arr) {');
            sarr.push(
                "   console.log('" + strs + "', arr)",
            );
            sarr.push('}');
        } else {
            tarr.push(
                '            :' + key + '="' + key + '"',
            );
            if (typeof val == 'function') {
                sarr.push(
                    'const ' +
                        key +
                        ' = ' +
                        getFunctionBody(
                            val,
                            key,
                            propsText,
                        ),
                );
            } else {
                if (is) {
                    is = false;
                    sarr.unshift(
                        "import { ref } from 'vue';",
                    );
                }
                if (typeof val == 'undefined') {
                    sarr.push('const ' + key + ' = ref();');
                } else {
                    let st = setValStringify(
                        val,
                        key,
                        propsText,
                    );
                    sarr.push(
                        'const ' +
                            key +
                            ' = ref(' +
                            st +
                            ');',
                    );
                }
            }
        }
    });
    if (tarr.length > 0) {
        tarr.unshift('');
    }
    const slots = getSlots(slotValue as ObjStr);

    const st = `<!--${propsname}-->
<template>
    <div>
        <${propsname}${tarr.join('\n')}>${slots.join('\n')}
        </${propsname}>
    </div>
</template>
<script lang="ts" setup>
${sarr.join('\n')}
<\/script>
`;
    return st;
}

function getSlots(obj: ObjStr = {}) {
    const arr: string[] = [];
    Object.keys(obj).forEach((key) => {
        const v = obj[key];
        if (v) {
            const st = `            <template #${key}="scope">
${vueFormat(v, '                ')}
            </template>`;
            arr.push(st);
        }
    });
    if (arr && arr.length > 0) {
        arr.unshift('');
    }
    return arr;
}

function getFunctionBody(
    v: Function,
    key: string,
    propsText?: ObjStr,
) {
    const text = propsText ? propsText[key] : '';
    if (text) {
        return 'function' + text;
    } else {
        const st = getFunctionFormat(
            prettierFormat(v.toString()),
        );
        if (st) {
            let body = `{
${vueFormat(getFunBody(st.body), '   ')}
}`;
            return `function${st.param}${body}`;
        } else {
            return 'undefined';
        }
    }
}

function setValStringify(
    v: unknown,
    key: string,
    propsText?: ObjStr,
) {
    const text = propsText ? propsText[key] : '';
    if (text) {
        return text;
    } else {
        return JSON.stringify(v);
    }
}
