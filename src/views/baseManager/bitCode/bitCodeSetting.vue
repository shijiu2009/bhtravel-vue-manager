<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" v-model="info" label-width="90px">
        <div class="form_item">
          <el-row>
            <el-col :span="3">
              <el-form-item label="app二维码(120*120)"></el-form-item>
            </el-col>
            <UploadFile @uploadValue="appValue" :uploadGroup="uploadGroupApp"></UploadFile>
          </el-row>
          <el-row>
            <el-col :span="3">
              <el-form-item label="小程序二维码(120*120)"></el-form-item>
            </el-col>
            <UploadFile @uploadValue="miniValue" :uploadGroup="uploadGroupMini"></UploadFile>
          </el-row>
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
import api from "@/api/bitCode.js";
import { mapMutations } from "vuex";
import quillConfig from "@/assets/js/quill-config.js";
import UploadFile from "@/components/uploadImage/uploadImage.vue";
import baseURL from "@/config/baseUrl.js";
export default {
  components: {
    UploadFile,
  },
  name: "bitCodeSetting",
  data() {
    return {
      info: {
        id: "",
        appCode: "",
        miniCode: "",
      },
      //图片上传组件信息
      uploadGroupTitle: {
        //文件列表
        fileList: [],
        limitCount: 1,
      },
      //提示信息
      tigs: {
        title: {
          isShow: false,
          content: "请输入名称，且名称长度不可大于20个字符",
        },
      },
      errorInfo: {
        title: {
          isErr: false,
          err: "名称不符合规范",
        },
      },
      options: {
        appOption: quillConfig,
        webOption: quillConfig,
      },
      //图片上传组件信息
      uploadGroupApp: {
        //文件列表
        fileList: [],
        limitCount: 1,
        autoUpload: true,
      },
      uploadGroupMini: {
        //文件列表
        fileList: [],
        limitCount: 1,
        autoUpload: true,
      },
      imgPaths: [],
    };
  },
  methods: {
    ...mapMutations({
      deleteTags: "DELETE_TAGSLIST",
    }),
    //信息校验
    infoChange: function () {
      let isCheck = true;
      //   if (this.info.name) {
      //     this.errorInfo.title.isErr = false;
      //   } else {
      //     this.errorInfo.title.isErr = true;
      //     isCheck = false;
      //   }
      return isCheck;
    },
    //添加路径
    appValue: function (data) {
      this.info.appCode = data.filePath;
    },
    miniValue: function (data) {
      this.info.miniCode = data.filePath;
    },
    //提交表单
    onSubmit: function () {
      let isCheck = this.infoChange();
      if (!isCheck) {
        return;
      }
      api
        .addOrEdit(this.info)
        .then((result) => {
          if (result.success) {
            this.$message.success("提交成功！");
            this.deleteTags(this.$route.fullPath); //关闭当前窗口
            //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
            this.$router.push({
              name: "index",
              params: { flow: true },
            });
          } else {
            if (this.info.id) {
              if(result.fielderrors){
                let errors = ''
                for(let i=0;i<result.fielderrors.length;i++){
                  let error = result.fielderrors[i].error
                  errors += error+'\n'
                }
                this.$message.error(errors);
              }
            } else {
              if(result.fielderrors){
                let errors = ''
                for(let i=0;i<result.fielderrors.length;i++){
                  let error = result.fielderrors[i].error
                  errors += error+'\n'
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
      api
        .detailed()
        .then((result) => {
          if (result.bitCode) {
            this.info = result.bitCode;
            this.uploadGroupApp.fileList.push({
              url: baseURL.releaseUrl + result.bitCode.appCode,
            });
            this.uploadGroupMini.fileList.push({
              url: baseURL.releaseUrl + result.bitCode.miniCode,
            });
          }
        })
        .catch(() => {
          this.$message.error("数据获取失败");
        });
    },
  },
  created() {},
  //keep-alive 生命周期，
  activated() {
    this.getAdvert();
  },
};
</script>