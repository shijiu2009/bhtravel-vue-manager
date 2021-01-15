// 短信管理接口
import api from './api.js'

//获取短信信息
let detailedSmsInfo = (data) => {
    return api.post("/api/travel/smsInfo/show", data)
}
//新增或编辑短信
let addOrEditSmsInfo = (data) => {
    if (data.id) {
        return api.post("/api/travel/smsInfo/setting", data)
    } else {
        return api.post("/api/travel/smsInfo/setting", data)
    }

}
export default {
    detailedSmsInfo,
    addOrEditSmsInfo,
}