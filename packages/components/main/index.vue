<template>
    <div class="main">
        <div class="main-top">
            <Compo :value="props.value"></Compo>
        </div>
        <div class="main-but">
            <div
                class="but-div"
                @click="onClick(1)"
            >
                当前
            </div>
            <div
                class="but-div"
                @click="onClick(2)"
            >
                更多
            </div>
            <div
                class="but-div"
                @click="onClick(3)"
            >
                开发
            </div>
        </div>
        <div
            class="main-test"
            v-for="item of tests"
        >
            <Test :value="item"></Test>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import {
    toCompon,
    toTests,
    toDevelop,
} from '../../router/index';
import Compo from '../compo/index.vue';
import Test from '../test/index.vue';
import { getTestName } from '../../utils/glob';
import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import type {
    TestsObj,
    ComponentsObj,
} from '../../utils/common';
const router = useRouter();
const props = defineProps({
    value: Object,
});
const tests: Ref<TestsObj[]> = ref([]);
watch(
    () => props.value,
    () => {
        gettests();
    },
);
function gettests() {
    tests.value = getTestName(props.value?.key);
}
gettests();
function onClick(key: string | number) {
    if (key == 1) {
        toCompon(router, props.value as ComponentsObj);
    } else if (key == 2) {
        toTests(router, props.value as ComponentsObj);
    } else if (key == 3) {
        toDevelop(router, props.value as ComponentsObj);
    }
}
</script>
<style lang="scss"></style>
