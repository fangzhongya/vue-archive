<template>
    <div class="compo">
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
    </div>
</template>
<script lang="ts" setup>
import Top from './top';
import FTable from './ftable.vue';
import { tprops, temits, texpose, tslot } from './index';
import { getNotesText } from './index';
import { ref, watch, reactive } from 'vue';
import type { Ref } from 'vue';
import type { SpecObjs } from '../../utils/index';
const props = defineProps({
    value: String,
});
const emit = defineEmits(['change']);
const vtitle: Ref<SpecObjs[]> = ref([]);
const iss = reactive({
    props: true,
    expose: true,
    emits: true,
    slot: true,
    top: true,
});
const vprops: Ref<SpecObjs[]> = ref([]);
const vemits: Ref<SpecObjs[]> = ref([]);
const vexpose: Ref<SpecObjs[]> = ref([]);
const vslot: Ref<SpecObjs[]> = ref([]);
function getData() {
    if (props.value) {
        const obj = getNotesText(props.value);
        vtitle.value = obj.titles;
        vprops.value = obj.propss;
        vslot.value = obj.slots;
        vemits.value = obj.emitss;
        vexpose.value = obj.exposes;
        emit('change', obj);
    }
}

watch(
    () => props.value,
    () => {
        getData();
    },
);
getData();
</script>
<style lang="scss"></style>
