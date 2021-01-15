// 管理接口
import api from '../api.js'
// 获取省份
let getProvinces = (data) => {
    return api.post("/api/travel/location/getProvinces", data);
}
//获取地市
let getCities = (data) => {
    return api.post("/api/travel/location/getCities", data)
}
//获取区县
let getCountys = (data) => {
    return api.post("/api/travel/location/getCountys", data)
}
export default {
    getProvinces,
    getCities,
    getCountys,
}