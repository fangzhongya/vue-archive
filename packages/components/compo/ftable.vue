<!-- @format -->

<template>
    <div class="compo-talbe">
        <table class="compo-talbe-body">
            <thead>
                <tr class="compo-talbe-top">
                    <template
                        v-for="(item, index) in props.list"
                    >
                        <th>{{ item?.label }}</th>
                    </template>
                </tr>
            </thead>
            <tbody>
                <template
                    v-if="
                        props.value &&
                        props.value.length > 0
                    "
                >
                    <tr
                        class="compo-talbe-li"
                        v-for="(data, index) in props.value"
                    >
                        <template
                            v-for="(
                                item, key
                            ) in props.list"
                        >
                            <td>
                                {{
                                    setValue(
                                        data,
                                        item,
                                        index,
                                        key,
                                    )
                                }}
                            </td>
                        </template>
                    </tr>
                </template>
                <template v-else>
                    <tr class="compo-talbe-zw">
                        <td colspan="5">暂无</td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>
<script lang="ts" setup>
const props = defineProps({
    /**
     * table列表
     * {
     *      name:"列表名称"
     *      value:"列表取值"
     *      type:"列表类型"
     * }
     */
    list: {
        type: Array,
        default() {
            return [];
        },
    },
    value: {
        type: Array,
        default() {
            return [];
        },
    },
});
function setValue(
    data: any,
    item: any,
    index: number,
    key: number,
) {
    if (item.formatter) {
        return item.formatter(data, item, index);
    } else if (item.props) {
        return data[item.props];
    }
}
</script>
