// 标签管理接口
import api from './api.js'
// 获取标签列表
let getTagMuster = (data) => {
    return api.post("/api/travel/tagMuster/list", data);
}
//获取标签信息
let detailedTagMuster = (data) => {
    return api.post("/api/travel/tagMuster/show", data)
}
//新增或编辑标签
let addOrEditTagMuster = (data) => {
    if (data.id) {
        return api.post("/api/travel/tagMuster/edit", data)
    } else {
        return api.post("/api/travel/tagMuster/add", data)
    }

}
//删除标签
let deleteTagMuster = (data) => {
    return api.post("/api/travel/tagMuster/delete", data)
}
export default {
    getTagMuster,
    detailedTagMuster,
    addOrEditTagMuster,
    deleteTagMuster,
}