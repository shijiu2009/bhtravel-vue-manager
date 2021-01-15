<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="100px">
        <div class="form_item">
          <el-form-item label="民宿名称">
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
          <el-form-item label="主题" style="width: 50%">
            <el-select v-model="info.themeId" placeholder="请选择">
              <el-option
                v-for="item in themes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核" style="width: 50%">
            <el-select v-model="info.status" placeholder="请选择">
              <el-option
                v-for="item in selects"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="酒店类型">
            <el-radio-group v-model="info.hotelOrHome">
              <el-radio :label="1">酒店</el-radio>
              <el-radio :label="2">民宿</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="民宿星级" style="width: 50%">
            <el-select v-model="info.stars" placeholder="请选择">
              <el-option
                v-for="item in starses"
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
          <el-form-item label="最晚入住时间">
            <el-time-picker
              v-model="info.lastDate"
              value-format="HH:mm:ss"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59',
              }"
              placeholder="最晚入住时间"
            >
            </el-time-picker>
          </el-form-item>
          <el-form-item label="可预订时间">
            <el-time-picker
              v-model="info.orderStartDate"
              value-format="HH:mm:ss"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59',
              }"
              placeholder="开始时间"
            >
            </el-time-picker>
            ~
            <el-time-picker
              arrow-control
              v-model="info.orderEndDate"
              value-format="HH:mm:ss"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59',
              }"
              placeholder="结束时间"
            >
            </el-time-picker>
          </el-form-item>
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
          <el-form-item label="排序" style="width: 50%">
            <el-input v-model="info.sort" @change="infoChange"></el-input>
          </el-form-item>
          <el-form-item label="联系人" style="width: 50%">
            <el-input v-model="info.linkman" @change="infoChange"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" style="width: 50%">
            <el-input v-model="info.contact" @change="infoChange"></el-input>
          </el-form-item>
          <el-form-item label="介绍（微信小程序、app）" :required="true">
            <quill-editor
              ref="my1TextEditor"
              v-model="info.info"
              :options="options.infoOption"
            ></quill-editor>
          </el-form-item>
          <el-form-item label="介绍（WEB）" :required="true">
            <quill-editor
              ref="my2TextEditor"
              v-model="info.infoWeb"
              :options="options.infoWebOption"
            ></quill-editor>
          </el-form-item>
          <el-form-item label="交通" :required="true">
            <quill-editor
              ref="my3TextEditor"
              v-model="info.traffic"
              :options="options.trafficOption"
            ></quill-editor>
          </el-form-item>
          <el-form-item label="周边" :required="true">
            <quill-editor
              ref="my4TextEditor"
              v-model="info.surrounding"
              :options="options.surroundingOption"
            ></quill-editor>
          </el-form-item>
          <el-form-item label="预定须知" :required="true">
            <quill-editor
              ref="my5TextEditor"
              v-model="info.notice"
              :options="options.reserveOption"
            ></quill-editor>
          </el-form-item>
          <el-form-item label="推荐理由" :required="true">
            <quill-editor
              ref="my6TextEditor"
              v-model="info.recommandReason"
              :options="options.recommenOption"
            ></quill-editor>
          </el-form-item>
          <el-form-item label="房型">
            <el-button type="success" @click="addSub">添加</el-button>
            <div style="margin-top: 10px">
              <div :gutter="20" v-for="(eItem, index) in roomlist" :key="index">
                <el-row>
                  <el-form-item label="房型名称">
                    <el-input
                      v-model="eItem.name"
                      placeholder="请输入内容"
                    ></el-input>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="房型图片">
                    <UploadFile
                      @uploadValue="roomValue(index)"
                      ref="uploadGroupRoom"
                      :uploadGroup="eItem.uploadGroupRoom"
                    ></UploadFile>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="床型">
                    <el-select v-model="eItem.bedType" placeholder="请选择">
                      <el-option
                        v-for="item in roomTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
                <el-form-item label="面积">
                  <el-input
                    v-model="eItem.area"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="早餐">
                  <el-select v-model="eItem.breakfast" placeholder="请选择">
                    <el-option
                      v-for="item in breakfasts"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="网络">
                  <el-radio-group v-model="eItem.network">
                    <el-radio :label="0">无</el-radio>
                    <el-radio :label="1">有（免费）</el-radio>
                    <el-radio :label="2">有（收费）</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="排序">
                  <el-input
                    v-model="eItem.sort"
                    placeholder="请输入排序"
                  ></el-input>
                </el-form-item>
                <el-form-item label="下架">
                  <el-radio-group v-model="eItem.down">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="默认房型">
                  <el-radio-group
                    v-model="eItem.theDefault"
                    @change="defaultChange(index)"
                  >
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="平日价格">
                  <el-form-item label="门店价">
                    <el-input
                      v-model="eItem.retailPrice"
                      placeholder="请输入价格"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="小程序销售价">
                    <el-input
                      v-model="eItem.salePrice"
                      placeholder="请输入价格"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="结算底价">
                    <el-input
                      v-model="eItem.floorPrice"
                      placeholder="请输入价格"
                    ></el-input>
                  </el-form-item>
                </el-form-item>
                <el-form-item label="周末价格">
                  <el-form-item label="门店价">
                    <el-input
                      v-model="eItem.weeklyRetailPrice"
                      placeholder="请输入价格"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="小程序销售价">
                    <el-input
                      v-model="eItem.weeklySalePrice"
                      placeholder="请输入价格"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="结算底价">
                    <el-input
                      v-model="eItem.weeklyfloorPrice"
                      placeholder="请输入价格"
                    ></el-input>
                  </el-form-item>
                </el-form-item>
                <el-form-item label="周末日期">
                  <el-checkbox-group v-model="eItem.weekly">
                    <el-checkbox label="2">周一</el-checkbox>
                    <el-checkbox label="3">周二</el-checkbox>
                    <el-checkbox label="4">周三</el-checkbox>
                    <el-checkbox label="5">周四</el-checkbox>
                    <el-checkbox label="6">周五</el-checkbox>
                    <el-checkbox label="7">周六</el-checkbox>
                    <el-checkbox label="1">周日</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
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
              </div>
            </div>
          </el-form-item>

          <el-form-item label="关联产品">
            <el-button type="success" @click="addProducts">添加</el-button>
          </el-form-item>

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
      <el-dialog title="特殊价格" :visible.sync="dialogTableVisible">
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
                v-model="subPrices[scope.$index].priceDate"
                :placeholder="scope.row.priceDate"
                align="right"
                type="date"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column property="storePrice" label="门店价" width="200">
            <template slot-scope="scope">
              <el-input
                v-model="subPrices[scope.$index].retailPrice"
                :placeholder="scope.row.retailPrice"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column property="flooerprice" label="结算底价">
            <template slot-scope="scope">
              <el-input
                v-model="subPrices[scope.$index].floorPrice"
                :placeholder="scope.row.floorPrice"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="app售价">
            <template slot-scope="scope">
              <el-input
                v-model="subPrices[scope.$index].salePrice"
                :placeholder="scope.row.salePrice"
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
          <el-table-column property="name" label="名称" width="150">
            <template slot-scope="scope">
              <el-input
                :placeholder="scope.row.name"
                :disabled="true"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column property="classId" label="所属分类" width="200">
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
        <el-pagination
          small
          layout="prev, pager, next"
          :total="total"
        >
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
import api from "@/api/reserveManager/hotel.js";
import productApi from "@/api/reserveManager/product.js";
import { mapMutations } from "vuex";
import UploadFile from "@/components/uploadImage/uploadImage.vue";
import quillConfig from "@/assets/js/quill-config.js";
import baseURL from "@/config/baseUrl.js";
//富文本框
import { quillEditor } from "vue-quill-editor";
export default {
  name: "addOrEditHomestay",
  components: {
    UploadFile,
    quillEditor,
  },
  data() {
    return {
      info: {
        name: "",
        titleImg: "",
        icon: "",
        hotelOrHome: 2,
        isLink: 0,
        link: "",
        stars: "",
        linkman: "",
        contact: "",
        sort: 0,
        lastDate: "",
        orderStartDate: "",
        orderEndDate: "",
        traffic: "",
        surrounding: "",
        notice: "",
        info: "",
        infoWeb: "",
        indexRecommend: 0,
        recommandReason: "",
        remarks: "",
        isOpen: 0,
        down: 0,
        address: "",
        longitude: "0.0",
        latitude: "0.0",
        rooms: [],
        hotelPicItems: [],
        products: [],
      },
      trips: [],
      roomlist: [],
      ptImgs: [],
      roomIcons: [],
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
        name: "",
        icon: "",
        bedType: "",
        area: "",
        breakfast: "",
        network: 0,
        sort: 0,
        down: 0,
        theDefault: 0,
        retailPrice: "",
        salePrice: "",
        floorPrice: "",
        weeklyRetailPrice: "",
        weeklySalePrice: "",
        weeklyfloorPrice: "",
        weekly: [],
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
        editTime: "",
      },
      priceTime: "",
      storePrice: "",
      flooerprice: "",
      appPrice: "",
      products: [],
      themes: [],
      total: 0,
      //分页数据
      page: {
        // 默认显示第几页
        page: 1,
        // 总条数，根据接口获取数据长度(注意：这里不能为空)
        totalCount: 0,
        // 个数选择器（可修改）
        // 默认每页显示的条数（可修改）
        rows: 10,
      },
      selectProducts: [],
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
      uploadGroupRoom: {
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
      starses: [
        {
          value: 0,
          label: "无星级",
        },
        {
          value: 1,
          label: "一星级",
        },
        {
          value: 2,
          label: "二星级",
        },
        {
          value: 3,
          label: "三星级",
        },
        {
          value: 4,
          label: "四星级",
        },
        {
          value: 5,
          label: "五星级",
        },
      ],
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
      roomTypes: [
        {
          value: 1,
          label: "单人床",
        },
        {
          value: 2,
          label: "双人床",
        },
        {
          value: 3,
          label: "单人大床",
        },
        {
          value: 4,
          label: "双人大床",
        },
        {
          value: 5,
          label: "三人床",
        },
        {
          value: 6,
          label: "三人以上",
        },
      ],
      breakfasts: [
        {
          value: 0,
          label: "无",
        },
        {
          value: 1,
          label: "含早",
        },
        {
          value: 2,
          label: "含双早",
        },
        {
          value: 3,
          label: "含三早",
        },
        {
          value: 4,
          label: "有（收费）",
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
      this.info.titleImg = data.filePath;
    },
    thumbValue: function (data) {
      this.info.icon = data.filePath;
    },
    uploadValue: function (data) {
      this.ptImgs.push(data.filePath);
      //this.ptImgs = this.$refs.UploadFile.uploadGroup.fileList;
    },
    roomValue: function (data) {
      this.roomlist[data].icon = this.$refs.uploadGroupRoom[
        data
      ].uploadGroup.fileList[0].response.filePath;
    },
    //添加行程详情
    addTrip: function () {
      this.trips.push(JSON.parse(JSON.stringify(this.trip)));
    },
    //添加线路套餐
    addSub: function () {
      let psub = JSON.parse(JSON.stringify(this.psub));
      psub.uploadGroupRoom = JSON.parse(JSON.stringify(this.uploadGroupRoom));
      this.roomlist.push(psub);
    },
    //删除行程详情
    deleteTrip: function (index) {
      this.trips.splice(index, 1)[0];
    },
    //删除行程详情
    deleteSub: function (index) {
      this.roomlist.splice(index, 1)[0];
    },
    //设置套餐价格
    editPrice: function () {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
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
      this.selectProducts = this.$refs.productsTable.selection;
    },
    openTable(index) {
      this.dialogTableVisible = true;
      this.indexPrices = index;
      this.subPrices = [];
      this.subPrices =
        this.cachePrices[index] == undefined ? [] : this.cachePrices[index];
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
          priceDate: date.getFullYear() + "-" + month + "-" + days,
          trueDate: date,
          retailPrice: this.storePrice,
          floorPrice: this.flooerprice,
          salePrice: this.appPrice,
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
      let arr = [];
      this.info.rooms = [];
      this.info.comments = [];
      for (let i = 0; i < this.uploadGroupOne.fileList.length; i++) {
        if ("response" in this.uploadGroupOne.fileList[i]) {
          this.info[
            "hotelPicItems[" + i + "].path"
          ] = this.uploadGroupOne.fileList[i].response.filePath;
        } else {
          var pos = this.uploadGroupOne.fileList[i].url.lastIndexOf(baseURL.imgUrl);
          let url = this.uploadGroupOne.fileList[i].url.substr(pos);
          this.info["hotelPicItems[" + i + "].path"] = url;
        }
      }

      for (let i = 0; i < this.roomlist.length; i++) {
        let weekly = "";
        for (let k = 0; k < this.roomlist[i].weekly.length; k++) {
          if (k < this.roomlist[i].weekly.length - 1) {
            weekly += this.roomlist[i].weekly[k] + ",";
          } else {
            weekly += this.roomlist[i].weekly[k];
          }
        }
        this.info["rooms[" + i + "].id"] = this.roomlist[i].id;
        this.info["rooms[" + i + "].name"] = this.roomlist[i].name;
        this.info["rooms[" + i + "].icon"] = this.roomlist[i].icon;
        this.info["rooms[" + i + "].retailPrice"] = this.roomlist[
          i
        ].retailPrice;
        this.info["rooms[" + i + "].salePrice"] = this.roomlist[i].salePrice;
        this.info["rooms[" + i + "].floorPrice"] = this.roomlist[i].floorPrice;
        this.info["rooms[" + i + "].bedType"] = this.roomlist[i].bedType;
        this.info["rooms[" + i + "].breakfast"] = this.roomlist[i].breakfast;
        this.info["rooms[" + i + "].network"] = this.roomlist[i].network;
        this.info["rooms[" + i + "].sort"] = this.roomlist[i].sort;
        this.info["rooms[" + i + "].down"] = this.roomlist[i].down;
        this.info["rooms[" + i + "].weeklySalePrice"] = this.roomlist[
          i
        ].weeklySalePrice;
        this.info["rooms[" + i + "].weeklyRetailPrice"] = this.roomlist[
          i
        ].weeklyRetailPrice;
        this.info["rooms[" + i + "].weeklyfloorPrice"] = this.roomlist[
          i
        ].weeklyfloorPrice;
        this.info["rooms[" + i + "].weekly"] = weekly;
        this.info["rooms[" + i + "].theDefault"] = this.roomlist[i].theDefault;
        this.info["rooms[" + i + "].network"] = this.roomlist[i].network;
        this.info["rooms[" + i + "].area"] = this.roomlist[i].area;

        if (this.cachePrices[i] != null && this.cachePrices[i] != "") {
          for (let j = 0; j < this.cachePrices[i].length; j++) {
            this.info[
              "rooms[" + i + "].priceList[" + j + "].retailPrice"
            ] = this.cachePrices[i][j].retailPrice;
            this.info[
              "rooms[" + i + "].priceList[" + j + "].salePrice"
            ] = this.cachePrices[i][j].salePrice;
            this.info[
              "rooms[" + i + "].priceList[" + j + "].floorPrice"
            ] = this.cachePrices[i][j].floorPrice;
            this.info[
              "rooms[" + i + "].priceList[" + j + "].priceDate"
            ] = this.cachePrices[i][j].priceDate;
          }
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
              name: "homestayList",
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
            this.quill(this.$refs.my1TextEditor);
            this.quill(this.$refs.my2TextEditor);
            this.quill(this.$refs.my3TextEditor);
            this.quill(this.$refs.my4TextEditor);
            this.quill(this.$refs.my5TextEditor);
            this.quill(this.$refs.my6TextEditor);
            this.info = result.hotel;
            if (result.hotel.titleImg != null && result.hotel.titleImg != "") {
              this.uploadGroupTitle.fileList.push({
                url: baseURL.releaseUrl + result.hotel.titleImg,
              });
            }
            if (result.hotel.icon != null && result.hotel.icon != "") {
              this.uploadGroupThumb.fileList.push({
                url: baseURL.releaseUrl + result.hotel.icon,
              });
            }
            if (result.hImgs != null && result.hImgs != "") {
              for (let i = 0; i < result.hImgs.length; i++) {
                this.uploadGroupOne.fileList.push({
                  url: baseURL.releaseUrl + result.hImgs[i].path,
                });
              }
            }
            if (result.roomlist != null && result.roomlist != "") {
              for (let i = 0; i < result.roomlist.length; i++) {
                this.roomlist.push(result.roomlist[i]);
                this.roomlist[i].weekly = result.roomlist[i].weekly.split(",");
                let uploadGroupRoom = JSON.parse(
                  JSON.stringify(this.uploadGroupRoom)
                );
                uploadGroupRoom.fileList.push({
                  url: baseURL.releaseUrl + result.roomlist[i].icon,
                });
                this.roomlist[i].uploadGroupRoom = uploadGroupRoom;

                if (
                  result.roomlist[i].priceList != null &&
                  result.roomlist[i].priceList != ""
                ) {
                  this.cachePrices.push(result.roomlist[i].priceList);
                }
              }
            }
            if(result.proList != null && result.proList != ""){
              this.selectProducts = result.proList
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
      for (let i = 0; i < this.roomlist.length; i++) {
        if (this.roomlist[i].theDefault == 1 && i != index) {
          this.roomlist[i].theDefault = 0;
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