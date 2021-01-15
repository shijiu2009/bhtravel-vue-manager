// 管理接口
import api from '../api.js'
// 获取列表
let getList = (data) => {
    return api.post("/api/travel/consultation/list", data);
}
//获取信息
let detailed = (data) => {
    return api.post("/api/travel/consultation/show", data)
}
//新增或编辑
let addOrEdit = (data) => {
    if (data.id) {
        return api.post("/api/travel/consultation/edit", data)
    } else {
        return api.post("/api/travel/consultation/add", data)
    }

}
//删除
let deleted = (data) => {
    return api.post("/api/travel/consultation/delete", data)
}
export default {
    getList,
    detailed,
    addOrEdit,
    deleted,
}