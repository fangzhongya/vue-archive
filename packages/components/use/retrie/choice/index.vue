<template>
    <div class="form-select">
        <input
            :value="label"
            readonly="readonly"
            placeholder="请选择"
            type="text"
            :disabled="props.disabled"
            ref="refInput"
            @click.stop="onClick"
            @blur.stop="onBlur"
        />
        <div
            @mousemove.stop="onMousemove"
            @mouseout.stop="onMouseout"
            class="form-select-box"
        >
            <div
                class="form-select-list"
                v-show="isShow"
            >
                <div
                    class="form-select-list-div"
                    v-if="
                        props.list && props.list.length > 0
                    "
                >
                    <div
                        class="form-select-list-li"
                        v-for="(v, k) of props.list"
                        :class="{
                            active: isActive(v),
                        }"
                        @click.stop="onSelect(v)"
                    >
                        <span>{{ setLabel(v) }}</span>
                    </div>
                </div>
                <div
                    v-else
                    class="no-data"
                >
                    暂无数据
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { toggleArray } from '../../../../utils/common';
import { getSonType, getString } from '../../util';
const props = defineProps({
    modelValue: {
        type: null,
    },
    dataType: { type: [String, Array] },
    disabled: Boolean,
    list: {
        type: Array,
    },
    config: {
        type: Object,
        default() {
            return {
                label: 'label',
                prop: 'prop',
            };
        },
    },
});
const emit = defineEmits(['value', 'change']);
const refInput = ref();
const isShow = ref(false);
const isShowList = ref(false);
const curValue = ref([]);
const label = computed(() => {
    return curValue.value
        .map((o) => {
            return setLabel(o);
        })
        .join(',');
});

const valueType = computed(() => {
    let t = props.dataType;
    if (t instanceof Array) {
        t = t[0];
    }
    let arr = getSonType('string') || [];
    return arr[1];
});

watch(
    () => props.modelValue,
    () => {
        setValue();
    },
    {
        immediate: true,
    },
);

function getValue(arr = []) {
    if (valueType.value == 'string') {
        return arr.map((v) => {
            return getString(v);
        });
    } else if (valueType.value == 'number') {
        return arr.map((v) => {
            let z = Number(v);
            if (isNaN(z)) {
                z = 0;
            }
            return z;
        });
    } else {
        return arr;
    }
}

function setValue() {
    curValue.value = [];
    let v = props.modelValue;
    let value = JSONParse(v, 'array') || [];
    if (props.list) {
        for (
            let index = 0;
            index < props.list.length;
            index++
        ) {
            const element = props.list[index];
            if (value.includes(setProp(element))) {
                curValue.value.push(element);
            }
        }
    }
    onValue();
}

function setLabel(v) {
    let label = props.config?.label;
    if (label && typeof v == 'object') {
        return v[label];
    } else {
        return v;
    }
}

function setProp(v) {
    let prop = props.config?.prop;
    if (prop && typeof v == 'object') {
        return v[prop];
    } else {
        return v;
    }
}

function isActive(v) {
    return curValue.value
        .map((z) => {
            return setProp(z);
        })
        .includes(setProp(v));
}

function onClick() {
    if (!props.disabled) {
        isShow.value = true;
    }
}

function onBlur() {
    if (!isShowList.value) {
        isShow.value = false;
    }
}

function onMousemove() {
    isShowList.value = true;
}
function onMouseout() {
    isShowList.value = false;
}

function onSelect(v) {
    if (refInput.value) {
        refInput.value.focus();
    }
    curValue.value = toggleArray(
        curValue.value,
        v,
        props.config.prop,
    );
    onValue();
}
function onValue() {
    let arr = getValue(
        curValue.value.map((v) => {
            return setProp(v);
        }),
    );
    emit('value', arr, JSON.stringify(arr));
}
</script>
<style lang="scss">
.form-select {
    position: relative;
    .form-select-box {
        position: absolute;
        background-color: #fff;
        text-align: center;
        .form-select-list-div {
            border: 1px solid #fff;
            .form-select-list-li {
                padding: 10px;
                border-bottom: 1px solid #eee;
                &:last-child {
                    border: 0;
                }
                &.active {
                    color: rgb(0, 81, 255);
                }
            }
        }
    }
}
</style>
