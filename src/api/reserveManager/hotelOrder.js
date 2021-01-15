// 管理接口
import api from './../api.js'
// 获取详情
let detailed = (data) => {
    return api.post("/api/travel/hotelorder/show", data);
}
// 处理订单
let edit = (data) => {
    return api.post("/api/travel/hotelorder/edit", data);
}
// 获取订单列表
let getList = (data) => {
    return api.post("/api/travel/hotelorder/list", data);
}
//统计
let statistics = (data) => {
    return api.post("/api/travel/hotelorder/statistics", data);
}
//退款
let refund = (data) => {
    return api.post("/api/travel/hotelorder/refund", data);
}
export default {
    detailed,
    edit,
    getList,
    statistics,
    refund
}