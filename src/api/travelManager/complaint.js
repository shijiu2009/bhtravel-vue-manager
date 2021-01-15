// 管理接口
import api from '../api.js'
// 获取列表
let getList = (data) => {
    return api.post("/api/travel/complaint/list", data);
}
//获取信息
let detailed = (data) => {
    return api.post("/api/travel/complaint/show", data)
}
//新增或编辑
let addOrEdit = (data) => {
    if (data.id) {
        return api.post("/api/travel/complaint/edit", data)
    } else {
        return api.post("/api/travel/complaint/add", data)
    }

}
//删除
let deleted = (data) => {
    return api.post("/api/travel/complaint/delete", data)
}
export default {
    getList,
    detailed,
    addOrEdit,
    deleted,
}