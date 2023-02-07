<template>
    <div class="__document-compon">
        <Choice>
            <template #default="scope">
                <Main :value="scope.value"></Main>
            </template>
        </Choice>
    </div>
</template>
<script lang="ts" setup>
import Main from '../../components/main/index.vue';
import Choice from '../../components/choice/index.vue';
</script>
<style lang="scss"></style>
