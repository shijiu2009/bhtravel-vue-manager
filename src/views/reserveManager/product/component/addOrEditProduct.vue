<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="90px">
        <div class="form_item">
          <!-- <el-form-item label="所属分类" style="width: 50%">
            <el-select v-model="info.classId" placeholder="请选择">
              <el-option
                v-for="item in classes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="审核状态" style="width: 50%">
            <el-select v-model="info.status" placeholder="请选择">
              <el-option
                v-for="item in statuses"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="美食名称">
            <el-input v-model="info.name"></el-input>
          </el-form-item>
          <el-form-item label="副标题">
            <el-input v-model="info.subTitle"></el-input>
          </el-form-item>
          <el-form-item label="今日显示价">
            <el-input v-model="info.todayPrice"></el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="info.sort"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="3">
              <el-form-item label="内容封面图片(640*428)"></el-form-item>
            </el-col>
            <UploadFile
              @uploadValue="titleValue"
              :uploadGroup="uploadGroupTitle"
            ></UploadFile>
          </el-row>
          <el-row>
            <el-col :span="3">
              <el-form-item label="列表缩略图片(280*187)"></el-form-item>
            </el-col>
            <UploadFile
              @uploadValue="thumbValue"
              :uploadGroup="uploadGroupThumb"
            ></UploadFile>
          </el-row>
          <el-form-item label="推荐理由" :required="true">
            <quill-editor
              ref="myTextEditor"
              v-model="info.recommandReason"
              :options="options.appOption"
            ></quill-editor>
          </el-form-item>
          <el-form-item label="美食详情(微信,App)" :required="true">
            <quill-editor
              ref="my1TextEditor"
              v-model="info.info"
              :options="options.webOption"
            ></quill-editor>
          </el-form-item>
          <el-form-item label="美食详情(web)" :required="true">
            <quill-editor
              ref="my2TextEditor"
              v-model="info.infoWeb"
              :options="options.webOption"
            ></quill-editor>
          </el-form-item>
          <el-form-item label="热门搜索">
            <el-radio-group v-model="info.hotSearch">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="开放预定">
            <el-radio-group v-model="info.isOpen">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="下架">
            <el-radio-group v-model="info.down">
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
import api from "@/api/reserveManager/product.js";
import { mapMutations } from "vuex";
import quillConfig from "@/assets/js/quill-config.js";
//富文本框
import { quillEditor } from "vue-quill-editor";
import UploadFile from "@/components/uploadImage/uploadImage.vue";
import baseURL from "@/config/baseUrl.js";
export default {
  components: {
    quillEditor,
    UploadFile,
  },
  name: "addOrEditAtlas",
  data() {
    return {
      info: {
        id: "",
        name: "",
        classId: 1,
        status: "",
        subTitle: "",
        titleImg: "",
        icon: "",
        recommandReason: "",
        info: "",
        infoWeb: "",
        hotSearch: 0,
        isOpen: 0,
        down: 0,
        todayPrice: "",
        sort: 0,
      },
      statuses: [
        {
          value: 0,
          label: "待审核",
        },
        {
          value: 1,
          label: "通过",
        },
        {
          value: 2,
          label: "不通过",
        },
      ],
      classes: [],
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
      this.info.titleImg = data.filePath;
    },
    thumbValue: function (data) {
      this.info.icon = data.filePath;
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
              name: "productList",
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
            //取消富文本框焦点，防止页面滚动
            this.quill(this.$refs.myTextEditor);
            this.quill(this.$refs.my1TextEditor);
            this.quill(this.$refs.my2TextEditor);
            this.uploadGroupTitle.fileList = [];
            this.uploadGroupThumb.fileList = [];
            this.info = result.product;
            this.uploadGroupTitle.fileList.push({
              url: baseURL.releaseUrl + result.product.titleImg,
            });
            this.uploadGroupThumb.fileList.push({
              url: baseURL.releaseUrl + result.product.icon,
            });
          })
          .catch(() => {
            this.$message.error("数据获取失败");
          });
      }
      api.getClassList().then((result) => {
        if (result.rows && result.rows.length > 0) {
          for (let i = 0; i < result.rows.length; i++) {
            let obj = result.rows[i];
            let classes = {
              value: obj.id,
              label: obj.name,
            };
            this.classes.push(classes);
          }
        }
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