// 活动管理接口
import api from './api.js'
// 获取活动列表
let getActivitys = (data) => {
    return api.post("/api/travel/activity/list", data);
}
//获取活动信息
let detailedActivity = (data) => {
    return api.post("/api/travel/activity/show", data)
}
//新增或编辑活动
let addOrEditActivity = (data) => {
    if (data.id) {
        return api.post("/api/travel/activity/edit", data)
    } else {
        return api.post("/api/travel/activity/add", data)
    }

}
//删除活动
let deleted = (data) => {
    return api.post("/api/travel/activity/delete", data)
}
export default {
    getActivitys,
    detailedActivity,
    addOrEditActivity,
    deleted,
}