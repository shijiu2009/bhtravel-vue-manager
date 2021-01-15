// 图片管理接口
import api from './api.js'
// 获取图片列表
let getList = (data) => {
    return api.post("/api/travel/imglib/list", data);
}
//获取图片信息
let detailed = (data) => {
    return api.post("/api/travel/imglib/show", data)
}
//新增或编辑图片
let addOrEdit = (data) => {
    if (data.id) {
        return api.post("/api/travel/imglib/edit", data)
    } else {
        return api.post("/api/travel/imglib/add", data)
    }

}
//删除图片
let deleted = (data) => {
    return api.post("/api/travel/imglib/delete", data)
}
export default {
    getList,
    detailed,
    addOrEdit,
    deleted,
}