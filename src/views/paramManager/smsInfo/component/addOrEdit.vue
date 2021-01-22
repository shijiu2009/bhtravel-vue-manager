<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="SmsInfo" label-width="128px">
        <div class="form_item">
          <el-form-item label="accessKeyId" :required="true">
            <el-input
              v-model="SmsInfo.accessKeyId"
              ref="el_input_title"
              maxlength="20"
              minlength="1"
              v-focus
            ></el-input>
            <!-- <el-alert
              :title="tigs.title.content"
              v-show="tigs.title.isShow"
              type="error"
              :closable="false"
              show-icon
            ></el-alert> -->
          </el-form-item>
          <el-form-item label="accessSecret" :required="true">
            <el-input
              v-model="SmsInfo.accessSecret"
              ref="el_input_title"
              maxlength="20"
              minlength="1"
              v-focus
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
          <el-form-item label="验证码模板编码" :required="true">
            <el-input
              v-model="SmsInfo.smsCode"
              ref="el_input_title"
              maxlength="20"
              minlength="1"
              v-focus
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
          <el-form-item label="短信签名" :required="true">
            <el-input
              v-model="SmsInfo.signName"
              ref="el_input_title"
              maxlength="20"
              minlength="1"
              v-focus
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
          <el-form-item label="是否开启" :required="true">
            <el-radio-group v-model="SmsInfo.isOpen">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="ip限制次数" :required="true">
            <el-input
              v-model="SmsInfo.ipLimitNums"
              ref="el_input_title"
              maxlength="20"
              minlength="1"
              v-focus
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
          <el-form-item label="手机号限制次数" :required="true">
            <el-input
              v-model="SmsInfo.phoneRegLimitNums"
              ref="el_input_title"
              maxlength="20"
              minlength="1"
              v-focus
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
                    <el-form-item label="其他短信模板">
            <el-button type="success" @click="addSub">添加</el-button>
            <div style="margin-top: 10px">
              <div :gutter="20" v-for="(eItem, index) in SmsInfo.templates" :key="index">
                <el-row>
                  <el-form-item label="模板中文名称">
                    <el-input
                      v-model="eItem.name"
                      placeholder="请输入模板中文名称"
                    ></el-input>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="别名(唯一)">
                    <el-input
                      v-model="eItem.code"
                      placeholder="请输入别名"
                    ></el-input>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="模板码">
                    <el-input
                      v-model="eItem.templateCode"
                      placeholder="请输入模板码"
                    ></el-input>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="参数集(逗号隔开)">
                    <el-input
                      v-model="eItem.templateCode"
                      placeholder="请输入参数集"
                    ></el-input>
                  </el-form-item>
                </el-row>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="deleteSub(index)"
                ></el-button>
              </div>
            </div>
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
import smsInfoApi from "@/api/smsInfo.js";
import quillConfig from "@/assets/js/quill-config.js";
import { analysisResolution } from "@/api/analysis.js";
import { mapMutations } from "vuex";
export default {
  name: "addOrEditSmsInfo",
  components: {
    
  },
  data() {
    return {
      SmsInfo: {
        id: "",
        ipLimitNums: 10,
        phoneRegLimitNums:10,
        isShow: 0,
        signName:"",
        accessKeyId:"",
        accessSecret:"",
        smsCode:"",
        templates:[],
      },
      tp:{
        name:"",
        code:"",
        templateCode:"",
        paramStr:"",
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
      if (this.SmsInfo.title) {
        this.tigs.title.isShow = false;
      } else {
        this.tigs.title.isShow = true;
        isCheck = false;
      }
      return isCheck;
    },
    //添加其他模板
    addSub: function () {
      let tp = JSON.parse(JSON.stringify(this.tp));
     // psub.uploadGroupRoom = JSON.parse(JSON.stringify(this.uploadGroupRoom));
      this.SmsInfo.templates.push(tp);
    },
    //删除其他模板
    deleteSub: function (index) {
      this.SmsInfo.templates.splice(index, 1)[0];
    },
    //提交表单
    onSubmit: function () {
      if (this.templates != null && this.templates != "") {
        analysisResolution(this.info, "templates", this.templates);
      }
      smsInfoApi
        .addOrEditSmsInfo(this.SmsInfo)
        .then((result) => {
          if (result.success) {
            this.$message.success("提交成功！");
          //  this.deleteTags(this.$route.fullPath); //关闭当前窗口
            //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
           // this.$router.push({ name: "smsInfoList", params: { flow: true } });
          } else {
            if (this.SmsInfo.id) {
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
          if (this.SmsInfo.id) {
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
    getSmsInfo: function () {
     
        //获取详情
        smsInfoApi
          .detailedSmsInfo({ id: this.$route.params.id })
          .then((result) => {
            this.SmsInfo = JSON.parse(JSON.stringify(result.smsInfo));
          })
          .catch(() => {
            this.$message.error("数据获取失败");
          });
      
    },
  },
  created() {
    this.getSmsInfo();
  },
  //keep-alive 生命周期，
  activated() {
    //重新获取页面数据，
    this.getSmsInfo();
  },
};
</script>