// 管理接口
import api from './../api.js'
// 获取门票订单列表
let getTicketList = (data) => {
    return api.post("/api/travel/ticketorder/list", data);
}
// 获取酒店订单列表
let getHotelList = (data) => {
    return api.post("/api/travel/hotelorder/list", data);
}
//获取线路订单列表
let getPeripheryList = (data) => {
    return api.post("/api/travel/peripherytravelorder/list", data)
}
export default {
    getTicketList,
    getHotelList,
    getPeripheryList,
}