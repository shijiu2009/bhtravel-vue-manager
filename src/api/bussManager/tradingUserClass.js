// 管理接口
import api from '../api.js'
// 获取列表
let getList = (data) => {
    return api.post("/api/travel/tradingUserClass/list", data);
}
//获取信息
let detailed = (data) => {
    return api.post("/api/travel/tradingUserClass/show", data)
}
//新增或编辑
let addOrEdit = (data) => {
    if (data.id) {
        return api.post("/api/travel/tradingUserClass/edit", data)
    } else {
        return api.post("/api/travel/tradingUserClass/add", data)
    }

}
//删除
let deleted = (data) => {
    return api.post("/api/travel/tradingUserClass/delete", data)
}
//所有列表
let getAllList = (data) => {
    return api.post("/api/travel/tradingUserClass/allList", data)
}
export default {
    getList,
    detailed,
    addOrEdit,
    deleted,
    getAllList
}