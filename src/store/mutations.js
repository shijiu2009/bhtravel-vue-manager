import * as types from './mutations-type'
import {
    getTagItem
} from "@/utils/arrangement";

// mutation相关的修改方法
const mutations = {
    //通过type来获取常量，
    // 当前状态树的state，提交mutation时传的payload
    [types.SET_TAGSLIST](state, path) {
        path = path.split("?")[0]
        let tagItem = getTagItem(path, state.menuList);
        // //判断数组是否已存在该元素
        let isTrue = true;
        state.tagsList.forEach(item => {
            if (item.path == tagItem.path) {
                isTrue = false;
            }
        });
        if (isTrue) {
            //给仓库中的tagsList对象添加属性
            if (tagItem && JSON.stringify(tagItem) != '{}') {
                state.tagsList.push(tagItem);
            }
        }
        if (tagItem.meta && tagItem.meta.noBreadcrumb == 1) {
            // let $path = path.substr(1);
            var index = state.include.indexOf(tagItem.name);
            if (index < 0) {
                state.include.push(tagItem.name);
            }
        }
    },
    [types.CLEAR_TAGSLIST](state) {
        //清空tabsList
        state.tagsList = [];
    },
    [types.DELETE_TAGSLIST](state, path) {
        path = path.split("?")[0]
        for (let i = 0; i < state.tagsList.length; i++) {
            if (state.tagsList[i].path === path) {
                //删除tagsList中的对应的对象
                state.tagsList.splice(i, 1)[0];
            }
        }
        let $path = path.substr(1);
        //删除缓存对象
        var index = state.include.indexOf($path);
        state.include.splice(index, 1);
    },
    [types.UPDATA_COLLAPSE](state) {
        //修改菜单栏显示状态
        state.isCollapse = !state.isCollapse;
    },
    [types.UPDATE_ROLE_PURVIEW](state, prviewList) {
        localStorage.setItem('prviewList', JSON.stringify(prviewList))
        //修改权限
        state.prviewList = prviewList;
    },
    [types.ARRANGE_MENU](state, menuList) {
        //整理菜单
        state.menuList = menuList;
    },
    [types.DELETE_MENU](state) {
        //整理菜单
        state.menuList = [];
    },
    [types.SET_INCLUDE](state, includeItem) {
        console.log(includeItem)
        //添加缓存，查找当前路径是否已经在缓存里面
        var index = state.include.indexOf(includeItem);
        if (index < 0) {
            state.include.push(includeItem);
        }
    },
    [types.DELETE_INCLUDE](state, includeItem) {
        //删除页面缓存对象
        var index = state.include.indexOf(includeItem);
        state.include.splice(index, 1);
        // state.include.push(includeItem)
    },
}
export default mutations