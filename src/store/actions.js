
import router from '@/router/router'
import Vue from 'vue'
import {
    filterAsyncRouter
} from "@/utils/arrangement";
import {
    getMenusTree
} from '@/api/system/menu.js'

import { asyncHome, dashboard } from '@/router/dynamic-router.js'
const action = {
    getMenus({ commit }) {
        // 获取路由菜单
        return new Promise((resolve, reject) => {
            getMenusTree().then(result => {
                if (result && result.status) {
                    //整理路由
                    let filter = filterAsyncRouter(JSON.parse(JSON.stringify(result.data)));
                    let asyncRouters = filter.routerList
                    asyncRouters.unshift(dashboard);
                    //添加菜单
                    commit("ARRANGE_MENU", asyncRouters);
                    //添加权限列表
                    commit("UPDATE_ROLE_PURVIEW", filter.purViewList);
                    asyncHome.children = asyncRouters;
                    // 动态添加路由
                    router.addRoutes([asyncHome]);
                    resolve()
                }
                else {
                    Vue.prototype.$message.error("请重新登录");
                    commit("CLOSE_TOKEN");
                    reject()
                }
            })
        })

    }
}

export default action;