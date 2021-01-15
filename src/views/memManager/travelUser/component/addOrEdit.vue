<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="90px">
        <div class="form_item">
          <el-form-item label="用户名称">
            <el-input v-model="info.username"></el-input>
          </el-form-item>

          <el-form-item label="电话">
            <el-input v-model="info.mobile"></el-input>
          </el-form-item>

          <el-form-item label="openid">
            <el-input v-model="info.openid"></el-input>
          </el-form-item>

          <el-form-item label="miniOpenid">
            <el-input v-model="info.miniOpenid"></el-input>
          </el-form-item>

          <el-form-item label="昵称">
            <el-input v-model="info.nickname"></el-input>
          </el-form-item>

          <el-form-item label="头像">
            <UploadFile
              @uploadValue="avatarValue"
              ref="uploadGroupAvatar"
              :uploadGroup="uploadGroupAvatar"
            ></UploadFile>
          </el-form-item>
        </div>
        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">表单提交</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import api from "@/api/memberManager/travelUser.js";
import { mapMutations } from "vuex";
import UploadFile from "@/components/uploadImage/uploadImage.vue";
import baseURL from "@/config/baseUrl.js";
export default {
  components: {
    UploadFile,
  },
  name: "addOrEditTravelUser",
  data() {
    return {
      info: {
        id: "",
        username: "",
        phone: "",
        openid: "",
        miniOpenid: "",
        nickname: "",
        headImg: "",
      },
      //图片上传组件信息
      uploadGroupAvatar: {
        //文件列表
        fileList: [],
        limitCount: 1,
        autoUpload: true,
      },
    };
  },
  methods: {
    ...mapMutations({
      deleteTags: "DELETE_TAGSLIST",
    }),
    //添加路径
    avatarValue: function (data) {
      this.info.headImg = data.filePath;
    },
    //提交表单
    onSubmit: function () {
      api
        .addOrEdit(this.info)
        .then((result) => {
          if (result.success) {
            this.$message.success("提交成功！");
            this.deleteTags(this.$route.fullPath); //关闭当前窗口
            //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
            this.$router.push({
              name: "travelUserList",
              params: { flow: true },
            });
          } else {
            if (this.info.id) {
              if (result.fielderrors) {
                let errors = "";
                for (let i = 0; i < result.fielderrors.length; i++) {
                  let error = result.fielderrors[i].error;
                  errors += error + "\n";
                }
                this.$message.error(errors);
              }
            } else {
              if (result.fielderrors) {
                let errors = "";
                for (let i = 0; i < result.fielderrors.length; i++) {
                  let error = result.fielderrors[i].error;
                  errors += error + "\n";
                }
                this.$message.error(errors);
              }
            }
          }
        })
        .catch(() => {
          if (this.info.id) {
            this.$message.error("数据更新失败");
          } else {
            this.$message.error("数据添加失败");
          }
        });
    },
    //取消按钮事件
    close: function () {
      this.$router.go(-1);
    },
    //获取详情信息
    getAdvert: function () {
      if (this.$route.params && this.$route.params.id) {
        api
          .detailed({ id: this.$route.params.id })
          .then((result) => {
            this.uploadGroupAvatar.fileList = [];
            this.info = result.travelUser;
            if (this.info.headImg != null && this.info.headImg != "") {
              this.uploadGroupAvatar.fileList.push({
                url: baseURL.releaseUrl + this.info.headImg,
              });
            }
          })
          .catch(() => {
            this.$message.error("数据获取失败");
          });
      }
    },
  },
  created() {},
  //keep-alive 生命周期，
  activated() {
    this.getAdvert();
  },
};
</script>
