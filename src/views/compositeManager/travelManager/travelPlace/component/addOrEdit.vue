<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="100px">
        <div class="form_item">
          <el-form-item label="文旅场所名称">
            <el-input v-model="info.name" @change="infoChange"></el-input>
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
          <el-form-item label="是否开放">
            <el-radio-group v-model="info.isOpen">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="类型">
            <el-radio-group v-model="info.type">
              <el-radio :label="0">科技馆</el-radio>
              <el-radio :label="1">博物馆</el-radio>
              <el-radio :label="2">展览馆</el-radio>
              <el-radio :label="3">图书馆</el-radio>
              <el-radio :label="4">文化馆</el-radio>
              <el-radio :label="5">纪念馆</el-radio>
              <el-radio :label="6">美术馆</el-radio>
              <el-radio :label="7">剧场</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="开馆日期">
            <el-input v-model="info.openDay"></el-input>
          </el-form-item>
          <el-form-item label="开馆时间">
            <el-time-picker
              v-model="info.openTime"
              value-format="HH:mm:ss"
              placeholder="选择时间"
            >
            </el-time-picker>
          </el-form-item>
          <el-form-item label="闭馆时间">
            <el-time-picker
              v-model="info.closingTime"
              value-format="HH:mm:ss"
              placeholder="选择时间"
            >
            </el-time-picker>
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-col :span="10">
                <el-form-item label="封面图片"></el-form-item>
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

          <el-row>
            <el-col :span="3">
              <el-form-item label="图片集合"></el-form-item>
            </el-col>
            <UploadFile
              @uploadValue="photosValue"
              ref="UploadFile"
              :uploadGroup="uploadGroupPhotos"
            ></UploadFile>
          </el-row>
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
import api from "@/api/travelPlace.js";
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
  name: "addOrEditTravelPlace",
  components: {
    UploadFile,
    VueUeditorWrap,
    baiduMap,
  },
  data() {
    return {
      info: {
        name: "",
        imgPath: "",
        type: 0,
        isOpen: 1,
        address: "",
        stars: "",
        latitude: "",
        longitude: "",
        sort: 0,
        contentWeb: "",
        contentMini: "",
        photos: [],
        openDay: "",
        openTime: "",
        closingTime: "",
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
      //图片集合上传组件信息
      uploadGroupPhotos: {
        //文件列表
        fileList: [],
        limitCount: 10,
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
    thumbValue: function (data) {
      this.info.icon = data.filePath;
    },
    uploadValue: function (data) {
      this.ptImgs.push(data.filePath);
      //this.ptImgs = this.$refs.UploadFile.uploadGroup.fileList;
    },
    photosValue: function (data) {
      this.photos[data].icon = this.$refs.uploadGroupPhotos[
        data
      ].uploadGroup.fileList[0].response.filePath;
    },
    //提交表单
    onSubmit: function () {
      let arr = [];
      this.info.photos = [];
      this.info.address = this.baiduInfo.address;
      this.info.longitude = this.baiduInfo.longitude;
      this.info.latitude = this.baiduInfo.latitude;
      this.info.proxcode = this.baiduInfo.proxcode;
      this.info.cityxcode = this.baiduInfo.cityxcode;
      this.info.countyxcode = this.baiduInfo.countyxcode;
      for (let i = 0; i < this.uploadGroupPhotos.fileList.length; i++) {
        if ("response" in this.uploadGroupPhotos.fileList[i]) {
          this.info["photos[" + i + "].imgPath"] = this.uploadGroupPhotos.fileList[
            i
          ].response.filePath;
        } else {
          var pos = this.uploadGroupPhotos.fileList[i].url.lastIndexOf(baseURL.imgUrl);
          let url = this.uploadGroupPhotos.fileList[i].url.substr(pos);
          this.info["photos[" + i + "].imgPath"] = url;
        }
      }

      api
        .addOrEdit(this.info)
        .then((result) => {
          if (result.success) {
            this.$message.success("提交成功！");
            this.deleteTags(this.$route.fullPath); //关闭当前窗口
            //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
            this.$router.push({
              name: "travelPlaceList",
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
    getTravelPlace: function () {
      this.uploadGroupTitle.fileList = [];
      this.uploadGroupPhotos.fileList = [];
      if (this.$route.params && this.$route.params.id) {
        api.getTravelPlace({ id: this.$route.params.id }).then((result) => {
          this.info = result.travelPlace;
          this.baiduInfo.address = this.info.address;
          this.baiduInfo.longitude = this.info.longitude;
          this.baiduInfo.latitude = this.info.latitude;
          this.baiduInfo.proxcode = this.info.proxcode;
          this.baiduInfo.cityxcode = this.info.cityxcode;
          this.baiduInfo.countyxcode = this.info.countyxcode;
          this.$refs.baiduMap.getClickInfo;
          this.$refs.baiduMap.getLngAndLat();
          this.$refs.baiduMap.getProvinces();
          if (result.travelPlace.imgPath != null && result.travelPlace.imgPath != "") {
            this.uploadGroupTitle.fileList.push({
              url: baseURL.releaseUrl + result.travelPlace.imgPath,
            });
          }
          if (result.travelPlace.photos != null && result.travelPlace.photos != "") {
            for (let i = 0; i < result.travelPlace.photos.length; i++) {
              // this.photos.push(result.travelPlace.photos[i]);
              let uploadGroupPhotos = JSON.parse(JSON.stringify(this.uploadGroupPhotos));
              this.uploadGroupPhotos.fileList.push({
                url: baseURL.releaseUrl + result.travelPlace.photos[i].imgPath,
              });
              // this.photos[i].uploadGroupPhotos = uploadGroupPhotos;
            }
          }
        });
        // .catch((e) => {
        //   console.info(e);
        //   this.$message.error("数据获取失败");
        // });
      } else {
        //重置参数
        Object.keys(this.info).map((key) => (this.info[key] = ""));
        Object.keys(this.baiduInfo).map((key) => (this.info[key] = ""));
        this.info = {
          name: "",
          imgPath: "",
          type: 0,
          isOpen: 1,
          address: "",
          stars: "",
          latitude: "",
          longitude: "",
          sort: 0,
          contentWeb: "",
          contentMini: "",
          photos: [],
          openDay: "",
          openTime: "",
          closingTime: "",
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
        this.uploadGroupTitle.fileList = [];
        this.uploadGroupPhotos.fileList = [];
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
    // this.getTravelPlace();
  },
  //keep-alive 生命周期，
  activated() {
    this.getTravelPlace();
  },
};
</script>
