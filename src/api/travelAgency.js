// 活动管理接口
import api from './api.js'
// 获取活动列表
let getList = (data) => {
    return api.post("/api/travel/travelAgency/list", data);
}
//获取活动信息
let getTravelAgency = (data) => {
    return api.post("/api/travel/travelAgency/show", data)
}
//新增或编辑活动
let addOrEdit = (data) => {
    if (data.id) {
        return api.post("/api/travel/travelAgency/edit", data)
    } else {
        return api.post("/api/travel/travelAgency/add", data)
    }

}
//删除活动
let deleted= (data) => {
    return api.post("/api/travel/travelAgency/delete", data)
}
export default {
    getList,
    getTravelAgency,
    addOrEdit,
    deleted,
}