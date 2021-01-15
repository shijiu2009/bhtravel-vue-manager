// 活动管理接口
import api from './api.js'
// 获取活动列表
let getFriendlyLink = (data) => {
    return api.post("/api/travel/friendlyLink/list", data);
}
//获取活动信息
let detailedFriendlyLink = (data) => {
    return api.post("/api/travel/friendlyLink/show", data)
}
//新增或编辑活动
let addOrEditFriendlyLink = (data) => {
    if (data.id) {
        return api.post("/api/travel/friendlyLink/edit", data)
    } else {
        return api.post("/api/travel/friendlyLink/add", data)
    }

}
//删除活动
let deleteFriendlyLink = (data) => {
    return api.post("/api/travel/friendlyLink/delete", data)
}
export default {
    getFriendlyLink,
    detailedFriendlyLink,
    addOrEditFriendlyLink,
    deleteFriendlyLink,
}