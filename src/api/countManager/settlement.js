// 管理接口
import api from './../api.js'

// 获取订单列表
let getList = (data) => {
    return api.post("/api/travel/settlement/list", data);
}
// 获取月份的周
let getValue = (data) => {
    return api.post("/api/travel/settlement/getValue", data);
}
// 获取产品列表
let getBusiness = (data) => {
    return api.post("/api/travel/settlement/getBusiness", data);
}
// 处理订单
let updatestatus = (data) => {
    return api.post("/api/travel/settlement/updatestatus", data);
}
export default {
    getValue,
    getList,
    getBusiness,
    updatestatus
}