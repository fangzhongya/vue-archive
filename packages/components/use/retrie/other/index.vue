<template>
    <div class="form-other">
        <textarea
            rows="3"
            :value="value"
            @blur="onBlur"
        />
    </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { prettierFormat, isTypeEqual } from '../../util';
const props = defineProps({
    modelValue: {
        type: null,
    },
    dataType: { type: [String, Array<string>] },
    disabled: Boolean,
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

function onBlur(e: Event) {
    const v = (e.target as EventTarget)?.value;
    let z = check(v);
    if (z) {
        value.value = z;
    }
}
function getChange(str: string) {
    return new Function(
        '',
        `{
        var a = ${str};
        return a;
    }`,
    );
}
function check(st: string) {
    let v;
    if (st) {
        try {
            const fu = getChange(st);
            const z = fu();
            if (isTypeEqual(z, props.dataType || [])) {
                v = prettierFormat(st);
                emit('value', z, v);
                emit('error', false);
            } else {
                emit('error', true);
                console.log('error', '类型不匹配');
            }
        } catch (error) {
            emit('error', true);
            console.log('error', error);
        }
    } else {
        v = '';
        emit('value', undefined, v);
        emit('error', false);
    }
    return v;
}
</script>
<style lang="scss"></style>
