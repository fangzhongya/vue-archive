<template>
    <div class="form-number">
        <textarea
            rows="3"
            :value="value"
            @blur.stop="onBlur"
        />
    </div>
</template>
<script lang="ts" setup>
import { getString } from '../../util';
const props = defineProps({
    modelValue: {
        type: null,
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
const emit = defineEmits(['value']);
const value = ref('');
watch(
    () => props.modelValue,
    () => {
        let v = props.modelValue;
        value.value = check(v);
    },
    {
        immediate: true,
    },
);

function onBlur(e) {
    let v = e.target.value;
    check(v);
}
function check(st) {
    if (st) {
        st = getString(st);
        emit('value', JSON.stringify(st));
        return st;
    } else {
        emit('value', undefined, JSON.stringify(''));
        return '';
    }
}
</script>
<style lang="scss"></style>
