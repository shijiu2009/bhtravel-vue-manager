<template>
  <div class="menu">
    <el-menu class="el-menu-vertical-demo sidebar" :default-active="onRoutes" background-color="#10384d"
      text-color="#FFFFFF" :collapse="isCollapse" router>
      <!-- 一级路由遍历 -->
      <template v-for="(item,i) in menuList">
        <!-- 判断是否有子路由 -->
        <template v-if="item.children&&item.meta.isMenu">
          <el-submenu :index="item.path" :key="item.id">
            <template slot="title" v-if="item.meta.isMenu">
              <!-- <i :class="item.icon"></i> -->
              <i :class="iconList[i-1]" style="color:#fff;"></i>
              <span slot="title">{{ item.meta.title }}</span>
            </template>
            <!-- 二级路由遍历 -->
            <template v-for="subItem in item.children">
              <!-- 判断是否有子路由 -->
              <el-submenu v-if="subItem.children&&subItem.meta.isMenu" :index="subItem.path" :key="subItem.id">
                <template slot="title">
                  <span>{{subItem.meta.title }}</span>
                </template>
                <!-- 三级路由遍历 -->
                <div v-for="(threeItem) in subItem.children" :key="threeItem.id" class="el-menu-item-box">
                  <el-menu-item :index="threeItem.path" :class="{'is-active':currentRouter===threeItem.path}"
                    v-if="threeItem.meta.isMenu">
                    <span>{{threeItem.meta.title }}</span>
                  </el-menu-item>
                </div>
              </el-submenu>
              <!-- 没有子路由 -->
              <el-menu-item v-if="!subItem.children&&subItem.meta.isMenu" :index="subItem.path" :key="subItem.id"
                :class="{'is-active':currentRouter===subItem.path}">
                <span>{{subItem.meta.title}}</span>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <!-- 没有子路由 -->
        <template v-if="!item.children&&item.meta.isMenu">
          <el-menu-item :index="item.path" :class="{'is-active':currentRouter===item.path}" :key="item.id">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.meta.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      actionPath: "/", //当前路由
      iconList: [
        'el-icon-s-tools',
        'el-icon-s-data',
        'el-icon-menu',
        'el-icon-s-custom',
        'el-icon-s-shop',
        'el-icon-s-operation',
        ], //路由列表
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
    ...mapState({
      isCollapse: "isCollapse",
      getToken: "getUserToken",
      menuList: "menuList", //路由列表
    }),
    //返回当前路由路径
    currentRouter() {
      return this.$route.fullPath;
    },
  },

  methods: {},
  created() {
    //设置方法，给其他组件调用
    // console.log(this.menuList)
  },
};
</script>
<style scoped>
.menu {
  background: #10374b;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 240px;
  min-height: 400px;
}
.menu {
  /* position: fixed; */
  background: #10374B;
  position: absolute;
  left: 0;
  top: 70px;
  height: 100%;
  /* width: 245px; */
  /* z-index: 999; */
  overflow: hidden;
  border-right: solid 1px #e6e6e6;
}
.menu:hover {
  overflow: auto;
  overflow-x: hidden;
}
.menu > ul {
  border-right: none;
}
.menu span {
  /* color: #fff; */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
  width: 100%;
}

/*  */
/* .menu .sidebar { */
/* height: 100%; */
/* } */

/* .el-menu-vertical-demo > li.el-submenu,
.el-menu-vertical-demo > li.el-menu-item {
  border-top: 1px solid hsla(0, 0%, 93.3%, 0.3);
}
.el-menu-item:hover.el-menu-item span {
  color: #409eff !important;
}

.el-submenu__title:hover.el-submenu__title span {
  color: #409eff !important;
}
.el-submenu__title:hover.el-submenu__title i {
  color: #409eff !important;
}
.el-menu-item:hover.el-menu-item i {
  color: #409eff !important;
} */

.el-menu-item-box {
  margin-bottom: 4px;
}
.el-submenu .el-menu-item {
  line-height: 36px;
  font-size: 12px;
  background: #234759 !important;
  padding: 6px 40px !important;
}
.el-submenu .el-menu-item span {
  border-radius: 4px;
  padding-left: 20px;
  box-sizing: border-box;
}
.el-submenu .el-menu-item.is-active span {
  background: #37bef2;
}
</style>
<style >
.el-submenu .el-menu {
  background: #234759 !important;
}
</style>