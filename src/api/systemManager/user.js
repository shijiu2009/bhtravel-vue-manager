// 角色管理接口
import api from './../api.js'
// 获取角色菜单列表
let getList = (data) => {
    return api.post("/api/manager/user/list", data);
}

//获取角色详情
let getDetail = (data) => {
    return api.post("/api/manager/user/detail", data);
}

let changePassword = (data) => {
    return api.post("/api/manager/user/changeUserPasswd", data);
}
let changePasswordMerchant = (data) => {
    return api.post("/api/travel/tradingUser/changePasswd", data);
}

export default {
    getList,
    getDetail,
    changePassword,
    changePasswordMerchant
}