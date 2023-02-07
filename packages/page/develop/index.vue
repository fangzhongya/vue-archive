<template>
    <div class="__document-compon">
        <Choice>
            <template #default="scope">
                <Compo :value="scope.value"></Compo>
            </template>
        </Choice>
    </div>
</template>
<script lang="ts" setup>
import Compo from '../../components/compo/index.vue';
import Choice from '../../components/choice/index.vue';
</script>
<style lang="scss"></style>
