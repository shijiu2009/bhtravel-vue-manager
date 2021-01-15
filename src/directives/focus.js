import Vue from 'vue'
import store from '@/store/index'
import regular from '@/assets/js/regular.js'

// 注册一个全局自定义指令 `v-role`
Vue.directive('role', {
    /**
     * 当被绑定元素插入到DOM时 */
    inserted: function (el, binding) {
        let isTrue = false
        // 判断是否在权限内
        // eslint-disable-next-line no-prototype-builtins 
        for (let i = 0; i < store.state.prviewList.length; i++) {
            if(store.state.prviewList[i].sid==binding.value){
                isTrue = true
            }
        }
        if (!isTrue) {
            el.parentNode.removeChild(el);
        }
    }
})

//自定义气泡指令,
Vue.directive('fingerTips', {
    inserted: function (el, binding) {
        el.style.position = "relative";
        var newChild = document.createElement("i"); //生成元素
        let icon = binding.value.icon ? binding.value.icon : "icon-wenhao"
        newChild.classList.add('input_tips', icon, 'iconfont'); //给元素添加类
        let randomIden = 'finger-tip-' + getRandom().toString(); //随机生成唯一标识
        newChild.setAttribute("data-iden", randomIden); //给元素添加唯一标识
        el.appendChild(newChild); //创建元素
        // const rect = newChild.getBoundingClientRect() //获取点击的dom的位置
        //添加移入事件
        newChild.addEventListener("mouseover", function () {
            const rect = this.getBoundingClientRect() //获取点击的dom的位置
            let elTips = document.getElementById(this.getAttribute("data-iden"));
            elTips.style.top = rect.y + 'px';
            elTips.style.left = rect.x + 'px';
            elTips.classList.add("show");
            setTimeout(function () {
                elTips.classList.add("show_01");
            }, 0);
        });
        //添加移出事件
        newChild.addEventListener("mouseout", function () {
            let elTips = document.getElementById(this.getAttribute("data-iden"));
            elTips.classList.remove("show", "show_01");
        })
        //添加气泡
        // 最大宽度
        let maxWidth = binding.value.maxWidth ? binding.value.maxWidth : 400;
        let fingerTips = `<div class="fingerTips" id="${randomIden}"style="max-width:${maxWidth}px">
        <div class="fingerTips_item"> ${binding.value.content} <div class="fingerTips_arrow"></div></div>
        </div>`;
        document.body.insertAdjacentHTML("beforeEnd", fingerTips);
    }
});

//自定义表单验证
//自定义气泡指令,comtent,type,
Vue.directive('validation', {
    inserted: function (el, binding) {
        let randomIden = 'validation-' + getRandom().toString(); //随机生成唯一标识
        let children = el.childNodes; //获取元素子类
        let elChildren = ""
        //获取输入元素
        for (let i = 0; i < children.length; i++) {
            if (children[i].tagName) {
                elChildren = children[i]
            }
        }
        elChildren.setAttribute("data-iden", randomIden); //给元素添加唯一标识
        console.log();
        //创建元素
        let errorEl = `<div class="report_error" id="${randomIden}">
        <div class="report_error_item"><i class="icon el-alert__icon el-icon-error"></i>
        <p class="content">${binding.value.content}</p></div>
      </div>`
        el.insertAdjacentHTML("beforeEnd", errorEl)
        elChildren.addEventListener('input', function () {
            //获取表现
            let elTips = document.getElementById(this.getAttribute("data-iden"));
            if (!regular.check(binding.value.type, this.value).isCheck) {
                elTips.classList.add("show");
                setTimeout(function () {
                    elTips.classList.add("show_01");
                }, 0);
            } else {
                elTips.classList.remove("show", "show_01");
            }
            if (binding.value.isEmpty && !this.value) {
                setTimeout(function () {
                    elTips.classList.remove("show", "show_01");
                }, 1);

            }
        });
    }
})

// 点击删除后弹出提示框
Vue.directive('deleteWarning', {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function (el, binding) {
        console.log(binding.value)
        binding.value.openWarning();
    }
});

//随机数组，防止数组相同
let randoms = new Array();
//生成随机数
function getRandom() {
    let num = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    if (randoms.indexOf(num) >= 0) {
        return getRandom();
    } else {
        randoms.push(num);
        return num
    }
}