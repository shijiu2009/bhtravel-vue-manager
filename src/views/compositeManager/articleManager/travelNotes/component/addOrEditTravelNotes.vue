<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="auto">
        <div class="form_item">
          <el-form-item label="游记攻略分类">
            <el-radio-group v-model="info.oid">
              <el-radio :label="1">游记</el-radio>
              <el-radio :label="2">攻略</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="浏览数">
            <el-input-number v-model="info.views" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="游记攻略标题">
            <el-input v-model="info.name"></el-input>
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
          <!-- <el-form-item label="是否为红色兴安文章">
            <el-radio-group v-model="info.special">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="文章内容(微信、App)" :required="true">
            <vue-ueditor-wrap
              v-model="info.content"
              :config="myConfig"
            ></vue-ueditor-wrap>
          </el-form-item>
          <!-- <el-form-item label="文章内容(Web)" :required="true">
            <quill-editor
              ref="myTextEditor"
              v-model="info.contentWeb"
              :options="options.webOption"
            ></quill-editor>
          </el-form-item> -->
          <el-form-item label="作者">
            <el-input v-model="info.author" @change="infoChange"></el-input>
          </el-form-item>
          <el-form-item label="游记攻略标题图片(1600*900)">
            <UploadFile
              @uploadValue="titleValue"
              :uploadGroup="uploadGroupTitle"
            ></UploadFile>
          </el-form-item>

          <el-form-item label="游记攻略缩略图片(900*506)">
            <UploadFile
              @uploadValue="thumbValue"
              :uploadGroup="uploadGroupThumb"
            ></UploadFile>
          </el-form-item>

          <el-form-item label="游记攻略首页图片(250*167)">
            <UploadFile
              @uploadValue="indexValue"
              :uploadGroup="uploadGroupIndex"
            ></UploadFile>
          </el-form-item>
          <el-form-item label="用户头像">
            <UploadFile
              @uploadValue="headImgValue"
              :uploadGroup="uploadGroupHeadImg"
            ></UploadFile>
          </el-form-item>
          <el-form-item label="是否展示">
            <el-radio-group v-model="info.isShow">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否首页展示">
            <el-radio-group v-model="info.isShowIndex">
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
import api from "@/api/travelNotes.js";
import { mapMutations} from "vuex";
//富文本框
import VueUeditorWrap from "vue-ueditor-wrap";
import ueditor from "@/assets/js/ueditorConfig.js";
import UploadFile from "@/components/uploadImage/uploadImage.vue";
import baseURL from "@/config/baseUrl.js";
export default {
  components: {
    VueUeditorWrap,
    UploadFile,
  },
  name: "addOrEditAtlas",
  data() {
    return {
      info: {
        id: "",
        name: "",
        isShow: 1,
        isShowIndex: 0,
        author: "",
        adventure: "",
        titleimgurl: "",
        thumbPath: "",
        indeximgurl: "",
        headImg: "",
        oid: 1,
        special: 0,
        views: 0,
      },
      myConfig: ueditor.myConfig,
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
      uploadGroupIndex: {
        //文件列表
        fileList: [],
        limitCount: 1,
        autoUpload: true,
      },
      uploadGroupHeadImg: {
        //文件列表
        fileList: [],
        limitCount: 1,
        autoUpload: true,
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
      this.info.titleimgurl = data.filePath;
    },
    thumbValue: function (data) {
      this.info.thumbPath = data.filePath;
    },
    indexValue: function (data) {
      this.info.indeximgurl = data.filePath;
    },
    headImgValue: function (data) {
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
              name: "travelNotesList",
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
      if (this.$route.params && this.$route.params.Id) {
        api
          .detailed({ id: this.$route.params.Id })
          .then((result) => {
            this.info = result.travelNotes;
            this.uploadGroupTitle.fileList = [];
            this.uploadGroupThumb.fileList = [];
            this.uploadGroupIndex.fileList = [];
            this.uploadGroupHeadImg.fileList = [];
            this.uploadGroupTitle.fileList.push({
              url: baseURL.releaseUrl + result.travelNotes.titleimgurl,
            });
            this.uploadGroupThumb.fileList.push({
              url: baseURL.releaseUrl + result.travelNotes.thumbPath,
            });
            this.uploadGroupIndex.fileList.push({
              url: baseURL.releaseUrl + result.travelNotes.indeximgurl,
            });
            this.uploadGroupHeadImg.fileList.push({
              url: baseURL.releaseUrl + result.travelNotes.headImg,
            });
          })
          .catch(() => {
            this.$message.error("数据获取失败");
          });
      } else {
        //重置参数
        Object.keys(this.info).map((key) => (this.info[key] = ""));
        this.info = {
          id: "",
          name: "",
          isShow: 1,
          isShowIndex: 0,
          author: "",
          adventure: "",
          titleimgurl: "",
          thumbPath: "",
          indeximgurl: "",
          headImg: "",
          oid: 1,
          special: 0,
          views: 0,
        };
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
