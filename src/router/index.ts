import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: '首页',
        meta: { title: '首页' },
        redirect: { name: '__document' },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;
