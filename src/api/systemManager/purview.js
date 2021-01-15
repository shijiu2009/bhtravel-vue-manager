// 权限管理接口
import api from './../api.js'
// 获取权限菜单列表
let getPurViews = (data) => {
    return api.post("/api/manager/purview/list", data);
}
//在添加页获取父级的权限菜单
let getByPurViews = (data) => {
    return api.post("/api/manager/purview/bylist", data);
}

//获取权限详情
let getPurView = (data) => {
    return api.post("/api/manager/purview/detail", data);
}

let getPurViewTree = (data) => {
    return api.post("/api/manager/purview/menuTree", data);
}
export default {
    getPurViews,
    getByPurViews,
    getPurView,
    getPurViewTree,
}
