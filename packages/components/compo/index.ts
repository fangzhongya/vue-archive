import { getTextNotes } from '../../utils/index';
import { getLocalTextComponents } from '../../utils/glob';
import { replaceAfter } from '../../utils/util';
export { getKeyMds } from '../../utils/glob';

import type {
    Block,
    Spec,
    Specs,
    SpecObjs,
} from '../../utils/index';

interface ArrFi {
    key: string;
    value: Specs;
}

export type NotesObj = {
    titles: SpecObjs[];
    propss: SpecObjs[];
    slots: SpecObjs[];
    emitss: SpecObjs[];
    exposes: SpecObjs[];
    [key: string]: any[];
};

const notesObj: NotesObj = {
    titles: [],
    propss: [],
    slots: [],
    emitss: [],
    exposes: [],
};
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

function setTitle(obj: Block) {
    let title = '';
    let name = '';
    let author = ''; //??????
    let description = ''; //??????
    let date = ''; //??????
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
    notesObj.titles.push(value);
}

function setProps(obj: Block) {
    let name = ''; //?????????
    let type = ''; //??????
    let defaults = ''; //?????????
    let description = ''; //??????
    let selectable = ''; //?????????
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
    addObj(value, 'props');
    fobj.arr.forEach((o) => {
        addTags(o.key, o.value as SpecObjs);
    });
}

let slots: SpecObjs[] = [];
function setSlot(obj: Block) {
    let name = ''; //?????????
    let description = ''; //??????
    let selectable = ''; //?????????
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
    addObj(value, 'slot');
    fobj.arr.forEach((o) => {
        addTags(o.key, o.value as SpecObjs);
    });
}

let emitss: SpecObjs[] = [];
function setEmits(obj: Block) {
    let name = ''; //?????????
    let description = ''; //??????
    let selectable = ''; //????????????
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
    addObj(value, 'emits');
    fobj.arr.forEach((o) => {
        addTags(o.key, o.value as SpecObjs);
    });
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
    addObj(value, 'expose');
    fobj.arr.forEach((o) => {
        addTags(o.key, o.value as SpecObjs);
    });
}
function addObj(value: SpecObjs, type: string) {
    const ms = notesObj[type + 'name'] || [];
    const name =
        (value.name as unknown as string) ??
        value[type]?.name;

    const nis = ms.indexOf(name);
    if (nis >= 0) {
        notesObj[type + 's'].splice(nis, 1);
        ms.splice(nis, 1);
    }
    notesObj[type + 's'].push(value);
    ms.push(name);
    notesObj[type + 'name'] = ms;
}

function init() {
    Object.keys(notesObj).forEach((key) => {
        notesObj[key] = [];
    });
}

function getFilter(obj: Block, arrs?: Array<string>) {
    const _objs = {
        descriptions: obj?.description || '',
    } as SpecObjs;
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
            addObj(obj, 'props');
            return true;
        case 'slot':
            addObj(obj, 'slot');
            return true;
        case 'emits':
            addObj(obj, 'emits');
            return true;
        case 'expose':
            addObj(obj, 'expose');
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

function notesFilter(notes?: Block[]): NotesObj {
    init();
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
    return notesObj;
}

export function getNotes(key: string): Promise<NotesObj> {
    return new Promise((resolve) => {
        getLocalTextComponents(key).then((text) => {
            let notes = getTextNotes(text);
            resolve(notesFilter(notes));
        });
    });
}

export function getNotesText(text: string): NotesObj {
    let notes = getTextNotes(text);
    return notesFilter(notes);
}

export type FTableFormatter = (
    data: SpecObjs,
    item?: FTableList,
    index?: number,
    key?: number,
) => string;

export type FTableList = {
    label: string;
    prop: string;
    formatter?: FTableFormatter;
};

import {
    props as fprops,
    emits as femits,
    expose as fexpose,
    slot as fslot,
} from '../../utils/props';

export const tprops: FTableList[] = [
    {
        label: '?????????',
        prop: 'name',
        formatter: fprops.name,
    },
    {
        label: '??????',
        prop: 'description',
        formatter: fprops.description,
    },
    {
        label: '??????',
        prop: 'type',
        formatter: fprops.type,
    },
    {
        label: '?????????',
        prop: 'selectable',
        formatter: fprops.selectable,
    },
    {
        label: '?????????',
        prop: 'default',
        formatter: fprops.default,
    },
];
export const temits: FTableList[] = [
    {
        label: '?????????',
        prop: 'name',
        formatter: femits.name,
    },
    {
        label: '??????',
        prop: 'description',
        formatter: femits.description,
    },
    {
        label: '????????????',
        prop: 'selectable',
        formatter: femits.selectable,
    },
];
export const texpose: FTableList[] = [
    {
        label: '?????????',
        prop: 'name',
        formatter: fexpose.name,
    },
    {
        label: '??????',
        prop: 'description',
        formatter: fexpose.description,
    },
    {
        label: '??????',
        prop: 'selectable',
        formatter: fexpose.selectable,
    },
    {
        label: '?????????',
        prop: 'type',
        formatter: fexpose.type,
    },
];

export const tslot: FTableList[] = [
    {
        label: '?????????',
        prop: 'name',
        formatter: fslot.name,
    },
    {
        label: '??????',
        prop: 'description',
        formatter: fslot.description,
    },
    {
        label: '???????????????',
        prop: 'selectable',
        formatter: fslot.selectable,
    },
];
