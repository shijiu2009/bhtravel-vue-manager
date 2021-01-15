<template>
  <div class="login">
    <div>
      <div class="login_top">
        <div class="logo">
          <img src="@/assets/images/logo.png" alt />
        </div>
        <h3 class="title">深圳市大也智能数据有限公司</h3>
      </div>
    </div>
    <div class="login_form">
      <div class="login_icon">
        <i class="el-icon-user"></i>
      </div>
      <el-form ref="form" :model="userInfo" class="login_box" @keyup.enter.native="onSubmit">
        <el-form-item>
          <el-input placeholder="请输入用户名" prefix-icon="el-icon-user-solid" v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="请输入密码" show-password prefix-icon="el-icon-key" v-model="userInfo.password"></el-input>
        </el-form-item>
        <el-form-item class="code">
          <el-input v-model="userInfo.xcode" placeholder="请输入验证"></el-input>
          <div class="code_img" @click="updateCodeImg">
            <img :src="codeImg" alt />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="onSubmit" @click="onSubmit">
            <span>登录</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bot-copy">Copyright © 2020.大也科技 All rights reserved.</div>
    <div class="cloth">
      <img :src="clothUrl" alt />
    </div>
  </div>
</template>
<script>
import loginApi from "@/api/login.js";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      clothUrl: require("../../../static/images/login_bg.jpg"),
      userInfo: {
        username: "chen",
        password: "123456",
        xcode: "",
      },
      codeImg: "",
    };
  },
  computed: {
    ...mapState({
      setToken: "setUserToken",
    }),
  },
  methods: {
    ...mapMutations({
      updateRolePurview: "UPDATE_ROLE_Purview",
    }),
    ...mapActions({
      login: "Login",
    }),
    //判断是否输入用户名，密码，验证码
    openMsg: function (content) {
      this.$confirm(content, "提示", {
        confirmButtonText: "关闭",
        showCancelButton: false,
        type: "warning",
      })
        .then(() => {})
        .catch(() => {});
    },
    //点击切换验证码
    updateCodeImg: function () {
      this.userInfo.xcode = "";
      loginApi
        .getCodeImg()
        .then((result) => {
          if (result.status) {
            this.codeImg = result.data.img;
            this.userInfo.uid = result.data.uid;
          } else {
            this.$message.error("获取验证码失败！请联系管理员");
          }
        })
        .catch(() => {
          this.$message.error("获取验证码失败！请联系管理员");
        });
    },
    //登录
    onSubmit: function () {
      if (!this.userInfo.username) {
        this.openMsg("请输入用户名");
        return;
      } else if (!this.userInfo.password) {
        this.openMsg("请输入密码");
        return;
      } else if (!this.userInfo.xcode) {
        this.openMsg("请输入验证码");
        return;
      }
      this.$loading.show(); // 显示loading
      this.login(this.userInfo)
        .then((result) => {
          console.log(result)
          //清空密码和重新生成状态码
          this.userInfo.password = "";
          this.updateCodeImg();
          this.$loading.hide(); // 关闭loading
          this.$router.push({ path: "/" });
        })
        .catch((err) => {
          //清空密码和重新生成状态码
          this.userInfo.password = "";
          this.updateCodeImg();
          this.$message.error(err.msg);
          this.$loading.hide(); // 关闭loading
        });
    },
  },
  created() {
    this.updateCodeImg();
  },
};
</script>
<style scoped>
.login {
  width: 100%;
  height: 100%;
  position: relative;
}
.login_top {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 90px;
  width: 100%;
  line-height: 90px;
  text-align: center;
}
.login_top .logo {
  display: inline-block;
  height: 100%;
}
.login_top img {
  height: 100%;
  float: left;
}
.login_top .title {
  font-size: 40px;
  display: inline-block;
  transform: translateY(-35%);
  margin-left: 20px;
  color: #fff;
}
.cloth {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}
.cloth img {
  display: inline-block;
  width: 100%;
  height: 100%;
}
.login_form {
  position: absolute;
  top: 54%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 340px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  display: inline-block;
  border: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  vertical-align: middle;
  background-color: #fff;
  border-radius: 4px;
}
.login_icon {
  margin-top: 20px;
  text-align: center;
}
.login_icon i {
  font-size: 50px;
  color: #3bb6d2;
}
.login_box {
  padding: 20px 30px;
  box-sizing: border-box;
}
.login_box .el-form-item {
  margin-bottom: 20px;
}
.el-form-item.code .el-input {
  width: calc(100% - 128px);
}
.el-form-item.code .code_img {
  width: 108px;
  height: 40px;
  float: right;
  font-size: 0;
}
.el-form-item.code .code_img img {
  display: inline-block;
  height: 100%;
  width: 100%;
}
.onSubmit {
  background: #3bb6d2;
  width: 100%;
  color: #fff;
  box-sizing: border-box;
  border: 2px solid #3bb6d2;
}
.onSubmit span {
  font-size: 16px !important;
  letter-spacing: 6px;
  font-weight: bold;
}
.onSubmit:hover {
  background: #fff;
}
.onSubmit:hover.onSubmit span {
  color: #3bb6d2;
}
.bot-copy {
  position: fixed;
  bottom: 20px;
  width: 100%;
  font-size: 16px;
  color: #fff;
  text-align: center;
  min-width: 800px;
}
</style>