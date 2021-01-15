// 短信记录管理接口
import api from './api.js'
// 获取短信记录列表
let getSmsRecord = (data) => {
    return api.post("/api/travel/smsRecord/list", data);
}
//获取短信记录信息
let detailedSmsRecord = (data) => {
    return api.post("/api/travel/smsRecord/show", data)
}
//新增或编辑短信记录
let addOrEditSmsRecord = (data) => {
    if (data.id) {
        return api.post("/api/travel/smsRecord/edit", data)
    } else {
        return api.post("/api/travel/smsRecord/add", data)
    }

}
//删除短信记录
let deleteSmsRecord = (data) => {
    return api.post("/api/travel/smsRecord/delete", data)
}
export default {
    getSmsRecord,
    detailedSmsRecord,
    addOrEditSmsRecord,
    deleteSmsRecord,
}