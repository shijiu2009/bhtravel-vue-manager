<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="90px">
        <div class="form_item">
          <el-form-item label="名称">
            <el-input v-model="info.name" @change="infoChange"></el-input>
            <el-tooltip
              :content="tigs.title.content"
              placement="bottom"
              effect="light"
              class="input_tips"
            >
              <i class="input_tips">?</i>
            </el-tooltip>
            <!-- <el-alert
              :title="errorInfo.title.err"
              v-show="errorInfo.title.isErr"
              type="error"
              :closable="false"
              show-icon
            ></el-alert> -->
          </el-form-item>

          <el-form-item label="封面图片">
            <UploadFile
              @uploadValue="titleValue"
              ref="uploadGroupTitle"
              :uploadGroup="uploadGroupTitle"
            ></UploadFile>
          </el-form-item>

          <el-form-item label="排序">
            <el-input-number v-model="info.sort" :min="0"></el-input-number>
          </el-form-item>
          <el-row>
            <el-col :span="3">
              <el-form-item label="视频"></el-form-item>
            </el-col>
            <UploadFileVideo
              @uploadValue="uploadValue"
              :uploadGroup="uploadGroup"
            ></UploadFileVideo>
          </el-row>
          <el-form-item label="是否展示">
            <el-radio-group v-model="info.auditing">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
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
import api from "@/api/video.js";
import { mapMutations } from "vuex";
import UploadFileVideo from "@/components/uploadVideo/uploadVideo.vue";
import UploadFile from "@/components/uploadImage/uploadImage.vue";
import baseURL from "@/config/baseUrl.js";
export default {
  name: "addOrEditVideo",
  components: {
    UploadFile,
    UploadFileVideo,
  },
  data() {
    return {
      info: {
        id: "",
        name: "",
        auditing: 0,
        isShow: 1,
        sort: "",
        url: "",
        titleImg: "",
      },
      //視頻上传组件信息
      uploadGroup: {
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
      options: {},
      imgPaths: [],
      uploadGroupTitle: {
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
    //信息校验
    infoChange: function () {
      let isCheck = true;
      if (this.info.name) {
        this.errorInfo.title.isErr = false;
      } else {
        this.errorInfo.title.isErr = true;
        isCheck = false;
      }
      return isCheck;
    },
    //添加路径
    titleValue: function (data) {
      this.info.titleImg = data.filePath;
    },
    //添加路径
    uploadValue: function (data) {
      this.info.url = data.filePath;
    },
    //提交表单
    onSubmit: function () {
      // let isCheck = this.infoChange();
      // if (!isCheck) {
      //   return;
      // }
      api
        .addOrEdit(this.info)
        .then((result) => {
          if (result.success) {
            this.$message.success("提交成功！");
            this.deleteTags(this.$route.fullPath); //关闭当前窗口
            //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
            this.$router.push({ name: "videoList", params: { flow: true } });
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
    getShow: function () {
      if (this.$route.params && this.$route.params.Id) {
        api
          .detailed({ id: this.$route.params.Id })
          .then((result) => {
            this.uploadGroupTitle.fileList = [];
            let file = result.video.url;
            let fileName = file.substring(file.lastIndexOf("/") + 1);
            this.info = result.video;
            this.uploadGroup.fileList = [
              {
                name: fileName,
                url: result.video.url,
              },
            ];
            if (result.video.titleImg != null && result.video.titleImg != "") {
              this.uploadGroupTitle.fileList.push({
                url: baseURL.releaseUrl + result.video.titleImg,
              });
            }
          })
          .catch(() => {
            this.$message.error("数据获取失败");
          });
      } else if (this.$route.params && this.$route.params.flow) {
        //重置参数
        this.info = {
          id: "",
          name: "",
          isShow: 1,
          sort: "",
          url: "",
        };
      }
    },
  },
  created() {},
  //keep-alive 生命周期，
  activated() {
    this.getShow();
  },
};
</script>
