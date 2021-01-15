// 管理接口
import api from '../api.js'
// 获取列表
let getList = (data) => {
    return api.post("/api/travel/settlement/list", data);
}
let updatestatus = (data) => {
    return api.post("/api/travel/settlement/updatestatus", data);
}
let updatestatus2 = (data) => {
    return api.post("/api/travel/settlement/updatestatus2", data);
}
// 获取详情
let detailed = (data) => {
    return api.post("/api/travel/settlement/show", data);
}
// 处理
let edit = (data) => {
    return api.post("/api/travel/settlement/edit", data);
}
export default {
    getList,
    updatestatus,
    updatestatus2,
    detailed,
    edit
}