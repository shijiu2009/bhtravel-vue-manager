// 管理接口
import api from './../api.js'
// 获取列表
let getList = (data) => {
    return api.post("/api/travel/countryTravel/list", data);
}
//获取信息
let detailed = (data) => {
    return api.post("/api/travel/countryTravel/show", data)
}
//新增或编辑
let addOrEdit = (data) => {
    if (data.id) {
        return api.post("/api/travel/countryTravel/edit", data)
    } else {
        return api.post("/api/travel/countryTravel/add", data)
    }

}
//活动
let deleted  = (data) => {
    return api.post("/api/travel/countryTravel/delete", data)
}
// 获取列表(不分页)
let getAllList = (data) => {
    return api.post("/api/travel/countryTravel/allList", data);
}
export default {
    getList,
    detailed,
    addOrEdit,
    deleted,
    getAllList
}