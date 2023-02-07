<template>
    <div class="__document-tests">
        <Choice @change="onChange">
            <FInfo :value="value"> </FInfo>
            <div class="tests-top">
                <span
                    class="but-div"
                    v-for="(item, index) in topList"
                    :key="index"
                    @click="onClick(item)"
                    :class="{ on: state == item.id }"
                >
                    {{ item.name }}
                </span>
            </div>
            <div
                class="tests-test"
                v-if="tests && tests.length > 0"
            >
                <div
                    class="tests-test-li"
                    v-for="item of tests"
                >
                    <Test
                        @state="onState"
                        :value="item"
                    ></Test>
                </div>
            </div>
            <div v-else>没有查询到示例</div>
        </Choice>
    </div>
</template>
<script lang="ts" setup>
import FInfo from '../../components/compo/info.vue';
import Choice from '../../components/choice/index.vue';
import Test from '../../components/test/index.vue';
import { getTestName } from '../../utils/glob';
import type {
    TestsObj,
    ComponentsObj,
} from '../../utils/common';
import type { Ref } from 'vue';
import { ref } from 'vue';
const testss: Ref<TestsObj[]> = ref([]);
const tests: Ref<TestsObj[]> = ref([]);
const value: Ref<ComponentsObj | undefined> = ref();

const state = ref('');
interface TopLi {
    name: string;
    id: string;
}
const topList: TopLi[] = [
    { name: '全部', id: '' },
    { name: '正常', id: '1' },
    { name: '更新', id: '2' },
    { name: '建议', id: '3' },
    { name: '错误', id: '4' },
    { name: '错误与建议', id: '5' },
    { name: '修改', id: '6' },
    { name: '完成建议修改', id: '7' },
    { name: '完成错误修改', id: '8' },
    { name: '完成全部修改', id: '9' },
];
const stateObj = {} as {
    [key: string]: string[];
};
/**
 * 状态 1：正常，2：更新， 3：建议，4 错误， 5 错误与建议，6，修改 7，完成建议修改，8，完成错误修改
 * @param {*} state
 * @param {*} key
 */
function onState(s = '', key: string) {
    s = s + '';
    let arr = stateObj[s] || [];
    arr.push(key);
    stateObj[s] = arr;
}
function onChange(val: ComponentsObj) {
    value.value = val;
    testss.value = getTestName(val.key);
    tests.value = [...testss.value];
}
function onClick(item: TopLi) {
    let id = item.id;
    state.value = item.id;
    if (id) {
        let arr = stateObj[id];
        if (arr && arr.length > 0) {
            tests.value = testss.value.filter((obj) => {
                return arr.includes(obj.key);
            });
        } else {
            tests.value = [];
        }
    } else {
        tests.value = [...testss.value];
    }
}
</script>
<style lang="scss"></style>
