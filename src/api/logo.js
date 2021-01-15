// 线路管理接口
import api from './api.js'
//获取线路信息
let detailed = (data) => {
    return api.post("/api/travel/logo/show", data)
}
//新增或编辑线路
let addOrEdit = (data) => {
        return api.post("/api/travel/logo/setting", data)
}
export default {
    detailed,
    addOrEdit,
}