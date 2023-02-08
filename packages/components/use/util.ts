import prettier from 'prettier/standalone';
import parserTypescript from 'prettier/parser-typescript';
import parserHtml from 'prettier/parser-html';

export function prettierFormat(st: string) {
    let str = prettier.format(st, {
        parser: 'typescript',
        plugins: [parserTypescript],
    });
    return str.replace(/\;(\s|\n\r)*$/, '');
}

export function prettierObjFormat(st: string) {
    st = 'let a = ' + st;
    let str = prettierFormat(st);
    return str.replace(/^let a = /, '');
}

export function prettierArrFormat(st: string) {
    let str = prettierFormat(st);
    return str;
}
export function prettierFunFormat(st: string) {
    let str = prettierFormat(st);
    return str;
}

export function prettierHtml(st: string) {
    return prettier.format(st, {
        parser: 'html',
        plugins: [parserHtml],
    });
}

export function vueFormat(st: string, kg = '') {
    let arr = (st + '').trim().split(/\n/);
    arr = arr.map((v) => {
        return kg + v;
    });
    return arr.join('\n');
}

export function getFunBody(sr: string = ''): string {
    sr = sr.trim();
    let body =
        '[\\s|\\n|\\r]*\\{((.|\n|\r)+?)\\}[\\s|\\n|\\r]*';
    let reg = new RegExp('^' + body + '$');
    let vts = reg.exec(sr);
    if (vts && vts.length > 0) {
        return getFunBody(vts[1]);
    } else {
        return sr;
    }
}

export function getFunctionFormat(v: Function | string) {
    if (v) {
        let st = v.toString();
        st = st.trim();
        let name = '([a-z|A-Z|_|$][a-z|A-Z|_|$|0-9]*)?';
        let fun = '(function\\s*' + name + '\\s*)?';
        let param = '(\\([^\\(|\\)]*\\)\\s*)?';
        let body =
            '[\\s|\\n|\\r]*\\{((.|\n|\r)+?)\\}[\\s|\\n|\\r]*';
        let reg = new RegExp(
            '^' + fun + param + body + '$',
        );
        let vts = reg.exec(st);
        let obj = {
            body: st,
            name: '',
            param: '',
        };
        if (vts && vts.length > 0) {
            obj.name = vts[2];
            obj.param = vts[3];
            obj.body = `{${vts[4]}}`;
        }
        obj.body = prettierFormat(obj.body);
        return obj;
    }
}

function sonType(type: string) {
    // /^([a-z|A-Z]+)\<(.+)\>$/
    let reg = new RegExp('^([a-z|A-Z]+)\\<(.+)\\>$');
    let vts = reg.exec(type);
    if (vts && vts.length > 0) {
        return {
            own: vts[1],
            son: vts[2],
        };
    }
}

function sonTypes(type: string, arr: Array<string>) {
    let obj = sonType(type);
    if (obj) {
        arr.push(obj.own);
        if (obj.son) {
            sonTypes(obj.son, arr);
        }
    } else {
        arr.push(type);
    }
}

/**
 * 解析array<string> 类型数组
 * @param {*} type
 * @returns
 */
export function getSonType(type: Array<string> | string) {
    if (type instanceof Array) {
        type = type[0];
    }
    const arr: string[] = [];
    if (type) {
        sonTypes(type, arr);
    }
    return arr;
}

/**
 * 获取当前对象的类型
 * @param {*} obj
 * @returns
 */
export function getObjType(obj: unknown) {
    const type = Object.prototype.toString.call(obj);
    const reg = /^\[[O|o]bject (.*)\]$/;
    let vts = reg.exec(type);
    let t: string = typeof obj;
    if (vts && vts.length > 0) {
        t = vts[1].toLowerCase();
    }
    return t;
}

/**
 * 配置类型是否匹配
 * @param {*} obj
 * @param {*} type
 * @returns
 */
export function isTypeEqual(
    obj: unknown,
    type: string[] | string,
) {
    const t = getObjType(obj);
    const v = getSonType(type)[0];
    if (v && v != '*') {
        return t == v;
    } else {
        return true;
    }
}
/**
 * 获取字符串, 去掉头尾''标识
 * @param {*} st
 * @returns
 */
export function getString(st: unknown): string {
    if (typeof st == 'string') {
        let is = false;
        if (/^\'(.|\n|\r)*\'$/.test(st)) {
            is = true;
        } else if (/^\"(.|\n|\r)*\"$/.test(st)) {
            is = true;
        } else if (/^\`(.|\n|\r)*\`$/.test(st)) {
            is = true;
        }
        if (is) {
            st = st.substring(1, st.length - 1);
        }
        return st + '';
    } else if (typeof st == 'object' && st) {
        return st.toString();
    } else if (
        typeof st == 'undefined' ||
        (typeof st == 'object' && !st)
    ) {
        return '';
    } else {
        return st + '';
    }
}

/**
 * 配置字符串的类型
 */
export function isDefaultType(st: string): string {
    st = (st + '')
        .replace(/^(\s|\n|r)*/, '')
        .replace(/(\s|\n|r)*$/, '');
    let type = '';
    if (/^\'(.|\n|\r)*\'$/.test(st)) {
        type = 'string';
    } else if (/^\"(.|\n|\r)*\"$/.test(st)) {
        type = 'string';
    } else if (/^\`(.|\n|\r)*\`$/.test(st)) {
        type = 'string';
    } else if (/^\[(.|\n|\r)*\]$/.test(st)) {
        type = 'array';
    } else if (/^\{(.|\n|\r)*\}$/.test(st)) {
        type = 'object';
    } else if (/^[0-9]*$/.test(st)) {
        type = 'number';
    } else if (st === 'true' || st === 'false') {
        type = 'boolean';
    } else if (st == 'undefined') {
        type = 'undefined';
    } else if (st == 'null') {
        type = 'null';
    } else if (st) {
        type = 'string';
    }
    return type;
}
