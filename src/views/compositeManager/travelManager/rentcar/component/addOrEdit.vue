<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="90px">
        <div class="form_item">
          <el-form-item label="名称">
            <el-input v-model="info.name" style="width: 400px"></el-input>
          </el-form-item>

          <!-- <el-form-item label="副标题">
            <el-input v-model="info.synopsis" style="width: 400px"></el-input>
          </el-form-item> -->

          <!-- <el-form-item label="座位">
            <el-input v-model="info.type" style="width: 400px"></el-input>
          </el-form-item> -->

          <!-- <el-form-item label="天数">
            <el-input-number v-model="info.days" :min="0"></el-input-number>
          </el-form-item> -->

          <!-- <el-form-item label="价格">
            <el-input v-model="info.price" style="width: 400px"></el-input>
          </el-form-item> -->

          <!-- <el-form-item label="车型">
            <el-input v-model="info.level" style="width: 400px"></el-input>
          </el-form-item> -->

          <!-- <el-form-item label="座位">
            <el-input v-model="info.seat"></el-input>
          </el-form-item> -->

          <el-form-item label="电话">
            <el-input v-model="info.phone" style="width: 400px"></el-input>
          </el-form-item>

          <!-- <el-form-item label="地址">
            <el-input v-model="info.address" style="width: 400px"></el-input>
          </el-form-item> -->

          <baiduMap :baiduInfo="baiduInfo" ref="baiduMap"></baiduMap>

          <el-form-item label="排序">
            <el-input-number v-model="info.sort" :min="0"></el-input-number>
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
            <el-col :span="8">
              <el-col :span="10">
                <el-form-item label="缩略图图片"></el-form-item>
              </el-col>
              <el-col :span="14">
                <UploadFile
                  @uploadValue="thumbValue"
                  ref="uploadGroupThumb"
                  :uploadGroup="uploadGroupThumb"
                ></UploadFile>
              </el-col>
            </el-col>
          </el-row>

          <el-form-item label="详情" :required="true">
            <vue-ueditor-wrap
              v-model="info.content"
              :config="myConfig"
            ></vue-ueditor-wrap>
          </el-form-item>

          <!-- <el-form-item label="简介">
            <vue-ueditor-wrap
              v-model="info.synopsis"
              :config="myConfig"
            ></vue-ueditor-wrap>
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
<script>
import api from "@/api/travelManager/rentcar.js";
import { mapMutations } from "vuex";
import UploadFile from "@/components/uploadImage/uploadImage.vue";
import baseURL from "@/config/baseUrl.js";
//百度地图
import baiduMap from "@/components/baiduMap/baiduMap.vue";
//富文本框
import VueUeditorWrap from "vue-ueditor-wrap";
import ueditor from "@/assets/js/ueditorConfig.js";
export default {
  components: {
    baiduMap,
    UploadFile,
    VueUeditorWrap,
  },
  name: "addOrEditRentcar",
  data() {
    return {
      info: {
        id: "",
        name: "",
        type: "",
        seat: "",
        phone: "",
        sort: 0,
        titleimgurl: "",
        icon: "",
        content: "",
        level: "",
        price: "",
        synopsis: "",
      },
      baiduInfo: {
        address: "",
        longitude: "",
        latitude: "",
      },
      myConfig: ueditor.myConfig,
      //图片上传组件信息
      uploadGroupTitle: {
        //文件列表
        fileList: [],
        limitCount: 1,
        autoUpload: true,
      },
      uploadGroupThumb: {
        //文件列表
        fileList: [],
        limitCount: 1,
        autoUpload: true,
      },
    };
  },
  methods: {
    ...mapMutations({
      deleteTags: "DELETE_TAGSLIST",
    }),
    //添加路径
    titleValue: function (data) {
      this.info.titleimgurl = data.filePath;
    },
    thumbValue: function (data) {
      this.info.icon = data.filePath;
    },
    //提交表单
    onSubmit: function () {
      this.info.address = this.baiduInfo.address;
      this.info.longitude = this.baiduInfo.longitude;
      this.info.latitude = this.baiduInfo.latitude;
      api
        .addOrEdit(this.info)
        .then((result) => {
          if (result.success) {
            this.$message.success("提交成功！");
            this.deleteTags(this.$route.fullPath); //关闭当前窗口
            //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
            this.$router.push({
              name: "rentcarList",
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
          document.getElementsByClassName("content")[0].scrollTop = 0;
        })
        .catch(() => {
          if (this.info.id) {
            this.$message.error("数据更新失败");
          } else {
            this.$message.error("数据添加失败");
          }
          document.getElementsByClassName("content")[0].scrollTop = 0;
        });
    },
    //取消按钮事件
    close: function () {
      this.$router.go(-1);
      document.getElementsByClassName("content")[0].scrollTop = 0;
    },
    //获取详情信息
    getAdvert: function () {
      if (this.$route.params && this.$route.params.id) {
        api
          .detailed({ id: this.$route.params.id })
          .then((result) => {
            this.uploadGroupTitle.fileList = [];
            this.uploadGroupThumb.fileList = [];
            this.info = result.rentcar;
            this.baiduInfo.address = result.rentcar.address;
            this.baiduInfo.longitude = result.rentcar.longitude;
            this.baiduInfo.latitude = result.rentcar.latitude;
            this.$refs.baiduMap.getClickInfo;
            this.$refs.baiduMap.getLngAndLat();
            if (result.rentcar.titleimgurl != null && result.rentcar.titleimgurl != "") {
              this.uploadGroupTitle.fileList.push({
                url: baseURL.releaseUrl + result.rentcar.titleimgurl,
              });
            }
            if (result.rentcar.icon != null && result.rentcar.icon != "") {
              this.uploadGroupThumb.fileList.push({
                url: baseURL.releaseUrl + result.rentcar.icon,
              });
            }
          })
          .catch(() => {
            this.$message.error("数据获取失败");
          });
      } else {
        //重置参数
        Object.keys(this.info).map((key) => (this.info[key] = ""));
        Object.keys(this.baiduInfo).map((key) => (this.info[key] = ""));
        this.info = {
          id: "",
          name: "",
          type: "",
          seat: "",
          phone: "",
          sort: 0,
          titleimgurl: "",
          icon: "",
          content: "",
          level: "",
          price: "",
          synopsis: "",
        };
        this.baiduInfo = {
          address: "",
          longitude: "",
          latitude: "",
        };
        this.uploadGroupTitle.fileList = [];
        this.uploadGroupThumb.fileList = [];
      }
    },
  },
  created() {},
  //keep-alive 生命周期，
  activated() {
    this.getAdvert();
  },
};
</script>
