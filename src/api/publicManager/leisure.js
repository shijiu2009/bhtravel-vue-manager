// 管理接口
import api from './../api.js'
// 获取列表
let getList = (data) => {
    return api.post("/api/travel/leisure/list", data);
}
// 获取列表(不分页)
let getAllList = (data) => {
    return api.post("/api/travel/leisure/allList", data);
}
//获取信息
let detailed = (data) => {
    return api.post("/api/travel/leisure/show", data)
}
//新增或编辑
let addOrEdit = (data) => {
    if (data.id) {
        return api.post("/api/travel/leisure/edit", data)
    } else {
        return api.post("/api/travel/leisure/add", data)
    }

}
//删除
let deleted = (data) => {
    return api.post("/api/travel/leisure/delete", data)
}
export default {
    getList,
    getAllList,
    detailed,
    addOrEdit,
    deleted,
}