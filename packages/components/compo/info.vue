<template>
    <div class="compo-info">
        <Boxurl :value="props.value">
            <div class="compo-info-name">
                <h2 class="compo-info-name-span">
                    {{ props.value?.name }}
                </h2>
                <div
                    class="compo-info-name-li"
                    v-if="
                        props.value?.aliasNames &&
                        props.value?.aliasNames.length
                    "
                >
                    <span class="compo-info-name-li-span">
                        别名
                    </span>
                    <span class="compo-info-name-li-span">
                        <span
                            v-for="v of props.value
                                .aliasNames"
                            >{{ v }}</span
                        >
                    </span>
                </div>
                <div class="compo-info-name-li">
                    <span class="compo-info-name-li-span">
                        文件路径
                    </span>
                    <span class="compo-info-name-li-span">
                        {{ props.value?.key }}
                    </span>
                </div>
            </div>
        </Boxurl>
    </div>
</template>
<script lang="ts" setup>
import Boxurl from '../boxurl/index.vue';
const props = defineProps({
    value: {
        type: Object,
    },
});
</script>
<style lang="scss"></style>
