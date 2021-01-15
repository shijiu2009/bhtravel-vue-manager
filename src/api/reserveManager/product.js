// 产品管理接口
import api from './../api.js'
// 获取产品列表
let getList = (data) => {
    return api.post("/api/travel/product/list", data);
}
// 获取产品列表(不分页)
let getAllList = (data) => {
    return api.post("/api/travel/product/allList", data);
}
// 获取产品分类列表
let getClassList = (data) => {
    return api.post("/api/travel/productClass/getList", data);
}
//获取产品信息
let detailed = (data) => {
    return api.post("/api/travel/product/show", data)
}
//新增或编辑产品
let addOrEdit = (data) => {
    if (data.id) {
        return api.post("/api/travel/product/edit", data)
    } else {
        return api.post("/api/travel/product/add", data)
    }

}
//删除产品
let deleted = (data) => {
    return api.post("/api/travel/product/delete", data)
}
export default {
    getList,
    getAllList,
    getClassList,
    detailed,
    addOrEdit,
    deleted,
}