import api from './../api.js'

export function getMenusTree() {
    return api.post("/api/manager/menu")
}