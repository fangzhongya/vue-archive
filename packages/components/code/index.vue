<!-- @format -->

<template>
    <div class="code">
        <div class="code-top">
            <div class="code-top-but">
                <div
                    class="but-div"
                    @click="onClickTo"
                >
                    go
                </div>
                <div
                    class="but-div"
                    @click="onClickCopy"
                >
                    复制
                </div>
                <div
                    class="but-div"
                    @click="onClick"
                >
                    {{ vshow ? '隐藏' : '显示' }}
                </div>
                <div class="top-but-files">
                    <Boxurl :value="props.value">
                        <div
                            class="but-div"
                            :class="{
                                on: !(file && file.value),
                            }"
                            @click.stop="onClickSwitch()"
                        >
                            index.vue
                        </div>
                    </Boxurl>
                    <template v-for="(item, key) of files">
                        <Boxurl :value="item">
                            <div
                                class="but-div"
                                :class="{
                                    on:
                                        item.key ==
                                        file?.key,
                                }"
                                @click.stop="
                                    onClickSwitch(item)
                                "
                            >
                                {{ item.value }}
                            </div>
                        </Boxurl>
                    </template>
                </div>
            </div>
        </div>
        <div
            class="code-highlightjs"
            v-show="vshow"
        >
            <Highlight
                language="html"
                :code="file?.raw || props.text"
            />
        </div>
    </div>
</template>
<script lang="ts" setup>
import Boxurl from '../boxurl/index.vue';
import { toSingle } from '../../router/index';
import Highlight from './highlight.vue';
import { ref, watch } from 'vue';
import { copyCode } from '../../utils/index';
import {
    getTestImportUrl,
    getLocalTextArr,
} from '../../utils/glob';
import type { TextObj, TestsObj } from '../../utils/common';
import type { Ref } from 'vue';

import { useRouter } from 'vue-router';
const router = useRouter();

const props = defineProps({
    text: String,
    value: Object,
});
watch(
    () => props.text,
    () => {
        getData();
    },
);
const files: Ref<TextObj[]> = ref([]);
const file: Ref<TextObj | undefined> = ref();
const vshow = ref(false);
function onClickCopy() {
    if (file.value?.raw) {
        copyCode(file.value.raw);
    } else {
        copyCode(props.text as string);
    }
}
function onClick() {
    vshow.value = !vshow.value;
}
function onClickTo() {
    toSingle(router, props.value as TestsObj);
}
function onClickSwitch(value?: TextObj) {
    vshow.value = true;
    file.value = value;
}
function getData() {
    file.value = undefined;
    vshow.value = false;
    if (props.text) {
        getTestImportUrl(
            props.value?.key,
            props.text,
            'vue',
            props.value?.comprops,
        ).then((arr) => {
            getLocalTextArr(arr).then((v) => {
                files.value = v.filter((o) => {
                    return o.raw;
                });
            });
        });
    }
}
getData();
</script>
<style lang="scss"></style>
