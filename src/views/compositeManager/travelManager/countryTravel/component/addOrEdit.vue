<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="auto">
        <div class="form_item">
          <el-form-item label="农家乐名称">
            <el-input v-model="info.name" style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-radio-group v-model="info.type" @change="typeChange">
              <el-radio :label="1">乡村旅游</el-radio>
              <el-radio :label="2">农家乐</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="首页提示语">
            <el-input v-model="info.indexTip" style="width: 400px"></el-input>
          </el-form-item>
          <!-- <el-form-item label="最大游客承载量">
            <el-input v-model="info.maxCustom"></el-input>
          </el-form-item>
          <el-form-item label="瞬时游客承载量">
            <el-input v-model="info.nowCustom"></el-input>
          </el-form-item> -->
          <el-form-item label="推荐指数" class="rank">
            <el-rate v-model="info.recommadStars" show-text> </el-rate>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="info.sort" style="width: 400px"></el-input>
          </el-form-item>
          <!-- <el-form-item label="主题" style="width: 50%">
            <el-select
              v-model="info.themeId"
              placeholder="请选择"
              @change="themesChange"
            >
              <el-option
                v-for="item in themes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="星级乡村" style="width: 50%">
            <el-select v-model="info.bstars" placeholder="请选择">
              <el-option
                v-for="item in starts"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核" style="width: 50%">
            <el-select v-model="info.isCheck" placeholder="请选择">
              <el-option
                v-for="item in selects"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="封面图片">
            <UploadFile
              @uploadValue="titleValue"
              ref="uploadGroupTitle"
              :uploadGroup="uploadGroupTitle"
            ></UploadFile>
          </el-form-item>

          <el-form-item label="缩略图图片">
            <UploadFile
              @uploadValue="thumbValue"
              ref="uploadGroupThumb"
              :uploadGroup="uploadGroupThumb"
            ></UploadFile>
          </el-form-item>

          <el-form-item label="联系方式">
            <el-input v-model="info.phone"></el-input>
          </el-form-item>
          <baiduMap :baiduInfo="baiduInfo" ref="baiduMap"></baiduMap>
          <el-form-item label="开放时间">
            <el-input v-model="info.opening" style="width: 400px"></el-input>
          </el-form-item>
          <!-- <el-form-item label="提前预定天数">
            <el-input v-model="info.advanceDay"></el-input>
          </el-form-item> -->
          <el-form-item label="最晚预定时间">
            <el-time-picker
              v-model="info.lastReserveTime"
              value-format="HH:mm:ss"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59',
              }"
              placeholder="最晚预定时间"
            >
            </el-time-picker>
          </el-form-item>
          <!-- <el-form-item label="今日价格">
            <el-input v-model="info.todayPrice"></el-input>
          </el-form-item> -->
          <el-form-item label="预定须知" :required="true">
            <vue-ueditor-wrap v-model="info.notice" :config="myConfig"></vue-ueditor-wrap>
          </el-form-item>
          <el-form-item label="推荐理由" :required="true">
            <vue-ueditor-wrap
              v-model="info.summary"
              :config="myConfig"
            ></vue-ueditor-wrap>
          </el-form-item>
          <el-form-item label="介绍（微信小程序、APP）" :required="true">
            <vue-ueditor-wrap v-model="info.info" :config="myConfig"></vue-ueditor-wrap>
          </el-form-item>
          <!-- <el-form-item label="公告" :required="true">
            <quill-editor
              ref="my4TextEditor"
              v-model="info.infoWeb"
              :options="options.surroundingOption"
            ></quill-editor>
          </el-form-item> -->
          <el-form-item label="交通信息" :required="true">
            <vue-ueditor-wrap
              v-model="info.traffic"
              :config="myConfig"
            ></vue-ueditor-wrap>
          </el-form-item>
          <el-form-item label="添加项目">
            <el-button type="success" @click="addTicket">添加</el-button>
            <div style="margin-top: 10px">
              <el-row
                :gutter="20"
                v-for="(eItem, index) in this.tickets"
                :key="index"
                style="box-shadow: 0px 0px 8px #888; padding: 10px"
              >
                <el-button type="danger" @click="deleteTitket(index)">删除</el-button>
                <span style="margin-left: 40px"
                  >第{{ tickets.length - index }}个项目，共{{
                    tickets.length
                  }}个项目</span
                >
                <el-row>
                  <el-form-item label="项目名称">
                    <el-input
                      v-model="eItem.name"
                      placeholder="请输入内容"
                      style="width: 300px"
                    ></el-input>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="图片">
                    <UploadFile
                      @uploadValue="ticketValue(index)"
                      ref="uploadGroupTicket"
                      :uploadGroup="eItem.uploadGroupTicket"
                    ></UploadFile>
                  </el-form-item>
                </el-row>
                <el-form-item label="项目价格">
                  <el-form-item label="结算底价">
                    <el-input
                      v-model="eItem.floorPrice"
                      placeholder="请输入价格"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="小程序销售价">
                    <el-input
                      v-model="eItem.salePrice"
                      placeholder="请输入价格"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="门店价">
                    <el-input v-model="eItem.price" placeholder="请输入价格"></el-input>
                  </el-form-item>
                  <el-form-item label="排序">
                    <el-input v-model="eItem.sort" placeholder="请输入价格"></el-input>
                  </el-form-item>
                  <el-form-item label="是否下架">
                    <el-radio-group v-model="eItem.down">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="默认项目">
                    <el-radio-group
                      v-model="eItem.isDefault"
                      @change="defaultChange(index)"
                    >
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-form-item>
                <!-- <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="deleteTitket(index)"
                ></el-button> -->
              </el-row>
            </div>
          </el-form-item>

          <el-form-item label="关联产品">
            <el-button type="success" @click="addProducts">添加</el-button>
          </el-form-item>

          <el-card
            class="box-card"
            style="margin-bottom: 20px"
            v-if="selectProducts.length > 0"
          >
            <span
              v-for="(item, index) in selectProducts"
              :key="item.id"
              class="text item"
            >
              {{ item.name
              }}<el-button type="text" @click="deleteProduct(index)">删除</el-button>
            </span>
          </el-card>

          <el-form-item label="首页推荐">
            <el-radio-group v-model="info.indexRecommend">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="开放预定">
            <el-radio-group v-model="info.isOpen">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否下架">
            <el-radio-group v-model="info.down">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="图片集合">
            <UploadFile
              @uploadValue="uploadValue"
              ref="UploadFile"
              :uploadGroup="uploadGroupOne"
            ></UploadFile>
          </el-form-item>
        </div>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">表单提交</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>

      <productDialog
        :dialogTableProduct.sync="dialogTableProducts"
        @SelectionComplete="SelectionComplete"
      ></productDialog>
    </div>
  </div>
</template>
<script>
import api from "@/api/reserveManager/countryTravel.js";
import { analysisResolution } from "@/api/analysis.js";
import { mapMutations } from "vuex";
import UploadFile from "@/components/uploadImage/uploadImage.vue";
import baseURL from "@/config/baseUrl.js";
//百度地图
import baiduMap from "@/components/baiduMap/baiduMap.vue";
import productDialog from "@/components/productsDialog";
//富文本框
import VueUeditorWrap from "vue-ueditor-wrap";
import ueditor from "@/assets/js/ueditorConfig.js";
import { deleteKeys } from "@/api/deleteKeys.js";
export default {
  name: "addOrEditCountryTravel",
  components: {
    baiduMap,
    UploadFile,
    VueUeditorWrap,
    productDialog,
  },
  data() {
    return {
      info: {
        id: "",
        name: "",
        type: 1,
        // isCheck: 0,
        maxCustom: "",
        nowCustom: "",
        indexTip: "",
        bstars: "",
        themeId: "",
        opening: "",
        indexImg: "",
        icon: "",
        phone: "",
        address: "",
        longitude: "",
        latitude: "",
        indexRecommend: 0,
        advanceDay: "",
        lastReserveTime: "",
        todayPrice: "",
        notice: "",
        summary: "",
        info: "",
        infoWeb: "",
        isOpen: 0,
        down: 0,
        sort: 0,
        imgpath: "",
        tickets: [],
        items: [],
        products: [],
        recommadStars: 0,
        traffic: "",
        // pcContent: "", //PC端内容
        // mobileContent: "", //移动端图文内容
      },
      myConfig: ueditor.myConfig,
      //分页数据
      items: [],
      tickets: [],
      products: [],
      total: 0,
      ticket: {
        id: "",
        name: "",
        img: "",
        floorPrice: "",
        salePrice: "",
        price: "",
        sort: 0,
        down: 0,
        isDefault: 0,
      },
      selectProducts: [],
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
      uploadGroupOne: {
        //文件列表
        fileList: [],
        limitCount: 10,
        autoUpload: true,
      },
      uploadGroupTicket: {
        //文件列表
        fileList: [],
        limitCount: 1,
        autoUpload: true,
      },
      selects: [
        {
          value: 0,
          label: "未审核",
        },
        {
          value: 1,
          label: "通过",
        },
        {
          value: 2,
          label: "不通过",
        },
      ],
      themes: [],
      isThemesShow: true, //显示主体内容
      grades: [
        {
          value: "",
          label: "--无--",
        },
        {
          value: "AAAAA",
          label: "AAAAA",
        },
        {
          value: "AAAA",
          label: "AAAA",
        },
        {
          value: "AAA",
          label: "AAA",
        },
        {
          value: "AA",
          label: "AA",
        },
        {
          value: "A",
          label: "A",
        },
      ],
      starts: [
        {
          value: "",
          label: "--无--",
        },
        {
          value: 1,
          label: "广西五星级乡村旅游区",
        },
        {
          value: 3,
          label: "广西四星级乡村旅游区",
        },
        {
          value: 5,
          label: "广西三星级乡村旅游区",
        },
      ],
      //对话框
      dialogTableProducts: false,
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
    defaultChange(index) {
      for (let i = 0; i < this.tickets.length; i++) {
        if (this.tickets[i].isDefault == 1 && i != index) {
          this.tickets[i].isDefault = 0;
        }
      }
    },

    //提交表单
    onSubmit: function () {
      deleteKeys(this.info, "projects", this);
      if (this.uploadGroupOne.fileList != null && this.uploadGroupOne.fileList != "") {
        for (let i = 0; i < this.uploadGroupOne.fileList.length; i++) {
          if ("response" in this.uploadGroupOne.fileList[i]) {
            this.info["items[" + i + "].path"] = this.uploadGroupOne.fileList[
              i
            ].response.filePath;
          } else {
            var pos = this.uploadGroupOne.fileList[i].url.lastIndexOf(baseURL.imgUrl);
            let url = this.uploadGroupOne.fileList[i].url.substr(pos);
            this.info["items[" + i + "].path"] = url;
          }
        }
      }

      if (this.tickets != null && this.tickets != "") {
        analysisResolution(this.info, "projects", this.tickets);
      }

      if (this.selectProducts != null && this.selectProducts != "") {
        for (let i = 0; i < this.selectProducts.length; i++) {
          this.info["products[" + i + "].id"] = this.selectProducts[i].id;
        }
      }
      this.info.address = this.baiduInfo.address;
      this.info.longitude = this.baiduInfo.longitude;
      this.info.latitude = this.baiduInfo.latitude;
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
              name: "countryTravelList",
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
    //添加项目
    addTicket: function () {
      let ticket = JSON.parse(JSON.stringify(this.ticket));
      ticket.uploadGroupTicket = JSON.parse(JSON.stringify(this.uploadGroupTicket));
      this.tickets.unshift(JSON.parse(JSON.stringify(ticket)));
    },
    //添加路径
    titleValue: function (data) {
      this.info.indexImg = data.filePath;
    },
    thumbValue: function (data) {
      this.info.icon = data.filePath;
    },
    uploadValue: function (data) {
      this.info.imgpath = data.filePath;
    },
    ticketValue: function (data) {
      this.tickets[data].img = this.$refs.uploadGroupTicket[
        data
      ].uploadGroup.fileList[0].response.filePath;
    },
    //删除行程详情
    deleteTitket: function (index) {
      this.tickets.splice(index, 1)[0];
    },
    //取消按钮事件
    close: function () {
      this.$router.go(-1);
      document.getElementsByClassName("content")[0].scrollTop = 0;
    },
    deleteProduct: function (index) {
      this.selectProducts.splice(index, 1);
    },

    addProducts: function () {
      this.dialogTableProducts = true;
    },
    SelectionComplete: function (val) {
      this.selectProducts = val;
    },
    themesChange: function (id) {
      let label = this.themes.find((item) => {
        return item.value === id;
      }).label;
      if (label == "乡村旅游") {
        this.isThemesShow = false;
        this.info.qualityGrade = "";
      } else {
        this.isThemesShow = true;
        this.info.bstars = "";
      }
    },
    typeChange: function () {
      if (this.info.type == 1) {
        this.starts = [
          {
            value: "",
            label: "--无--",
          },
          {
            value: 1,
            label: "广西五星级乡村旅游区",
          },
          {
            value: 3,
            label: "广西四星级乡村旅游区",
          },
          {
            value: 5,
            label: "广西三星级乡村旅游区",
          },
        ];
      } else {
        this.starts = [
          {
            value: "",
            label: "--无--",
          },
          {
            value: 2,
            label: "广西五星级农家乐",
          },
          {
            value: 4,
            label: "广西四星级农家乐",
          },
          {
            value: 6,
            label: "广西三星级农家乐",
          },
        ];
      }
    },
    //获取详情信息
    getDetail: function () {
      if (this.$route.params && this.$route.params.id) {
        api
          .detailed({ id: this.$route.params.id })
          .then((result) => {
            this.uploadGroupTitle.fileList = [];
            this.uploadGroupThumb.fileList = [];
            this.uploadGroupTicket.fileList = [];
            this.uploadGroupOne.fileList = [];
            this.tickets = [];
             if (result.type == 1) {
              this.starts = [
                {
                  value: "",
                  label: "--无--",
                },
                {
                  value: 1,
                  label: "广西五星级乡村旅游区",
                },
                {
                  value: 3,
                  label: "广西四星级乡村旅游区",
                },
                {
                  value: 5,
                  label: "广西三星级乡村旅游区",
                },
              ];
            } else {
              this.starts = [
                {
                  value: "",
                  label: "--无--",
                },
                {
                  value: 2,
                  label: "广西五星级农家乐",
                },
                {
                  value: 4,
                  label: "广西四星级农家乐",
                },
                {
                  value: 6,
                  label: "广西三星级农家乐",
                },
              ];
            }
            this.info = result.countryTravel;
            this.baiduInfo.address = this.info.address;
            this.baiduInfo.longitude = this.info.longitude;
            this.baiduInfo.latitude = this.info.latitude;
            this.baiduInfo.proxcode = this.info.proxcode;
            this.baiduInfo.cityxcode = this.info.cityxcode;
            this.baiduInfo.countyxcode = this.info.countyxcode;
            this.$refs.baiduMap.getClickInfo;
            this.$refs.baiduMap.getLngAndLat();
            this.$refs.baiduMap.getProvinces();
           
            if (
              result.countryTravel.indexImg != null &&
              result.countryTravel.indexImg != ""
            ) {
              this.uploadGroupTitle.fileList.push({
                url: baseURL.releaseUrl + result.countryTravel.indexImg,
              });
            }
            if (result.countryTravel.icon != null && result.countryTravel.icon != "") {
              this.uploadGroupThumb.fileList.push({
                url: baseURL.releaseUrl + result.countryTravel.icon,
              });
            }
            if (result.projects != null && result.projects != "") {
              for (let i = 0; i < result.projects.length; i++) {
                this.tickets.push(result.projects[i]);
                let uploadGroupTicket = JSON.parse(
                  JSON.stringify(this.uploadGroupTicket)
                );
                uploadGroupTicket.fileList.push({
                  url: baseURL.releaseUrl + result.projects[i].img,
                });
                this.tickets[i].uploadGroupTicket = uploadGroupTicket;
              }
            }
            if (result.hImgs != null && result.hImgs != "") {
              for (let i = 0; i < result.hImgs.length; i++) {
                this.uploadGroupOne.fileList.push({
                  url: baseURL.releaseUrl + result.hImgs[i].path,
                });
              }
            }
            if (result.proList != null && result.proList != "") {
              this.selectProducts = result.proList;
            }
            if (result.themeList != null && result.themeList != "") {
              for (let i = 0; i < result.themeList.length; i++) {
                this.themes.push({
                  value: result.themeList[i].id,
                  label: result.themeList[i].name,
                });
              }
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
          // isCheck: 0,
          maxCustom: "",
          nowCustom: "",
          indexTip: "",
          bstars: "",
          themeId: "",
          opening: "",
          indexImg: "",
          icon: "",
          phone: "",
          address: "",
          longitude: "",
          latitude: "",
          indexRecommend: 0,
          advanceDay: "",
          lastReserveTime: "",
          todayPrice: "",
          notice: "",
          summary: "",
          info: "",
          infoWeb: "",
          isOpen: 0,
          down: 0,
          sort: 0,
          imgpath: "",
          tickets: [],
          items: [],
          products: [],
          recommadStars: 0,
          traffic: "",
          // pcContent: "", //PC端内容
          // mobileContent: "", //移动端图文内容
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
        this.uploadGroupThumb.fileList = [];
        this.uploadGroupTicket.fileList = [];
        this.uploadGroupOne.fileList = [];
        this.tickets = [];
        this.$refs.baiduMap.getProvinces();
      }
    },
  },
  created() {
    // this.getDetail();
  },
  //keep-alive 生命周期，
  activated() {
    this.getDetail();
  },
};
</script>

<style scoped>
.rank >>> .el-form-item__content {
  display: flex;
  align-items: center;
  height: 40px;
}
</style>
