// 线路管理接口
import api from './api.js'
// 获取线路列表
let getList = (data) => {
    return api.post("/api/travel/travelNotes/list", data);
}
//获取线路信息
let detailed = (data) => {
    return api.post("/api/travel/travelNotes/show", data)
}
//新增或编辑线路
let addOrEdit = (data) => {
    if (data.id) {
        return api.post("/api/travel/travelNotes/edit", data)
    } else {
        return api.post("/api/travel/travelNotes/add", data)
    }

}
//删除线路
let deleted = (data) => {
    return api.post("/api/travel/travelNotes/delete", data)
}
export default {
    getList,
    detailed,
    addOrEdit,
    deleted,
}