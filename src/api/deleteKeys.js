export function deleteKeys(object, name, method) {
    let keys = Object.keys(object);
    keys.forEach(key => {
        if (key.indexOf(name) != -1) {
            method.$delete(object, key)
        }
    })
}