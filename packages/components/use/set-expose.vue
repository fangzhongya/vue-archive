<template>
    <div
        v-if="props.list && props.list.length > 0"
        class="set-expose"
    >
        请先选择要执行的方法
        <FSelect
            @change="onChange"
            :list="list"
        ></FSelect>
        <FExpose
            :name="props.name"
            :value="curValue"
            :getRef="props.getRef"
        ></FExpose>
    </div>
</template>
<script lang="ts" setup>
import FSelect from './retrie/select/index.vue';
import FExpose from './retrie/expose/index.vue';
import { nextTick } from 'vue';
const props = defineProps({
    list: Array,
    name: String,
    getRef: {
        type: Function,
    },
});
const list = computed(() => {
    return props.list?.map((o, index) => {
        return {
            label: o.name,
            prop: index,
        };
    });
});

const curValue = ref({});

function onChange(v, obj) {
    curValue.value = props.list[v];
}
</script>
<style lang="scss"></style>
