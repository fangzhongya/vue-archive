function getFile() {
    const globalComponents = import.meta.glob(
        './../page/**/index.(ts|vue)',
    );
    return globalComponents;
}
function getName(key: string) {
    let name = key.replace(/\.\/|\/index.(ts|vue)/g, '');
    name = name.replace('.page/', '');
    return name;
}
export function getRouterName(value: string) {
    let vs = value.split('/');
    let arr: string[] = [];
    vs.forEach((v) => {
        arr.push(...v.split('-'));
    });
    arr = arr.map((value) => {
        return (
            value.slice(0, 1).toUpperCase() + value.slice(1)
        );
    });
    return arr.join('');
}

export function getRouterValueName(value: string) {
    // let vs = value.split('/');
    // let arr = [];
    // vs.forEach((v) => {
    //     arr.push(...v.split('-'));
    // });
    // arr = arr.map((value) => {
    //     return value.slice(0, 1).toUpperCase() + value.slice(1);
    // });
    // arr[0] = arr[0].slice(0, 1).toLowerCase() + arr[0].slice(1);
    return value;
}

export function getFileName() {
    let arrs = [];
    const globalComponents = getFile();
    // 批量注册路由
    for (const key in globalComponents) {
        const component = globalComponents[key];
        let name = getName(key);
        let value = getRouterValueName(name);
        name = getRouterName(name);
        arrs.push({
            name,
            key,
            value,
            component: component,
        });
    }
    return arrs;
}
