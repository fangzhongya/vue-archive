<template>
    <div class="slot">
        <textarea
            rows="5"
            :value="value"
            ref="refText"
            @blur="onBlur"
        />
        <div
            @click.stop="onClick"
            class="but-div"
        >
            插入
        </div>
    </div>
</template>
<script lang="ts" setup>
import { prettierHtml } from '../../util';
const props = defineProps({
    value: {
        type: Object,
    },
});
const refText = ref();
const value = ref('');
const emit = defineEmits(['change', 'error']);
function onClick() {
    const dom = refText.value;
    const v = dom.value;
    try {
        emit('change', v);
        emit('error', false);
    } catch (error) {
        emit('error', true);
        console.log('error', error);
    }
}
function onBlur(e) {
    let v = e.target.value;
    try {
        let z = prettierHtml(v);
        value.value = z;
        emit('error', false);
    } catch (error) {
        emit('error', true);
        console.log('error', error);
    }
}
</script>
<style lang="scss"></style>
