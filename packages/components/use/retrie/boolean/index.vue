<template>
    <div class="form-boolean">
        <div @click.stop="onClick(true)">
            <input
                type="radio"
                value="true"
                :disabled="props.disabled"
                :checked="checked"
            />
            <label for="true">true</label>
        </div>
        <div @click.stop="onClick(false)">
            <input
                type="radio"
                value="false"
                :disabled="props.disabled"
                :checked="!checked"
            />
            <label for="false">false</label>
        </div>
    </div>
</template>
<script lang="ts" setup>
const props = defineProps({
    modelValue: {
        type: null,
    },
    list: {
        type: Array,
    },
    disabled: Boolean,
    config: {
        type: Object,
        default() {
            return {};
        },
    },
});
const emit = defineEmits(['value', 'error']);
const checked = ref(false);
watch(
    () => props.modelValue,
    () => {
        let v = props.modelValue;
        onClick(v);
    },
    {
        immediate: true,
    },
);

function check(st) {
    if (typeof st == 'string') {
        if (st === 'true' || st === '1') {
            return true;
        } else {
            return false;
        }
    } else if (typeof st == 'boolean' && st === true) {
        return true;
    } else if (typeof st == 'number' && st === 1) {
        return true;
    } else {
        return false;
    }
}

function onClick(is) {
    checked.value = check(is) || false;
    emit(
        'value',
        checked.value,
        JSON.stringify(checked.value),
    );
}
</script>
<style lang="scss"></style>
