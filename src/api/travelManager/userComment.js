// 用户评论管理接口
import api from '../api.js'
// 获取 用户评论列表
let getComments = (data) => {
    return api.post("/api/travel/userComment/list", data);
}

let detailedComment = (data) => {
    return api.post("/api/travel/userComment/show", data)
}
//新增或编辑广告
let addOrEditComment = (data) => {
    if (data.id) {
        return api.post("/api/travel/userComment/edit", data)
    } else {
        return api.post("/api/travel/userComment/add", data)
    }
}
//删除广告
let deleteComment = (data) => {
    return api.post("/api/travel/userComment/delete", data)
}


export default {
    getComments,
    detailedComment,
    addOrEditComment,
    deleteComment
}