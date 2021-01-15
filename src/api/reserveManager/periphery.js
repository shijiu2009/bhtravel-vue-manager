// 线路管理接口
import api from './../api.js'
// 获取线路列表
let getList = (data) => {
    return api.post("api/travel/peripheryTravel/list", data);
}
//获取线路信息
let detailed = (data) => {
    return api.post("api/travel/peripheryTravel/show", data)
}
//新增或编辑线路
let addOrEdit = (data) => {
    if (data.id) {
        return api.post("api/travel/peripheryTravel/edit", data)
    } else {
        return api.post("api/travel/peripheryTravel/add", data)
    }

}
//删除线路
let deleted = (data) => {
    return api.post("api/travel/peripheryTravel/delete", data)
}
//获取列表(不分页)
let getAllList = (data) => {
    return api.post("/api/travel/peripheryTravel/allList", data);
}
export default {
    getList,
    detailed,
    addOrEdit,
    deleted,
    getAllList
}