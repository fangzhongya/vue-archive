<template>
    <div class="com-retrie">
        <div
            v-for="(item, index) in props.list"
            :key="index"
            class="com-retrie-li"
        >
            <label v-if="item.label">{{
                item.label
            }}</label>
            <template
                v-if="!item.type || item.type == 'any'"
            >
                <FAny
                    :config="item"
                    :selects="props.selects"
                    :modelValue="
                        props.modelValue[item.prop]
                    "
                    @change="onChange"
                ></FAny>
            </template>
            <template v-else>
                <FForm
                    :config="item"
                    :selects="props.selects"
                    :modelValue="
                        props.modelValue[item.prop]
                    "
                    @change="onChange"
                ></FForm>
            </template>
        </div>

        <div
            class="but-div com-retrie-but"
            @click.stop="onClick"
        >
            <span>{{ queryName }}</span>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { nextTick } from 'vue';
import FAny from './any/index.vue';
import FForm from './form/index.vue';
const props = defineProps({
    name: String,
    /**
     * @props { Object } selects 选择数据集合
     */
    selects: {
        type: Object,
        default() {
            return {};
        },
    },
    /**
     * @props { Object } config 默认展示数据
     */
    list: {
        type: Array,
        default() {
            return [];
        },
    },
    /**
     * @props { Number } refresh 刷新请求
     */
    refresh: {
        type: Number,
        default: 0,
    },
    modelValue: {
        type: null,
        default() {
            return {};
        },
    },
    queryName: {
        type: String,
        default: '执行',
    },
    /**
     * @props { Boolean } defaultQuery=false ( false, true) 默认查询
     */
    defaultQuery: {
        type: Boolean,
    },
});
/**
 * @emits query ( param:Object ) 查询事件
 */
const emit = defineEmits(['query']);

const value = ref({});
const valueText = ref({});
function onChange(prop, v, text) {
    value.value[prop] = v;
    valueText.value[prop] = text;
}

function onClick() {
    emit('query', value.value, valueText.value);
}

watch(
    () => props.modelValue,
    () => {
        value.value = {};
        valueText.value = {};
        nextTick(() => {
            onClick();
        });
    },
    {
        immediate: true,
    },
);

// watch(
//     () => props.refresh,
//     () => {
//         setRefresh();
//     },
// );
</script>
<style lang="scss"></style>
