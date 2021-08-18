// 活动管理接口
import api from './api.js'
// 获取活动列表
let getActivitys = (data) => {
    return api.post("/api/travel/project/list", data);
}
//获取活动信息
let detailedActivity = (data) => {
    return api.post("/api/travel/project/show", data)
}
//新增或编辑活动
let addOrEditActivity = (data) => {
    if (data.id) {
        return api.post("/api/travel/project/edit", data)
    } else {
        return api.post("/api/travel/project/add", data)
    }

}
//删除活动
let deleted = (data) => {
    return api.post("/api/travel/project/delete", data)
}
export default {
    getActivitys,
    detailedActivity,
    addOrEditActivity,
    deleted,
}