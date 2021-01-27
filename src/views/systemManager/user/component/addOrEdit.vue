<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="120px">
        <div class="form_item">
          <el-form-item
            label="登录名称"
            :required="true"
            v-finger-tips="{ content: '登录时使用的名称' }"
          >
            <el-input
              v-model="info.username"
              ref="el_input_title"
              maxlength="20"
              minlength="1"
            >
            </el-input>
          </el-form-item>

          <el-form-item
            v-if="condition"
            label="登录密码"
            :required="true"
            v-finger-tips="{ content: '登录时使用的密码' }"
          >
            <el-input
              v-if="condition"
              v-model="info.password"
              show-password
              ref="el_input_title"
              maxlength="20"
              minlength="1"
            >
            </el-input>
          </el-form-item>

          <el-form-item
            label="账号中文名称"
            :required="true"
            v-finger-tips="{ content: '平时显示的名称' }"
          >
            <el-input
              v-model="info.realname"
              ref="el_input_title"
              maxlength="100"
              minlength="1"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="头像">
            <UploadFile
              @uploadValue="avatarValue"
              ref="uploadGroupAvatar"
              :uploadGroup="uploadGroupAvatar"
            ></UploadFile>
          </el-form-item>

          <el-form-item label="账号状态" style="width: 50%">
            <el-select v-model="info.state" placeholder="请选择">
              <el-option
                v-for="item in states"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="所属组织" v-finger-tips="{ content: '节点的上级' }">
            <el-input
              type="readonly"
              v-model="byName"
              readonly
              ref="readonly"
              @focus="openDrawer"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="联系电话"
            :required="true"
            v-finger-tips="{ content: '用户联系电话' }"
          >
            <el-input
              v-model="info.mobile"
              ref="el_input_title"
              maxlength="20"
              minlength="1"
            >
            </el-input>
          </el-form-item>

          <el-form-item
            label="电子邮箱"
            :required="true"
            v-finger-tips="{ content: '用户电子邮箱' }"
          >
            <el-input
              v-model="info.email"
              ref="el_input_title"
              maxlength="20"
              minlength="1"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="所属角色" style="width: 50%">
            <el-select v-model="rids" placeholder="请选择">
              <el-option
                v-for="item in ridses"
                :key="item.rid"
                :label="item.rname"
                :value="item.rid"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">表单提交</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <byBrawer ref="byBrawer"></byBrawer>
  </div>
</template>
<script>
import byBrawer from "./byBrawer";
import api from "@/api/systemManager/user.js";
import orgApi from "@/api/systemManager/org.js";
import roleApi from "@/api/systemManager/role.js";
import { mapMutations } from "vuex";
import UploadFile from "@/components/uploadImage/uploadImage.vue";
import baseURL from "@/config/baseUrl.js";
export default {
  components: {
    byBrawer,
    UploadFile,
  },
  data() {
    return {
      info: {
        id: "",
        username: "",
        realname: "",
        avatar: "",
        password: "",
        orgId: "",
        mobile: "",
        email: "",
        roleIds: [],
      },
      //图片上传组件信息
      uploadGroupAvatar: {
        //文件列表
        fileList: [],
        limitCount: 1,
        autoUpload: true,
      },
      states: [
        {
          value: 0,
          label: "正常",
        },

        {
          value: 1,
          label: "锁定",
        },
        {
          value: 2,
          label: "已注销",
        },
      ],
      rids: 0,
      ridses: [],
      byName: "",
      condition: true,
    };
  },
  methods: {
    ...mapMutations({
      deleteTags: "DELETE_TAGSLIST",
    }),
    //添加路径
    avatarValue: function (data) {
      this.info.avatar = data.filePath;
    },
    //打开抽屉
    openDrawer() {
      this.$refs.byBrawer.openDrawer(); //打开抽屉
      this.$refs.readonly.blur(); //失去焦点
    },
    //提交表单
    onSubmit: function () {
      this.info.roleIds = [];
      this.info.roleIds = this.rids;
      let path = "/api/manager/user/add";
      if (this.info.id != "" && this.info.id != null) {
        path = "/api/manager/user/edit";
      }
      this.$global
        .addOrEdit({
          path: path,
          data: this.info,
        })
        .then(() => {
          this.deleteTags(this.$route.fullPath); //删除当前的tags
          // //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
          this.$router.push({
            name: "user_list",
            params: {
              flow: true,
            },
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    //返回
    close: function () {
      this.$router.go(-1);
    },
    // 获取父级
    getByOrg(byid) {
      if (byid) {
        orgApi
          .getDetail({ orgId: byid })
          .then((result) => {
            if (result.status && result.data) {
              this.info.byOrg = result.data.orgId;
              this.byName = result.data.orgName + "----" + result.data.orgId;
            }
          })
          .catch(() => {
            this.$message.error("父级权限查询失败");
          });
      }
    },
    //获取信息
    getDetail() {
      if (this.$route.params && this.$route.params.id) {
        api
          .getDetail({ uid: this.$route.params.id })
          .then((result) => {
            if (result.status && result.data) {
              this.condition = false;
              this.info = result.data;
              //合并两个数组
              this.rids = result.data.roleIds[0];
              if (this.info.orgId) {
                this.getByOrg(this.info.orgId);
              }
              if (this.info.avatar != null && this.info.avatar != "") {
                this.uploadGroupAvatar.fileList.push({
                  url: baseURL.releaseUrl + this.info.avatar,
                });
              }
            } else {
              this.$message.error("权限数据查询失败");
            }
            this.getByOrg(result.data.orgId);
          })
          .catch(() => {
            this.$message.error("权限数据查询失败");
          });
      }
      roleApi
        .getAll()
        .then((result) => {
          if (result.status && result.data) {
            this.ridses = result.data;
          } else {
            this.$message.error("角色数据查询失败");
          }
        })
        .catch(() => {
          this.$message.error("角色数据查询失败");
        });
    },
    //抽屉提交过来的事件
    getByDrawer(data) {
      this.info.orgId = data.orgId;
      this.byName = data.pname;
    },
  },
  created() {
    this.getDetail();
  },
  activated() {
    if (this.$route.params && this.$route.params.flow) {
      //重新获取页面数据，
      this.getDetail();
    }
  },
};
</script>
<style scoped>
.form-box .el-form-item {
  max-width: 600px;
}
.drawer_btn {
  padding: 0 20px;
}
.confirmBtn {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
