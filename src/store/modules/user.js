import login from '@/api/login.js';
import md5 from "js-md5";
const user = {
    state: {
        /*用户信息 */
        userName: localStorage.getItem('userName'),
        //令牌的存储和获取
        getUserToken() {
            return sessionStorage.getItem('token')
        },
        setUserToken(value) {
            sessionStorage.setItem('token', value)
        },
        //解析串化的localStorage数据
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
    },
    mutations: {
        SET_USERNAME: (state, username) => {
            state.userName = username
        },
        SET_USER: (state, userInfo) => {
            state.userInfo = userInfo
        },
        CLOSE_TOKEN: () => {
            sessionStorage.removeItem('token');
        },
        CLOSE_USERINFO: (state) => {
            state.userInfo = {};
        },
        SET_TOKEN: (state, token) => {
            state.setUserToken(token);
        },
        SAVE_USER:(state,userinfo)=>{
            state.userInfo = userinfo;
            // console.log(state.userInfo)
        }
    },
    actions: {
        // 登录
        Login({
            commit
        }, data) {
            return new Promise((resolve, reject) => {
                //密码加密 
                let passwd = data.password;
                var password = data.password;
                password = md5(password).toUpperCase();
                password = password + data.xcode;
                password = md5(password);
                data.password = password;
                data.qs = 0;
                //登录
                login.login(data).then((result) => {
                    if (result.status) {
                        // console.log(result);
                        commit('SET_TOKEN', result.data.token);
                        //对象串化
                        result.data._root = true
                        localStorage.setItem("userInfo", JSON.stringify(result.data))
                        //对象解析
                        // console.log(JSON.parse(localStorage.getItem('userInfo')))
                        commit('SAVE_USER',result.data)
                        resolve({
                            status: true
                        });
                        commit('SET_USERNAME', result.data.username)
                        localStorage.setItem("userName", result.data.username)
                        console.log(localStorage.getItem('userName'));
                        localStorage.setItem("token", result.data.token)
                    } else if (result.msg == "用户名或密码错误！！") {
                        login.openLogin({
                            name: data.username,
                            passwd: passwd
                        }).then((result) => {
                            if (result.success) {
                                commit('SET_TOKEN', result.token);
                                // console.log(result);
                                //对象串化
                                localStorage.setItem("userInfo", JSON.stringify(result))
                                // console.log(JSON.parse(localStorage.getItem('userInfo')))
                                commit('SAVE_USER',result)
                                resolve({
                                    status: true
                                });
                                localStorage.setItem("token", result.token)
                            } else {
                                reject(result)
                            }
                        })
                    } else {
                        reject(result)
                    }
                }).catch((err) => {
                    reject(err)
                })
            })
        },
        //获取用户信息

        getUsrrInfo({
            // eslint-disable-next-line no-unused-vars
            commit
        }) {

        },
        //退出
        logout({
            commit
        }) {
            return new Promise((resolve) => {
                commit('CLOSE_TOKEN');
                commit('CLOSE_USERINFO');
                commit('DELETE_MENU');
                resolve({
                    success: true
                });
            })
        }
    },
}
export default user