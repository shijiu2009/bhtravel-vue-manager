// 标签管理接口
import api from './api.js'
// 获取标签列表
let getTag = (data) => {
    return api.post("/api/travel/tag/list", data);
}
//获取标签信息
let detailedTag = (data) => {
    return api.post("/api/travel/tag/show", data)
}
//新增或编辑标签
let addOrEditTag = (data) => {
    if (data.id) {
        return api.post("/api/travel/tag/edit", data)
    } else {
        return api.post("/api/travel/tag/add", data)
    }

}
//删除标签
let deleteTag = (data) => {
    return api.post("/api/travel/tag/delete", data)
}
// 获取标签类别列表
let getTagMusters = (data) => {
    // eslint-disable-next-line valid-typeof
    if (!data || JSON.stringify(data) == '{}') {
        return api.post("/api/travel/tagMuster/all")
    } else {
        return api.post("/api/travel/tagMuster/list", data)
    }
}
export default {
    getTag,
    detailedTag,
    addOrEditTag,
    deleteTag,
    getTagMusters,
}