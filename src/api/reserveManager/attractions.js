// 管理接口
import api from './../api.js'
// 获取列表
let getAttractions = (data) => {
    return api.post("/api/travel/attractions/list", data);
}
// 获取景点列表(不分页)
let getAllList = (data) => {
    return api.post("/api/travel/attractions/allList", data);
}
//获取信息
let detailedAttractions = (data) => {
    return api.post("/api/travel/attractions/show", data)
}
//新增或编辑
let addOrEditAttractions = (data) => {
    if (data.id) {
        return api.post("/api/travel/attractions/edit", data)
    } else {
        return api.post("/api/travel/attractions/add", data)
    }

}
//活动
let deleteAttractions = (data) => {
    return api.post("/api/travel/attractions/delete", data)
}
export default {
    getAttractions,
    getAllList,
    detailedAttractions,
    addOrEditAttractions,
    deleteAttractions,
}