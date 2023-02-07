<template>
    <div class="form-select">
        <input
            :value="setLabel(curValue)"
            readonly="readonly"
            placeholder="请选择"
            type="text"
            :disabled="props.disabled"
            @click.stop="onClick"
            @blur.stop="onBlur"
        />
        <div class="form-select-box">
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
import { getString } from '../../util';
const props = defineProps({
    modelValue: {
        type: null,
    },
    dataType: { type: [String, Array] },
    disabled: Boolean,
    list: {
        type: Array,
    },
    noValue: Boolean,
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
const isShow = ref(false);
const curValue = ref({});

watch(
    () => props.modelValue,
    () => {
        setValue();
    },
    {
        immediate: true,
    },
);

function setValue() {
    if (props.list) {
        for (
            let index = 0;
            index < props.list.length;
            index++
        ) {
            const element = props.list[index];
            if (setProp(element) === props.modelValue) {
                curValue.value = element;
                if (!props.noValue) {
                    onChange();
                }
                break;
            }
        }
    }
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
    return setProp(v) === setProp(curValue.value);
}

function onClick() {
    if (!props.disabled) {
        isShow.value = true;
    }
}

function onBlur() {
    setTimeout(() => {
        isShow.value = false;
    }, 100);
}

function onSelect(v) {
    curValue.value = v;
    onChange();
}
function onChange() {
    let z = setProp(curValue.value);
    if (props.dataType && props.dataType.length == 1) {
        let type = props.dataType[0];
        if (type == 'string') {
            z = getString(z);
        } else if (type == 'number') {
            z = Number(z);
            if (isNaN(z)) {
                z = 0;
            }
        }
    }
    emit('value', z, JSON.stringify(z));
    emit('change', z, curValue.value);
}
</script>
<style lang="scss">
.form-select {
    position: relative;
    .form-select-box {
        position: absolute;
        z-index: 100;
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
