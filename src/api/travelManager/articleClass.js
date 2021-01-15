// 管理接口
import api from '../api.js'
// 获取列表
let getList = (data) => {
    return api.post("/api/travel/articleClass/list", data);
}
//获取信息
let detailed = (data) => {
    return api.post("/api/travel/articleClass/show", data)
}
//新增或编辑
let addOrEdit = (data) => {
    if (data.id) {
        return api.post("/api/travel/articleClass/edit", data)
    } else {
        return api.post("/api/travel/articleClass/add", data)
    }

}
//删除
let deleted = (data) => {
    return api.post("/api/travel/articleClass/delete", data)
}

let getViewTree = (data) => {
    return api.post("/api/travel/articleClass/getTree", data);
}

let getClassList = (data) => {
    return api.post("/api/travel/articleClass/getList", data);
}
export default {
    getList,
    detailed,
    addOrEdit,
    deleted,
    getViewTree,
    getClassList
}