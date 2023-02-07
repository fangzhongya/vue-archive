<template>
    <div
        v-if="props.list && props.list.length > 0"
        class="set-slot"
    >
        <div>
            当前作用域参数使用 scope ，使用 template 来渲染
        </div>
        <div
            v-for="(item, index) in props.list"
            :key="index"
        >
            <div>{{ setLabel(item) }}</div>
            <div
                class="form-item"
                :class="{ error: errors[index] }"
            >
                <FSlot
                    @error="
                        (is) => {
                            errors[index] = is;
                        }
                    "
                    @change="
                        (...arr) => {
                            onChange(arr, item);
                        }
                    "
                    :value="item"
                ></FSlot>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import FSlot from './retrie/slot/index.vue';
const props = defineProps({
    list: Array,
    name: String,
});

const errors = ref([]);
const emit = defineEmits(['change']);
function setLabel(val) {
    let st =
        val.name +
        ': (' +
        val.selectable +
        ') ' +
        val.description;
    return st;
}

function onChange(arr, obj) {
    let name = obj.name || 'default';
    emit('change', name, arr[0]);
}
</script>
<style lang="scss"></style>
