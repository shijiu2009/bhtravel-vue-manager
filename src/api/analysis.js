export function analysisResolution(parent,name,listData) {
    // let info=[]
    if (!listData && (listData instanceof Array) && listData.length > 0) {
        return {};
    }
    for (let i = 0; i < listData.length; i++) {
        Object.keys(listData[i]).forEach((key) => {
            parent[`${name}[${i}].${key}`]=listData[i][key];
        });
    }
    return parent
}

