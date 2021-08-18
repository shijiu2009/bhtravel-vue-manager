<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="activityInfo" label-width="98px">
        <div class="form_item">
          <el-form-item label="标题" :required="true">
            <el-input
              v-model="activityInfo.title"
              @change="infoChange"
              maxlength="20"
              minlength="1"
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
              :title="tigs.title.content"
              v-show="tigs.title.isShow"
              type="error"
              :closable="false"
              show-icon
            ></el-alert>
          </el-form-item>
          <el-form-item label="是否排序" :required="true">
            <el-radio-group v-model="activityInfo.sort">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <!-- pc端内容富文本框 -->
        <el-form-item label="pc端内容" :required="true">
          <quill-editor
            ref="myTextEditor"
            v-model="activityInfo.pcContent"
            :options="options.pcEditorOption"
          ></quill-editor>
        </el-form-item>
        <!-- 移动端内容富文本框 -->
        <el-form-item label="移动端内容" :required="true">
          <quill-editor
            ref="myTextEditor"
            v-model="activityInfo.mobileContent"
            :options="options.mEditorOption"
          ></quill-editor>
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
import activityApi from "@/api/activity.js";
import quillConfig from "@/assets/js/quill-config.js";
import { mapMutations } from "vuex";
//富文本框
import { quillEditor } from "vue-quill-editor";
export default {
  name: "addOrEditActivity",
  components: {
    quillEditor,
  },
  data() {
    return {
      activityInfo: {
        id: "",
        title: "",
        author: "",
        content: "", //内容
      },
      //提示信息
      tigs: {
        title: {
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
      if (this.activityInfo.title) {
        this.tigs.title.isShow = false;
      } else {
        this.tigs.title.isShow = true;
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
      activityApi
        .addOrEditActivity(this.activityInfo)
        .then((result) => {
          if (result.success) {
            this.$message.success("提交成功！");
            this.deleteTags(this.$route.fullPath); //关闭当前窗口
            //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
            this.$router.push({ name: "activityList", params: { flow: true } });
          } else {
            if (this.activityInfo.id) {
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
          if (this.activityInfo.id) {
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
            this.activityInfo = result.travelProject;
          })
          // .catch(() => {
          //   this.$message.error("数据获取失败");
          // });
      } else if (this.$route.params && this.$route.params.flow) {
        //重置参数
        Object.keys(this.activityInfo).map(
          (key) => (this.activityInfo[key] = "")
        );
        this.activityInfo.sort = 1;
      }
    },
  },
  created() {
  },
  //keep-alive 生命周期，
  activated() {
    //重新获取页面数据，
    this.getAdvert();
  },
};
</script>