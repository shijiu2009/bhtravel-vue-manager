<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="90px">
        <div class="form_item">
          <el-form-item label="投诉人id">
            <el-input v-model="info.userid" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="投诉人用户名称">
            <el-input v-model="info.user" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="投诉人电话号码">
            <el-input v-model="info.phoneNumber" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="投诉内容">
            <vue-ueditor-wrap
              v-model="info.content"
              :config="myConfig"
            ></vue-ueditor-wrap>
          </el-form-item>
          <el-form-item label="回复内容">
            <vue-ueditor-wrap v-model="info.reply" :config="myConfig"></vue-ueditor-wrap>
          </el-form-item>
          <el-form-item label="回复人员帐号">
            <el-input v-model="info.replyname"></el-input>
          </el-form-item>
          <el-form-item label="是否显示">
            <el-radio-group v-model="info.isShow">
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
import api from "@/api/travelManager/complaint.js";
import { mapMutations } from "vuex";
//富文本框
import VueUeditorWrap from "vue-ueditor-wrap";
export default {
  components: {
    VueUeditorWrap,
  },
  name: "addOrEditComplaint",
  data() {
    return {
      info: {
        id: "",
        userid: "",
        user: "",
        content: "",
        mail: "",
        reply: "",
        replyname: "",
        isShow: 0,
      },
    };
  },
  methods: {
    ...mapMutations({
      deleteTags: "DELETE_TAGSLIST",
    }),
    // 获得焦点事件
    onEditorFocus(event) {
      event.enable(false);
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
              name: "complaintList",
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
        api
          .detailed({ id: this.$route.params.id })
          .then((result) => {
            this.info = result.complaint;
          })
          .catch(() => {
            this.$message.error("数据获取失败");
          });
      }
    },
  },
  created() {
    this.getAdvert();
  },
  //keep-alive 生命周期，
  activated() {
    this.getAdvert();
  },
};
</script>
