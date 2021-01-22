<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="attractionsPointInfo" label-width="auto">
        <div class="form_item">
          <el-form-item label="标题" style="width: 400px">
            <el-input
              v-model="attractionsPointInfo.title"
              @change="infoChange"
            ></el-input>
            <el-tooltip
              :content="tigs.title.content"
              placement="bottom"
              effect="light"
              class="input_tips"
            >
              <i class="input_tips">?</i>
            </el-tooltip>
            <el-alert
              :title="errorInfo.title.err"
              v-show="errorInfo.title.isErr"
              type="error"
              :closable="false"
              show-icon
            ></el-alert>
          </el-form-item>
          <el-form-item label="所属景点">
            <el-tag>{{ currentRowName }}</el-tag>
            <el-button type="success" @click="addAttractions">添加</el-button>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number
              v-model="attractionsPointInfo.sort"
              :min="0"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="标题图片">
            <uploadFile
              @uploadValue="uploadValue"
              ref="uploadGroup"
              :uploadGroup="uploadGroup"
            ></uploadFile>
          </el-form-item>
          <el-form-item label="是否展示">
            <el-radio-group v-model="attractionsPointInfo.recommend">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="视频">
            <UploadFileVideo
              @uploadValue="uploadVideo"
              :uploadGroup="uploadGroupVideo"
            ></UploadFileVideo>
          </el-form-item>
          <el-form-item label="导游点介绍" :required="true">
            <vue-ueditor-wrap
              v-model="attractionsPointInfo.info"
              :config="myConfig"
            ></vue-ueditor-wrap>
          </el-form-item>
          <el-form-item label="是否上传音频文件">
            <el-radio-group
              v-model="attractionsPointInfo.isUpfile"
              @change="selectUpFile"
            >
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="音频文本" :required="true" v-show="isShow">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="attractionsPointInfo.vioceText"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="生成音频文件" v-show="isShow">
            <el-button type="success" @click="generate">生成</el-button>
            <template>
              <ul
                class="infinite-list"
                v-infinite-scroll="load"
                style="overflow: auto"
              >
                <li class="infinite-list-item">
                  {{ attractionsPointInfo.audioUrl }}
                </li>
              </ul>
            </template>
          </el-form-item>
          <el-form-item label="音频" v-show="isAudioShow">
            <UploadFileVideo
              @uploadValue="uploadAudio"
              :uploadGroup="uploadGroupAudio"
            ></UploadFileVideo>
          </el-form-item>
        </div>
        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">表单提交</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>

      <!-- <template> -->
      <el-dialog title="关联景点" :visible.sync="dialogTableAttractions">
        <el-table
          ref="attractionsTable"
          :data="attractions"
          highlight-current-row
          @current-change="handleCurrentChange"
          style="width: 100%"
        >
          <el-table-column property="id" label="id" width="100">
          </el-table-column>
          <el-table-column property="name" label="名称" width="100">
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-button type="primary" @click="confirmAttractions">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import attractionsPointApi from "@/api/attractionsPoint.js";
import attractionsApi from "@/api/reserveManager/attractions.js";
import { mapMutations } from "vuex";
import uploadFile from "@/components/uploadImage/uploadImage.vue";
//富文本框
import VueUeditorWrap from "vue-ueditor-wrap";
import ueditor from "@/assets/js/ueditorConfig.js";
import UploadFileVideo from "@/components/uploadVideo/uploadVideo.vue";
import baseURL from "@/config/baseUrl.js";
export default {
  name: "addOrEditAttractionsPoint",
  components: {
    uploadFile,
    VueUeditorWrap,
    UploadFileVideo,
  },
  data() {
    return {
      attractionsPointInfo: {
        id: "",
        title: "",
        recommend: 1,
        titleImgurl: "",
        attractionsId: 0,
        sort: "",
        info: "",
        isUpfile: 1,
        vioceText: "",
        videoUrl: "",
        audioUrl: "",
        autoUpload: true,
      },
      myConfig: ueditor.myConfig,
      //图片上传组件信息
      uploadGroup: {
        //文件列表
        fileList: [],
        limitCount: 1,
        autoUpload: true,
      },
      //視頻上传组件信息
      uploadGroupVideo: {
        //文件列表
        fileList: [],
        limitCount: 1,
      },
      //音頻上传组件信息
      uploadGroupAudio: {
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
      imgPaths: [],
      total: 0,
      attractions: [],
      selectAttractions: [],
      isShow: false,
      isAudioShow: true,
      //对话框
      dialogTableAttractions: false,
      currentRowId: null,
      currentRowName: "未选定",
    };
  },
  methods: {
    ...mapMutations({
      deleteTags: "DELETE_TAGSLIST",
    }),
    //信息校验
    infoChange: function () {
      // let isCheck = true;
      // if (this.attractionsPointInfo.name) {
      //   this.errorInfo.title.isErr = false;
      // } else {
      //   this.errorInfo.title.isErr = true;
      //   isCheck = false;
      // }
      // return isCheck;
    },
    selectUpFile: function () {
      if (this.attractionsPointInfo.isUpfile == 1) {
        this.isShow = false;
        this.isAudioShow = true;
        this.attractionsPointInfo.audioUrl = "";
      } else if (this.attractionsPointInfo.isUpfile == 0) {
        this.isShow = true;
        this.isAudioShow = false;
        this.attractionsPointInfo.audioUrl = "";
      }
    },
    generate: function () {
      if (this.attractionsPointInfo.vioceText == "") {
        this.$message.error("请确保音频文本不为空！");
      } else {
        attractionsPointApi
          .generate({ text: this.attractionsPointInfo.vioceText })
          .then((result) => {
            this.attractionsPointInfo.audioUrl = result.path;
          })
          .catch((result) => {
            this.$message.error(result.msg);
          });
      }
    },
    //添加图片路径
    uploadValue: function (data) {
      this.attractionsPointInfo.titleImgurl = data.filePath;
    },
    //添加视频路径
    uploadVideo: function (data) {
      this.attractionsPointInfo.videoUrl = data.filePath;
    },
    //添加音频路径
    uploadAudio: function (data) {
      this.attractionsPointInfo.audioUrl = data.filePath;
    },
    //提交表单
    onSubmit: function () {
      attractionsPointApi
        .addOrEdit(this.attractionsPointInfo)
        .then((result) => {
          if (result.success) {
            this.$message.success("提交成功！");
            this.deleteTags(this.$route.fullPath); //关闭当前窗口
            //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
            this.$router.push({
              name: "attractionsPointList",
              params: { flow: true },
            });
          } else {
            if (this.attractionsPointInfo.id) {
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
          if (this.atlasInfo.id) {
            this.$message.error("数据更新失败");
          } else {
            this.$message.error("数据添加失败");
          }
        });
    },
    addAttractions: function () {
      this.dialogTableAttractions = true;
      attractionsApi
        .getAllList(this.page)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.attractions = result.rows;
        })
        .catch(() => {
          this.loading = false; //关掉加载动画
          this.$message.error("查询出错");
        });
    },
    handleCurrentChange(val) {
      this.currentRowId = val.id;
      this.currentRowName = val.name;
    },
    confirmAttractions: function () {
      this.dialogTableAttractions = false;
      this.attractionsPointInfo.attractionsId = this.currentRowId;
    },
    //取消按钮事件
    close: function () {
      this.$router.go(-1);
    },
    //获取详情信息
    getAttractionsPoint: function () {
      if (this.$route.params && this.$route.params.id) {
        attractionsPointApi
          .detailed({ id: this.$route.params.id })
          .then((result) => {
            this.currentRowId = result.attractionsPoint.attractionsId;
            this.currentRowName = result.attractionsPoint.attractionsName;
            this.attractionsPointInfo = result.attractionsPoint;
            if (this.attractionsPointInfo.isUpfile == 0) {
              this.isShow = true;
              this.isAudioShow = false;
            }
            this.uploadGroupVideo.fileList = [];
            let fileVideo = result.attractionsPoint.videoUrl;
            let fileNameVideo = fileVideo.substring(
              fileVideo.lastIndexOf("/") + 1
            );
            this.attractionsPointInfo = result.attractionsPoint;
            this.uploadGroupVideo.fileList = [
              {
                name: fileNameVideo,
                url: result.attractionsPoint.videoUrl,
              },
            ];
            this.uploadGroupAudio.fileList = [];
            let fileAudio = result.attractionsPoint.audioUrl;
            let fileNameAudio = fileAudio.substring(
              fileAudio.lastIndexOf("/") + 1
            );
            this.uploadGroupAudio.fileList = [
              {
                name: fileNameAudio,
                url: result.attractionsPoint.audioUrl,
              },
            ];
            this.uploadGroup.fileList = [];
            if (
              result.attractionsPoint.titleImgurl != null &&
              result.attractionsPoint.titleImgurl != ""
            ) {
              this.uploadGroup.fileList.push({
                url: baseURL.releaseUrl + result.attractionsPoint.titleImgurl,
              });
            }
          })
          .catch(() => {
            this.$message.error("数据获取失败");
          });
      } else if (this.$route.params && this.$route.params.flow) {
        //重置参数
        this.attractionsPointInfo = {
          id: "",
          title: "",
          recommend: 1,
          titleImgurl: "",
          attractionsId: 0,
          sort: "",
          info: "",
          isUpfile: "",
          vioceText: "",
          videoUrl: "",
          audioUrl: "",
          autoUpload: true,
        };
      }
    },
  },
  created() {},
  //keep-alive 生命周期，
  activated() {
    this.getAttractionsPoint();
  },
};
</script>
