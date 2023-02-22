import { defineComponent, h } from 'vue';
import type { SpecObjs } from '../../utils/index';

export function getTestTopDom<
    T extends (...arrs: any[]) => any,
    E = ReturnType<T>,
>(props: SpecObjs[], h: T): E[] {
    let doms: E[] = [];
    let domss: E[] = [];
    let list: E[] = [];
    const setTitle = () => {
        if (list.length > 0) {
            doms.push(
                h(
                    'div',
                    {
                        class: 'test-top-list',
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
                        class: 'test-top-division',
                    },
                    doms,
                ),
            );
            doms = [];
        }
    };

    props.forEach((obj: SpecObjs) => {
        const info = [];
        let is = false;
        if (obj.date) {
            is = true;
            info.push(
                h(
                    'div',
                    {
                        class: 'test-top-date',
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
                        class: 'test-top-author',
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
                        class: 'test-top-title',
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
                        class: 'test-top-info',
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
                        class: 'test-top-text',
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

        if (obj.proposal) {
            let type = obj.proposal.type || 'div';
            list.push(
                h(
                    type,
                    {
                        class: 'test-top-proposal',
                    },
                    [
                        h(
                            'span',
                            {},
                            obj.proposal.name +
                                ' ' +
                                obj.proposal.description,
                        ),
                    ],
                ),
            );
        }
        if (obj.error) {
            let type = obj.error.type || 'div';
            list.push(
                h(
                    type,
                    {
                        class: 'test-top-error',
                    },
                    [
                        h(
                            'span',
                            {},
                            obj.error.name +
                                ' ' +
                                obj.error.description,
                        ),
                    ],
                ),
            );
        }
    });
    setTitle();
    setDivision();
    return domss;
}
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
        props: { value: SpecObjs[] },
    ) {
        const domss = getTestTopDom(props.value, h);
        return h(
            'div',
            {
                class: 'test-top',
            },
            domss,
        );
    },
});
