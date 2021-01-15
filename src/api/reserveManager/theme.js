// 主题管理接口
import api from './../api.js'
// 获取主题列表
let getList = (data) => {
    return api.post("/api/travel/theme/list", data);
}
// 获取主题列表(不分页)
let getAllList = (data) => {
    return api.post("/api/travel/theme/allList", data);
}
//获取主题信息
let detailed = (data) => {
    return api.post("/api/travel/theme/show", data)
}
//新增或编辑主题
let addOrEdit = (data) => {
    if (data.id) {
        return api.post("/api/travel/theme/edit", data)
    } else {
        return api.post("/api/travel/theme/add", data)
    }

}
//删除主题
let deleted = (data) => {
    return api.post("/api/travel/theme/delete", data)
}
export default {
    getList,
    getAllList,
    detailed,
    addOrEdit,
    deleted,
}