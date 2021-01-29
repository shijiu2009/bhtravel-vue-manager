<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="100px">
        <div class="form_item">
          <el-form-item label="线路标题" style="width: 500px">
            <el-input
              v-model="info.title"
              @change="infoChange"
              style="width: 400px"
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
              :title="errorInfo.title.err"
              v-show="errorInfo.title.isErr"
              type="error"
              :closable="false"
              show-icon
            ></el-alert>
          </el-form-item>

          <el-form-item label="线路副标题">
            <el-input
              v-model="info.subtitle"
              @change="infoChange"
              style="width: 400px"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="基本房间数">
            <el-input-number v-model="info.countRooms" :min="0"></el-input-number>
          </el-form-item> -->
          <!-- <el-form-item label="价格">
            <el-input v-model="info.todayPrice"></el-input>
          </el-form-item> -->

          <!-- <el-form-item label="排序" style="width:50%">
            <el-input v-model="info.sort" @change="infoChange"></el-input>
          </el-form-item>-->
          <!-- <el-form-item label="审核" style="width: 50%">
            <el-select v-model="info.reviewStat" placeholder="请选择">
              <el-option
                v-for="item in selects"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item> -->

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
          <el-row>
            <el-col :span="8">
              <el-form-item label="提前预定天数">
                <el-input-number
                  v-model="info.advanceDay"
                  :min="0"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="游玩天数">
                <el-input-number v-model="info.days" :min="0"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="游玩人数">
                <el-input-number
                  v-model="info.players"
                  :min="0"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="游玩花费">
                <el-input v-model="info.salesPrice"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <baiduMap :baiduInfo="baiduInfo" ref="baiduMap"></baiduMap>
          <!-- <el-form-item label="行程天数" style="width: 50%">
            <el-input-number v-model="info.days" :min="0"></el-input-number>
          </el-form-item> -->
          <el-form-item label="预定须知" :required="true">
            <vue-ueditor-wrap
              v-model="info.notice"
              :config="myConfig"
            ></vue-ueditor-wrap>
          </el-form-item>
          <el-form-item label="推荐理由" :required="true">
            <vue-ueditor-wrap
              v-model="info.recommenReasons"
              :config="myConfig"
            ></vue-ueditor-wrap>
          </el-form-item>
          <el-form-item label="产品特色" :required="true">
            <vue-ueditor-wrap
              v-model="info.edge"
              :config="myConfig"
            ></vue-ueditor-wrap>
          </el-form-item>
          <el-form-item label="费用说明" :required="true">
            <vue-ueditor-wrap
              v-model="info.priceintroduction"
              :config="myConfig"
            ></vue-ueditor-wrap>
          </el-form-item>
          <el-form-item label="行程安排" :required="true">
            <vue-ueditor-wrap
              v-model="info.schedule"
              :config="myConfig"
            ></vue-ueditor-wrap>
          </el-form-item>
          <!-- <el-form-item label="详细行程">
            <el-button type="success" @click="addTrip">添加</el-button>
            <div style="margin-top: 10px">
              <div :gutter="20" v-for="(eItem, index) in trips" :key="index">
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="第几天">
                      <el-input
                        v-model="eItem.sorted"
                        placeholder="请输入内容"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="标题">
                      <el-input v-model="eItem.title" placeholder="请输入内容"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="旅游餐饮">
                      <el-input v-model="eItem.food" placeholder="请输入内容"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="入住酒店">
                      <el-input v-model="eItem.hotel" placeholder="请输入内容"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="16">
                    <el-form-item label="集合计划">
                      <el-input
                        v-model="eItem.gather"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入内容"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :offset="2" :span="4">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      @click="deleteTrip(index)"
                    ></el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-form-item> -->
          <el-form-item label="线路套餐">
            <!-- <el-button type="success" @click="addSub">添加</el-button> -->
            <div style="margin-top: 30px">
              <div :gutter="20" v-for="(eItem, index) in psubList" :key="index">
                <el-row>
                  <!-- <el-col :span="10">
                    <el-form-item label="套餐标题">
                      <el-input v-model="eItem.title" placeholder="请输入内容"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="默认套餐">
                      <el-radio-group
                        v-model="eItem.theDefault"
                        @change="defaultChange(index)"
                      >
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="人数">
                      <el-input-number v-model="eItem.peoNum" :min="0"></el-input-number>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="是否下架">
                      <el-radio-group v-model="eItem.down">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="排序">
                      <el-input-number v-model="eItem.sort" :min="0"></el-input-number>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="16">
                    <el-form-item label="套餐说明">
                      <el-input
                        v-model="eItem.info"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入内容"
                      ></el-input>
                    </el-form-item>
                  </el-col> -->
                  <div style="margin-top: 10px">
                    {{ eItem.title }}
                  </div>
                  <el-col :offset="2" :span="4" style="margin-top: -18px">
                    <el-button
                      type="primary"
                      round
                      icon="el-icon-edit"
                      circle
                      title="编辑"
                      @click="openTable(index)"
                    ></el-button>
                    <!-- <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      @click="deleteSub(index)"
                    ></el-button> -->
                  </el-col>
                </el-row>
              </div>
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
              }}<el-button type="text" @click="deleteProduct(index)"
                >删除</el-button
              >
            </span>
          </el-card>
          <el-form-item label="热门推荐" class="buttom-con">
            <el-radio-group
              v-model="info.indexRecommend"
              class="buttom-con-son"
            >
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="热门搜索" class="buttom-con">
            <el-radio-group v-model="info.hotSearch" class="buttom-con-son">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="开放预定" class="buttom-con">
            <el-radio-group v-model="info.isOpen" class="buttom-con-son">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否下架" class="buttom-con">
            <el-radio-group v-model="info.down" class="buttom-con-son">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- <el-row>
            <el-col :span="3">
              <el-form-item label="图片集合"></el-form-item>
            </el-col>
            <UploadFile
              @uploadValue="uploadValue"
              ref="UploadFile"
              :uploadGroup="uploadGroupOne"
            ></UploadFile>
          </el-row> -->
        </div>
        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">表单提交</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>

      <!-- 对话框 -->
      <el-dialog
        title="套餐价格"
        :visible.sync="dialogTableVisible"
        class="dialog"
      >
        <el-form>
          <el-row>
            <el-col :span="12">
              <el-form-item label="日期">
                <div class="timePicker">
                  <el-date-picker
                    v-model="priceTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                  ></el-date-picker>
                </div>
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="3">
              <el-form-item label="门市价">
                <el-input
                  v-model="storePrice"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="3">
              <el-form-item label="结算底价">
                <el-input
                  v-model="flooerprice"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="3">
              <el-form-item label="App售价">
                <el-input
                  v-model="appPrice"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-button type="success" @click="addTablePrice()">添加</el-button>
            <el-button type="danger" @click="deleteTablePrice()"
              >全部删除</el-button
            >
          </el-row>
        </el-form>
        <el-table :data="subPrices">
          <el-table-column property="departureDate" label="日期" width="150">
            <template slot-scope="scope">
              <el-date-picker
                v-model="subPrices[scope.$index].departureDate"
                :placeholder="scope.row.departureDate"
                align="right"
                type="date"
              ></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column property="storePrice" label="门店价" width="200">
            <template slot-scope="scope">
              <el-input
                v-model="subPrices[scope.$index].storePrice"
                :placeholder="scope.row.storePrice"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column property="flooerprice" label="结算底价">
            <template slot-scope="scope">
              <el-input
                v-model="subPrices[scope.$index].flooerprice"
                :placeholder="scope.row.flooerprice"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="app售价">
            <template slot-scope="scope">
              <el-input
                v-model="subPrices[scope.$index].price"
                :placeholder="scope.row.price"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="删除">
            <template slot-scope="scope">
              <el-button
                type="danger"
                @click="deletePrice(scope.$index)"
                icon="el-icon-delete"
                circle
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <!-- <el-button @click="dialogTableVisible = false">取 消</el-button> -->
          <el-button type="primary" @click="confirmPrice">确 定</el-button>
        </div>
      </el-dialog>
      <productDialog
        :dialogTableProduct.sync="dialogTableProducts"
        @SelectionComplete="SelectionComplete"
      ></productDialog>
    </div>
  </div>
</template>
<script src="http://libs.baidu.com/jquery/1.9.1/jquery.js"></script>
<script>
import api from "@/api/reserveManager/periphery.js";
import { mapMutations,mapGetters } from "vuex";
import UploadFile from "@/components/uploadImage/uploadImage.vue";
import { deleteKeys } from "@/api/deleteKeys.js";
import baseURL from "@/config/baseUrl.js";
//百度地图
import baiduMap from "@/components/baiduMap/baiduMap.vue";
import productDialog from "@/components/productsDialog";
//富文本框
import VueUeditorWrap from "vue-ueditor-wrap";
import ueditor from "@/assets/js/ueditorConfig.js";
//jQuery
export default {
  name: "addOrEditPeriphery",
  components: {
    UploadFile,
    VueUeditorWrap,
    baiduMap,
    productDialog
  },
  data() {
    return {
      info: {
        title: "",
        subtitle: "",
        titlePath: "",
        thumbPath: "",
        indexRecommend: 0,
        indexRecommendSort: 0,
        hotSearch: 0,
        recommenReasons: "",
        priceintroduction: "",
        days: "",
        schedule: "",
        createTime: "",
        editTime: "",
        isOpen: 0,
        down: 0,
        advanceDay: 0,
        days: 0,
        address: "",
        longitude: "0.0",
        latitude: "0.0",
        trips: [],
        psubList: [],
        ptImgs: [],
        defaultTravelSub: "",
        products: [],
        players: 0,
        salesPrice: "",
        countRooms: 0,
        // reviewStat: 0,
      },
      myConfig: ueditor.myConfig,

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
      trips: [],
      psubList: [
        {
          title: "成人价",
          theDefault: 0,
          info: "默认套餐",
          down: 0,
        },
        {
          title: "儿童价",
          theDefault: 1,
          info: "默认套餐",
          down: 0,
        },
      ],
      ptImgs: [],
      trip: {
        title: "",
        sorted: "",
        gather: "",
        route: "",
        hotel: "",
        introduce: "",
        pic: "",
      },
      psub: {
        title: "",
        theDefault: 0,
        peoNum: "",
        info: "",
        price: "",
        sort: 0,
        down: 0,
      },
      subPrices: [],
      indexPrices: 0,
      cachePrices: [],
      subPrice: {
        pid: "",
        psubId: "",
        appPrice: "",
        storePrice: "",
        flooerprice: "",
        departureDate: "",
        createTime: "",
        editTime: "",
      },
      priceTime: "",
      storePrice: "",
      flooerprice: "",
      appPrice: "",
      products: [],
      total: 0,
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() <
            new Date(new Date(new Date().toLocaleDateString()).getTime())
          );
        },
        // shortcuts: [
        //   {
        //     text: "今天",
        //     onClick(picker) {
        //       picker.$emit("pick", new Date());
        //     },
        //   },
        //   {
        //     text: "昨天",
        //     onClick(picker) {
        //       const date = new Date();
        //       date.setTime(date.getTime() - 3600 * 1000 * 24);
        //       picker.$emit("pick", date);
        //     },
        //   },
        //   {
        //     text: "一周前",
        //     onClick(picker) {
        //       const date = new Date();
        //       date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        //       picker.$emit("pick", date);
        //     },
        //   },
        // ],
      },
      //對話框
      dialogTableVisible: false,
      //对话框
      dialogTableProducts: false,
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
      BMap: null,
      map: null,
      selectProducts: [],
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
      this.info.titlePath = data.filePath;
    },
    thumbValue: function (data) {
      this.info.thumbPath = data.filePath;
    },
    uploadValue: function (data) {
      this.ptImgs = data.filePath;
    },
    //添加行程详情
    addTrip: function () {
      this.trips.push(JSON.parse(JSON.stringify(this.trip)));
    },
    //添加线路套餐
    addSub: function () {
      this.psubList.push(JSON.parse(JSON.stringify(this.psub)));
    },
    //删除行程详情
    deleteTrip: function (index) {
      this.trips.splice(index, 1)[0];
    },
    //删除行程详情
    deleteSub: function (index) {
      this.psubList.splice(index, 1)[0];
    },
    //设置套餐价格
    editPrice: function () {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    openTable(index) {
      this.dialogTableVisible = true;
      this.indexPrices = index;
      this.subPrices = [];
      this.subPrices =
        this.cachePrices[index] == undefined ? [] : this.cachePrices[index];
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
    addTablePrice: function () {
      let oneDay = 1000 * 60 * 60 * 24;
      for (
        let i = this.priceTime[0].getTime();
        i <= this.priceTime[1].getTime();
        i += oneDay
      ) {
        let date = new Date(i);
        let month = date.getMonth() + 1;
        let days = date.getDate();
        if (month < 10) {
          month = "0" + month;
        }
        if (days < 10) {
          days = "0" + days;
        }
        this.subPrices.push({
          departureDate: date.getFullYear() + "-" + month + "-" + days,
          trueDate: date,
          storePrice: this.storePrice,
          flooerprice: this.flooerprice,
          price: this.appPrice,
        });
      }
    },
    deletePrice(index) {
      this.subPrices.splice(index, 1);
    },
    deleteTablePrice() {
      this.subPrices = [];
    },
    confirmPrice() {
      this.dialogTableVisible = false;
      this.cachePrices[this.indexPrices] = this.subPrices;
    },
    //提交表单
    onSubmit: function () {
      // let isCheck = this.infoChange();
      // if (!isCheck) {
      //   return;
      // }
      let arr = [];
      this.info.psubList = [];
      this.info.defaultTravelSub = new Object();
      this.info.ptImgs = [];
      this.info.trips = [];
      this.info.address = this.baiduInfo.address;
      this.info.longitude = this.baiduInfo.longitude;
      this.info.latitude = this.baiduInfo.latitude;
      this.info.proxcode = this.baiduInfo.proxcode;
      this.info.cityxcode = this.baiduInfo.cityxcode;
      this.info.countyxcode = this.baiduInfo.countyxcode;

      deleteKeys(this.info, "prices", this);

      for (let i = 0; i < this.psubList.length; i++) {
        this.info["psubList[" + i + "].id"] = this.psubList[i].id;
        this.info["psubList[" + i + "].info"] = this.psubList[i].info;
        this.info["psubList[" + i + "].title"] = this.psubList[i].title;
        this.info["psubList[" + i + "].theDefault"] = this.psubList[
          i
        ].theDefault;
        this.info["psubList[" + i + "].peoNum"] = this.psubList[i].peoNum;
        this.info["psubList[" + i + "].price"] = this.psubList[i].price;
        this.info["psubList[" + i + "].sort"] = this.psubList[i].sort;
        this.info["psubList[" + i + "].down"] = this.psubList[i].down;

        if (this.cachePrices[i] != null && this.cachePrices[i] != "") {
          for (let j = 0; j < this.cachePrices[i].length; j++) {
            this.info[
              "psubList[" + i + "].prices[" + j + "].storePrice"
            ] = this.cachePrices[i][j].storePrice;
            this.info[
              "psubList[" + i + "].prices[" + j + "].price"
            ] = this.cachePrices[i][j].price;
            this.info[
              "psubList[" + i + "].prices[" + j + "].flooerprice"
            ] = this.cachePrices[i][j].flooerprice;
            this.info[
              "psubList[" + i + "].prices[" + j + "].departureDate"
            ] = this.cachePrices[i][j].departureDate;
          }
        }
      }
      for (let i = 0; i < this.trips.length; i++) {
        this.info["trips[" + i + "].id"] = this.trips[i].id;
        this.info["trips[" + i + "].title"] = this.trips[i].title;
        this.info["trips[" + i + "].sorted"] = this.trips[i].sorted;
        this.info["trips[" + i + "].gather"] = this.trips[i].gather;
        this.info["trips[" + i + "].route"] = this.trips[i].route;
        this.info["trips[" + i + "].hotel"] = this.trips[i].hotel;
        this.info["trips[" + i + "].food"] = this.trips[i].food;
      }
      for (let i = 0; i < this.uploadGroupOne.fileList.length; i++) {
        if ("response" in this.uploadGroupOne.fileList[i]) {
          this.info["ptImgs[" + i + "].path"] = this.uploadGroupOne.fileList[
            i
          ].response.filePath;
        } else {
          var pos = this.uploadGroupOne.fileList[i].url.lastIndexOf(
            baseURL.imgUrl
          );
          let url = this.uploadGroupOne.fileList[i].url.substr(pos);
          this.info["ptImgs[" + i + "].path"] = url;
        }
      }
      if (this.selectProducts != null && this.selectProducts != "") {
        for (let i = 0; i < this.selectProducts.length; i++) {
          this.info["products[" + i + "].id"] = this.selectProducts[i].id;
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
              name: "peripheryList",
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
    getAdvert: function () {
      this.uploadGroupOne.fileList = [];
      this.uploadGroupTitle.fileList = [];
      this.uploadGroupThumb.fileList = [];
      if (this.$route.params && this.$route.params.id) {
        api
          .detailed({ id: this.$route.params.id })
          .then((result) => {
            this.info = result.peripheryTravel;

            this.baiduInfo.address = this.info.address;
            this.baiduInfo.longitude = this.info.longitude;
            this.baiduInfo.latitude = this.info.latitude;
            this.baiduInfo.proxcode = this.info.proxcode;
            this.baiduInfo.cityxcode = this.info.cityxcode;
            this.baiduInfo.countyxcode = this.info.countyxcode;
            this.$refs.baiduMap.getProvinces();
            this.cachePrices = [];
            this.uploadGroupThumb.fileList = [];
            this.trips = [];
            this.uploadGroupOne.fileList = [];
            this.selectProducts = [];
            if (result.publist != null && result.publist.length > 0) {
              this.psubList = result.publist;
            }
            for (let i = 0; i < result.publist.length; i++) {
              if (
                result.publist[i].prices != null &&
                result.publist[i].prices != ""
              ) {
                this.cachePrices[i] = result.publist[i].prices;
              }
            }
            this.trips = result.trips;
            if (
              result.peripheryTravel.titlePath != null &&
              result.peripheryTravel.titlePath != ""
            ) {
              this.uploadGroupTitle.fileList.push({
                url: baseURL.releaseUrl + result.peripheryTravel.titlePath,
              });
            }
            if (
              result.peripheryTravel.thumbPath != null &&
              result.peripheryTravel.thumbPath != ""
            ) {
              this.uploadGroupThumb.fileList.push({
                url: baseURL.releaseUrl + result.peripheryTravel.thumbPath,
              });
            }
            for (let i = 0; i < result.ptImgs.length; i++) {
              this.uploadGroupOne.fileList.push({
                url: baseURL.releaseUrl + result.ptImgs[i].path,
              });
              this.ptImgs.push(result.ptImgs[i].path);
            }
            if (result.proList != null && result.proList != "") {
              this.selectProducts = result.proList;
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
          title: "",
          subtitle: "",
          titlePath: "",
          thumbPath: "",
          indexRecommend: 0,
          indexRecommendSort: 0,
          hotSearch: 0,
          recommenReasons: "",
          priceintroduction: "",
          days: "",
          schedule: "",
          createTime: "",
          editTime: "",
          isOpen: 0,
          down: 0,
          advanceDay: 0,
          days: 0,
          address: "",
          longitude: "0.0",
          latitude: "0.0",
          trips: [],
          psubList: [],
          ptImgs: [],
          defaultTravelSub: "",
          products: [],
          players: 0,
          salesPrice: "",
          countRooms: 0,
          // reviewStat: 0,
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
        this.uploadGroupOne.fileList = [];
        this.uploadGroupTitle.fileList = [];
        this.uploadGroupThumb.fileList = [];
        this.$refs.baiduMap.getProvinces();
      }
    },
    defaultChange(index) {
      for (let i = 0; i < this.psubList.length; i++) {
        if (this.psubList[i].theDefault == 1 && i != index) {
          this.psubList[i].theDefault = 0;
        }
      }
    },
  },
  created() {
    // this.getAdvert();
  },
  //keep-alive 生命周期，
  activated() {
    this.getAdvert();
  },
};
</script>
<style scoped>
.dialog >>> .el-table {
  max-height: 40vh;
  overflow: scroll;
}
</style>