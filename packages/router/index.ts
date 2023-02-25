import { getConfig } from '../config';
import { setSession, getSession } from '../utils/storage';
import { firstUpper } from '@fangzhongya/utils/basic/string/firstUpper';
import type {
    Router,
    RouteRecordRaw,
    LocationQueryRaw,
    RouteParamsRaw,
    RouteLocationNormalizedLoaded,
} from 'vue-router';
import type {
    TestsObj,
    ComponentsObj,
} from '../utils/common';
import { ObjUnk } from '../config';
import { getFileName } from './file';

const routes: RouteRecordRaw[] = [
    {
        path: '/__document',
        name: '__document',
        component: () => import('../index/index.vue'),
        redirect: { name: '__documentIndex' },
        meta: { title: '文档' },
        children: [],
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

let prefix = '__document';

export function init(router: Router) {
    prefix =
        (getConfig('router') as string) || '__document';
    let path = '/' + prefix;
    routes[0].path = path;
    routes[0].redirect = { name: prefix + 'Index' };
    routes[0].children?.unshift({
        path: path + '/:chapters+',
        redirect: { name: prefix + 'Index' },
    });
    getFileName().forEach((obj) => {
        routes[0].children?.push({
            path: obj.value,
            name: prefix + obj.name,
            component: obj.component,
        });
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
const toPageParam = {} as { [key: string]: ObjUnk };
export function getPageParams(
    route: RouteLocationNormalizedLoaded,
): ObjUnk {
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
                return getSession(
                    'router.toPage.' + path,
                ) as ObjUnk;
            }
        }
    }
}

type PushObj = {
    path?: string;
    name?: string;
    params?: RouteParamsRaw;
    query?: LocationQueryRaw;
};

export function toPage(
    router: Router,
    push: PushObj,
    type: ToPush = 'push',
) {
    let path = push.path || '';
    const name = push.name;
    const params = push.params || {};
    router[type](push);
    if (name) {
        path = router.resolve({ name: name }).path;
    }
    toPageParam[path] = params;
    setSession('router.toPage.' + path, params);
}

export function tos(
    router: Router,
    obj: ComponentsObj,
    name?: string,
) {
    let m = '';
    if (name) {
        m = firstUpper(name);
    }
    toPage(router, {
        name: prefix + m,
        query: {
            id: obj.value,
        },
        params: { key: obj.key },
    });
}

export function toSingle(router: Router, obj: TestsObj) {
    toPage(router, {
        name: prefix + 'Single',
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
        name: prefix + 'Develop',
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
        name: prefix + 'Tests',
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
        name: prefix + 'Compon',
        query: {
            id: obj.value,
        },
        params: { key: obj.key },
    });
}

export function toIndex(router: Router, id: string) {
    router.push({
        name: prefix,
        query: {
            id: id,
        },
    });
}
