// 管理接口
import api from './../api.js'

// 获取列表
let getList = (data) => {
    return api.post("/api/travel/wxPayRecord/list", data);
}
// 获取详情
let detailed = (data) => {
    return api.post("/api/travel/wxPayRecord/show", data);
}
export default {
    detailed,
    getList,
}