<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" v-model="info" label-width="90px">
        <div class="form_item">
          <el-form-item label="ICP备案号">
            <el-input v-model="info.icpNumber"></el-input>
          </el-form-item>
          <el-form-item label="公安备案号">
            <el-input v-model="info.publicNumber"></el-input>
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
import api from "@/api/recordInformation.js";
import { mapMutations } from "vuex";
import quillConfig from "@/assets/js/quill-config.js";
export default {
  name: "recordInformationSetting",
  data() {
    return {
      info: {
        id: "",
        icpNumber: "",
        publicNumber: "",
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
      console.log(this.$route.params);
      //   if (this.$route.params && this.$route.params.id) {
      //     api
      //       .detailed({ id: this.$route.params.id })
      //       .then((result) => {
      //         this.info = result.recordInfomation;
      //       })
      //       .catch(() => {
      //         this.$message.error("数据获取失败");
      //       });
      //   }
      api
        .detailed()
        .then((result) => {
          if (result.recordInformation) {
            this.info = result.recordInformation;
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