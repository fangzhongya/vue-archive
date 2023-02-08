import { SpecObjs, Spec } from './index';

type PropsOBj = {
    [key: string]: (obj: SpecObjs) => string;
};

export const props: PropsOBj = {
    name(obj: SpecObjs): string {
        if (obj.name) {
            return obj.name.name;
        } else if (obj.props) {
            return obj.props.name;
        } else {
            return '';
        }
    },
    description(obj: SpecObjs): string {
        if (obj.description && obj.description.name) {
            return obj.description.name;
        } else if (obj.descriptions) {
            return obj.descriptions;
        } else if (obj.props) {
            return obj.props.description;
        } else {
            return '';
        }
    },
    type(obj: SpecObjs): string {
        if (obj.type) {
            return obj.type.name;
        } else if (obj.props) {
            return obj.props.type;
        } else {
            return '';
        }
    },
    selectable(obj: SpecObjs): string {
        if (obj.selectable) {
            return (
                obj.selectable.description ||
                obj.selectable.name
            );
        } else if (obj.props) {
            return obj.props.selectable;
        } else {
            return '';
        }
    },
    default(obj: SpecObjs): string {
        if (obj.default) {
            return (
                obj.default.description || obj.default.name
            );
        } else if (obj.props) {
            return obj.props.default || '';
        } else {
            return '';
        }
    },
};

export const emits: PropsOBj = {
    name(obj: SpecObjs): string {
        if (obj.name) {
            return obj.name.name;
        } else if (obj.emits) {
            return obj.emits.name;
        } else {
            return '';
        }
    },
    description(obj: SpecObjs): string {
        if (obj.description && obj.description.name) {
            return obj.description.name;
        } else if (obj.descriptions) {
            return obj.descriptions;
        } else if (obj.emits) {
            return obj.emits.description;
        } else {
            return '';
        }
    },
    selectable(obj: SpecObjs): string {
        if (obj.selectable) {
            return (
                obj.selectable.description ||
                obj.selectable.name
            );
        } else if (obj.emits) {
            return obj.emits.selectable;
        } else {
            return '';
        }
    },
};

export const expose: PropsOBj = {
    name(obj: SpecObjs): string {
        if (obj.name) {
            return obj.name.name;
        } else if (obj.expose) {
            return obj.expose.name;
        } else {
            return '';
        }
    },
    description(obj: SpecObjs): string {
        if (obj.description && obj.description.name) {
            return obj.description.name;
        } else if (obj.descriptions) {
            return obj.descriptions;
        } else if (obj.expose) {
            return obj.expose.description;
        } else {
            return '';
        }
    },
    selectable(obj: SpecObjs): string {
        if (obj.selectable) {
            return (
                obj.selectable.description ||
                obj.selectable.name
            );
        } else if (obj.expose) {
            return obj.expose.selectable;
        } else {
            return '';
        }
    },
    type(obj: SpecObjs): string {
        if (obj.type) {
            return obj.type.description || obj.type.name;
        } else if (obj.expose) {
            return obj.expose.type;
        } else {
            return '';
        }
    },
};

export const slot: PropsOBj = {
    name(obj: SpecObjs): string {
        if (obj.name) {
            return obj.name.name;
        } else if (obj.slot) {
            return obj.slot.name;
        } else {
            return '';
        }
    },
    description(obj: SpecObjs): string {
        if (obj.description && obj.description.name) {
            return obj.description.name;
        } else if (obj.descriptions) {
            return obj.descriptions;
        } else if (obj.slot) {
            return obj.slot.description;
        } else {
            return '';
        }
    },
    selectable(obj: SpecObjs): string {
        if (obj.selectable) {
            return (
                obj.selectable.description ||
                obj.selectable.name
            );
        } else if (obj.slot) {
            return obj.slot.selectable;
        } else {
            return '';
        }
    },
};

export function getPropsValue(arr: SpecObjs[]) {
    return arr.map((obj) => {
        const v = {} as Spec;
        Object.keys(props).forEach((key) => {
            v[key] = props[key](obj);
        });
        return v;
    });
}

export function getEmitsValue(arr: SpecObjs[]) {
    return arr.map((obj) => {
        const v = {} as Spec;
        Object.keys(emits).forEach((key) => {
            v[key] = emits[key](obj);
        });
        return v;
    });
}

export function getExposeValue(arr: SpecObjs[]) {
    return arr.map((obj) => {
        const v = {} as Spec;
        Object.keys(expose).forEach((key) => {
            v[key] = expose[key](obj);
        });
        return v;
    });
}

export function getSlotValue(arr: SpecObjs[]) {
    return arr.map((obj) => {
        const v = {} as Spec;
        Object.keys(slot).forEach((key) => {
            v[key] = slot[key](obj);
        });
        return v;
    });
}
