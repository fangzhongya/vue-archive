<template>
    <div class="form-any">
        <div>
            <FSelect
                noValue
                @change="onChangeSelect"
                :modelValue="config.dataType"
                :list="list"
            >
            </FSelect>
        </div>
        <FForm
            :config="config"
            :selects="props.selects"
            :modelValue="value"
            @change="onChange"
        ></FForm>
    </div>
</template>
<script lang="ts" setup>
import { getSonType, isDefaultType } from '../../util';
import FForm from '../form/index.vue';
import FSelect from '../select/index.vue';
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
const list = ref([]);
const config = ref({});
const emit = defineEmits(['change']);
const value = ref('');

const defaultList = [
    {
        label: 'string',
        prop: 'string',
    },
    {
        label: 'boolean',
        prop: 'boolean',
    },
    {
        label: 'number',
        prop: 'number',
    },
    {
        label: 'array',
        prop: 'array',
    },
    {
        label: 'object',
        prop: 'object',
    },
    {
        label: 'function',
        prop: 'function',
    },
    {
        label: '其他',
        prop: '',
    },
];

watch(
    () => props.modelValue,
    () => {
        setValue();
    },
    {
        immediate: true,
    },
);

function getValueType(valueType) {
    for (
        let index = 0;
        index < list.value.length;
        index++
    ) {
        const prop = list.value[index].prop;
        if (
            prop === valueType ||
            prop.startsWith(valueType)
        ) {
            return prop;
        }
    }
}

function setType(type, valueType) {
    let obj = Object.assign({}, props.config);
    if (valueType) {
        const t = getValueType(valueType);
        if (t) {
            type = t;
        }
    }
    let arr = getSonType(type);
    obj.type = arr[0];
    obj.dataType = type;

    config.value = obj;
}

function setValue() {
    let arr = [];
    const dataType = props.config.dataType || [];
    if (dataType && dataType.length > 1) {
        arr = dataType.map((type) => {
            return {
                label: type,
                prop: type,
            };
        });
    } else {
        let type = dataType[0];
        if (type && type != '*') {
            arr = [
                {
                    label: type,
                    prop: type,
                },
            ];
        } else {
            arr = defaultList;
        }
    }

    list.value = arr;
    setType(arr[0].prop, isDefaultType(props.modelValue));
    value.value = props.modelValue;
}

function onChangeSelect(v) {
    setType(v);
    value.value = '';
}
function onChange(...arr) {
    emit('change', ...arr);
}
</script>
<style lang="scss"></style>
