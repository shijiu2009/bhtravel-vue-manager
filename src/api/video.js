// 視頻管理接口
import api from './api.js'
// 获取視頻列表
let getList = (data) => {
    return api.post("/api/travel/travelvideo/list", data);
}
//获取視頻信息
let detailed = (data) => {
    return api.post("/api/travel/travelvideo/show", data)
}
//新增或编辑視頻
let addOrEdit = (data) => {
    if (data.id) {
        return api.post("/api/travel/travelvideo/edit", data)
    } else {
        return api.post("/api/travel/travelvideo/add", data)
    }

}
//删除視頻
let deleted = (data) => {
    return api.post("/api/travel/travelvideo/delete", data)
}
export default {
    getList,
    detailed,
    addOrEdit,
    deleted,
}