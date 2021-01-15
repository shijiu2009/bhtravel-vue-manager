import api from './api.js'

//登录
function login(data) {
    return api.post('/api/manager/login', data);
}

//商家登录
function openLogin(data) {
    return api.post('/api/travel/tradinguser/openLogin', data);
}

function getInfo(){
    
}

function getCodeImg(){
    return api.post("/manager/createImage");
}

function logout(){
    
}


export default {
    login,
    getInfo,
    getCodeImg,
    logout,
    openLogin
}