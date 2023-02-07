<template>
    <div
        class="aside"
        ref="refAside"
    >
        <div class="aside-search">
            <input v-model="search" />
        </div>
        <div class="aside-list">
            <template v-for="(item, key) of compos">
                <div
                    class="aside-li"
                    @click="onClick(item)"
                    :class="
                        getClassKey(item.key) +
                        ' ' +
                        (item.key == cur.key ? 'on' : '')
                    "
                >
                    <Boxurl :value="item">
                        <div class="aside-li-name">
                            <div class="aside-li-name-name">
                                {{ item.name }}
                            </div>
                            <span
                                class="aside-li-name-aliass"
                            >
                                <span
                                    v-for="v of item.aliasNames"
                                    >{{ v }}</span
                                >
                            </span>
                        </div>
                    </Boxurl>
                </div>
            </template>
        </div>
    </div>
</template>
<script lang="ts" setup>
import Boxurl from '../boxurl/index.vue';
import { ref, watch, onMounted, nextTick } from 'vue';
import type { ComponentsObj } from '../../utils/common';
import type { Ref } from 'vue';
import {
    getCompoNameObj,
    getCompoName,
    getCompoNameKey,
} from '../../utils/glob';
import {
    getAsideKey,
    setAsideKey,
} from '../../utils/common';
const props = defineProps({
    value: Object,
});
const refAside = ref();
const compos: Ref<ComponentsObj[]> = ref([]);
compos.value = getCompoNameObj();

const cur: Ref<ComponentsObj> = ref(
    props.value as ComponentsObj,
);

if (!cur.value || !cur.value.key) {
    let key = getAsideKey();
    if (key) {
        cur.value = getCompoNameKey(key);
    } else {
        cur.value = compos.value[0];
    }
}

const search = ref('');

watch(
    () => props.value,
    () => {
        cur.value = props.value as ComponentsObj;
        setKey();
    },
);

watch(
    () => search.value,
    () => {
        setSearch();
    },
);
const emit = defineEmits(['change']);

function getClassKey(key: string) {
    if (key) {
        return key.replace(/[\.|\/|\s]/g, '-');
    }
    return 'a';
}
function onClick(v: ComponentsObj) {
    cur.value = v;
    setKey();
    emit('change', v);
}
let timeout: NodeJS.Timeout;
function setSearch() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        let v = search.value;
        if (v) {
            compos.value = getCompoName(v, true);
        } else {
            compos.value = getCompoNameObj();
        }
    }, 400);
}

function setKey() {
    let key = cur.value?.key || '';
    setAsideKey(key);
}

setKey();

emit('change', cur.value);
onMounted(() => {
    /**
     * 跳转到对应的位置
     */
    nextTick(() => {
        const dom = refAside.value.querySelector(
            '.aside-li.' + getClassKey(cur.value?.key),
        );
        if (dom) {
            const z = dom.offsetTop;
            const k = refAside.value.parentNode;
            k.scrollTop = z;
        }
    });
});

// const state = useStateStore();
// state.curObj = compos[0] || {};
// function onClick(v) {
//     state.curObj = v;
// }
</script>
<style lang="scss"></style>
