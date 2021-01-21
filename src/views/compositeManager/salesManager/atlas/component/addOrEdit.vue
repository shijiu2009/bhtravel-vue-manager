<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="atlasInfo" label-width="90px">
        <div class="form_item">
          <el-form-item label="名称">
            <el-input v-model="atlasInfo.name" @change="infoChange" style="width:400px"></el-input>
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
          <el-form-item label="排序">
            <el-input-number v-model="atlasInfo.sort" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="封面图片">
            <UploadFile
              @uploadValue="titleValue"
              ref="uploadGroupTitle"
              :uploadGroup="uploadGroupTitle"
            ></UploadFile>
          </el-form-item>
          <el-row>
            <el-col :span="3">
              <el-form-item label="图片集合"></el-form-item>
            </el-col>
            <UploadFile
              @uploadValue="uploadValue"
              :uploadGroup="uploadGroup"
            ></UploadFile>
          </el-row>
          <el-form-item label="是否展示">
            <el-radio-group v-model="atlasInfo.isShow">
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
import atlasApi from "@/api/atlas.js";
import { mapMutations } from "vuex";
import UploadFile from "@/components/uploadImage/uploadImage.vue";
import baseURL from "@/config/baseUrl.js";
export default {
  name: "addOrEditAtlas",
  components: {
    UploadFile,
  },
  data() {
    return {
      atlasInfo: {
        id: "",
        name: "",
        isShow: 1,
        sort: "",
        titleId: "", //封面图片Id
        imglibList: [],
        autoUpload: true,
        imglib: "",
      },
      //图片上传组件信息
      uploadGroupTitle: {
        //文件列表
        fileList: [],
        limitCount: 1,
        autoUpload: true,
      },
      uploadGroup: {
        //文件列表
        fileList: [],
        limitCount: 20,
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
      options: {},
      imgPaths: [],
    };
  },
  methods: {
    ...mapMutations({
      deleteTags: "DELETE_TAGSLIST",
    }),
    titleValue: function (data) {
      this.atlasInfo.imglib = data.filePath;
    },
    //信息校验
    infoChange: function () {
      let isCheck = true;
      if (this.atlasInfo.name) {
        this.errorInfo.title.isErr = false;
      } else {
        this.errorInfo.title.isErr = true;
        isCheck = false;
      }
      return isCheck;
    },
    //添加路径
    uploadValue: function (data) {
      this.imglibList.push(data.filePath);
    },
    //提交表单
    onSubmit: function () {
      this.atlasInfo.imglibList = [];
      if (this.uploadGroup.fileList != null && this.uploadGroup.fileList != "") {
        for (let i = 0; i < this.uploadGroup.fileList.length; i++) {
          if ("response" in this.uploadGroup.fileList[i]) {
            this.atlasInfo["imglibList[" + i + "].imglogo"] = this.uploadGroup.fileList[
              i
            ].response.filePath;
          } else {
            var pos = this.uploadGroup.fileList[i].url.lastIndexOf(baseURL.imgUrl);
            let url = this.uploadGroup.fileList[i].url.substr(pos);
            this.atlasInfo["imglibList[" + i + "].imglogo"] = url;
          }
        }
      }

      atlasApi
        .addOrEditAtlas(this.atlasInfo)
        .then((result) => {
          if (result.success) {
            this.$message.success("提交成功！");
            this.deleteTags(this.$route.fullPath); //关闭当前窗口
            //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
            this.$router.push({ name: "atlasList", params: { flow: true } });
          } else {
            if (this.atlasInfo.id) {
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
    //取消按钮事件
    close: function () {
      this.$router.go(-1);
    },
    //获取详情信息
    getAdvert: function () {
      this.uploadGroup.fileList = [];
      this.atlasInfo.imglibList = [];
      this.uploadGroupTitle.fileList = [];
      if (this.$route.params && this.$route.params.Id) {
        atlasApi
          .detailedAtlas({ id: this.$route.params.Id })
          .then((result) => {
            this.atlasInfo = result.atlas;
            if (result.atlas.imglib != null && result.atlas.imglib != "") {
              this.uploadGroupTitle.fileList.push({
                url: baseURL.releaseUrl + result.atlas.imglib,
              });
            }
            for (let i = 0; i < result.atlas.imglibList.length; i++) {
              if (result.atlas.imglibList[i].titlePage != 1) {
                this.uploadGroup.fileList.push({
                  url: baseURL.releaseUrl + result.atlas.imglibList[i].imglogo,
                });
              }
            }
          })
          .catch(() => {
            this.$message.error("数据获取失败");
          });
      } else if (this.$route.params && this.$route.params.flow) {
        //重置参数
        this.uploadGroup.fileList = [];
        this.atlasInfo.imglibList = [];
        this.uploadGroupTitle.fileList = [];
        this.atlasInfo = {
          id: "",
          name: "",
          isShow: 1,
          sort: "",
          titleId: "", //封面图片Id
          imglibList: [],
        };
      }
    },
  },
  created() {
    // this.getAdvert();
  },
  //keep-alive 生命周期，
  activated() {
    this.getAdvert();
  },
};
</script>
