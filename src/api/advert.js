// 广告管理接口
import api from './api.js'

//获取列表数据
let getAdverts = (data) => {
    return api.post("/api/travel/advert/list", data);
}
//获取广告信息
let detailedAdvert = (data) => {
    return api.post("/api/travel/advert/show", data)
}
//新增或编辑广告
let addOrEditAdvert = (data) => {
    if (data.id) {
        return api.post("/api/travel/advert/edit", data)
    } else {
        return api.post("/api/travel/advert/add", data)
    }
}
//删除广告
let deleteAdvert = (data) => {
    return api.post("/api/travel/advert/delete", data)
}

// 获取广告位置列表
let getLoctions = (data) => {
    // eslint-disable-next-line valid-typeof
    if (!data || JSON.stringify(data) == '{}') {
        return api.post("/api/travel/advertSite/all.do")
    } else {
        return api.post("/api/travel/advertSite/list.do", data)
    }
}

//获取广告位置信息
let detailedAdvertSite = (data) => {
    return api.post("/api/travel/advertSite/show.do", data)
}

//新增或更新广告位置
let addOrEditAdvertSite = (data) => {
    if (data.id) {
        return api.post("/api/travel/advertSite/edit.do", data)
    } else {
        return api.post("/api/travel/advertSite/add.do", data)
    }
}

//删除广告位置
let deleteAdvertSite = (data) => {
    return api.post("/api/travel/advertSite/delete.do", data)
}

export default {
    getAdverts,
    detailedAdvert,
    addOrEditAdvert,
    deleteAdvert,
    getLoctions,
    detailedAdvertSite,
    addOrEditAdvertSite,
    deleteAdvertSite,
}