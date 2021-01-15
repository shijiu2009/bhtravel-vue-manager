// 线路管理接口
import api from './api.js'
// 获取线路列表
let getList = (data) => {
    return api.post("/api/travel/serviceInformation/list.do", data);
}
//获取线路信息
let detailed = (data) => {
    return api.post("/api/travel/serviceInformation/show.do", data)
}
//新增或编辑线路
let addOrEdit = (data) => {
    if (data.id) {
        return api.post("/api/travel/serviceInformation/edit.do", data)
    } else {
        return api.post("/api/travel/serviceInformation/add.do", data)
    }

}
// 获取线路列表
let getClassList = (data) => {
    return api.post("/api/travel/serviceInformationClass/getList", data);
}
//删除线路
let deleted = (data) => {
    return api.post("/api/travel/serviceInformation/delete", data)
}
export default {
    getList,
    detailed,
    addOrEdit,
    deleted,
    getClassList
}