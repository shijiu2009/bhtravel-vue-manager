// 管理接口
import api from '../api.js'
// 获取列表
let getList = (data) => {
    return api.post("/api/travel/tradingUser/list", data);
}
//获取信息
let detailed = (data) => {
    return api.post("/api/travel/tradingUser/show", data)
}
//新增或编辑
let addOrEdit = (data) => {
    if (data.id) {
        return api.post("/api/travel/tradingUser/edit", data)
    } else {
        return api.post("/api/travel/tradingUser/add", data)
    }

}
//删除
let deleted = (data) => {
    return api.post("/api/travel/tradingUser/delete", data)
}
//修改密码
let changePassword = (data) => {
    return api.post("/api/travel/tradingUser/changePasswd", data)
}

let getAllList = (data) => {
    return api.post("/api/travel/tradingUser/allList", data)
}
export default {
    getList,
    detailed,
    addOrEdit,
    deleted,
    changePassword,
    getAllList
}