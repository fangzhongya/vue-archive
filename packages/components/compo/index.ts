import { getTextNotes } from '../../utils/index';
import { getLocalTextComponents } from '../../utils/glob';

export { getKeyMds } from '../../utils/glob';

import type { Block, Spec } from '../../utils/index';

interface Specs {
    [key: string]: Spec;
}
interface ArrFi {
    key: string;
    value: Specs;
}
export interface SpecObjs extends Specs {
    descriptions: string;
    [key: string]: any;
}

function getDefault(ss: string, iss?: boolean) {
    let c = ss.charAt(0);
    let css = [
        ['"', '"'],
        ["'", "'"],
        ['`', '`'],
        ['(', ')'],
        ['{', '}'],
        ['[', ']'],
    ];
    const cs = css.map((o) => o[0]);
    let ci = cs.indexOf(c);
    if (ci != -1) {
        let reg = new RegExp(
            '^' +
                css[ci][0] +
                '((.|\\n|\\r)+?)' +
                css[ci][1] +
                (iss ? '\\s' : ''),
            'gi',
        );
        let rs = reg.exec(ss);
        if (rs) {
            // let defaults = rs[0];
            // if (ci == 0 || ci == 1 || ci == 3) {
            //     defaults = defaults.substring(
            //         1,
            //         defaults.length - (iss ? 2 : 1),
            //     );
            // }
            return rs[0];
        }
    }
}

function getObj(v: Spec) {
    delete v.problems;
    delete v.source;
    let tag = v.tag;
    let name = v.name;
    let description = v.description;
    let defaults = v.default;
    let selectable = '';
    if (tag == 'default') {
        name = name.trim();
        name = getDefault(name) || name;
    } else if (tag == 'selectable') {
        name = name.trim();
    } else {
        if (name.includes('=')) {
            const ms = name.split('=');
            name = ms[0];
            const ss = ms[1] + ' ' + description;
            const dvz = getDefault(ss, true);
            if (dvz) {
                defaults = dvz;
                description = ss.replace(dvz, '');
            } else {
                defaults = v.default || ms[1] || '';
            }
        }
        const regExp = /\s*\((.*)\)\s/gi;
        const rtr = regExp.exec(description);
        if (rtr && rtr.length > 0) {
            selectable = rtr[1];
            description = description.replace(rtr[0], '');
        }
    }
    v.name = name;
    v.default = defaults || '';
    v.description = description;
    v.selectable = selectable;
    return v;
}

let titles: SpecObjs[] = [];
function setTitle(obj: Block) {
    let title = '';
    let name = '';
    let author = ''; //作者
    let description = ''; //说明
    let date = ''; //时间
    let arr = [
        'title',
        // 'name',
        'text',
        'author',
        'date',
        // 'description',
        // 'descriptions',
    ];
    let fobj = getFilter(obj, arr);
    let value = {} as SpecObjs;
    arr.forEach((key) => {
        value[key] = fobj.obj[key];
    });
    addTitles(value);
    fobj.arr.forEach((o) => {
        addTags(o.key, o.value as SpecObjs);
    });
}
function addTitles(value: SpecObjs) {
    titles.push(value);
}

let propss: SpecObjs[] = [];
function setProps(obj: Block) {
    let name = ''; //属性名
    let type = ''; //类型
    let defaults = ''; //默认值
    let description = ''; //说明
    let selectable = ''; //可选值
    let arr = [
        'props',
        'name',
        'type',
        'default',
        'selectable',
        'description',
        'descriptions',
    ];
    let fobj = getFilter(obj, arr);
    let value = {} as SpecObjs;
    arr.forEach((key) => {
        value[key] = fobj.obj[key];
    });
    addProps(value);
    fobj.arr.forEach((o) => {
        addTags(o.key, o.value as SpecObjs);
    });
}
function addProps(value: SpecObjs) {
    propss.push(value);
}

let slots: SpecObjs[] = [];
function setSlot(obj: Block) {
    let name = ''; //插槽名
    let description = ''; //说明
    let selectable = ''; //子标签
    let arr = [
        'slot',
        'name',
        'selectable',
        'description',
        'descriptions',
    ];
    let fobj = getFilter(obj, arr);
    let value = {} as SpecObjs;
    arr.forEach((key) => {
        value[key] = fobj.obj[key];
    });
    addSlots(value);
    fobj.arr.forEach((o) => {
        addTags(o.key, o.value as SpecObjs);
    });
}
function addSlots(value: SpecObjs) {
    slots.push(value);
}

let emitss: SpecObjs[] = [];
function setEmits(obj: Block) {
    let name = ''; //事件名
    let description = ''; //说明
    let selectable = ''; //回调参数
    let arr = [
        'emits',
        'name',
        'selectable',
        'description',
        'descriptions',
    ];
    let fobj = getFilter(obj, arr);
    let value = {} as SpecObjs;
    arr.forEach((key) => {
        value[key] = fobj.obj[key];
    });
    addEmits(value);
    fobj.arr.forEach((o) => {
        addTags(o.key, o.value as SpecObjs);
    });
}
function addEmits(value: SpecObjs) {
    emitss.push(value);
}

let exposes: SpecObjs[] = [];
function setExpose(obj: Block) {
    let arr = [
        'expose',
        'name',
        'type',
        'selectable',
        'description',
        'descriptions',
    ];
    let fobj = getFilter(obj, arr);
    let value = {} as SpecObjs;
    arr.forEach((key) => {
        value[key] = fobj.obj[key];
    });
    addExpose(value);
    fobj.arr.forEach((o) => {
        addTags(o.key, o.value as SpecObjs);
    });
}
function addExpose(value: SpecObjs) {
    exposes.push(value);
}

function getFilter(obj: Block, arrs?: Array<string>) {
    const _objs: SpecObjs = {
        descriptions: obj?.description || '',
    };
    const arr: ArrFi[] = [];
    if (obj?.tags) {
        obj?.tags?.forEach((v: Spec) => {
            let tag = v.tag;
            let ov = getObj(v);
            if (!_objs.hasOwnProperty(tag)) {
                _objs[tag] = ov;
            } else {
                const ao: Specs = {};
                ao[tag] = ov;
                arr.push({
                    key: tag,
                    value: ao,
                });
            }
        });
    }
    return {
        arr: arr,
        obj: _objs,
    };
}
function addTags(tag: string, obj: SpecObjs) {
    switch (tag) {
        case 'title':
            addTitles(obj);
            return true;
        case 'text':
            addTitles(obj);
            return true;
        case 'props':
            addProps(obj);
            return true;
        case 'slot':
            addSlots(obj);
            return true;
        case 'emits':
            addEmits(obj);
            return true;
        case 'expose':
            addExpose(obj);
            return true;
        default:
            return false;
    }
}
function setTags(tag: string, obj: Block) {
    switch (tag) {
        case 'title':
            setTitle(obj);
            return true;
        case 'props':
            setProps(obj);
            return true;
        case 'slot':
            setSlot(obj);
            return true;
        case 'emits':
            setEmits(obj);
            return true;
        case 'expose':
            setExpose(obj);
            return true;
        default:
            return false;
    }
}

type NotesObj = {
    titles: SpecObjs[];
    propss: SpecObjs[];
    slots: SpecObjs[];
    emitss: SpecObjs[];
    exposes: SpecObjs[];
};

function notesFilter(notes?: Block[]): NotesObj {
    titles = [];
    propss = [];
    slots = [];
    emitss = [];
    exposes = [];
    notes?.forEach((obj) => {
        let tags = obj?.tags || [];
        let lg = tags?.length || 0;
        if (lg > 0) {
            for (let i = 0; i < lg; i++) {
                const v = tags[i] || {};
                let is = setTags(v.tag, obj);
                if (is) {
                    break;
                }
            }
        }
    });
    return {
        titles,
        propss,
        slots,
        emitss,
        exposes,
    };
}

export function getNotes(key: string): Promise<NotesObj> {
    return new Promise((resolve) => {
        getLocalTextComponents(key).then((text) => {
            let notes = getTextNotes(text);
            resolve(notesFilter(notes));
        });
    });
}
