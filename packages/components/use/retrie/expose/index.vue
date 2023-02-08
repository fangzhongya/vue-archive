<template>
    <div>
        <div>{{ label || '请选择方法' }}</div>
        <Retrie
            :list="rlist"
            :name="props.name"
            queryName="调用"
            @query="onQuery"
        ></Retrie>
        <div>返回值：{{ value }}</div>
    </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import Retrie from '../index.vue';
import type { ObjUnk, ObjStr } from '../../../../config';
const props = defineProps({
    getRef: {
        type: Function,
    },
    name: String,
    value: {
        type: Object,
    },
});
const label = ref('');
const value = ref('');
const paramArr: Ref<string[]> = ref([]);
const rlist = computed(() => {
    paramArr.value = [];
    const v = props.value;
    if (v && v.name) {
        let cs = (v.selectable + '').trim();
        label.value =
            v.name +
            ': ' +
            v.description +
            ' 入参=(' +
            cs +
            ')' +
            ' 返回值: ' +
            v.type;
        if (cs) {
            let arrs = cs.split(',');
            return arrs.map((key) => {
                let vs = key.split(':');
                let name = vs[0];
                paramArr.value.push(name);
                let tarr = getType(vs[1]);
                return {
                    label: key,
                    prop: name,
                    type: tarr[0],
                    dataType: tarr,
                };
            });
        }
    }
    return [];
});

function getType(str: string) {
    if (str) {
        str = (str + '').trim().toLowerCase();
        const reg = /^\<([a-z|\<|\>|\|]+)\>/;
        let rts = reg.exec(str);
        if (rts && rts.length > 0) {
            let ass = rts[1];
            return ass.split('|');
        } else {
            return ['any'];
        }
    } else {
        return ['any'];
    }
}

function onQuery(val: ObjUnk, param: ObjStr) {
    let obj = props.getRef ? props.getRef() : undefined;
    let name = props.value?.name;
    if (name) {
        let arr = paramArr.value.map((key) => {
            return param[key];
        });
        if (obj && obj[name]) {
            let v = obj[name](...arr);
            value.value = JSON.stringify(v);
        }
    } else {
        console.log('请选择方法');
    }
}
</script>
<style lang="scss"></style>
