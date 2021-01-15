// 线路管理接口
import api from './api.js'
// 获取线路列表
let getList = (data) => {
    return api.post("/api/travel/serviceInformationClass/list", data);
}
//获取线路信息
let detailed = (data) => {
    return api.post("/api/travel/serviceInformationClass/show", data)
}
//新增或编辑线路
let addOrEdit = (data) => {
    if (data.id) {
        return api.post("/api/travel/serviceInformationClass/edit", data)
    } else {
        return api.post("/api/travel/serviceInformationClass/add", data)
    }

}
//删除线路
let deleted = (data) => {
    return api.post("/api/travel/serviceInformationClass/delete", data)
}
export default {
    getList,
    detailed,
    addOrEdit,
    deleted,
}