// 农家乐电子导游管理接口
import api from './api.js'
// 获取农家乐电子导游列表
let getList = (data) => {
    return api.post("/api/travel/countryTravelPoint/list", data);
}
//获取农家乐电子导游信息
let detailed = (data) => {
    return api.post("/api/travel/countryTravelPoint/show", data)
}
//新增或编辑农家乐电子导游
let addOrEdit = (data) => {
    if (data.id) {
        return api.post("/api/travel/countryTravelPoint/edit", data)
    } else {
        return api.post("/api/travel/countryTravelPoint/add", data)
    }

}
//删除农家乐电子导游
let deleted = (data) => {
    return api.post("/api/travel/countryTravelPoint/delete", data)
}
//生成农家乐电子导游语音文件
let generate = (data) => {
    return api.post("/api/travel/countryTravelPoint/covertVoice", data)
}
export default {
    getList,
    detailed,
    addOrEdit,
    deleted,
    generate,
}