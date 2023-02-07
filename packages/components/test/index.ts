import { getTextNotes } from '../../utils/index';
import type { Block, Spec } from '../../utils/index';

function getObj(v: Spec) {
    delete v.problems;
    delete v.source;
    return v;
}

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

function getFilter(obj: Block, keyArr: string[]) {
    const _objs: SpecObjs = {
        descriptions: obj?.description || '',
    };
    const arr: ArrFi[] = [];
    if (obj?.tags) {
        obj?.tags?.forEach((v, index) => {
            let tag = v.tag;
            let ov = getObj(v);
            if (
                !_objs.hasOwnProperty(tag) &&
                keyArr.includes(tag)
            ) {
                _objs[tag] = ov;
            } else {
                let ao: Specs = {};
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

let titles: SpecObjs[] = [];
function setTitle(obj: Block) {
    const arr = ['title', 'author', 'date'];
    const fobj = getFilter(obj, arr);
    const value = {} as SpecObjs;
    arr.forEach((key) => {
        value[key] = fobj.obj[key];
    });
    addTitle(value);
    fobj.arr.forEach((o) => {
        addTags(o.key, o.value as SpecObjs);
    });
}

let states: SpecObjs[] = [];
function setState(obj: Block) {
    const arr = ['state', 'type'];
    const fobj = getFilter(obj, arr);
    const value = {} as SpecObjs;
    arr.forEach((key) => {
        value[key] = fobj.obj[key];
    });
    addState(value);
    fobj.arr.forEach((o) => {
        addTags(o.key, o.value as SpecObjs);
    });
}

function addTitle(value: SpecObjs) {
    titles.push(value);
}

function addProposal(value: SpecObjs) {
    titles.push(value);
}

function addError(value: SpecObjs) {
    titles.push(value);
}

function addState(value: SpecObjs) {
    states.push(value);
}

function addTags(tag: string, obj: SpecObjs) {
    switch (tag) {
        case 'title':
            addTitle(obj);
            return true;
        case 'proposal':
            addProposal(obj);
            return true;
        case 'error':
            addError(obj);
            return true;
        case 'state':
            addState(obj);
            return true;
        case 'text':
            addTitle(obj);
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
        // case 'proposal':
        //     setProposal(obj);
        //     return true;
        // case 'error':
        //     setError(obj);
        //     return true;
        case 'state':
            setState(obj);
            return true;
        default:
            return false;
    }
}

export function getNotes(text: string) {
    titles = [];
    states = [];
    const notes = getTextNotes(text);
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
        states,
    };
}
