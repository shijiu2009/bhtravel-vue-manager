import Vue from 'vue'
import loadingComponent from '@/components/loading/loading.vue'

const LoadingConstructor = Vue.extend(loadingComponent)

const instance = new LoadingConstructor({
    el: document.createElement('div')
})

instance.show = false // 默认隐藏
export default {
    show() { // 显示方法
        instance.show = true;
        document.body.appendChild(instance.$el);
    },
    hide() { // 隐藏方法
        instance.show = false;
    }
}
