<template>
    <div class="choice aside">
        <template v-for="(item, key) of props.value">
            <div
                class="aside-li"
                @click="onClick(item)"
                :class="{
                    on: item.key == props.choice?.key,
                }"
            >
                <Boxurl :value="item">
                    <div class="aside-li-name">
                        <div class="aside-li-name-name">
                            {{ item.name }}
                        </div>
                        <div class="aside-li-name-aliass">
                            <span
                                v-for="v of item.aliasNames"
                                >{{ v }}</span
                            >
                        </div>
                        <div class="aside-li-name-aliass">
                            <span>{{ item.key }}</span>
                        </div>
                    </div>
                </Boxurl>
            </div>
        </template>
    </div>
</template>
<script lang="ts" setup>
import Boxurl from '../boxurl/index.vue';
import type { ComponentsObj } from '../../utils/common';
const props = defineProps({
    value: {
        type: Array<ComponentsObj>,
    },
    choice: {
        type: Object,
    },
});
const emit = defineEmits(['change']);
function onClick(val: ComponentsObj) {
    emit('change', val);
}
</script>
<style lang="scss"></style>
