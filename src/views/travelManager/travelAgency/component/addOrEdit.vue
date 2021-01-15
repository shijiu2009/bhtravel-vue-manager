<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="100px">
        <div class="form_item">
          <el-form-item label="旅行社名称">
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
          <el-form-item label="诚信分">
            <el-input v-model="info.score" @change="infoChange"></el-input>
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
          <el-form-item label="联系方式">
            <el-input v-model="info.contact" @change="infoChange"></el-input>
            <el-tooltip
              :content="tigs.title.contact"
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
          <el-row>
            <el-form-item label="地址">
              <el-col :span="8">
                <el-input
                  v-model="info.address"
                  @change="infoChange"
                  style="width: 90%"
                ></el-input>
              </el-col>
              <el-col :span="8">
                <el-button type="info" @click="getLngAndLat()"
                  >解析地址</el-button
                >
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
                    style="display: inline-block; width: 80%"
                    v-model="info.lon"
                    @change="infoChange"
                  ></el-input>
                </el-col>
                <el-col :span="8">
                  纬度：
                  <el-input
                    id="lat"
                    style="display: inline-block; width: 80%"
                    v-model="info.lat"
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
                style="width: 500px; height: 300px"
                @click="getClickInfo"
                :scroll-wheel-zoom="true"
              ></baidu-map>
            </el-col>
          </el-row>
          <el-form-item label="资质经营" :required="true">
            <quill-editor
              ref="my2TextEditor"
              v-model="info.qualification"
              :options="options.qualificationOption"
            ></quill-editor>
          </el-form-item>
          <el-form-item label="介绍（微信小程序、app）" :required="true">
            <quill-editor
              ref="my1TextEditor"
              v-model="info.contentMini"
              :options="options.contentMiniOption"
            ></quill-editor>
          </el-form-item>
          <el-form-item label="介绍（WEB）" :required="true">
            <quill-editor
              ref="my2TextEditor"
              v-model="info.contentWeb"
              :options="options.contentWebOption"
            ></quill-editor>
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
<script src="http://libs.baidu.com/jquery/1.9.1/jquery.js"></script>
<script>
import api from "@/api/travelAgency.js";
import { mapMutations } from "vuex";
import UploadFile from "@/components/uploadImage/uploadImage.vue";
import quillConfig from "@/assets/js/quill-config.js";
import baseURL from "@/config/baseUrl.js";
//富文本框
import { quillEditor } from "vue-quill-editor";
//jQuery
export default {
  name: "addOrEditTravelAgency",
  components: {
    UploadFile,
    quillEditor,
  },
  data() {
    return {
      info: {
        name: "",
        imgPath: "",
        address: "",
        qualification:"",
        lat: "",
        lon: "",
        contentWeb: "",
        contentMini: "",
        contact:"",
      },
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
      options: {
        reserveOption: quillConfig,
        recommenOption: quillConfig,
        edgeOption: quillConfig,
        introductionOption: quillConfig,
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
              this.$message.error("数据更新失败");
            } else {
              this.$message.error("数据添加失败");
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
            console.log(result)
            //取消富文本框焦点，防止页面滚动
            // this.$refs.my1TextEditor.quill.enable(false); //刚开始时，不聚焦
            // this.$refs.my2TextEditor.quill.enable(false); //刚开始时，不聚焦
            // this.$refs.my3TextEditor.quill.enable(false); //刚开始时，不聚焦
            // this.$refs.my4TextEditor.quill.enable(false); //刚开始时，不聚焦
            // this.$refs.my5TextEditor.quill.enable(false); //刚开始时，不聚焦
            // this.$refs.my6TextEditor.quill.enable(false); //刚开始时，不聚焦
            this.info = result.travelAgency;
            if (result.travelAgency.imgPath != null && result.travelAgency.imgPath != "") {
              this.uploadGroupTitle.fileList.push({
                url: baseURL.releaseUrl + result.travelAgency.imgPath,
              });
            }
          })
          .catch((e) => {
            console.info(e)
            this.$message.error("数据获取失败");
          });
      }
    },
    //百度地图初始化
    handler({ BMap, map }) {
      this.BMap = BMap;
      this.map = map;
      let lng = this.info.longitude;
      let lat = this.info.latitude;
      if (lng && lat && lng != "0.0" && lat != "0.0") {
        let point = new BMap.Point(lng, lat);
        map.centerAndZoom(point, 15);
        let marker = new BMap.Marker(point); // 创建标注
        map.addOverlay(marker); // 将标注添加到地图中
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
      } else {
        map.centerAndZoom("北海", 15); // 初始化地图,设置城市和地图级别。
      }
    },
    getClickInfo(e) {
      this.map.clearOverlays();
      let BMap = this.BMap;
      let point = new BMap.Point(e.point.lng, e.point.lat);
      let marker = new BMap.Marker(point); // 创建标注
      this.map.addOverlay(marker); // 将标注添加到地图中
      marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
      this.info.lon = e.point.lng;
      this.info.lat = e.point.lat;
    },
    getLngAndLat() {
      let address = this.info.address;
      if (address && address.length > 0) {
        let this_ = this;
        let BMap = this.BMap;
        this.map.clearOverlays();
        let myGeo = new BMap.Geocoder();
        myGeo.getPoint(
          address,
          function (point) {
            if (point) {
              let BMap = this_.BMap;
              let map = this_.map;
              map.centerAndZoom(point, 16);
              var marker = new BMap.Marker(point); // 创建标注
              this_.info.lon = point.lng;
              this_.info.lat = point.lat;
              map.addOverlay(marker);
              marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
            }
          },
          "广西壮族自治区"
        );
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
    this.getTravelAgency();
  },
  //keep-alive 生命周期，
  activated() {
     //this.getTravelPlace();
  },
};
</script>