import { defineComponent, h } from 'vue';
import type { VNode } from 'vue';
import type { SpecObjs } from '../../utils/index';
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
        value: Array,
    },
    render(
        propss: any,
        a: any,
        props: {
            value: SpecObjs[];
        },
    ) {
        let doms: VNode[] = [];
        let domss: VNode[] = [];
        let list: VNode[] = [];
        const setTitle = () => {
            if (list.length > 0) {
                doms.push(
                    h(
                        'div',
                        {
                            class: 'compo-top-list',
                        },
                        list,
                    ),
                );
                list = [];
            }
        };
        const setDivision = () => {
            if (doms.length > 0) {
                domss.push(
                    h(
                        'div',
                        {
                            class: 'compo-top-division',
                        },
                        doms,
                    ),
                );
                doms = [];
            }
        };

        props.value?.forEach((obj) => {
            const info = [];
            let is = false;
            if (obj.date) {
                is = true;
                info.push(
                    h(
                        'div',
                        {
                            class: 'compo-top-date',
                        },
                        [
                            h('span', {}, '更新时间：'),
                            h(
                                'span',
                                {},
                                obj.date.name +
                                    ' ' +
                                    obj.date.description,
                            ),
                        ],
                    ),
                );
            }
            if (obj.author) {
                is = true;
                info.push(
                    h(
                        'div',
                        {
                            class: 'compo-top-author',
                        },
                        [
                            h('span', {}, '作者：'),
                            h(
                                'span',
                                {},
                                obj.author.name +
                                    ' ' +
                                    obj.author.description,
                            ),
                        ],
                    ),
                );
            }
            if (
                obj.title &&
                (obj.title.type ||
                    obj.title.name ||
                    obj.title.description)
            ) {
                setTitle();
                if (is) {
                    setDivision();
                }
                let type = obj.title.type || 'div';
                doms.push(
                    h(
                        type,
                        {
                            class: 'compo-top-title',
                        },
                        [
                            h(
                                'span',
                                {},
                                obj.title.name +
                                    ' ' +
                                    obj.title.description,
                            ),
                        ],
                    ),
                );
            }
            if (is) {
                if (list.length > 0) {
                    setTitle();
                    setDivision();
                }
                doms.push(
                    h(
                        'div',
                        {
                            class: 'compo-top-info',
                        },
                        info,
                    ),
                );
            }

            if (obj.text) {
                let type = obj.text.type || 'div';
                list.push(
                    h(
                        type,
                        {
                            class: 'compo-top-text',
                        },
                        [
                            h(
                                'span',
                                {},
                                obj.text.name +
                                    ' ' +
                                    obj.text.description,
                            ),
                        ],
                    ),
                );
            }
        });
        setTitle();
        setDivision();
        return h(
            'div',
            {
                class: 'compo-top',
            },
            domss,
        );
    },
});
