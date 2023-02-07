<template>
    <div class="__document-index">
        <div class="index-aside">
            <div class="index-aside-div">
                <Aside
                    :value="value"
                    @change="omChange"
                ></Aside>
            </div>
        </div>
        <div class="index-body">
            <div class="index-div">
                <div class="index-header">
                    <Header></Header>
                </div>
                <div class="index-main">
                    <div class="index-main-div">
                        <Main :value="value"></Main>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import Aside from '../../components/aside/index.vue';
import Header from '../../components/header/index.vue';
import Main from '../../components/main/index.vue';
import { computed, ref, watch } from 'vue';
import { getCompoName } from '../../utils/glob';
import type { ComponentsObj } from '../../utils/common';
import { useRoute } from 'vue-router';
const route = useRoute();
const value = ref({});
function omChange(v: ComponentsObj) {
    value.value = v;
}
watch(
    () => route.query.id,
    () => {
        getData();
    },
);
function getData() {
    if (route.query.id) {
        value.value = getCompoName(route.query.id + '');
    }
}
getData();
// import { useStateStore } from '../store/state';
// const state = useStateStore();
// const value = computed(() => {
//     return state.curObj;
// });
</script>
<style lang="scss"></style>
