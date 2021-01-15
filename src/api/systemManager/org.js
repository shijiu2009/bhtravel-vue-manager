// 组织管理接口
import api from './../api.js'
// 获取组织菜单列表
let getList = (data) => {
    return api.post("/api/manager/org/list", data);
}
//在添加页获取父级的组织菜单
let getByOrgs = (data) => {
    return api.post("/api/manager/org/bylist", data);
}

//获取组织详情
let getDetail = (data) => {
    return api.post("/api/manager/org/detail", data);
}

let getOrgTree = (data) => {
    return api.post("/api/manager/org/orgTree", data);
}

export default {
    getList,
    getByOrgs,
    getDetail,
    getOrgTree,
}