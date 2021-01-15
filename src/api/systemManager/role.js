// 角色管理接口
import api from './../api.js'
// 获取角色菜单列表
let getList = (data) => {
    return api.post("/api/manager/role/list", data);
}
//在添加页获取父级的角色菜单
let getByPurViews = (data) => {
    return api.post("/api/manager/purview/bylist", data);
}

//获取角色详情
let getDetail = (data) => {
    return api.post("/api/manager/role/detail", data);
}

//获取所有角色
let getAll = (data) => {
    return api.post("/api/manager/role/all", data);
}

let getPurViewTree = (data) => {
    return api.post("/api/manager/purview/menuTree", data);
}

export default {
    getList,
    getByPurViews,
    getDetail,
    getPurViewTree,
    getAll
}