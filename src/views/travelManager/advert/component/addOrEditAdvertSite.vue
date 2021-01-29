<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="advertSiteInfo" label-width="80px">
        <div class="form_item">
          <el-form-item label="代码编号" :required="true">
            <el-input v-model="advertSiteInfo.codeName" @change="codeNameChange"></el-input>
            <el-tooltip
              :content="tigs.codeName.content"
              placement="bottom"
              effect="light"
              class="input_tips"
            >
              <i class="input_tips">?</i>
            </el-tooltip>
            <el-alert
              :title="tigs.codeName.content"
              v-show="tigs.codeName.isShow"
              type="error"
              :closable="false"
              show-icon
            ></el-alert>
          </el-form-item>
          <el-form-item label="简介">
            <el-input type="textarea" rows="5" v-model="advertSiteInfo.account"></el-input>
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
import advertApi from "@/api/advert.js";
import { mapMutations} from "vuex";
import regular from "@/assets/js/regular.js";
export default {
  name: "addOrEditAdvertSize",
  data() {
    return {
      advertSiteInfo: {
        id: "",
        codeName: "",
        account: "",
      },
      //错误信息提示
      tigs: {
        codeName: {
          isShow: false,
          content: "请输入代码编号，且长度不可大于20个字符",
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
    //表单提交按钮事件
    onSubmit: function () {
      //判断代码编号是否符合规范
      if (
        !regular.letterAndNumber(this.advertSiteInfo.codeName) ||
        !this.advertSiteInfo.codeName.trim()
      ) {
        this.tigs.codeName.isShow = true;
        return;
      }
      advertApi
        .addOrEditAdvertSite(this.advertSiteInfo)
        .then((result) => {
          console.log(result);
          if (result.success) {
            this.$message.success("提交成功！");
            this.deleteTags(this.$route.fullPath); //关闭当前窗口
            //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
            this.$router.push({
              name: "advertSizeList",
              params: { flow: true },
            });
          } else {
            if (this.advertSiteInfo.id) {
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
          console.log("okk");
          if (this.advertSiteInfo.id) {
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
    //用户编码修改触发事件
    codeNameChange: function (value) {
      this.tigs.codeName.isShow = !regular.letterAndNumber(value);
    },
    //根据id获取详情信息
    getAdvertSite() {
      //判断是否传ID过来
      console.log(this.$route.params);
      if (this.$route.params && this.$route.params.id) {
        //获取详情
        advertApi
          .detailedAdvertSite({ id: this.$route.params.id })
          .then((result) => {
            this.advertSiteInfo = result.advertSite;
          })
          .catch(() => {
            this.$message.error("数据获取失败");
          });
      }
    },
  },
  created() {},
  //keep-alive 生命周期，
  activated() {
    this.getAdvertSite();
  },
};
</script>