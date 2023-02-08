<template>
    <div class="form-number">
        <input
            :value="value"
            type="number"
            @blur.stop="onBlur"
        />
    </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
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

function onBlur(e: Event) {
    const v = (e.target as EventTarget)?.value;
    check(v);
}
function check(st: string) {
    if (st) {
        const z = Number(st);
        if (isNaN(z)) {
            emit('error', true);
        } else {
            emit('value', z, JSON.stringify(z));
            emit('error', false);
            return z;
        }
    } else {
        emit('value', undefined, JSON.stringify(0));
        emit('error', false);
        return 0;
    }
}
</script>
<style lang="scss"></style>
