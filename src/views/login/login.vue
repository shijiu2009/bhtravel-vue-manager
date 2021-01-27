<template>
  <div class="login">
    <div class="login-box">
      <div class="login_top">
        <div class="logo">
          <img src="../../../static/images/login-left.png" alt />

        </div>
        <div class="min-logo">
          <img src="../../../static/images/login-logo.png" alt="" style="width:100%">
        </div>
      </div>
      <div class="login-right">
        <div class="login_form">
          <div class="login_icon">北海智慧旅游</div>
          <el-form
            ref="form"
            :model="userInfo"
            class="login_box"
            @keyup.enter.native="onSubmit"
          >
            <el-form-item>
              <el-input
                class="username"
                placeholder="请输入用户名"
                prefix-icon="el-icon-user-solid"
                v-model="userInfo.username"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="请输入密码"
                show-password
                class="password"
                prefix-icon="el-icon-key"
                v-model="userInfo.password"
              ></el-input>
            </el-form-item>
            <el-form-item class="code">
              <el-input
                v-model="userInfo.xcode"
                placeholder="请输入验证"
              ></el-input>
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
      </div>
    </div>
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
          console.log(result);
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
.login >>> .el-input__icon{
  display: flex;
  align-items: center;
  height: 100%;
}
.login-box {
  display: flex;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 1252px;
  height: 670px;
  background: #ffffff;
  box-shadow: 0px 35px 80px 0px rgba(55, 127, 177, 0.24);
  border-radius: 2px;
}
.login_top {
  position: relative;
  width: 519px;
  height: 100%;
  overflow: hidden;
}
.login-right {
  flex: 1;
  width: 200px;
}
.login_top .logo {
  width: 100%;
}
.login_top img {
  width: 100%;
}
.login_top .title {
  font-size: 40px;
  display: inline-block;
  transform: translateY(-35%);
  margin-left: 20px;
  color: #fff;
}
.min-logo{
  position: absolute;
  left: 47px;
  top: 39px;
  width: 146px;
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
  width: 100%;
  height: 100%;
  padding: 88px 140px 140px 120px;
  box-sizing: border-box;
  background-color: #fff;
}
.login_icon {
  text-align: center;
  margin-bottom: 32px;
  font-size: 56px;
  line-height: 1;
  font-family: SourceHanSansCN;
  font-weight: 800;
  color: #2984b8;
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
  margin-bottom: 31px;
}
/* .el-form-item.code .el-input {
  width: calc(100% - 128px);
} */
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
.username,
.password,
.code {
  font-size: 24px;
  font-family: SourceHanSansCN;
  font-weight: 400;
}
.code >>> .el-form-item__content {
  display: flex;
  align-items: center;
}
.username >>> .el-input__inner {
  width: 460px;
  height: 59px;

  border: 1px solid #a0a0a0;
  border-radius: 2px;
}
.username >>> .el-input__inner:hover {
  border: 1px solid #ccc;
}
.username >>> .el-input__inner:focus {
  border: 1px solid #1aa3dc;
  color: #1ba4dd;
}
.password >>> .el-input__inner {
  width: 460px;
  height: 59px;

  border: 1px solid #a0a0a0;
  border-radius: 2px;
}
.password >>> .el-input__inner:hover {
  border: 1px solid #ccc;
}
.password >>> .el-input__inner:focus {
  border: 1px solid #1aa3dc;
  color: #1ba4dd;
}
.code >>> .el-input {
  width: 270px;
  height: 59px;
  margin-right: 34px;
}
.code >>> .el-input__inner {
  width: 100%;
  height: 100%;
  border: 1px solid #a0a0a0;
  border-radius: 2px;
}
.code >>> .el-input__inner:hover {
  border: 1px solid #ccc;
}
.code >>> .el-input__inner:focus {
  border: 1px solid #1aa3dc;
  color: #1ba4dd;
}
.login-box .code {
  margin-bottom: 57px;
}
.onSubmit {
  width: 460px;
  height: 59px;
  font-size: 24px;
  font-family: SourceHanSansCN;
  font-weight: 400;
  color: #ffffff;
  background: linear-gradient(176deg, #43c9fb, #18a2db);
  box-shadow: 0px 10px 20px 0px rgba(33, 160, 197, 0.24);
  border-radius: 4px;
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