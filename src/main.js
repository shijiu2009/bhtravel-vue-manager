/* eslint-disable no-unused-vars */
import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import './router/index.js'
import store from '@/store/index'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from './config/httpConfig'
import baseUrl from './config/baseUrl'
//自定义指令
import './directives/focus.js'
document.title="北海旅游后台管理";//修改html页面标题
import loading from './utils/loading.js' // 引入loading
if (!Vue.$loading) {
  Vue.$loading = loading;
}
Vue.mixin({
  created() {
    this.$loading = Vue.$loading;
  }
})
//公共方法
import global from './assets/js/global.js'
Vue.prototype.$global = global
//自定义指令
import './directives/focus.js'
// 富文本框
import Quill from 'quill' // 引入编辑器
import ImageResize from 'quill-image-resize-module';//富文本框图片配置

//百度地图
import BaiduMap from 'vue-baidu-map'

Quill.register('modules/imageResize', ImageResize);
//自定义富文本框方法，防止富文本框编辑的时候加载，导致页面滚动
Vue.prototype.quill = ((quillEditor) => {
  quillEditor.quill.enable(false); //刚开始时，不聚焦
  let timeout=setTimeout(() => {
    quillEditor.quill.enable(true); //0秒之后可以点击（聚焦）
    clearTimeout(timeout);
  }, 0);
})


Vue.prototype.$baseUrl = baseUrl;
Vue.prototype.$http = axios
//创建公共组件
Vue.prototype.bus = new Vue();
Vue.config.productionTip = false
//获取表单高度
Vue.prototype.$tableHeight = store.state.tableHeight;

Vue.use(ElementUI);
Vue.use(BaiduMap, {
  ak: 'jxL9ZCE1KGypzG1MbPwSSAcR'
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')