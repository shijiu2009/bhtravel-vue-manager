// 管理接口
import api from './../api.js'
// 获取详情
let detailed = (data) => {
    return api.post("/api/travel/homestayorder/show", data);
}
// 处理订单
let edit = (data) => {
    return api.post("/api/travel/homestayorder/edit", data);
}

// 获取订单列表
let getList = (data) => {
    return api.post("/api/travel/homestayorder/list", data);
}
//统计
let statistics = (data) => {
    return api.post("/api/travel/homestayorder/statistics", data);
}
//退款
let refund = (data) => {
    return api.post("/api/travel/homestayorder/refund", data);
}
export default {
    detailed,
    edit,
    getList,
    statistics,
    refund
}