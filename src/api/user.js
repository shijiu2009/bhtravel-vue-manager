import api from './api.js'
// import qs from 'qs'

// 获取用户所有信息
let getUsers = (data) => {
    return api.post("manager/travelnUser/list", data);
    //test/traveln/userList.do
}

let testToken = () => {
    // 192.168.31.172:8888/traveln
    return api.post("/test/traveln/tr")
}
//登录
let login = data => {
    return api.post('/manager/login', data);
}

export default {
    getUsers,
    login,
    testToken,
}