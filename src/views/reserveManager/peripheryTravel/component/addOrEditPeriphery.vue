<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="100px">
        <div class="form_item">
          <el-form-item label="线路标题">
            <el-input v-model="info.title" @change="infoChange"></el-input>
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
            <el-input v-model="info.subtitle" @change="infoChange"></el-input>
          </el-form-item>
          <!-- <el-form-item label="排序" style="width:50%">
            <el-input v-model="info.sort" @change="infoChange"></el-input>
          </el-form-item>-->
          <el-form-item label="审核" style="width: 50%">
            <el-select v-model="info.reviewStat" placeholder="请选择">
              <el-option
                v-for="item in selects"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
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
          <el-row>
            <el-col :span="6">
              <el-form-item label="提前预定天数">
                <el-input
                  v-model="info.advanceDay"
                  @change="infoChange"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="行程时间">
                <el-input
                  v-model="info.schedule"
                  @change="infoChange"
                  placeholder="仅描述产品行程总时间，如：两日一夜"
                ></el-input>
              </el-form-item>
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
                    v-model="info.longitude"
                    @change="infoChange"
                  ></el-input>
                </el-col>
                <el-col :span="8">
                  纬度：
                  <el-input
                    id="lat"
                    style="display: inline-block; width: 80%"
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
                style="width: 500px; height: 300px"
                @click="getClickInfo"
                :scroll-wheel-zoom="true"
              ></baidu-map>
            </el-col>
          </el-row>
          <el-form-item label="行程天数" style="width: 50%">
            <el-input v-model="info.days" @change="infoChange"></el-input>
          </el-form-item>
          <el-form-item label="预定须知" :required="true">
            <quill-editor
              ref="myTextEditor"
              v-model="info.notice"
              :options="options.reserveOption"
            ></quill-editor>
          </el-form-item>
          <el-form-item label="推荐理由" :required="true">
            <quill-editor
              ref="my1TextEditor"
              v-model="info.recommenReasons"
              :options="options.recommenOption"
            ></quill-editor>
          </el-form-item>
          <el-form-item label="行程亮点" :required="true">
            <quill-editor
              ref="my3TextEditor"
              v-model="info.edge"
              :options="options.edgeOption"
            ></quill-editor>
          </el-form-item>
          <el-form-item label="价格介绍" :required="true">
            <quill-editor
              ref="my2TextEditor"
              v-model="info.priceintroduction"
              :options="options.introductionOption"
            ></quill-editor>
          </el-form-item>
          <el-form-item label="详细行程">
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
                      <el-input
                        v-model="eItem.title"
                        placeholder="请输入内容"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="旅游餐饮">
                      <el-input
                        v-model="eItem.food"
                        placeholder="请输入内容"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="入住酒店">
                      <el-input
                        v-model="eItem.hotel"
                        placeholder="请输入内容"
                      ></el-input>
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
          </el-form-item>
          <el-form-item label="线路套餐">
            <el-button type="success" @click="addSub">添加</el-button>
            <div style="margin-top: 10px">
              <div :gutter="20" v-for="(eItem, index) in psubList" :key="index">
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="套餐标题">
                      <el-input
                        v-model="eItem.title"
                        placeholder="请输入内容"
                      ></el-input>
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
                      <el-input
                        v-model="eItem.peoNum"
                        placeholder="请输入内容"
                      ></el-input>
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
                  </el-col>
                  <el-col :offset="2" :span="4">
                    <el-button
                      type="primary"
                      round
                      icon="el-icon-edit"
                      circle
                      title="编辑"
                      @click="openTable(index)"
                    ></el-button>
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      @click="deleteSub(index)"
                    ></el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="关联产品">
            <el-button type="success" @click="addProducts">添加</el-button>
          </el-form-item>

          <el-form-item label="热门推荐">
            <el-radio-group v-model="info.indexRecommend">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="热门搜索">
            <el-radio-group v-model="info.hotSearch">
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
          <el-row>
            <el-col :span="3">
              <el-form-item label="图片集合"></el-form-item>
            </el-col>
            <UploadFile
              @uploadValue="uploadValue"
              ref="UploadFile"
              :uploadGroup="uploadGroupOne"
            ></UploadFile>
          </el-row>
        </div>
        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">表单提交</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>

      <!-- 对话框 -->
      <el-dialog title="套餐价格" :visible.sync="dialogTableVisible">
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
                :picker-options="pickerOptions"
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

      <!-- 对话框 -->
      <el-dialog title="关联产品" :visible.sync="dialogTableProducts">
        <el-table :data="products" ref="productsTable">
          <el-table-column type="selection"> </el-table-column>
          <el-table-column property="name" label="名称">
            <template slot-scope="scope">
              <el-input
                :placeholder="scope.row.name"
                :disabled="true"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column property="classId" label="所属分类">
            <template slot-scope="scope">
              <el-input
                :placeholder="scope.row.classId"
                :disabled="true"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column property="isOpen" label="开放预定">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.isOpen == '1' ? 'success' : 'primary'"
                disable-transitions
                >{{ scope.row.isOpen == "1" ? "是" : "否" }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column property="hotSearch" label="热门搜索">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.hotSearch == '1' ? 'success' : 'primary'"
                disable-transitions
                >{{ scope.row.hotSearch == "1" ? "是" : "否" }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="是否下架">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.down == '1' ? 'success' : 'primary'"
                disable-transitions
                >{{ scope.row.down == "1" ? "是" : "否" }}</el-tag
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination small layout="prev, pager, next" :total="total">
        </el-pagination>
        <div slot="footer" class="dialog-footer">
          <!-- <el-button @click="dialogTableVisible = false">取 消</el-button> -->
          <el-button type="primary" @click="confirmProducts">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script src="http://libs.baidu.com/jquery/1.9.1/jquery.js"></script>
<script>
import api from "@/api/reserveManager/periphery.js";
import productApi from "@/api/reserveManager/product.js";
import { mapMutations } from "vuex";
import UploadFile from "@/components/uploadImage/uploadImage.vue";
import quillConfig from "@/assets/js/quill-config.js";
import baseURL from "@/config/baseUrl.js";
//富文本框
import { quillEditor } from "vue-quill-editor";
//jQuery
export default {
  name: "addOrEditPeriphery",
  components: {
    UploadFile,
    quillEditor,
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
        advanceDay: "",
        address: "",
        longitude: "0.0",
        latitude: "0.0",
        trips: [],
        psubList: [],
        ptImgs: [],
        defaultTravelSub: "",
        products: [],
      },
      trips: [],
      psubList: [],
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
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
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
      this.info.titlePath = data.filePath;
      console.log(data.filePath);
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
    addProducts: function () {
      this.dialogTableProducts = true;
      productApi
        .getAllList(this.page)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.products = result.rows;
          this.total = result.total;
          this.$nextTick(function () {
            this.products.forEach((product, i) => {
              this.selectProducts.forEach((selectProduct, j) => {
                if (
                  this.products[i] != null &&
                  this.selectProducts[j] != null &&
                  this.products[i].id == this.selectProducts[j].id
                ) {
                  this.$refs.productsTable.toggleRowSelection(
                    this.products[i],
                    true
                  );
                }
              });
            });
          });
        })
        .catch(() => {
          this.loading = false; //关掉加载动画
          this.$message.error("查询出错");
        });
    },
    confirmProducts: function () {
      this.dialogTableProducts = false;
      this.selectProducts.concat(this.$refs.productsTable.selection);
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
      let isCheck = this.infoChange();
      if (!isCheck) {
        return;
      }
      let arr = [];
      this.info.psubList = [];
      this.info.defaultTravelSub = new Object();
      this.info.ptImgs = [];
      this.info.trips = [];
      for (let i = 0; i < this.psubList.length; i++) {
        this.info["psubList[" + i + "].id"] = this.psubList[i].id;
        this.info["psubList[" + i + "].info"] = this.psubList[i].info;
        this.info["psubList[" + i + "].title"] = this.psubList[i].title;
        this.info["psubList[" + i + "].theDefault"] = this.psubList[
          i
        ].theDefault;
        this.info["psubList[" + i + "].peoNum"] = this.psubList[i].peoNum;
        this.info["psubList[" + i + "].price"] = this.psubList[i].price;

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
          var pos = this.uploadGroupOne.fileList[i].url.lastIndexOf(baseURL.imgUrl);
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
              path: "/travel/periphery/list",
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
            //取消富文本框焦点，防止页面滚动
            this.quill(this.$refs.myTextEditor);
            this.quill(this.$refs.my1TextEditor);
            this.quill(this.$refs.my2TextEditor);
            this.quill(this.$refs.my3TextEditor);
            this.info = result.peripheryTravel;
            //取消富文本框焦点，防止页面滚动

            this.psubList = result.publist;
            for (let i = 0; i < result.publist.length; i++) {
              if (
                result.publist[i].prices != null &&
                result.publist[i].prices != ""
              ) {
                this.cachePrices.push(result.publist[i].prices);
              }
            }
            console.log(this.cachePrices);
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
        map.centerAndZoom("崇左龙州", 15); // 初始化地图,设置城市和地图级别。
      }
    },
    getClickInfo(e) {
      this.map.clearOverlays();
      let BMap = this.BMap;
      let point = new BMap.Point(e.point.lng, e.point.lat);
      let marker = new BMap.Marker(point); // 创建标注
      this.map.addOverlay(marker); // 将标注添加到地图中
      marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
      this.info.longitude = e.point.lng;
      this.info.latitude = e.point.lat;
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
              this_.info.longitude = point.lng;
              this_.info.latitude = point.lat;
              map.addOverlay(marker);
              marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
            }
          },
          "广西壮族自治区"
        );
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
    this.getAdvert();
  },
  //keep-alive 生命周期，
  activated() {
    // this.getAdvert();
  },
};
</script>