<template>
    <div class="__document">
        <!-- <router-view v-slot="{ Component }">
            <Transition>
                <keep-alive>
                    <component :is="Component" />
                </keep-alive>
            </Transition>
        </router-view> -->
        <router-view></router-view>
    </div>
</template>
<script lang="ts" setup></script>
<style lang="scss">
@import '../css/index.scss';
</style>
