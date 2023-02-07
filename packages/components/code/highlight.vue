<!-- @format -->

<template>
    <highlightjs
        v-if="code"
        class="highlightjs"
        :language="language"
        :code="code"
    />
</template>

<script lang="ts">
import 'highlight.js/styles/stackoverflow-light.css';
import hljs from 'highlight.js/lib/common';
import hljsVuePlugin from '@highlightjs/vue-plugin';

export default {
    props: {
        language: {
            type: String,
        },
        code: {
            type: String,
        },
    },
    components: {
        highlightjs: hljsVuePlugin.component,
    },
};
</script>
