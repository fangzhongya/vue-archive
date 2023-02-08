<template>
    <div class="__document-single">
        <Choice
            :get-name="getName"
            :get-key="getKey"
            @change="onChange"
        >
            <FInfo :value="value"> </FInfo>
            <div
                class="single-top"
                @click="onClick"
            >
                <div class="single-top-li">
                    <div class="single-top-li-span">
                        {{ test?.name }}
                    </div>
                    <div class="single-top-li-span">
                        {{ test?.value }}
                    </div>
                </div>
                <div class="single-top-li">
                    <div class="single-top-li-span">
                        文件路径
                    </div>
                    <div class="single-top-li-span">
                        {{ test?.key }}
                    </div>
                </div>
            </div>
            <div class="single-test">
                <Test :value="test"></Test>
            </div>
            <div
                v-show="isShow"
                class="single-compo"
            >
                <Compo :value="value"></Compo>
            </div>
        </Choice>
    </div>
</template>
<script lang="ts" setup>
import FInfo from '../../components/compo/info.vue';
import Choice from '../../components/choice/index.vue';
import Test from '../../components/test/index.vue';
import Compo from '../../components/compo/index.vue';
import { getTestNameObj } from '../../utils/glob';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { getPageParams } from '../../router/index';
import { ObjUnk } from '../../config';
import type {
    ComponentsObj,
    TestsObj,
} from '../../utils/common';
import type { Ref } from 'vue';
const route = useRoute();
const params = getPageParams(route);
const value = ref({});
const test: Ref<TestsObj | undefined> = ref();
const isShow = ref(false);
function getKey(params: ObjUnk) {
    return params.comkey;
}
function getName(query: ObjUnk) {
    const str = (query.id || '') as string;
    let name = str.split('/')[0] || '';
    return name;
}

function onClick() {
    isShow.value = !isShow.value;
}
function onChange(v: ComponentsObj) {
    value.value = v;
    test.value = getTestNameObj(
        route.query.id + '',
        params.key as string,
        v.key,
    )[0];
}
</script>
<style lang="scss"></style>
