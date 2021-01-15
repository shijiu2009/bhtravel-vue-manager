<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="friendlyLink" label-width="90px">
        <div class="form_item">
          <el-form-item label="名称">
            <el-input v-model="friendlyLink.name" @change="infoChange"></el-input>
            <el-alert
              :title="friendlyLink.name.err"
              v-show="friendlyLink.name.isErr"
              type="error"
              :closable="false"
              show-icon
            ></el-alert>
          </el-form-item>
          <el-form-item label="链接路径">
            <el-input v-model="friendlyLink.address" @change="infoChange"></el-input>
            <el-alert
              :title="friendlyLink.address.err"
              v-show="friendlyLink.address.isErr"
              type="error"
              :closable="false"
              show-icon
            ></el-alert>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="friendlyLink.sort" @change="infoChange"></el-input>
            <el-alert
              :title="friendlyLink.sort.err"
              v-show="friendlyLink.sort.isErr"
              type="error"
              :closable="false"
              show-icon
            ></el-alert>
          </el-form-item>
          <el-form-item label="是否显示">
            <el-radio-group v-model="friendlyLink.isShow">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="图片">
            <UploadFile @uploadValue="uploadValue"></UploadFile>
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
import friendlyLinkApi from "@/api/friendlyLink.js";
import quillConfig from "@/assets/js/quill-config.js";
import { mapMutations } from "vuex";
import UploadFile from "./uploadFile";
export default {
  name: "addOrEditFriendlyLink",
  components: {
    
    UploadFile,
  },
  data() {
    return {
      friendlyLink: {
        id: "",
        name: "",
        sort: 1,
        imgpath: "",
        address: "",
        // pcContent: "", //PC端内容
        // mobileContent: "", //移动端图文内容
      },
      errorInfo: {
        name: {
          isErr: false,
          err: "标题不符合规范",
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
      if (this.friendlyLink.name) {
        this.errorInfo.name.isErr = false;
      } else {
        this.errorInfo.name.isErr = true;
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
      friendlyLinkApi
        .addOrEditFriendlyLink(this.friendlyLink)
        .then((result) => {
          if (result.success) {
            this.$message.success("提交成功！");
            this.deleteTags(this.$route.fullPath); //关闭当前窗口
            //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
            this.$router.push({ name: "friendlyLinkList", params: { flow: true } });
          } else {
            if (this.friendlyLinkInfo.id) {
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
          if (this.friendlyLink.id) {
            this.$message.error("数据更新失败");
          } else {
            this.$message.error("数据添加失败");
          }
        });
    },
    uploadValue:function(data){
      this.friendlyLink.imgpath = data.filePath;
    },
    //取消按钮事件
    close: function () {
      this.$router.go(-1);
    },
    //获取详情信息
    getFriendlyLink: function () {
      if (this.$route.params && this.$route.params.Id) {
        friendlyLinkApi
          .detailedFriendlyLink({ id: this.$route.params.Id })
          .then((result) => {
            this.friendlyLink = result.friendlyLink;
          })
          .catch(() => {
            this.$message.error("数据获取失败");
          });
      } else if (this.$route.params && this.$route.params.flow) {
        //重置参数
        this.friendlyLink = {
          id: "",
          name: "",
          sort: 1,
          imgpath:"",
          address: "",
          // pcContent: "", //PC端内容
          // mobileContent: "", //移动端图文内容
        };
      }
    },
  },
  created() {
    this.getFriendlyLink();
  },
  //keep-alive 生命周期，
  activated() {
    this.getFriendlyLink();
  },
};
</script>