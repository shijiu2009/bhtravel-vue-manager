<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="90px">
        <div class="form_item">
          <el-form-item label="分类" style="width:50%">
            <el-select v-model="info.byId" placeholder="请选择">
              <el-option
                v-for="item in selects"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="信息名称">
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
          <el-row>
            <el-col :span="3">
              <el-form-item label="图片(100*66)"></el-form-item>
            </el-col>
            <UploadFile @uploadValue="titleValue" :uploadGroup="uploadGroupTitle"></UploadFile>
          </el-row>
          <baiduMap :baiduInfo="baiduInfo" ref="baiduMap"></baiduMap>
          <!-- <el-row>
            <el-form-item label="地址">
              <el-col :span="8">
                <el-input v-model="info.address" @change="infoChange" style="width:90%"></el-input>
              </el-col>
              <el-col :span="8">
                <el-button type="info" @click="getLngAndLat()">解析地址</el-button>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="位置信息">
              <el-col>
                <el-col :span="8">
                  经度：
                  <el-input
                    id="lng"
                    style="display:inline-block;width:80%"
                    v-model="info.longitude"
                    @change="infoChange"
                  ></el-input>
                </el-col>
                <el-col :span="8">
                  纬度：
                  <el-input
                    id="lat"
                    style="display:inline-block;width:80%"
                    v-model="info.latitude"
                    @change="infoChange"
                  ></el-input>
                </el-col>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :offset="3">
              <baidu-map
                @ready="handler"
                style="width: 500px; height: 300px;"
                @click="getClickInfo"
                :scroll-wheel-zoom="true"
              ></baidu-map>
            </el-col>
          </el-row>-->
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
import api from "@/api/serviceInformation.js";
import { mapMutations } from "vuex";
import quillConfig from "@/assets/js/quill-config.js";
import UploadFile from "@/components/uploadImage/uploadImage.vue";
import baseURL from "@/config/baseUrl.js";
import baiduMap from "@/components/baiduMap/baiduMap.vue";
export default {
  components: {
    baiduMap,
    UploadFile,
  },
  name: "addOrEditAtlas",
  data() {
    return {
      info: {
        id: "",
        name: "",
        byId: "",
        imgpath: "",
        address: "",
        longitude: "",
        latitude: "",
      },
      baiduInfo: {
        address: "",
        longitude: "",
        latitude: "",
      },
      selects: [],
      //图片上传组件信息
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
      options: {
        appOption: quillConfig,
        webOption: quillConfig,
      },
      imgPaths: [],
    };
  },
  methods: {
    ...mapMutations({
      deleteTags: "DELETE_TAGSLIST",
    }),
    //信息校验
    infoChange: function () {
      let isCheck = true;
      if (this.info.name) {
        this.errorInfo.title.isErr = false;
      } else {
        this.errorInfo.title.isErr = true;
        isCheck = false;
      }
      return isCheck;
    },
    //添加路径
    titleValue: function (data) {
      this.info.imgpath = data.filePath;
    },
    thumbValue: function (data) {
      this.info.thumbPath = data.filePath;
    },
    indexValue: function (data) {
      this.info.indeximgurl = data.filePath;
    },
    headImgValue: function (data) {
      this.info.headImg = data.filePath;
    },
    //提交表单
    onSubmit: function () {
      this.info.address = this.baseInfo.address;
      this.info.latitude = this.baseInfo.latitude;
      this.info.longitude = this.baseInfo.longitude;
      let isCheck = this.infoChange();
      if (!isCheck) {
        return;
      }
      api
        .addOrEdit(this.info)
        .then((result) => {
          if (result.success) {
            this.$message.success("提交成功！");
            this.deleteTags(this.$route.fullPath); //关闭当前窗口
            //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
            this.$router.push({
              name: "serviceInformationList",
              params: { flow: true },
            });
          } else {
            if (this.info.id) {
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
      if (this.$route.params && this.$route.params.Id) {
        api
          .detailed({ id: this.$route.params.Id })
          .then((result) => {
            this.info = result.serviceInformation;
            this.uploadGroupTitle.fileList.push({
              url: baseURL.releaseUrl + result.serviceInformation.imgpath,
            });
            this.baiduInfo.address = result.serviceInformation.address;
            this.baiduInfo.longitude = result.serviceInformation.longitude;
            this.baiduInfo.latitude = result.serviceInformation.latitude;
            this.$refs.baiduMap.getLngAndLat();
          })
          .catch(() => {
            this.$message.error("数据获取失败");
          });
      }
      api.getClassList().then((result) => {
        if (result.rows && result.rows.length > 0) {
          for (let i = 0; i < result.rows.length; i++) {
            let obj = result.rows[i];
            let classes = {
              value: obj.id,
              label: obj.name,
            };
            this.selects.push(classes);
          }
        }
      });
    },
    // //百度地图初始化
    // handler({ BMap, map }) {
    //   this.BMap = BMap;
    //   this.map = map;
    //   let lng = this.info.longitude;
    //   let lat = this.info.latitude;
    //   if (lng && lat && lng != "0.0" && lat != "0.0") {
    //     let point = new BMap.Point(lng, lat);
    //     map.centerAndZoom(point, 15);
    //     let marker = new BMap.Marker(point); // 创建标注
    //     map.addOverlay(marker); // 将标注添加到地图中
    //     marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    //   } else {
    //     map.centerAndZoom("崇左龙州", 15); // 初始化地图,设置城市和地图级别。
    //   }
    // },
    // getClickInfo(e) {
    //   this.map.clearOverlays();
    //   let BMap = this.BMap;
    //   let point = new BMap.Point(e.point.lng, e.point.lat);
    //   let marker = new BMap.Marker(point); // 创建标注
    //   this.map.addOverlay(marker); // 将标注添加到地图中
    //   marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    //   this.info.longitude = e.point.lng;
    //   this.info.latitude = e.point.lat;
    // },
    // getLngAndLat() {
    //   let address = this.info.address;
    //   if (address && address.length > 0) {
    //     let this_ = this;
    //     let BMap = this.BMap;
    //     this.map.clearOverlays();
    //     let myGeo = new BMap.Geocoder();
    //     myGeo.getPoint(
    //       address,
    //       function (point) {
    //         if (point) {
    //           let BMap = this_.BMap;
    //           let map = this_.map;
    //           map.centerAndZoom(point, 16);
    //           var marker = new BMap.Marker(point); // 创建标注
    //           this_.info.longitude = point.lng;
    //           this_.info.latitude = point.lat;
    //           map.addOverlay(marker);
    //           marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    //         }
    //       },
    //       "广西壮族自治区"
    //     );
    //   }
    // },
  },
  created() {
    this.getAdvert();
  },
  //keep-alive 生命周期，
  activated() {
    // this.getAdvert();
  },
};
</script>