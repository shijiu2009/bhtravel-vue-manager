import store from '@/store/index'
// 遍历后台传来的权限，转换为组件对象
export const filterAsyncRouter = (routers, purViewList=[]) => {
    let routerList= routers.filter(router => {
        purViewList.push({ name: router.name, sid: router.id, title: router.meta.title });
        if (router.component) {
            //判断是否有"/"
            if (router.path.substr(0, 1) != "/") {
                router.path = "/" + router.path;
            }
            const component = router.component;
            router.component = loadView(component);
        }
        if (router.children && router.children.length) {
            router.children = filterAsyncRouter(router.children,purViewList).routerList
        }
        return true
    })
    return {routerList:routerList,purViewList:purViewList}
}

let loadView = (view) => {
    //判断是否有"/"
    if (view.substr(0, 1) == "/") {
        view = view.substr(1);
    }
    return (resolve) => require([`@/views/${view}.vue`], resolve)
}

//根据路径获取菜单列表中对应的菜单
let item = {}

export const getTagItem = (path, list) => {
    if (list) {
        for (var i = 0; i < list.length; i++) {
            let node = list[i];
            if (list[i].path === path) {
                item = list[i]
            } else if (node.children) {
                getTagItem(path, node.children);
            }
        }
    }
    return item
}

//权限判断
export const rootJudge = (codeArr) => {
    if (!codeArr) return false
    for (let i = 0; i < codeArr.length; i++) {
        if (codeArr[i] == "0") {
            return true;
        }
        // eslint-disable-next-line no-prototype-builtins
        else if (store.state.prviewList.hasOwnProperty(codeArr[i])) {
            return true;
        }
    }
    return false;
}
