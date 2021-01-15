/* eslint-disable no-unused-vars */
import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/home/home.vue"
// import Dashboard from "@/views/dashboard/dashboard.vue"
import SystemManager from "@/views/systemManager/systemManager.vue"
import TravelManager from "@/views/travelManager/travelManager.vue"
import Login from "@/views/login/login.vue"
import Error404 from "@/views/errorPage/404.vue"
import systemRouter from "./systemRouter.js"
import travelRouter from "./travelRouter.js"


// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)
const routes = [{
    path: "/",
    redirect: "/dashboard",
    meta: {
      title: "首页",
      requiresAuth: true,
    },
  },
 {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      title: "登录页面",
      code: ["0"], //0为默认显示
      through: true, //无需登录验证便可通过
    },
  },
]
const router = new VueRouter({
  // mode: "history", 
  routes
});

export default router