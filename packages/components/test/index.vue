<template>
    <div
        class="test"
        :class="'state-' + state"
    >
        <Boxurl :value="props.value"
            ><div class="md-top-name">
                {{ props.value?.value }} 文件 示例代码
            </div>
        </Boxurl>
        <div class="test-top">
            <Top :value="title"></Top>
        </div>
        <div class="test-div">
            <div class="test-body">
                <Suspense>
                    <AdminPage></AdminPage>
                    <template #fallback>
                        示例加载中...
                    </template>
                </Suspense>
            </div>
            <div
                v-if="props.read"
                class="test-code"
            >
                <Code
                    :value="props.value"
                    :text="codetext"
                ></Code>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import Boxurl from '../boxurl/index.vue';
import Top from './top';
import Code from '../code/index.vue';
import { defineAsyncComponent, watch, ref } from 'vue';
import type {
    Ref,
    ComponentOptionsBase,
    ComponentPublicInstance,
} from 'vue';
import { getNotes } from './index';
import { getLocalTextTests } from '../../utils/glob';
import type { TestsObj } from '../../utils/common';
import type { SpecObjs } from '../../utils/index';
const props = defineProps({
    value: Object,
    read: {
        type: Boolean,
        default: true,
    },
});
const emit = defineEmits(['state']);
const codetext = ref('');
const title: Ref<SpecObjs[]> = ref([]);
const state = ref('1');
watch([() => props.value, () => props.read], () => {
    getData();
});
let AdminPage: new () => ComponentPublicInstance<
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    false,
    ComponentOptionsBase<
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        {},
        {},
        string
    >,
    {}
>;
function getData() {
    if (props.read) {
        if (props.value?.key) {
            getLocalTextTests(props.value as TestsObj)
                .then((text) => {
                    codetext.value = text;
                    let { titles, states } = getNotes(text);
                    title.value = titles;
                    const so = states[0];
                    if (so && so.type) {
                        state.value = so.type.type;
                    }
                    emit(
                        'state',
                        state.value,
                        props.value?.key,
                    );
                })
                .catch(() => {
                    codetext.value = '';
                });
        }
    }
    if (props.value?.component) {
        AdminPage = defineAsyncComponent(
            props.value.component,
        );
    }
}
getData();
</script>
<style></style>
