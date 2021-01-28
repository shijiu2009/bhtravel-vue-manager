
<template>
  <div class="header">
    <div class="openMenu">
      <router-link :to="{ path: '/' }">
        <div class="left-img">
          <div class="img-box">
            <img src="../../assets/images/home.png" alt="" />
          </div>
          北海智慧旅游
        </div>
      </router-link>
      <div class="header-left">
        <!-- 展开或缩放菜单 -->
        <i
          class="iconfont icon-caidan"
          :class="{ action: isCollapse }"
          @click="openMenu"
          style="color: #fff"
        ></i>
        <!-- 面包屑 -->
        <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-for="item in breadcrumb" :key="item">{{
            item
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="header-right">
        <div class="header-user-con">
          <!-- 全屏显示 -->
          <div class="btn-fullscreen header-btn" @click="handleFullScreen">
            <el-tooltip
              effect="dark"
              :content="fullscreen ? `取消全屏` : `全屏`"
              placement="bottom"
            >
              <p>
                <i class="el-icon-rank" style="color: #fff"></i>
              </p>
            </el-tooltip>
          </div>
          <!-- 消息中心 -->
          <div class="btn-bell header-btn">
            <el-tooltip
              effect="dark"
              :content="message ? `有${message}条未读消息` : `消息中心`"
              placement="bottom"
            >
              <router-link to="/">
                <i class="el-icon-bell" style="color: #fff"></i>
                <span style="font-size: 14px; color: #fff; margin-left: -6px"
                  >消息</span
                >
              </router-link>
            </el-tooltip>
            <span class="btn-bell-badge" v-if="message"></span>
          </div>
          <!-- 用户头像及下拉菜单 -->
          <el-dropdown
            class="user-avator"
            trigger="click"
            @command="handleCommand"
          >
            <img :src="userimage" alt="" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="changePassword"
                >修改密码</el-dropdown-item
              >
              <el-dropdown-item command="loginout" @click.native="logoutFun"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <!-- 对话框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogPassword"
      :modal-append-to-body="false"
    >
      <el-form ref="form" :model="passwordParams" label-width="auto">
        <el-form-item label="新密码：">
          <el-input v-model="passwordParams.newpass1" show-password></el-input>
        </el-form-item>
        <el-form-item label="再次输入新密码：">
          <el-input v-model="passwordParams.newpass2" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogTableVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="confirmPassword">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import api from "@/api/systemManager/user.js";
import store from "@/store/modules/user.js";
export default {
  data() {
    return {
      dialogPassword: false,
      passwordParams: {
        userId: this.$store.state.user.userInfo.userId,
        newpass1: "",
        newpass2: "",
      },
      store,
      userimage:
        "https://travel.gxucreate.com/travelbh" + store.state.userInfo.avatar,
      fullscreen: false, //是否全屏属性
      message: 2, //消息数量
      username: "我的光啊", //用户名称
    };
  },
  computed: {
    //获取路由，制作面包屑
    breadcrumb: function () {
      let list = [];
      list.push(this.$route.meta.title);
      if (this.$route.meta && this.$route.meta.parentName) {
        list.unshift(this.$route.meta.parentName);
      }
      return list;
    },
    ...mapState({
      isCollapse: "isCollapse",
    }),
  },
  methods: {
    ...mapMutations({
      updataCollapse: "UPDATA_COLLAPSE",
    }),
    ...mapActions({
      logout: "logout",
    }),
    // 修改密码
    changePassword() {
      console.log(1);
      this.dialogPassword = !this.dialogPassword;
    },
    confirmPassword: function () {
      api.changePassword(this.passwordParams).then((result) => {
        alert(result.msg);
      });
      this.dialogPassword = false;
      this.logoutFun();
    },
    //展开或缩放菜单
    openMenu: function () {
      this.updataCollapse();
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "loginout") {
        this.$router.push("/login");
      }
    },
    //注销用户
    logoutFun: function () {
      localStorage.removeItem("token");
      this.logout().then(() => {
        this.$router.push("/logon");
      });
    },
  },
};
</script>
<style scoped>
.header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  /* border-bottom: 1px solid #e5e5e5;
  background: #fff; */
  background: linear-gradient(162deg, #18a2db, #43c9fb);
  box-shadow: 0px 8px 40px 0px rgba(25, 163, 220, 0.22);
  z-index: 999;
  height: 70px;
  line-height: 70px;
  min-width: 700px;
}
.left-img {
  float: left;
  width: 280px;
  height: 70px;
  display: flex;
  align-items: center;
  font-size: 24px;
  font-family: SourceHanSansCN;
  font-weight: bold;
  color: #ffffff;
  line-height: 33px;
}
.img-box {
  width: 37px;
  height: 37px;
  margin: 0 10px 0 30px;
  background: #fff;
  border-radius: 50%;
  overflow: hidden;
  padding: 5px;
}
.img-box img {
  width: 100%;
  height: 100%;
}
.header-left {
  float: left;
}
.header-right {
  float: right;
  display: inline-block;
  text-align: right;
  padding-right: 20px;
}
.openMenu {
  width: 100%;
}
.openMenu i {
  display: inline-block;
  margin-left: 8px;
  padding: 0 10px;
  font-size: 26px;
  vertical-align: middle;
  color: #333;
  cursor: pointer;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}
.openMenu i.action {
  transform: rotate(90deg);
}
.breadcrumb {
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  margin-left: 5px;
}
.breadcrumb span {
  display: inline-block;
  font-weight: 400;
  color: #424040;
}
.breadcrumb_separator {
  margin: 0 9px;
  font-weight: 700;
  color: #c0c4cc;
}
.breadcrumb .is-last-link {
  color: #999;
}
.header-user-con > div {
  float: left;
  font-size: 14px;
}
.header-btn a {
  display: inline-block;
}
.header-btn i {
  font-size: 20px;
  padding: 10px;
  margin: 0;
}
.user-avator {
  width: 40px;
  height: 40px;
  margin: 10px 10px;
  display: inline-block;
  transform: translateY(14%);
}
.user-avator img {
  width: 100%;
  height: 100%;
  border-radius: 100%;
}
.user-name {
  cursor: pointer;
}
.user-name .el-dropdown-link {
  font-size: 12px;
}
.user-name .el-dropdown-link i {
  font-size: 20px;
  margin: 0;
  padding: 0;
  transform: translate(-2px, -2 px);
}
/* 表单行高 */
.header >>> .el-form-item__content {
  line-height: 70px !important;
}
</style>