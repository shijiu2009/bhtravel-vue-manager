// 活动管理接口
import api from './api.js'
// 获取活动列表
let getList = (data) => {
    return api.post("/api/travel/travelPlace/list", data);
}
//获取活动信息
let getTravelPlace = (data) => {
    return api.post("/api/travel/travelPlace/show", data)
}
//新增或编辑活动
let addOrEdit = (data) => {
    if (data.id) {
        return api.post("/api/travel/travelPlace/edit", data)
    } else {
        return api.post("/api/travel/travelPlace/add", data)
    }

}
//删除活动
let deleted= (data) => {
    return api.post("/api/travel/travelPlace/delete", data)
}
export default {
    getList,
    getTravelPlace,
    addOrEdit,
    deleted,
}