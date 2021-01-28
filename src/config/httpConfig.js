import axios from 'axios'
import baseURL from './baseUrl'
import qs from 'qs'
//创建axios实例，设置请求超时时间
let instance = axios.create({
    changeOrigin: true, // 是否允许跨越, 开发环境中使用
});

// 请求超时
instance.defaults.timeout = 100000;

//统一请求地址
// instance.defaults.baseURL = baseURL.baseUrl
//统一请求地址
if (process.env.NODE_ENV === 'dev') {
    instance.defaults.baseURL = baseURL.baseUrl;
} else {
    instance.defaults.baseURL = baseURL.releaseUrl;
}


instance.defaults.withCredentials = true //设置cross跨域 并设置访问权限 允许跨域携带cookie信息
instance.defaults.crossDomain = true

//http 请求拦截器，有token值则配置上token值
instance.interceptors.request.use(config => {
    
    //根据这个判断是否是上传图片
    let upload = RegExp(/webuploader/)
    //根据这个判断是否是修改密码
    let reg = RegExp(/changeUserPasswd/)
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加
    const token = localStorage.getItem('token');
    //后端添加数据统一要求json = 1
    config.data ? config.data.json = 1 : '';
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加
    if (token) {
        config.headers.token = `${token}`;
    }
    //判断是否是上传图片
    if (config.url.search(upload) > 0) {
        // instance.defaults.headers.post["Content-Type"] = 'multipart/form-data';
        // config.headers['Content-Type'] = 'multipart/form-data';
    }
    //判断是否是修改密码
    if (config.url.search(reg) > 0) {
        instance.defaults.headers.post["Content-Type"] = 'application/json';
        config.headers['Content-Type'] = 'application/json';
    }
    //设置默认值，用于判断是否序列化
    else if (config.data && config.data.qs != 0 && config.url.search(upload) <= 0) {
        //序列化表单数据
        config.data = qs.stringify(config.data);
    }
    return config;
}, err => {
    return Promise.reject(err)
})

// 响应拦截器
instance.interceptors.response.use(
    response => {
        if (response.status === 200 || response.status === 201) {
            return Promise.resolve(response.data)
        } else {
            return Promise.reject(response.data)
        }
    }, err => {
        const {
            response
        } = err;
        if (response) {
            return Promise.reject(err)
        }
    })
export default instance;