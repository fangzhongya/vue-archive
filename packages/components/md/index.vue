<!-- @format -->

<template>
    <div class="md">
        <template v-if="dom">
            <Boxurl :value="props.value">
                <div class="md-top-name">
                    {{ props.value?.value }} 说明文档
                </div>
            </Boxurl>
            <div v-html="dom"></div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import Boxurl from '../boxurl/index.vue';
import hljs from 'highlight.js/lib/common';
import { ref, watch } from 'vue';
import MarkdownIt from 'markdown-it';
import { getLocalTextTests } from '../../utils/glob';
import type { TestsObj } from '../../utils/common';
const props = defineProps({
    value: Object,
});
const dom = ref('');
const md = new MarkdownIt({
    html: true,
    xhtmlOut: true,
    highlight: function (str: string, lang: string) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, {
                    language: lang,
                }).value;
            } catch (__) {}
        }

        return ''; // use external default escaping
    },
});

watch(
    () => props.value,
    () => {
        getData();
    },
);
function getData() {
    if (props.value?.key) {
        getLocalTextTests(props.value as TestsObj)
            .then((text) => {
                dom.value = md.render(text);
            })
            .catch(() => {
                dom.value = '';
            });
    }
}
getData();
</script>
