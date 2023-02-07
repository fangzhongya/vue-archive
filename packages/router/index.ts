import { getConfig } from '../config';
import { setSession, getSession } from '../utils/storage';
import type {
    Router,
    RouteRecordRaw,
    RouteLocationNormalizedLoaded,
} from 'vue-router';
import type {
    TestsObj,
    ComponentsObj,
} from '../utils/common';
const routes: RouteRecordRaw[] = [
    {
        path: '/__document',
        name: '__document',
        component: () => import('../index/index.vue'),
        redirect: { name: '__documentIndex' },
        meta: { title: '文档' },
        children: [
            {
                path: 'index',
                name: '__documentIndex',
                component: () =>
                    import('../page/index/index.vue'),
                meta: { title: '首页' },
            },
            {
                path: 'compon',
                name: '__documentCompon',
                component: () =>
                    import('../page/compon/index.vue'),
                meta: { title: '组件' },
            },
            {
                path: 'tests',
                name: '__documentTests',
                component: () =>
                    import('../page/tests/index.vue'),
                meta: { title: '示例' },
            },
            {
                path: 'develop',
                name: '__documentDevelop',
                component: () =>
                    import('../page/develop/index.vue'),
                meta: { title: '开发' },
            },
            {
                path: 'single',
                name: '__documentSingle',
                component: () =>
                    import('../page/single/index.vue'),
                meta: { title: '单例开发' },
            },
        ],
    },
];

let state = 0;
document.addEventListener('keydown', keydown);
function keydown(e: KeyboardEvent) {
    //键盘按键控制
    e = e || window.event;
    if (
        (e.ctrlKey && e.location == 82) || //ctrl+R
        e.location == 116
    ) {
        //F5刷新，禁止
        setSession('-keydown-F5', 2);
    }
}

export function init(router: Router) {
    let path = '/' + getConfig('router') || '__document';
    console.log('path', path);
    routes[0].path = path;
    routes[0].children?.unshift({
        path: path + '/:chapters+',
        redirect: { name: '__documentIndex' },
    });
    const redirect = getConfig('redirect');
    routes.forEach((obj) => {
        router.addRoute(obj);
        router.beforeEach((to, from) => {
            if (from.fullPath == '/') {
                let s = getSession('-keydown-F5');
                if (document.referrer || s == 2) {
                    console.log('刷新');
                    state = 2;
                } else {
                    console.log('地址栏输入 或者 刷新');
                    state = 3;
                }
            } else {
                console.log('跳转');
                state = 1;
            }
            setSession('-keydown-F5', 0);
        });
    });
    if (redirect) {
        const obj = router.getRoutes().filter((o) => {
            return o.path == '/';
        })[0] || {
            path: '/',
        };
        obj.redirect = path;
        if (obj.name) {
            router.addRoute(obj.name, obj);
        } else {
            router.addRoute(obj);
        }
    }
}

type ToPush = 'replace' | 'push';
const toPageParam = {} as {
    [key: string]: any;
};
export function getPageParams(
    route: RouteLocationNormalizedLoaded,
) {
    let path = route.path;
    let params = route.params;
    if (params && Object.keys(params).length) {
        return params;
    } else {
        let obj = toPageParam[path];
        if (obj && Object.keys(obj).length) {
            return obj;
        } else {
            if (state == 3) {
                return {};
            } else {
                return getSession('router.toPage.' + path);
            }
        }
    }
}

interface PushObj {
    path?: string;
    name?: string;
    params?: any;
    query?: any;
}

export function toPage(
    router: Router,
    push: PushObj,
    type: ToPush = 'push',
) {
    let name = push.name;
    let path = push.path || '';
    let params = push.params || {};
    router[type](push);
    if (name) {
        path = router.resolve({ name: name }).path;
    }
    toPageParam[path] = params;
    setSession('router.toPage.' + path, params);
}
export function toSingle(router: Router, obj: TestsObj) {
    toPage(router, {
        name: '__documentSingle',
        query: {
            id: obj.name + '/' + obj.value,
        },
        params: { key: obj.key, comkey: obj.comkey },
    });
}

export function toDevelop(
    router: Router,
    obj: ComponentsObj,
) {
    toPage(router, {
        name: '__documentDevelop',
        query: {
            id: obj.value,
        },
        params: { key: obj.key },
    });
}

export function toTests(
    router: Router,
    obj: ComponentsObj,
) {
    toPage(router, {
        name: '__documentTests',
        query: {
            id: obj.value,
        },
        params: { key: obj.key },
    });
}

export function toCompon(
    router: Router,
    obj: ComponentsObj,
) {
    toPage(router, {
        name: '__documentCompon',
        query: {
            id: obj.value,
        },
        params: { key: obj.key },
    });
}

export function toIndex(router: Router, id: string) {
    router.push({
        name: '__document',
        query: {
            id: id,
        },
    });
}
