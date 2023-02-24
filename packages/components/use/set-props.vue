<template>
    <div
        v-if="rlist && rlist.length > 0"
        class="set-props"
    >
        <Retrie
            :refresh="refresh"
            :modelValue="propsValue"
            :selects="selects"
            :list="rlist"
            :name="props.name"
            @query="onQuery"
        ></Retrie>
    </div>
</template>
<script lang="ts" setup>
import { ref, nextTick, watch } from 'vue';
import Retrie from './retrie/index.vue';
import type { Spec } from '../../utils/index';
import type { ObjUnk } from '../../config';
import type { Ref } from 'vue';
import { getSpecType } from './code';
const props = defineProps({
    name: String,
    list: Array<Spec>,
});

type SelectsObj = {
    label: string;
    prop: unknown;
};

type Selects = {
    [key: string]: Array<SelectsObj>;
};

type RList = {
    label: string;
    prop: string;
    type: string;
    dataType: string | string[];
    select?: string | Array<SelectsObj>;
};

const emit = defineEmits(['change']);
const selects: Ref<Selects> = ref({});
const refresh = ref(0);

const propsValue: Ref<ObjUnk> = ref({});
const rlist: Ref<RList[]> = ref([]);
function setVlaue() {
    propsValue.value = {};
    const arrlist: RList[] = [];
    props.list?.forEach((val) => {
        let name = val.name;
        if (!name.includes('.')) {
            name = (name.split('/')[0] || '').trim();
        } else {
            name = '';
        }
        if (name) {
            propsValue.value[name] = (
                val.default || ''
            ).trim();
            const { arr, type, dataType } =
                getSpecType(val);

            selects.value[name] = arr;
            const label = setLabel(name, val);
            let obj = {
                label: label,
                prop: name,
                type: type,
                dataType: dataType,
                select: name,
            };
            arrlist.push(obj);
        }
    });
    rlist.value = arrlist;
}

function setLabel(name: string, val: Spec) {
    let st =
        name +
        ': ' +
        '{ ' +
        (val.type || 'any') +
        ' } ' +
        val.description;
    if (val.default) {
        st += ' 默认值=' + val.default;
    }
    if (val.selectable) {
        st += ' 可选值=' + val.selectable;
    }
    return st;
}

function getType(value: string) {
    let arr: string[] = [];
    let str = (value || '').trim().toLowerCase();
    str.split(',').forEach((v) => {
        v = v.trim();
        if (v) {
            arr.push(v);
        }
    });
    return [...new Set(arr)].sort();
}

function onQuery(obj: unknown, text: unknown) {
    let value = Object.assign({}, obj);
    emit('change', value, text);
}

let t: NodeJS.Timeout;
function setRefresh() {
    clearTimeout(t);
    t = setTimeout(() => {
        setVlaue();
    }, 400);
}

watch(
    () => props.name,
    () => {
        rlist.value = [];
        nextTick(() => {
            setRefresh();
        });
    },
    {
        immediate: true,
    },
);
</script>
<style lang="scss"></style>
