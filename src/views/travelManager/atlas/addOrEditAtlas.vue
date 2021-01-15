<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="atlasInfo" label-width="90px">
        <div class="form_item">
          <el-form-item label="名称">
            <el-input v-model="atlasInfo.name" @change="infoChange"></el-input>
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
            <el-input v-model="atlasInfo.sort" @change="infoChange"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="3">
              <el-form-item label="图片集合"></el-form-item>
            </el-col>
              <UploadFile @uploadValue="uploadValue" :uploadGroup="uploadGroup"></UploadFile>
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
        autoUpload: true
      },
      //图片上传组件信息
      uploadGroup: {
        //文件列表
        fileList: [],
        limitCount: 10,
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
      this.imgPaths.push(data.filePath);
    },
    //提交表单
    onSubmit: function () {
      let isCheck = this.infoChange();
      if (!isCheck) {
        return;
      }
      atlasApi
        .addOrEditAtlas(this.atlasInfo)
        .then((result) => {
          if (result.success) {
            atlasApi.delImgList({ typeId: result.atlas.id });
            let imgList = this.imgPaths;
            for (let i = 0; i < imgList.length; i++) {
              atlasApi.addImglib({
                imglogo: imgList[i],
                typeId: result.atlas.id,
                typeName: result.atlas.name,
              });
            }
            this.$message.success("提交成功！");
            this.deleteTags(this.$route.fullPath); //关闭当前窗口
            //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
            this.$router.push({ name: "atlasList", params: { flow: true } });
          } else {
            if (this.atlasInfo.id) {
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
      if (this.$route.params && this.$route.params.Id) {
        atlasApi
          .detailedAtlas({ id: this.$route.params.Id })
          .then((result) => {
            this.atlasInfo = result.atlas;
            console.log(this.atlasInfo);
            for (let i = 0; i < result.atlas.imglibList.length; i++) {
              this.uploadGroup.fileList.push({
                url: baseURL.releaseUrl + result.atlas.imglibList[i],
              });
            }
          })
          .catch(() => {
            this.$message.error("数据获取失败");
          });
      } else if (this.$route.params && this.$route.params.flow) {
        //重置参数
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
  created() {},
  //keep-alive 生命周期，
  activated() {
    this.getAdvert();
  },
};
</script>