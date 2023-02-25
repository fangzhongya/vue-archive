<template>
    <div class="__document-index">
        <div class="index-aside">
            <div class="index-aside-div">
                <div class="choice aside">
                    <template v-for="(item, key) of lists">
                        <div
                            class="aside-li"
                            @click="onClick(item)"
                            :class="{
                                on: item.key == choice?.key,
                            }"
                        >
                            <Boxurl :value="item">
                                <div class="aside-li-name">
                                    <div
                                        class="aside-li-name-name"
                                    >
                                        {{ getName(item) }}
                                    </div>
                                </div>
                            </Boxurl>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <div class="index-body">
            <div class="index-div">
                <div class="index-header">
                    <Header></Header>
                </div>
                <div class="index-main">
                    <div class="index-main-top">
                        <Boxurl :value="choice">
                            <div class="aside-li-name">
                                <div
                                    class="aside-li-name-name"
                                >
                                    {{ getName(choice) }}
                                </div>
                            </div>
                        </Boxurl>
                    </div>
                    <div class="index-main-div">
                        <Props :value="text"></Props>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import Boxurl from '../../components/boxurl/index.vue';
import Props from '../../components/compo/props.vue';
import Header from '../../components/header/index.vue';
import { getConfig, type Components } from '../../config';
import { type Ref, ref } from 'vue';
import { isComprops } from '../../utils/common';
import {
    getComponentPropsObjs,
    getPropsRaws,
} from '../../utils/glob';
import type { PropsObj, PropObj } from '../../utils/common';
const ps = (
    getConfig('components') as Array<Components>
).map((o) => o.comprops);
const lis = Object.values(getComponentPropsObjs()).filter(
    (o) => {
        for (let index = 0; index < ps.length; index++) {
            const element = ps[index] || '';
            if (element && isComprops(o.key, element)) {
                return true;
            }
        }
    },
);

function getName(obj: PropsObj) {
    const reg = new RegExp(obj.comprops + '(.+)$');
    const rs = reg.exec('/' + obj.value);
    if (rs) {
        return rs[1];
    }
    return obj.value;
}

const lists = ref(lis);
const choice = ref(lists.value[0]) as Ref<PropsObj>;
const text = ref('');
function onClick(item: PropsObj) {
    choice.value = item;
    getData();
}
function getData() {
    getPropsRaws([choice.value as any as PropObj]).then(
        (arrs) => {
            const obj = arrs[0];
            text.value = obj.raw;
        },
    );
}
getData();
</script>
<style lang="scss"></style>
