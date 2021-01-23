<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="100px">
        <div class="form_item">
          <el-form-item label="旅行社名称">
            <el-input v-model="info.name" @change="infoChange" style="width:400px"></el-input>
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
          <el-form-item label="诚信分">
            <el-input v-model="info.score" @change="infoChange" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input v-model="info.contact" @change="infoChange" style="width:400px"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-col :span="10">
                <el-form-item label="旅行社图片"></el-form-item>
              </el-col>
              <el-col :span="14">
                <UploadFile
                  @uploadValue="titleValue"
                  ref="uploadGroupTitle"
                  :uploadGroup="uploadGroupTitle"
                ></UploadFile>
              </el-col>
            </el-col>
          </el-row>
          <baiduMap :baiduInfo="baiduInfo" ref="baiduMap"></baiduMap>
          <!-- <el-form-item label="资质经营" :required="true">
            <vue-ueditor-wrap
              v-model="info.qualification"
              :config="myConfig"
            ></vue-ueditor-wrap>
          </el-form-item> -->
          <el-form-item label="介绍（微信小程序、app）" :required="true">
            <vue-ueditor-wrap
              v-model="info.contentMini"
              :config="myConfig"
            ></vue-ueditor-wrap>
          </el-form-item>
          <!-- <el-form-item label="介绍（WEB）" :required="true">
            <quill-editor
              ref="my2TextEditor"
              v-model="info.contentWeb"
              :options="options.contentWebOption"
            ></quill-editor>
          </el-form-item> -->
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
<script src="http://libs.baidu.com/jquery/1.9.1/jquery.js"></script>
<script>
import api from "@/api/travelAgency.js";
import { mapMutations } from "vuex";
import UploadFile from "@/components/uploadImage/uploadImage.vue";
import baseURL from "@/config/baseUrl.js";
//百度地图
import baiduMap from "@/components/baiduMap/baiduMap.vue";
//富文本框
import VueUeditorWrap from "vue-ueditor-wrap";
import ueditor from "@/assets/js/ueditorConfig.js";
//jQuery
export default {
  name: "addOrEditTravelAgency",
  components: {
    baiduMap,
    UploadFile,
    VueUeditorWrap,
  },
  data() {
    return {
      info: {
        name: "",
        imgPath: "",
        address: "",
        qualification: "",
        lat: "",
        lon: "",
        contentWeb: "",
        contentMini: "",
        contact: "",
      },
      myConfig: ueditor.myConfig,
      //對話框
      dialogTableVisible: false,
      //标题图片上传组件信息
      uploadGroupTitle: {
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
      BMap: null,
      map: null,
      baiduInfo: {
        address: "",
        longitude: "",
        latitude: "",
        proxcode: "",
        cityxcode: "",
        countyxcode: "",
        provinces: [],
        cities: [],
        countys: [],
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
      // if (this.info.name) {
      //   this.errorInfo.title.isErr = false;
      // } else {
      //   this.errorInfo.title.isErr = true;
      //   isCheck = false;
      // }
      return isCheck;
    },
    //添加路径
    titleValue: function (data) {
      this.info.imgPath = data.filePath;
    },
    //提交表单
    onSubmit: function () {
      let arr = [];
      this.info.address = this.baiduInfo.address;
      this.info.lon = this.baiduInfo.longitude;
      this.info.lat = this.baiduInfo.latitude;
      this.info.proxcode = this.baiduInfo.proxcode;
      this.info.cityxcode = this.baiduInfo.cityxcode;
      this.info.countyxcode = this.baiduInfo.countyxcode;
      api
        .addOrEdit(this.info)
        .then((result) => {
          if (result.success) {
            this.$message.success("提交成功！");
            this.deleteTags(this.$route.fullPath); //关闭当前窗口
            //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
            this.$router.push({
              name: "travelAgencyList",
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
    getTravelAgency: function () {
      this.uploadGroupTitle.fileList = [];

      if (this.$route.params && this.$route.params.id) {
        api
          .getTravelAgency({ id: this.$route.params.id })
          .then((result) => {
            this.info = result.travelAgency;
            this.baiduInfo.address = this.info.address;
            this.baiduInfo.longitude = this.info.lon;
            this.baiduInfo.latitude = this.info.lat;
            this.baiduInfo.proxcode = this.info.proxcode;
            this.baiduInfo.cityxcode = this.info.cityxcode;
            this.baiduInfo.countyxcode = this.info.countyxcode;
            this.$refs.baiduMap.getClickInfo;
            this.$refs.baiduMap.getLngAndLat();
            this.$refs.baiduMap.getProvinces();
            if (
              result.travelAgency.imgPath != null &&
              result.travelAgency.imgPath != ""
            ) {
              this.uploadGroupTitle.fileList.push({
                url: baseURL.releaseUrl + result.travelAgency.imgPath,
              });
            }
          })
          .catch((e) => {
            this.$message.error("数据获取失败");
          });
      } else {
        //重置参数
        Object.keys(this.info).map((key) => (this.info[key] = ""));
        Object.keys(this.baiduInfo).map((key) => (this.info[key] = ""));
        this.info = {
          name: "",
          imgPath: "",
          address: "",
          qualification: "",
          lat: "",
          lon: "",
          contentWeb: "",
          contentMini: "",
          contact: "",
        };
        this.baiduInfo = {
          address: "",
          longitude: "",
          latitude: "",
          proxcode: "",
          cityxcode: "",
          countyxcode: "",
          provinces: [],
          cities: [],
          countys: [],
          isArea: true,
        };
        this.$refs.baiduMap.getProvinces();
      }
    },
    defaultChange(index) {
      for (let i = 0; i < this.roomlist.length; i++) {
        if (this.roomlist[i].theDefault == 1 && i != index) {
          this.roomlist[i].theDefault = 0;
        }
      }
    },
  },
  created() {
    // this.getTravelAgency();
  },
  //keep-alive 生命周期，
  activated() {
    this.getTravelAgency();
  },
};
</script>

<style scoped>
.info_box >>> .el-form-item__content{
  width: 400px;
}
</style>