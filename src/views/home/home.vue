<template>
  <div>
    <Menu></Menu>
    <div class="content_box" :class="{isCollapse:isCollapse}">
      <!-- 头部 -->
      <Tags></Tags>
      <Header></Header>
      <div class="content">
        <!-- transition页面过度动画 -->
        <transition name="slide-top">
          <keep-alive>
            <!-- 子内容显示 -->
            <router-view />
          </keep-alive>
        </transition>
        <!-- 返回顶部 -->
        <el-backtop target=".content"></el-backtop>
      </div>
    </div>
  </div>
</template>
<script>
import Menu from "@/components/menu/menu.vue";
import Tags from "@/components/tags/tags.vue";
import Header from "@/components/header/header.vue";
import { mapState } from "vuex";
export default {
  components: {
    Menu,
    Tags,
    Header,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      isCollapse: "isCollapse",
    }),
  },
  methods: {
    //调整table栏目宽高
    adjustTableHeight() {
      let handle = document.querySelector(".handle-box");
      let tags = document.querySelector(".tags");
      let table = document.querySelector(".adjustTable");
      if (!handle || !tags || !table) {
        return;
      }
      let height = handle.offsetHeight + tags.offsetHeight + 119;
      // 设置表格最大高度
      table.style.maxHeight = window.innerHeight - height + "px";
      //获取表格元素
      let tableWrapper = document.querySelector(
        ".adjustTable .el-table__body-wrapper"
      );
      let tableRight = document.querySelector(
        ".adjustTable .el-table__fixed-body-wrapper"
      );
      //设置元素的高度
      if (tableRight) {
        tableRight.style.maxHeight = window.innerHeight - height - 104 + "px";
      }
      if (tableWrapper) {
        tableWrapper.style.maxHeight = window.innerHeight - height - 104 + "px";
      }
      this.$tableHeight = window.innerHeight - height;
    },
  },
  created() {},
  mounted() {
    this.$nextTick(function () {
      this.adjustTableHeight();
    });
    //窗口或框架被调整大小时发生触发该事件
    window.onresize = () => {
      this.adjustTableHeight();
    };
  },
};
</script>
<style scoped>
.content_box {
  position: absolute;
  left: 240px;
  right: 0;
  top: 0px;
  bottom: 0px;
  transition: left 0.3s ease-in-out;
  overflow: hidden;
  padding-top: 50px;
}
.content {
  width: auto;
  position: relative;
  padding: 10px 20px 20px;
  overflow-y: scroll;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  min-width: 500px;
  height: calc(100% - 30px);
}

.isCollapse {
  left: 65px;
}
.basic_box {
  margin-bottom: 50px;
  box-shadow: 0px 0px 2px #999;
  border-radius: 4px;
}
.basic_box .el-row {
  margin-top: 20px;
}
.basic_item {
  padding: 10px;
}
.basic_box .title {
  font-size: 18px;
  padding: 20px;
}
.el-button-group + .el-button-group {
  margin-left: 10px;
}
.el-collapse-item {
  position: relative;
  padding-bottom: 50px;
}
.el-collapse-item .el-collapse-item__content {
  padding-bottom: 0px;
  line-height: 0em;
}
.el-collapse-item > div[role="tab"] {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
}
.el-collapse-item .el-collapse-item__header {
  display: block;
  text-align: center;
  position: relative;
  color: #999;
  transition: all 0.4s ease;
}
.el-collapse-item__header i {
  float: right;
  margin-top: 16px;
  transition: all 0.4s ease;
}
.el-collapse-item .el-collapse-item__header:hover {
  color: #409eff;
  margin-right: 16px;
}
.el-collapse-item .el-collapse-item__arrow.is-active {
  transform: rotate(-90deg);
}

.bold {
  padding: 2px 4px;
  background: #e6effb;
}
.basic_item a {
  margin: 0 10px;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
/*定义滚动条轨道 内阴影+圆角*/
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
}
element::-webkit-scrollbar {
  display: none;
}
.el-table div.cell {
  /* 单词字母自动换行 */
  word-break: break-word;
}
</style>