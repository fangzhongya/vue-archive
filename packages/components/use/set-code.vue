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
import { ref, computed } from 'vue';
import Highlight from '../code/highlight.vue';
import { copyCode } from '../../utils/index';
import { getHmtl } from './code';
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
    return getHmtl(
        props.name || '',
        props.value || {},
        props.slotValue,
        props.propsText,
    );
});

const isShow = ref(false);

// function getFunctionBody(v) {
//     let st = getFunctionFormat(v);
//     if (st) {
//         return `function${st.param}${st.body}`;
//     } else {
//         return 'undefined';
//     }
// }

function onClick() {
    isShow.value = !isShow.value;
}

function onClickCopy() {
    copyCode(html.value);
}
</script>
<style lang="scss"></style>
