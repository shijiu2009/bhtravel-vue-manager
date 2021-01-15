// 酒店管理接口
import api from './../api.js'
// 获取酒店列表
let getList = (data) => {
    return api.post("api/travel/hotel/list", data);
}
//获取酒店信息
let detailed = (data) => {
    return api.post("api/travel/hotel/show", data)
}
//新增或编辑酒店
let addOrEdit = (data) => {
    if (data.id) {
        return api.post("api/travel/hotel/edit", data)
    } else {
        return api.post("api/travel/hotel/add", data)
    }

}
//删除酒店
let deleted = (data) => {
    return api.post("api/travel/hotel/delete", data)
}
// 获取列表(不分页)
let getAllList = (data) => {
    return api.post("/api/travel/hotel/allList", data);
}
export default {
    getList,
    detailed,
    addOrEdit,
    deleted,
    getAllList
}