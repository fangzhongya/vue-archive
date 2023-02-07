export const props = {
    name(obj) {
        if (obj.name) {
            return obj.name.name;
        } else if (obj.props) {
            return obj.props.name;
        }
    },
    description(obj) {
        if (obj.description && obj.description.name) {
            return obj.description.name;
        } else if (obj.descriptions) {
            return obj.descriptions;
        } else if (obj.props) {
            return obj.props.description;
        }
    },
    type(obj) {
        if (obj.type) {
            return obj.type.name;
        } else if (obj.props) {
            return obj.props.type;
        }
    },
    selectable(obj) {
        if (obj.selectable) {
            return (
                obj.selectable.description ||
                obj.selectable.name
            );
        } else if (obj.props) {
            return obj.props.selectable;
        }
    },
    default(obj) {
        if (obj.default) {
            return (
                obj.default.description || obj.default.name
            );
        } else if (obj.props) {
            return obj.props.default;
        }
    },
};

export const emits = {
    name(obj) {
        if (obj.name) {
            return obj.name.name;
        } else if (obj.emits) {
            return obj.emits.name;
        }
    },
    description(obj) {
        if (obj.description && obj.description.name) {
            return obj.description.name;
        } else if (obj.descriptions) {
            return obj.descriptions;
        } else if (obj.emits) {
            return obj.emits.description;
        }
    },
    selectable(obj) {
        if (obj.selectable) {
            return (
                obj.selectable.description ||
                obj.selectable.name
            );
        } else if (obj.emits) {
            return obj.emits.selectable;
        }
    },
};

export const expose = {
    name(obj) {
        if (obj.name) {
            return obj.name.name;
        } else if (obj.expose) {
            return obj.expose.name;
        }
    },
    description(obj) {
        if (obj.description && obj.description.name) {
            return obj.description.name;
        } else if (obj.descriptions) {
            return obj.descriptions;
        } else if (obj.expose) {
            return obj.expose.description;
        }
    },
    selectable(obj) {
        if (obj.selectable) {
            return (
                obj.selectable.description ||
                obj.selectable.name
            );
        } else if (obj.expose) {
            return obj.expose.selectable;
        }
    },
    type(obj) {
        if (obj.type) {
            return obj.type.description || obj.type.name;
        } else if (obj.expose) {
            return obj.expose.type;
        }
    },
};

export const slot = {
    name(obj) {
        if (obj.name) {
            return obj.name.name;
        } else if (obj.slot) {
            return obj.slot.name;
        }
    },
    description(obj) {
        if (obj.description && obj.description.name) {
            return obj.description.name;
        } else if (obj.descriptions) {
            return obj.descriptions;
        } else if (obj.slot) {
            return obj.slot.description;
        }
    },
    selectable(obj) {
        if (obj.selectable) {
            return (
                obj.selectable.description ||
                obj.selectable.name
            );
        } else if (obj.slot) {
            return obj.slot.selectable;
        }
    },
};

export function getPropsValue(arr) {
    return arr.map((obj) => {
        let v = {};
        Object.keys(props).forEach((key) => {
            v[key] = props[key](obj);
        });
        return v;
    });
}

export function getEmitsValue(arr) {
    return arr.map((obj) => {
        let v = {};
        Object.keys(emits).forEach((key) => {
            v[key] = emits[key](obj);
        });
        return v;
    });
}

export function getExposeValue(arr) {
    return arr.map((obj) => {
        let v = {};
        Object.keys(expose).forEach((key) => {
            v[key] = expose[key](obj);
        });
        return v;
    });
}

export function getSlotValue(arr) {
    return arr.map((obj) => {
        let v = {};
        Object.keys(slot).forEach((key) => {
            v[key] = slot[key](obj);
        });
        return v;
    });
}
