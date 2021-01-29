<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="90px">
        <div class="form_item">
          <el-form-item label="标题">
            <el-input v-model="info.title"></el-input>
          </el-form-item>
          <el-form-item label="作者">
            <el-input v-model="info.author"></el-input>
          </el-form-item>
          <el-form-item label="简介">
            <el-input v-model="info.summary"></el-input>
          </el-form-item>
          <el-form-item label="发布时间">
            <el-date-picker
              v-model="info.createTime"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
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
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-col :span="10">
                <el-form-item label="首页图片"></el-form-item>
              </el-col>
              <el-col :span="14">
                <UploadFile
                  @uploadValue="thumbValue"
                  ref="uploadGroupThumb"
                  :uploadGroup="uploadGroupThumb"
                ></UploadFile>
              </el-col>
            </el-col>
          </el-row>
          <el-form-item label="是否前端展现">
            <el-radio-group v-model="info.isShow">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="info.sort" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="浏览数">
            <el-input-number v-model="info.browseNum" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="文章内容(微信小程序、App)" :required="true">
            <vue-ueditor-wrap
              v-model="info.content"
              :config="myConfig"
            ></vue-ueditor-wrap>
          </el-form-item>
          <!-- <el-form-item label="文章内容(Web)" :required="true">
            <quill-editor
              ref="my2TextEditor"
              v-model="info.contentWeb"
              :options="options.infoWebOption"
            ></quill-editor>
          </el-form-item> -->
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
import api from "@/api/travelManager/knowCity.js";
import { mapMutations} from "vuex";
//富文本框
import VueUeditorWrap from "vue-ueditor-wrap";
import ueditor from "@/assets/js/ueditorConfig.js";
import UploadFile from "@/components/uploadImage/uploadImage.vue";
import baseURL from "@/config/baseUrl.js";
export default {
  components: {
    UploadFile,
    VueUeditorWrap,
  },
  name: "addOrEditAtlas",
  data() {
    return {
      info: {
        id: "",
        title: "",
        createTime: "",
        author: "",
        titleimgurl: "",
        indexImg: "",
        content: "",
        contentWeb: "",
        sort: 0,
        browseNum: 0,
        isShow: 0,
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
      this.info.indexImg = data.filePath;
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
              name: "knowCityList",
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
        api.detailed({ id: this.$route.params.id }).then((result) => {
          this.info = result.knowCity;
          this.uploadGroupTitle.fileList = [];
          this.uploadGroupThumb.fileList = [];
          if (result.knowCity.titleimgurl != null && result.knowCity.titleimgurl != "") {
            this.uploadGroupTitle.fileList.push({
              url: baseURL.releaseUrl + result.knowCity.titleimgurl,
            });
          }
          if (result.knowCity.indexImg != null && result.knowCity.indexImg != "") {
            this.uploadGroupThumb.fileList.push({
              url: baseURL.releaseUrl + result.knowCity.indexImg,
            });
          }
        });
        // .catch(() => {
        //   this.$message.error("数据获取失败");
        // });
      } else {
        //重置参数
        Object.keys(this.info).map((key) => (this.info[key] = ""));
        this.info = {
          id: "",
          title: "",
          createTime: "",
          author: "",
          titleimgurl: "",
          indexImg: "",
          content: "",
          contentWeb: "",
          sort: 0,
          browseNum: 0,
          isShow: 0,
        };
      }
      // api.getClassList().then((result) => {
      //   if (result.rows && result.rows.length > 0) {
      //     for (let i = 0; i < result.rows.length; i++) {
      //       let obj = result.rows[i];
      //       let classes = {
      //         value: obj.id,
      //         label: obj.name,
      //       };
      //       this.classes.push(classes);
      //     }
      //   }
      // });
    },
  },
  created() {},
  //keep-alive 生命周期，
  activated() {
    this.getAdvert();
  },
};
</script>
