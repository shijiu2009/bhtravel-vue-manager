/* eslint-disable no-unused-vars */
import router from './router'
import store from '@/store/index'
import NProgress from 'nprogress' //

// import arrangement from "@/utils/arrangement";
import 'nprogress/nprogress.css' // 进度条样式

NProgress.configure({
  showSpinner: false, //禁用进度环
  ease: 'ease', //调整动画设置和
  speed: 1000, //速度（毫秒ms）
  trickleRate: 0.02, //每次步进增长多少 
  trickleSpeed: 800, //步进间隔(ms)
}) // 进度条配置


const whiteList = ['/login', '/404'] // no redirect whitelist
// 路由拦截
router.beforeEach((to, from, next) => {
  // if (to.meta.title) {
  //   document.title = to.meta.title + ' - ' + Config.title
  // }
  NProgress.start();
  if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
    next()
  }
  let token = store.state.user.getUserToken();
  if (!token || typeof (token) == undefined || token == 'undefined' || token == 'null' || JSON.stringify(token) == '{}') {
    // 否则全部重定向到登录页
    next({
      path: '/login'
    })
  } else {
    //1.获取用户权限
    //2.根据token获取用户信息，
    //3.动态获取用户菜单
    if (store.state.menuList.length <= 0) {
      store.dispatch('getMenus').catch(err => {
        next({
          path: '/'
        })
      })
    }
    next();
    if (to.path === '/login') {
      next({
        path: '/'
      })
    }
  }
});

//路由加载后
router.afterEach((to) => {
  store.commit("SET_TAGSLIST", to.fullPath);
  //结束进度条
  NProgress.done()
});



