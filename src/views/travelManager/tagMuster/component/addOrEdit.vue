<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="tagMusterInfo" label-width="98px">
        <div class="form_item">
          <el-form-item label="名称" :required="true">
            <el-input
              v-model="tagMusterInfo.name"
              @change="infoChange"
              ref="el_input_title"
              maxlength="20"
              minlength="1"
              v-focus
            ></el-input>
          </el-form-item>
          <el-form-item label="编码" :required="true">
            <el-input
              v-model="tagMusterInfo.code"
              @change="infoChange"
              ref="el_input_title"
              maxlength="20"
              minlength="1"
              v-focus
            ></el-input>
          </el-form-item>
          <el-form-item label="排序" :required="true">
            <el-input
              v-model="tagMusterInfo.sort"
              @change="infoChange"
              ref="el_input_title"
              maxlength="20"
              minlength="1"
              v-focus
            ></el-input>
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
import tagMusterApi from "@/api/tagMuster.js";
import quillConfig from "@/assets/js/quill-config.js";
import { mapMutations } from "vuex";
//富文本框
// import { quillEditor } from "vue-quill-editor";
export default {
  name: "addOrEditTagMuster",
  components: {
    
  },
  data() {
    return {
      tagMusterInfo: {
        id: "",
        name: "",
        code: "",
        createTime: "", //
      },
      //提示信息
      tigs: {
        name: {
          isShow: false,
          content: "请输入标题，且标题长度不可大于20个字符",
        },
      },
      options: {
        pcEditorOption: quillConfig,
        mEditorOption: quillConfig,
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
      if (this.tagMusterInfo.name) {
        this.tigs.name.isShow = false;
      } else {
        this.tigs.name.isShow = true;
        isCheck = false;
      }
      return isCheck;
    },
    //提交表单
    onSubmit: function () {
      let isCheck = this.infoChange();
      if (!isCheck) {
        return;
      }
      tagMusterApi
        .addOrEditTagMuster(this.tagMusterInfo)
        .then((result) => {
          if (result.success) {
            this.$message.success("提交成功！");
            this.deleteTags(this.$route.fullPath); //关闭当前窗口
            //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
            this.$router.push({ name: "tagMusterList", params: { flow: true } });
          } else {
            if (this.tagMusterInfo.id) {
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
          if (this.tagMusterInfo.id) {
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
    getTagMuster: function () {
      //判断是否传ID过来
      if (this.$route.params && this.$route.params.id) {
        //获取详情
        tagMusterApi
          .detailedTagMuster({ id: this.$route.params.id })
          .then((result) => {
            this.tagMusterInfo = JSON.parse(JSON.stringify(result.tagMuster));
            //取消富文本框焦点，防止页面滚动
            this.$quill(this.$refs.mypTextEditor);
          })
          .catch(() => {
            this.$message.error("数据获取失败");
          });
      } else if (this.$route.params && this.$route.params.flow) {
        //重置参数
        Object.keys(this.tagMusterInfo).map(
          (key) => (this.tagMusterInfo[key] = "")
        );
        this.tagMusterInfo.sort = 1;
      }
    },
  },
  created() {
    this.getTagMuster();
  },
  //keep-alive 生命周期，
  activated() {
    //重新获取页面数据，
    this.getTagMuster();
  },
};
</script>