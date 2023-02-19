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
import 'highlight.js/lib/common';
import hljsVuePlugin from '@highlightjs/vue-plugin';
import { defineComponent } from 'vue';
export default defineComponent({
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
});
</script>
