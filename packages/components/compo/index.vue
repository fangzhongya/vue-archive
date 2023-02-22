<!-- @format -->

<template>
    <div class="compo">
        <FInfo :value="value"></FInfo>
        <div class="compo-top">
            <Top
                v-if="iss.top"
                :value="vtitle"
            ></Top>
        </div>
        <div class="compo-li compo-props">
            <h4 @click="iss.props = !iss.props">
                组件属性
            </h4>
            <FTable
                v-if="iss.props"
                :list="tprops"
                :value="vprops"
            ></FTable>
        </div>
        <div class="compo-li compo-emits">
            <h4 @click="iss.emits = !iss.emits">
                组件事件
            </h4>
            <FTable
                v-if="iss.emits"
                :list="temits"
                :value="vemits"
            ></FTable>
        </div>
        <div class="compo-li compo-expose">
            <h4 @click="iss.expose = !iss.expose">
                组件方法
            </h4>
            <FTable
                v-if="iss.expose"
                :list="texpose"
                :value="vexpose"
            ></FTable>
        </div>
        <div class="compo-li compo-slot">
            <h4 @click="iss.slot = !iss.slot">组件插槽</h4>
            <FTable
                v-if="iss.slot"
                :list="tslot"
                :value="vslot"
            ></FTable>
        </div>
        <div
            v-if="mds && mds.length"
            class="compo-md"
        >
            <div
                @click="iss.md = !iss.md"
                class="compo-md-name"
            >
                说明文档
            </div>
            <div
                class="compo-md-list"
                v-if="iss.md"
            >
                <template v-for="item of mds">
                    <Md :value="item"></Md>
                </template>
            </div>
        </div>
        <div class="compo-use">
            <Use
                :value="props.value"
                :param="{
                    props: vprops,
                    slot: vslot,
                    emits: vemits,
                    expose: vexpose,
                }"
            ></Use>
        </div>
    </div>
</template>
<script lang="ts" setup>
import Use from '../use/index';
import FInfo from './info.vue';
import Md from '../md/index.vue';
import Top from './top';
import FTable from './ftable.vue';
import { ref, watch, reactive } from 'vue';
import { tprops, temits, texpose, tslot } from './index';
import { getNotes, getKeyMds } from './index';
import type { FTableList } from './index';
import type { MdObj } from '../../utils/common';
import type { Ref } from 'vue';
import type { SpecObjs } from '../../utils/index';
const props = defineProps({
    value: Object,
});
const vtitle: Ref<SpecObjs[]> = ref([]);
const iss = reactive({
    props: true,
    expose: true,
    emits: true,
    slot: true,
    md: true,
    top: true,
});
const vprops: Ref<SpecObjs[]> = ref([]);
const vemits: Ref<SpecObjs[]> = ref([]);
const vexpose: Ref<SpecObjs[]> = ref([]);
const vslot: Ref<SpecObjs[]> = ref([]);

const mds: Ref<MdObj[]> = ref([]);

watch(
    () => props.value,
    () => {
        getData();
    },
);
function getData() {
    if (props.value?.key) {
        getNotes(props.value?.key).then((obj) => {
            let { titles, propss, slots, emitss, exposes } =
                obj;
            vtitle.value = titles;
            vprops.value = propss;
            vslot.value = slots;
            vemits.value = emitss;
            vexpose.value = exposes;
        });
        mds.value = getKeyMds(props.value?.key) || [];
    }
}
getData();
</script>
<style lang="scss"></style>
