//系统主页
export let asyncHome = {
    path: "/",
    name: "home",
    component(resolve) {
        require(['@/views/home/home.vue'], resolve)
    },
    meta: {
        title: "首页",
        requiresAuth: true,
    },
    children: []
};
export let dashboard = {
    path: "/dashboard",
    name: "dashboard",
    component(resolve) {
        require(['@/views/dashboard/dashboard.vue'], resolve)
    },
    meta: {
        title: "系统首页",
        icon: "el-icon-s-home",
        code: ["0"] //0为默认显示
    },
}

// export default {
//     asyncHome,
//     dashboard
// }