// 图集管理接口
import api from './api.js'
// 获取图集列表
let getAtlas = (data) => {
    return api.post("/api/travel/atlas/list", data);
}
//获取图集信息
let detailedAtlas = (data) => {
    return api.post("/api/travel/atlas/show", data)
}
//新增或编辑图集
let addOrEditAtlas = (data) => {
    if (data.id) {
        return api.post("/api/travel/atlas/edit", data)
    } else {
        return api.post("/api/travel/atlas/add", data)
    }

}
//删除图集
let deleteAtlas = (data) => {
    return api.post("/api/travel/atlas/delete", data)
}
// 获取图片列表
let getImglibs = (data) => {
    return api.post("/api/travel/imglib/list", data);
}
// 添加图片
let addImglib = (data) => {
    return api.post("/api/travel/imglib/add", data);
}
// 清空该图集图片
let delImgList = (data) => {
    return api.post("/api/travel/imglib/delList", data);
}
export default {
    getAtlas,
    detailedAtlas,
    addOrEditAtlas,
    deleteAtlas,
    getImglibs,
    addImglib,
    delImgList
}