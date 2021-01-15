<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="advertInfo" label-width="80px">
        <div class="form_item">
          <el-form-item label="名称" :required="true">
            <el-input v-model="advertInfo.name" @change="checkInfo"></el-input>
            <el-tooltip
              :content="tigs.name.content"
              placement="bottom"
              effect="light"
              class="input_tips"
            >
              <i class="input_tips">?</i>
            </el-tooltip>
            <el-alert
              :title="tigs.name.content"
              v-show="tigs.name.isShow"
              type="error"
              :closable="false"
              show-icon
            ></el-alert>
          </el-form-item>
          <el-form-item label="位置" :required="true">
            <el-select v-model="advertInfo.loction" clearable placeholder="请选择">
              <el-option
                v-for="item in loctionList"
                :key="item.id"
                :label="item.codeName"
                :value="item.id"
                :reserve-keyword="true"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否显示" :required="true">
            <el-radio-group v-model="advertInfo.isShow">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否排序" :required="true">
            <el-radio-group v-model="advertInfo.sort">
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
        <el-form-item label="图片">
          <uploadImage @uploadValue="uploadValue" :uploadGroup="uploadGroup"></uploadImage>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import advertApi from "@/api/advert.js";
import { mapMutations } from "vuex";
import uploadImage from "@/components/uploadImage/uploadImage.vue";
import baseURL from "@/config/baseUrl.js";
export default {
  name: "addOrEditAdvert",
  components: {
    uploadImage,
  },
  data() {
    return {
      // 广告信息
      advertInfo: {
        id: "",
        name: "",
        path: "",
        loction: "",
        isShow: 1,
        sort: 1,
      },
      //图片上传组件信息
      uploadGroup: {
        //文件列表
        fileList: [], //当前图片个数
        limitCount: 4, //上传图片个数
        autoUpload: true, //是否不需要上传按钮
        width: 148,
        height: 148,
      },
      //错误信息提示
      tigs: {
        name: {
          isShow: false,
          content: "请输入标题，且标题长度不可大于20个字符",
        },
      },
      //位置列表
      loctionList: [],
    };
  },
  methods: {
    ...mapMutations({
      deleteTags: "DELETE_TAGSLIST",
    }),
    getLoctions: function () {
      advertApi
        .getLoctions()
        .then((result) => {
          this.loctionList = result.all;
          this.advertInfo.loction = this.advertInfo.loction
            ? this.advertInfo.loction
            : this.loctionList[0].id; //默认赋值
        })
        .catch(() => {
          this.$message.error("广告位置列表获取失败");
        });
    },
    //校验信息
    checkInfo: function () {
      if (this.advertInfo.name) {
        this.tigs.name.isShow = false;
        return true;
      } else {
        this.tigs.name.isShow = true;
        return false;
      }
    },
    //表单提交按钮事件
    onSubmit: function () {
      let isCheck = this.checkInfo();
      if (!isCheck) {
        return;
      }
      advertApi
        .addOrEditAdvert(this.advertInfo)
        .then((result) => {
          if (result.success) {
            this.$message.success("提交成功！");
            this.deleteTags(this.$route.fullPath); //关闭当前窗口
            //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
            this.$router.push({ name: "advertList", params: { flow: true } });
          } else {
            if (this.advertInfo.id) {
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
          if (this.advertInfo.id) {
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
    //修改路径的值
    uploadValue: function (data) {
      this.advertInfo.path = data.filePath;
    },
    //根据id获取详情信息
    getAdvert: function () {
      this.uploadGroup.fileList = [];
      //判断是否传ID过来
      if (this.$route.params && this.$route.params.id) {
        //获取详情
        advertApi
          .detailedAdvert({ id: this.$route.params.id })
          .then((result) => {
            let fileItem = {
              url: baseURL.releaseUrl + result.advert.path,
            };
            this.uploadGroup.fileList.push(fileItem);
            this.advertInfo = result.advert;
          })
          .catch(() => {
            this.$message.error("数据获取失败");
          });
      } 
    },
  },
  created() {
    this.getLoctions();
  },
  //keep-alive 生命周期，
  activated() {
    this.getAdvert();
  },
  deactivated() {},
};
</script>
<style scoped>
.el-upload-list__item {
  transition: all 0s cubic-bezier(0.55, 0, 0.1, 1);
}
</style>