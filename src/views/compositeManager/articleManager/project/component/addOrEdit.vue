<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="98px">
        <div class="form_item">
          <el-form-item label="名称" :required="true">
            <el-input
              v-model="info.title"
              @change="infoChange"
              ref="el_input_title"
              maxlength="20"
              minlength="1"
            ></el-input>

            <!-- <el-tooltip
              :content="tigs.title.content"
              placement="bottom"
              effect="light"
              class="input_tips"
            >
              <i class="input_tips">?</i>
            </el-tooltip> -->

            <!-- <el-alert
              :title="tigs.title.content"
              v-show="tigs.title.isShow"
              type="error"
              :closable="false"
              show-icon
            ></el-alert> -->
          </el-form-item>

          <el-form-item label="作者">
            <el-input v-model="info.author" style="max-width: 400px"></el-input>
          </el-form-item>

          <el-row>
            <el-col :span="8">
              <el-col :span="10">
                <el-form-item label="封面图片"></el-form-item>
              </el-col>
              <el-col :span="14">
                <UploadFile
                  @uploadValue="titleValue"
                  ref="uploadGroupTitle"
                  :uploadGroup="uploadGroupTitle"
                ></UploadFile>
              </el-col>
            </el-col>
            <!-- <el-col :span="8">
              <el-col :span="10">
                <el-form-item label="缩略图图片"></el-form-item>
              </el-col>
              <el-col :span="14">
                <UploadFile
                  @uploadValue="thumbValue"
                  ref="uploadGroupThumb"
                  :uploadGroup="uploadGroupThumb"
                ></UploadFile>
              </el-col>
            </el-col> -->
          </el-row>

          <!-- <el-form-item label="活动时间">
            <el-date-picker
              v-model="info.createTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="排序" :required="true">
            <el-input-number v-model="info.sort" :min="0"></el-input-number>
          </el-form-item> -->
        </div>
        <!-- pc端内容富文本框 -->
        <!-- <el-form-item label="pc端内容" :required="true">
          <quill-editor
            ref="mypTextEditor"
            v-model="info.pcContent"
            :options="options.pcEditorOption"
          ></quill-editor>
        </el-form-item> -->
        <!-- 移动端内容富文本框 -->
        <el-form-item label="移动端内容" :required="true">
          <vue-ueditor-wrap v-model="info.content" :config="myConfig"></vue-ueditor-wrap>
        </el-form-item>
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
import activityApi from "@/api/project.js";
import { mapMutations } from "vuex";
//富文本框
import VueUeditorWrap from "vue-ueditor-wrap";
import ueditor from "@/assets/js/ueditorConfig.js";
import UploadFile from "@/components/uploadImage/uploadImage.vue";
import baseURL from "@/config/baseUrl.js";
export default {
  name: "addOrEditProject",
  components: {
    UploadFile,
    VueUeditorWrap,
  },
  data() {
    return {
      info: {
        id: "",
        title: "",
        sort: 0,
        pcContent: "", //PC端内容
        mobileContent: "", //移动端图文内容
      },
      myConfig: ueditor.myConfig,
      //提示信息
      tigs: {
        title: {
          isShow: false,
          content: "请输入标题，且标题长度不可大于20个字符",
        },
      },
      //图片上传组件信息
      uploadGroupTitle: {
        //文件列表
        fileList: [],
        limitCount: 1,
        autoUpload: true,
      },
      uploadGroupThumb: {
        //文件列表
        fileList: [],
        limitCount: 1,
        autoUpload: true,
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
    };
  },
  methods: {
    ...mapMutations({
      deleteTags: "DELETE_TAGSLIST",
    }),
    //添加路径
    titleValue: function (data) {
      this.info.titleimgurl = data.filePath;
    },
    thumbValue: function (data) {
      this.info.thumbImg = data.filePath;
    },
    //信息校验
    infoChange: function () {
      let isCheck = true;
      if (this.info.title) {
        this.tigs.title.isShow = false;
      } else {
        this.tigs.title.isShow = true;
        isCheck = false;
      }
      return isCheck;
    },
    //提交表单
    onSubmit: function () {
      // let isCheck = this.infoChange();
      // if (!isCheck) {
      //   return;
      // }
      activityApi
        .addOrEditActivity(this.info)
        .then((result) => {
          if (result.success) {
            this.$message.success("提交成功！");
            this.deleteTags(this.$route.fullPath); //删除当前的tags
            //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
            this.$router.push({ name: "projectList", params: { flow: true } });
          } else {
            if (this.info.id) {
              this.$message.error("数据更新失败");
            } else {
              this.$message.error("数据添加失败");
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
      //判断是否传ID过来
      if (this.$route.params && this.$route.params.id) {
        //获取详情
        activityApi
          .detailedActivity({ id: this.$route.params.id })
          .then((result) => {
            this.uploadGroupTitle.fileList = [];
            this.uploadGroupThumb.fileList = [];
            this.info = JSON.parse(JSON.stringify(result.travelProject));
            if (result.travelProject.titleimgurl != null && result.travelProject.titleimgurl != "") {
              this.uploadGroupTitle.fileList.push({
                url: baseURL.releaseUrl + result.travelProject.titleimgurl,
              });
            }
            // if (result.activity.thumbImg != null && result.activity.thumbImg != "") {
            //   this.uploadGroupThumb.fileList.push({
            //     url: baseURL.releaseUrl + result.activity.thumbImg,
            //   });
            // }
          })
          // .catch(() => {
          //   this.$message.error("数据获取失败");
          // });
      } else {
        //重置参数
        Object.keys(this.info).map((key) => (this.info[key] = ""));
        this.uploadGroupTitle.fileList = [];
        this.uploadGroupThumb.fileList = [];
        this.info = {
          id: "",
          title: "",
          sort: 0,
          pcContent: "", //PC端内容
          mobileContent: "", //移动端图文内容
        };
      }
    },
  },
  //keep-alive 生命周期，
  activated() {
    //重新获取页面数据，
    this.getAdvert();
  },
};
</script>
