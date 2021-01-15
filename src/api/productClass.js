// 产品管理接口
import api from './api.js'
// 获取产品列表
let getList = (data) => {
    return api.post("/api/travel/productClass/list", data);
}
//获取产品信息
let detailed = (data) => {
    return api.post("/api/travel/productClass/show", data)
}
//新增或编辑产品
let addOrEdit = (data) => {
    if (data.id) {
        return api.post("/api/travel/productClass/edit", data)
    } else {
        return api.post("/api/travel/productClass/add", data)
    }

}
//删除产品
let deleted = (data) => {
    return api.post("/api/travel/productClass/delete", data)
}
export default {
    getList,
    detailed,
    addOrEdit,
    deleted,
}