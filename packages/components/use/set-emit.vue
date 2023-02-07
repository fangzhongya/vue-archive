<template>
    <div
        v-if="props.list && props.list.length > 0"
        class="set-emit"
    >
        <div
            v-for="(item, index) in props.list"
            :key="index"
        >
            <div>{{ setLabel(item) }}</div>
            <div>
                <span
                    >事件返回数据：{{ setDate(item) }}</span
                >
                <div
                    v-for="(val, key) in setValue(item)"
                    :key="key"
                >
                    <span>参数{{ key + 1 }}：</span>
                    <span>{{ JSON.stringify(val) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
const props = defineProps({
    list: Array,
    value: {
        type: Object,
    },
});

function setLabel(val) {
    let st =
        val.name +
        ': (' +
        val.selectable +
        ') ' +
        val.description;
    return st;
}
function setValue(val) {
    let name = val.name;
    if (props.value) {
        let arr = props.value[name];
        return arr;
    } else {
        return [];
    }
}
function setDate(val) {
    let name = val.name;
    if (props.value) {
        let arr = props.value[name];
        return arr?._date_ || '';
    } else {
        return '';
    }
}
</script>
<style lang="scss"></style>
