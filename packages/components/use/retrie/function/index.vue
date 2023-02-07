<template>
    <div class="form-function">
        <textarea
            rows="5"
            :value="value"
            @blur="onBlur"
        />
    </div>
</template>
<script lang="ts" setup>
import { getFunctionFormat } from '../../util';
const props = defineProps({
    modelValue: {
        type: null,
    },
    list: {
        type: Array,
    },
    config: {
        type: Object,
        default() {
            return {
                label: 'label',
                prop: 'prop',
            };
        },
    },
});
const param = computed(() => {
    return (
        props.list?.map((o) => {
            return o[props.config.prop];
        }) || []
    );
});
const emit = defineEmits(['value', 'error']);
const value = ref('');
watch(
    () => props.modelValue,
    () => {
        let v = props.modelValue;
        value.value = check(v) || v;
    },
    {
        immediate: true,
    },
);

function onBlur(e) {
    let v = e.target.value;
    let z = check(v);
    if (z) {
        value.value = z;
    }
}

function getChange(v) {
    return new Function(...param.value, v);
}

function getParamStr() {
    return `(${param.value.join(', ')}) `;
}

function check(st) {
    let v;
    if (st) {
        try {
            let obj = getFunctionFormat(st);
            if (obj) {
                v = obj.body;
                const fu = getChange(v);
                fu();
                emit('value', fu, getParamStr() + v);
                emit('error', false);
            }
        } catch (error) {
            emit('error', true);
            console.log('error', error);
        }
    } else {
        v = '{\n    \n}';
        emit('value', undefined, getParamStr() + v);
        emit('error', false);
    }
    return v;
}
</script>
<style lang="scss"></style>
