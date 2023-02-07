import {
    h,
    defineComponent,
    resolveComponent,
    ref,
} from 'vue';
import SetProps from './set-props.vue';
import SetEmit from './set-emit.vue';
import SetCode from './set-code.vue';
import SetExpose from './set-expose.vue';
import SetSlot from './set-slot.vue';
import {
    getPropsValue,
    getEmitsValue,
    getExposeValue,
    getSlotValue,
} from '../../utils/props';
import { firstUpper } from '../../utils/common';

/**
 * @title
 * @author 方忠亚
 * @description 这是个我用来测试功能的测试组件，请不要使用它
 * @date 2022年11月24日22点58分
 */
export default defineComponent({
    /**
     * @props {Stinrg} value 插入数据
     */
    props: {
        value: {
            type: Object,
        },
        param: {
            type: Object,
        },
    },
    // setup(props) {
    // return () => h('div', '这个应该测试js文件组件');
    // },
    render(propss, a, props, b, data) {
        console.log('render', new Date().getTime());
        const rdata = reactive({
            emitValue: {},
            slotValue: {},
        });
        const value = props.value;
        let dom = 'div';
        if (value.component) {
            dom = defineAsyncComponent(value.component);
        } else if (value.name) {
            dom = resolveComponent(value.name);
        }
        const param = props.param;
        const ps = getPropsValue(param.props);
        const es = getEmitsValue(param.emits);
        const res = getExposeValue(param.expose);
        const ss = getSlotValue(param.slot);
        const propsObj = {};
        const slotObj = {};
        ps.forEach((val) => {
            let name = val.name;
            if (!name.includes('.')) {
                let arr = name.split('/');
                name = (arr[0] || '').trim();
                if (name) {
                    propsObj[name] = data.propsValue[name];
                    if (arr && arr.length > 1) {
                        es.push({
                            name: 'update:' + name,
                            description: val.description,
                            selectable:
                                'value:[' + val.type + ']',
                        });
                    }
                }
            }
        });
        es.forEach((val) => {
            let knam = val.name;
            if (knam.includes('-')) {
                let arr = knam.split('-');
                arr = arr.map((vs, i) => {
                    return firstUpper(vs);
                });
                knam = arr.join('');
            } else {
                knam = firstUpper(knam);
            }
            const name = 'on' + knam;
            propsObj[name] = (...arr) => {
                rdata.emitValue[val.name] = arr;
                rdata.emitValue[val.name]._date_ =
                    new Date().getTime();
            };
        });
        let refDom;

        ss.forEach((val) => {
            const name = val.name || 'default';
            slotObj[name] = (scope) => {
                if (rdata.slotValue[name]) {
                    return h(
                        defineComponent({
                            props: {
                                scope: {
                                    type: Object,
                                },
                            },
                            template: rdata.slotValue[name],
                        }),
                        {
                            scope: scope,
                        },
                    );
                }
            };
        });
        return h(
            'div',
            {
                class: 'use',
            },
            [
                h(
                    'div',
                    {
                        class: 'use-props',
                    },
                    h(SetProps, {
                        name: value.name,
                        list: ps,
                        onChange: (val, text) => {
                            data.propsValue = val;
                            data.propsText = text;
                        },
                    }),
                ),
                h(
                    'div',
                    {
                        class: 'use-component',
                    },
                    h(
                        dom,
                        {
                            ...propsObj,
                            ref: (el) => {
                                refDom = el;
                            },
                        },
                        slotObj,
                    ),
                ),
                h(
                    'div',
                    {
                        class: 'use-code',
                    },
                    h(SetCode, {
                        name: value.name,
                        value: propsObj,
                        propsText: data.propsText,
                        slotValue: rdata.slotValue,
                    }),
                ),

                h(
                    'div',
                    {
                        class: 'use-emit',
                    },
                    h(SetEmit, {
                        name: value.name,
                        list: es,
                        value: rdata.emitValue,
                    }),
                ),

                h(
                    'div',
                    {
                        class: 'use-expose',
                    },
                    h(SetExpose, {
                        name: value.name,
                        list: res,
                        getRef: () => {
                            return refDom;
                        },
                    }),
                ),
                h(
                    'div',
                    {
                        class: 'use-slot',
                    },
                    h(SetSlot, {
                        name: value.name,
                        list: ss,
                        onChange: (name, str) => {
                            rdata.slotValue[name] = str;
                        },
                    }),
                ),
            ],
        );
    },
    data() {
        return {
            propsValue: {},
            propsText: {},
        };
    },
    // watch: {
    //     'value.name'() {
    //         console.log('value.name', this.value.name);
    //         this.propsValue = {};
    //         this.emitValue = {};
    //     },
    // },
});
