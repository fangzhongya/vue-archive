<template>
    <div class="form-object">
        <textarea
            rows="5"
            :value="value"
            @blur="onBlur"
        />
    </div>
</template>
<script lang="ts" setup>
import { prettierObjFormat } from '../../util';
const props = defineProps({
    modelValue: {
        type: null,
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

function onBlur(e) {
    let v = e.target.value;
    let z = check(v);
    if (z) {
        value.value = z;
    }
}
function getChange(str) {
    return new Function(
        '',
        `{
        var a = ${str};
        return a;
    }`,
    );
}
function check(st) {
    let v;
    if (st) {
        try {
            const fu = getChange(st);
            const z = fu();
            if (typeof z === 'object') {
                v = prettierObjFormat(st);
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
        v = '{\n    \n}';
        emit('value', undefined, v);
        emit('error', false);
    }
    return v;
}
</script>
<style lang="scss"></style>
