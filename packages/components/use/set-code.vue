<template>
    <div class="set-code">
        <div
            @click="onClick"
            class="set-code-buts"
        >
            <div>代码</div>
            <div class="but-div set-code-but">
                {{ isShow ? '显示' : '隐藏' }}
            </div>
            <div
                @click.stop="onClickCopy"
                class="but-div set-code-but"
            >
                复制
            </div>
        </div>
        <div
            class="set-code-html"
            v-show="isShow"
        >
            <Highlight
                language="html"
                :code="html"
            />
        </div>
    </div>
</template>
<script lang="ts" setup>
import {
    getFunctionFormat,
    prettierFormat,
    vueFormat,
    getFunBody,
} from './util';
import Highlight from '../code/highlight.vue';
import { copyCode } from '../../utils/index';
import {
    firstLower,
    humpToLine,
    firstUpper,
} from '../../utils/common';
const props = defineProps({
    name: {
        type: String,
    },
    value: {
        type: Object,
    },
    slotValue: {
        type: Object,
    },
    propsText: {
        type: Object,
    },
});
const html = computed(() => {
    let tarr = [];
    let sarr = [];
    let is = true;
    Object.keys(props.value).forEach((key) => {
        let val = props.value[key];
        if (
            /^on[A-Z]/.test(key) &&
            typeof val == 'function'
        ) {
            let name = key.substring(2);
            let knam = key.split(':');
            if (knam.length > 1) {
                knam =
                    knam[0] +
                    knam
                        .slice(1)
                        .map((o) => firstUpper(o))
                        .join('');
                name = firstLower(name);
            } else {
                knam = knam[0];
                name = humpToLine(name);
            }
            if (knam.includes('-')) {
                let arr = knam.split('-');
                arr = arr.map((vs, i) => {
                    if (i != 0) {
                        return firstUpper(vs);
                    } else {
                        return vs;
                    }
                });
                knam = arr.join('');
            }
            tarr.push(
                '            @' + name + '="' + knam + '"',
            );
            sarr.push('function ' + knam + '(...arr) {');
            sarr.push(
                "   console.log('" + knam + "', arr)",
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
                        getFunctionBody(val, key),
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
                    let st = setValStringify(val, key);
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
    const slots = getSlots(props.slotValue);

    const st = `<!--${props.name}-->
<template>
    <div>
        <${props.name}${tarr.join('\n')}>${slots.join('\n')}
        </${props.name}>
    </div>
</template>
<script lang="ts" setup>
${sarr.join('\n')}
<\/script>
`;
    return st;
});

const isShow = ref(false);

function getSlots(obj) {
    const arr = [];
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

// function getFunctionBody(v) {
//     let st = getFunctionFormat(v);
//     if (st) {
//         return `function${st.param}${st.body}`;
//     } else {
//         return 'undefined';
//     }
// }

function getFunctionBody(v, key) {
    let text = props.propsText[key];
    if (text) {
        return text;
    } else {
        let st = getFunctionFormat(
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

function setValStringify(v, key) {
    // if (/^\'(.|\n|\r)*\'$/.test(st)) {
    //     st = st
    //         .replace(/^\'/, '"')
    //         .replace(/\'$/, '"');
    // }
    let text = props.propsText[key];
    if (text) {
        return text;
    } else {
        return JSON.stringify(v);
    }
}

function onClick() {
    isShow.value = !isShow.value;
}

function onClickCopy() {
    copyCode(html.value);
}
</script>
<style lang="scss"></style>
