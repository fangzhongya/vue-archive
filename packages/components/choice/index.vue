<template>
    <div class="__document-compon">
        <div
            class="__document-compon-choice"
            v-if="choice.length"
        >
            <Choice
                v-if="isChoice"
                @change="onChange"
                :value="choice"
                :choice="value"
            ></Choice>
            <div
                @click="isChoice = !isChoice"
                class="__document-compon-choice-but"
            >
                {{ isChoice ? '展开' : '隐藏' }}
            </div>
        </div>
        <div
            class="__document-compon-body"
            :class="{
                choice: choice.length,
            }"
        >
            <div v-if="value?.key">
                <slot :value="value"></slot>
            </div>
            <div v-else-if="choice.length">
                请先选择要查看的组件
            </div>
            <div v-else>
                没有查询到{{ route.query.id }}组件
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import Choice from './choice.vue';
import { getCompoName } from '../../utils/glob';
import { setAsideKey } from '../../utils/common';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getPageParams } from '../../router/index';
import type { ComponentsObj } from '../../utils/common';
import type { Ref } from 'vue';
const props = defineProps({
    getName: {
        type: Function,
        default(query: { [key: string]: any }): string {
            return query.id;
        },
    },
    getKey: {
        type: Function,
        default(params: { [key: string]: any }): string {
            return params.key;
        },
    },
});
const route = useRoute();
const params = getPageParams(route);
const value: Ref<ComponentsObj | undefined> = ref();
const choice: Ref<ComponentsObj[]> = ref([]);
const isChoice = ref(false);
const emit = defineEmits(['change']);
watch(
    () => route.query.id,
    () => {
        getData();
    },
);
function getData() {
    let arr =
        getCompoName(
            props.getName(route.query),
            true,
            props.getKey(params),
        ) || [];
    choice.value = [];
    if (arr.length == 1) {
        value.value = arr[0];
        emit('change', value.value);
    } else if (arr.length == 0) {
        value.value = undefined;
        emit('change', value.value);
    } else {
        isChoice.value = true;
        choice.value = arr;
    }
}
function onChange(val: ComponentsObj) {
    isChoice.value = false;
    value.value = val;
    emit('change', value.value);
    setAsideKey(val.key);
}

getData();
</script>
<style lang="scss"></style>
