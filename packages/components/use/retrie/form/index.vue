<template>
    <div
        class="form-item"
        :class="{ error: isErr }"
    >
        <template v-if="props.config?.type == 'select'">
            <FSelect
                :modelValue="props.modelValue"
                class="form-inp"
                :disabled="props.config?.disabled"
                :dataType="props.config.dataType"
                :list="setSelect(props.config)"
                :config="props.config?.config"
                @error="onError"
                @value="onValue"
            ></FSelect>
        </template>
        <template
            v-else-if="props.config?.type == 'choice'"
        >
            <FChoice
                :modelValue="props.modelValue"
                class="form-inp"
                :dataType="props.config.dataType"
                :disabled="props.config?.disabled"
                :list="setSelect(props.config)"
                :config="props.config?.config"
                @error="onError"
                @value="onValue"
            ></FChoice>
        </template>
        <template
            v-else-if="props.config?.type == 'boolean'"
        >
            <FBoolean
                :modelValue="props.modelValue"
                class="form-inp"
                :dataType="props.config.dataType"
                :disabled="props.config?.disabled"
                :config="props.config?.config"
                @error="onError"
                @value="onValue"
            ></FBoolean>
        </template>
        <template
            v-else-if="props.config?.type == 'string'"
        >
            <FString
                :modelValue="props.modelValue"
                class="form-inp"
                :dataType="props.config.dataType"
                :disabled="props.config?.disabled"
                :config="props.config?.config"
                @error="onError"
                @value="onValue"
            ></FString>
        </template>
        <template
            v-else-if="props.config?.type == 'number'"
        >
            <FNumber
                :modelValue="props.modelValue"
                class="form-inp"
                :dataType="props.config.dataType"
                :disabled="props.config?.disabled"
                :config="props.config?.config"
                @error="onError"
                @value="onValue"
            ></FNumber>
        </template>
        <template
            v-else-if="props.config?.type == 'object'"
        >
            <FObject
                :modelValue="props.modelValue"
                class="form-inp"
                :dataType="props.config.dataType"
                :disabled="props.config?.disabled"
                :config="props.config?.config"
                @error="onError"
                @value="onValue"
            ></FObject>
        </template>
        <template v-else-if="props.config?.type == 'array'">
            <FArray
                :modelValue="props.modelValue"
                class="form-inp"
                :dataType="props.config.dataType"
                :disabled="props.config?.disabled"
                :config="props.config?.config"
                @error="onError"
                @value="onValue"
            ></FArray>
        </template>
        <template
            v-else-if="props.config?.type == 'function'"
        >
            <FFunction
                :modelValue="props.modelValue"
                class="form-inp"
                :dataType="props.config.dataType"
                :list="setSelect(props.config)"
                :disabled="props.config?.disabled"
                :config="props.config?.config"
                @error="onError"
                @value="onValue"
            ></FFunction>
        </template>
        <template v-else>
            <FOther
                :modelValue="props.modelValue"
                class="form-inp"
                :dataType="props.config.dataType"
                :list="setSelect(props.config)"
                :disabled="props.config?.disabled"
                :config="props.config?.config"
                @error="onError"
                @value="onValue"
            >
            </FOther>
        </template>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import FFunction from '../function/index.vue';
import FObject from '../object/index.vue';
import FArray from '../array/index.vue';
import FSelect from '../select/index.vue';
import FChoice from '../choice/index.vue';
import FBoolean from '../boolean/index.vue';
import FString from '../string/index.vue';
import FNumber from '../number/index.vue';
import FOther from '../other/index.vue';
import type { ObjUnk } from '../../../../config';
const props = defineProps({
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
    config: {
        type: Object,
        default() {
            return {};
        },
    },
    modelValue: {
        type: null,
    },
});
const isErr = ref(false);
const emit = defineEmits(['change']);

function setSelect(v: ObjUnk, ...arr: unknown[]) {
    if (v) {
        if (typeof v.select == 'string') {
            return props.selects[v.select];
        } else if (typeof v.select == 'function') {
            return v.select(v, ...arr);
        } else {
            return v.select;
        }
    } else {
        return [];
    }
}

function onValue(value: unknown, text: string) {
    const prop = props.config?.prop as string;
    emit('change', prop, value, text);
}

function onError(v: boolean) {
    isErr.value = v;
}
</script>
<style lang="scss"></style>
