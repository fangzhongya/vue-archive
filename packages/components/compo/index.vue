<!-- @format -->

<template>
    <div class="compo">
        <FInfo :value="value"></FInfo>
        <Props
            @change="onChange"
            :value="text"
        ></Props>
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
        <div
            v-if="useparam"
            class="compo-use"
        >
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
import Props from './props.vue';
import { getConfig } from '../../config';
import Md from '../md/index.vue';
import { ref, watch, reactive } from 'vue';
import { getKeyMds, type NotesObj } from './index';
import type { MdObj } from '../../utils/common';
import { getLocalTextComponents } from '../../utils/glob';
import type { SpecObjs } from '../../utils/index';
import type { Ref } from 'vue';
const props = defineProps({
    value: Object,
});
const useparam = getConfig('useparam');
const text = ref('');
const iss = reactive({
    md: true,
});
const mds: Ref<MdObj[]> = ref([]);
const vprops: Ref<SpecObjs[]> = ref([]);
const vemits: Ref<SpecObjs[]> = ref([]);
const vexpose: Ref<SpecObjs[]> = ref([]);
const vslot: Ref<SpecObjs[]> = ref([]);

function onChange(obj: NotesObj) {
    let { propss, slots, emitss, exposes } = obj;

    vprops.value = propss;
    vslot.value = slots;
    vemits.value = emitss;
    vexpose.value = exposes;
}

watch(
    () => props.value,
    () => {
        getData();
    },
);
function getData() {
    if (props.value?.key) {
        getLocalTextComponents(props.value?.key).then(
            (t) => {
                text.value = t;
            },
        );
        mds.value = getKeyMds(props.value?.key) || [];
    }
}
getData();
</script>
<style lang="scss"></style>
