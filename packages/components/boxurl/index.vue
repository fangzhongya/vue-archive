<template>
    <div
        ref="boxurl"
        class="box-url"
    >
        <span class="box-url-span">
            <slot></slot>
        </span>
        <div
            class="box-url-box"
            :style="{ top: lefty, left: topx }"
        >
            <div class="box-url-box-div">
                <div class="box-div-li">
                    <div class="box-div-li-span">
                        {{ value?.name }}
                    </div>
                    <div class="box-div-li-span">
                        {{ value?.value }}
                    </div>
                </div>
                <div
                    v-if="
                        value?.aliasNames &&
                        value?.aliasNames.length
                    "
                    class="box-div-li"
                >
                    <div class="box-div-li-span">别名</div>
                    <div class="box-div-li-span">
                        <span
                            v-for="v of value?.aliasNames"
                            >{{ v }}</span
                        >
                    </div>
                </div>
                <div class="box-div-li">
                    <div class="box-div-li-span">
                        文件路径
                    </div>
                    <div class="box-div-li-span">
                        {{ value?.key }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
const props = defineProps({
    value: Object,
});
const boxurl = ref();
const topx = ref('');
const lefty = ref('');
onMounted(() => {
    boxurl.value.onmouseenter = (event: MouseEvent) => {
        var event = event || window.event; //标准化事件对象
        let x, y;
        if (event.x || event.y) {
            x = event.x;
            y = event.y;
        } else if (event.pageX || event.pageY) {
            x = event.pageX - 1;
            y = event.pageY - 1;
        }
        topx.value = x + 'px';
        lefty.value = y + 'px';
    };
});
</script>
<style lang="scss"></style>
