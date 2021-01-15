// 管理接口
import api from './../api.js'
//列表

// 获取详情
let detailed = (data) => {
    return api.post("/api/travel/countryProjectorder/show", data);
}
// 处理订单
let edit = (data) => {
    return api.post("/api/travel/countryProjectorder/edit", data);
}

// 获取订单列表
let getList = (data) => {
    return api.post("/api/travel/countryProjectorder/list", data);
}
//统计
let statistics = (data) => {
    return api.post("/api/travel/countryProjectorder/statistics", data);
}
//退款
let refund = (data) => {
    return api.post("/api/travel/countryProjectorder/refund", data);
}
export default {
    detailed,
    edit,
    getList,
    statistics,
    refund
}