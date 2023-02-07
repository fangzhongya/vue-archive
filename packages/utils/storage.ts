const STORAGE = '__document';

interface Config {}

/**
 * 获取对应key
 * @param {string} key 要获取的kye
 * @param {boolean} isCom 是否是公共存储
 * @returns
 */
function getKey(key: string, isCom: boolean) {
    if (isCom) {
        return key;
    } else {
        return STORAGE + '.' + key;
    }
}
/**
 * 设置本地浏览器存储数据
 * @param {string} key 存储数据的 key
 * @param {*} value 存储的数据
 * @param {Object} config 存储的配置，目前没有实现
 * @param {Boolean} isCom 是否是公共存储
 */
export function setLocal(
    key: string,
    value: unknown = '',
    config: Config = {},
    isCom = false,
) {
    try {
        if (!value) value = '';
        localStorage.setItem(
            getKey(key, isCom),
            JSON.stringify(value),
        );
    } catch (g) {
        console.log(
            '您的浏览器版本太低，或者您开启了隐身/无痕浏览模式，或者WebView组件不支持localStorage！',
        );
    }
}
/**
 * 获取本地浏览器存储数据
 * @param {string} key 存储数据的 key
 * @param {Object} config 存储的配置，目前没有实现
 * @param {Boolean} isCom 是否是公共存储
 */
export function getLocal(
    key: string,
    config: Config = {},
    isCom = false,
): unknown {
    let e = '';
    try {
        let obj = localStorage.getItem(getKey(key, isCom));
        if (obj && obj !== 'null' && obj !== 'undefined') {
            e = JSON.parse(obj);
        }
    } catch (f) {
        console.log(
            '您的浏览器版本太低，或者您开启了隐身/无痕浏览模式，或者WebView组件不支持localStorage！',
        );
    }
    return e;
}
/**
 * 清除本地浏览器存储数据
 * @param {string} key 存储数据的 key  不传 清除所有
 * @param {Boolean} isCom 是否是公共存储
 */
export function clearLocal(key: string, isCom = false) {
    try {
        if (key) {
            localStorage.removeItem(getKey(key, isCom));
        } else {
            localStorage.clear();
        }
    } catch (g) {
        console.log(
            '清除数据失败，key为：' +
                key +
                '错误信息：' +
                g,
        );
    }
}
/**
 * 设置本地页面存储数据
 * @param {string} key 存储数据的 key
 * @param {*} value 存储数据的
 * @param {Object} config 存储的配置，目前没有实现
 * @param {Boolean} isCom 是否是公共存储
 */
export function setSession(
    key: string,
    value: unknown = '',
    config: Config = {},
    isCom = false,
) {
    try {
        if (!value) value = '';
        sessionStorage.setItem(
            getKey(key, isCom),
            JSON.stringify(value),
        );
    } catch (g) {
        console.log(
            '存储数据失败，key为：' +
                key +
                '错误信息：' +
                g,
        );
    }
}
/**
 * 获取本地页面存储数据
 * @param {string} key 存储数据的 key
 * @param {Object} config 存储的配置，目前没有实现
 * @param {Boolean} isCom 是否是公共存储
 */
export function getSession(
    key: string,
    config: Config = {},
    isCom = false,
): unknown {
    let v = '';
    try {
        let obj = sessionStorage.getItem(
            getKey(key, isCom),
        );
        if (obj && obj !== 'null' && obj !== 'undefined') {
            v = JSON.parse(obj);
        }
    } catch (g) {
        console.log(
            '獲取数据失败，key为：' +
                key +
                '错误信息：' +
                g,
        );
    }
    return v;
}
/**
 * 清除本地页面存储数据
 * @param {string} key 存储数据的 key  不传 清除所有
 * @param {Boolean} isCom 是否是公共存储
 */
export function clearSession(key: string, isCom = false) {
    try {
        if (key) {
            sessionStorage.removeItem(getKey(key, isCom));
        } else {
            sessionStorage.clear();
        }
    } catch (g) {
        console.log(
            '清除数据失败，key为：' +
                key +
                '错误信息：' +
                g,
        );
    }
}
