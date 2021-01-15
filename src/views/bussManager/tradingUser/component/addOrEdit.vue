<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="90px">
        <div class="form_item">
          <el-form-item label="登录名称">
            <el-input v-model="info.username"></el-input>
          </el-form-item>
          <el-form-item label="登录密码" v-show="isShow">
            <el-input v-model="info.password"></el-input>
          </el-form-item>
          <el-form-item label="登录中文名">
            <el-input v-model="info.name"></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="info.mobile"></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱">
            <el-input v-model="info.email"></el-input>
          </el-form-item>
          <el-form-item label="商家名称">
            <el-input v-model="info.businessName"></el-input>
          </el-form-item>

          <el-form-item label="头像">
            <UploadFile
              @uploadValue="avatarValue"
              ref="uploadGroupAvatar"
              :uploadGroup="uploadGroupAvatar"
            ></UploadFile>
          </el-form-item>

          <el-row>
            <el-col :span="8">
              <el-form-item label="合作模式">
                <el-radio-group
                  v-model="info.cooperationMode"
                  @change="cooperationChange"
                >
                  <el-radio :label="1">结算底价</el-radio>
                  <el-radio :label="2">佣金比例</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="showMode">
              <el-form-item label="佣金比例(%)">
                <el-input-number
                  v-model="info.rate"
                  :precision="2"
                  :step="0.1"
                  :max="100"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="商家分类">
            <el-button type="success" @click="addClasses">添加</el-button>
          </el-form-item>

          <el-card class="box-card">
            <span v-for="o in selectClasses" :key="o.id" class="text item">
              {{ o.name }}
            </span>
          </el-card>
          <br />

          <el-form-item label="关联用户">
            <el-button type="success" @click="addUsers">添加</el-button>
          </el-form-item>
          <el-card class="box-card">
            <span v-for="o in selectUsers" :key="o.id" class="text item">
              {{ o.username }}
            </span>
          </el-card>
          <br />

          <baiduMap :baiduInfo="baiduInfo" ref="baiduMap"></baiduMap>

          <el-form-item label="线下对接人员">
            <el-input v-model="info.personnel"></el-input>
          </el-form-item>
          <!-- <el-form-item label="商家法定地址">
            <el-input v-model="info.businessAddress"></el-input>
          </el-form-item> -->
          <el-form-item label="商家法人代表">
            <el-input v-model="info.legalRepresentative"></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-radio v-model="info.roleId" label="11">商家开放平台</el-radio>
          </el-form-item>
        </div>

        <el-form-item label="可查看景点">
          <el-button type="success" @click="addAttractions">添加</el-button>
        </el-form-item>

        <el-card class="box-card">
          <span v-for="o in selectAttractions" :key="o.id" class="text item">
            {{ o.name }}
          </span>
        </el-card>

        <el-form-item label="可查看农家乐">
          <el-button type="success" @click="addCountryTravels">添加</el-button>
        </el-form-item>

        <el-card class="box-card">
          <span v-for="o in selectCountryTravels" :key="o.id" class="text item">
            {{ o.name }}
          </span>
        </el-card>

        <el-form-item label="可查看酒店">
          <el-button type="success" @click="addHotels">添加</el-button>
        </el-form-item>

        <el-card class="box-card">
          <span v-for="o in selectHotels" :key="o.id" class="text item">
            {{ o.name }}
          </span>
        </el-card>

        <el-form-item label="可查看民宿">
          <el-button type="success" @click="addHomestays">添加</el-button>
        </el-form-item>

        <el-card class="box-card">
          <span v-for="o in selectHomestays" :key="o.id" class="text item">
            {{ o.name }}
          </span>
        </el-card>

        <el-form-item label="可查看线路">
          <el-button type="success" @click="addPeripherys">添加</el-button>
        </el-form-item>

        <el-card class="box-card">
          <span v-for="o in selectPeripherys" :key="o.id" class="text item">
            {{ o.title }}
          </span>
        </el-card>

        <!-- 对话框 -->
        <el-dialog title="关联用户" :visible.sync="dialogTableUsers">
          <el-table ref="usersTable" :data="users">
            <el-table-column type="selection"> </el-table-column>
            <el-table-column property="username" label="id"> </el-table-column>
            <el-table-column property="email" label="邮箱"> </el-table-column>
            <el-table-column property="mobile" label="号码"> </el-table-column>
            <el-table-column property="miniOpenid" label="小程序的openid">
            </el-table-column>
          </el-table>
          <div style="margin-top: 20px">
            <el-button type="primary" @click="confirmUsers">确定</el-button>
          </div>
        </el-dialog>

        <!-- 对话框 -->
        <el-dialog title="商家分类" :visible.sync="dialogTableClasses">
          <el-table :data="classes" ref="classesTable">
            <el-table-column type="selection"> </el-table-column>
            <el-table-column property="name" label="名称" width="150">
              <template slot-scope="scope">
                <el-input :placeholder="scope.row.name" :disabled="true"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="createTime" label="创建时间" width="150">
              <template slot-scope="scope">
                <el-input :placeholder="scope.row.createTime" :disabled="true"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="editTime" label="修改时间" width="150">
              <template slot-scope="scope">
                <el-input :placeholder="scope.row.editTime" :disabled="true"></el-input>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination small layout="prev, pager, next" :total="classesTotal">
          </el-pagination>
          <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="dialogTableVisible = false">取 消</el-button> -->
            <el-button type="primary" @click="confirmClasses">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 对话框 -->
        <el-dialog title="可查看景点" :visible.sync="dialogTableAttractions">
          <el-table :data="attractions" ref="attractionsTable">
            <el-table-column type="selection"> </el-table-column>
            <el-table-column property="name" label="名称" width="150">
              <template slot-scope="scope">
                <el-input :placeholder="scope.row.name" :disabled="true"></el-input>
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
          <el-pagination small layout="prev, pager, next" :total="attractionTotal">
          </el-pagination>
          <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="dialogTableVisible = false">取 消</el-button> -->
            <el-button type="primary" @click="confirmAttractions">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 对话框 -->
        <el-dialog title="可查看农家乐" :visible.sync="dialogTableCountryTravels">
          <el-table :data="countryTravels" ref="countryTravelsTable">
            <el-table-column type="selection"> </el-table-column>
            <el-table-column property="name" label="名称" width="150">
              <template slot-scope="scope">
                <el-input :placeholder="scope.row.name" :disabled="true"></el-input>
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
          <el-pagination small layout="prev, pager, next" :total="countryTravelTotal">
          </el-pagination>
          <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="dialogTableVisible = false">取 消</el-button> -->
            <el-button type="primary" @click="confirmCountryTravels">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 对话框 -->
        <el-dialog title="可查看酒店" :visible.sync="dialogTableHotels">
          <el-table :data="hotels" ref="hotelsTable">
            <el-table-column type="selection"> </el-table-column>
            <el-table-column property="name" label="名称" width="150">
              <template slot-scope="scope">
                <el-input :placeholder="scope.row.name" :disabled="true"></el-input>
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
          <el-pagination small layout="prev, pager, next" :total="hotelTotal">
          </el-pagination>
          <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="dialogTableVisible = false">取 消</el-button> -->
            <el-button type="primary" @click="confirmHotels">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 对话框 -->
        <el-dialog title="可查看民宿" :visible.sync="dialogTableHomestays">
          <el-table :data="homestays" ref="homestaysTable">
            <el-table-column type="selection"> </el-table-column>
            <el-table-column property="name" label="名称" width="150">
              <template slot-scope="scope">
                <el-input :placeholder="scope.row.name" :disabled="true"></el-input>
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
          <el-pagination small layout="prev, pager, next" :total="homestayTotal">
          </el-pagination>
          <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="dialogTableVisible = false">取 消</el-button> -->
            <el-button type="primary" @click="confirmHomestays">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 对话框 -->
        <el-dialog title="可查看线路" :visible.sync="dialogTablePeripherys">
          <el-table :data="peripherys" ref="peripherysTable">
            <el-table-column type="selection"> </el-table-column>
            <el-table-column property="title" label="名称" width="150">
              <template slot-scope="scope">
                <el-input :placeholder="scope.row.title" :disabled="true"></el-input>
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
          <el-pagination small layout="prev, pager, next" :total="peripheryTotal">
          </el-pagination>
          <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="dialogTableVisible = false">取 消</el-button> -->
            <el-button type="primary" @click="confirmPeripherys">确 定</el-button>
          </div>
        </el-dialog>

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
import api from "@/api/bussManager/tradingUser.js";
import usersApi from "@/api/memberManager/travelUser.js";
import classApi from "@/api/bussManager/tradingUserClass.js";
import attractionApi from "@/api/reserveManager/attractions.js";
import countryTravelApi from "@/api/reserveManager/countryTravel.js";
import hotelApi from "@/api/reserveManager/hotel.js";
import homestayApi from "@/api/reserveManager/homestay.js";
import peripheryApi from "@/api/reserveManager/periphery.js";
import { mapMutations } from "vuex";
import { analysisResolution } from "@/api/analysis.js";
import UploadFile from "@/components/uploadImage/uploadImage.vue";
import baseURL from "@/config/baseUrl.js";
//百度地图
import baiduMap from "@/components/baiduMap/baiduMap.vue";
export default {
  components: {
    baiduMap,
    UploadFile,
  },
  name: "addOrEditTradingUser",
  data() {
    return {
      info: {
        id: "",
        username: "",
        password: "",
        name: "",
        mobile: "",
        email: "",
        businessName: "",
        cooperationMode: 1,
        rate: 0.0,
        type: "",
        objs: [],
        roleId: "11",
        classId: "",
      },
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
      //关联用户
      traditem: [],
      users: [],
      dialogTableUsers: false,
      selectUsers: [],
      //商家分类
      classesTotal: 0,
      classes: [],
      selectClasses: [],
      dialogTableClasses: false,
      //景点
      attractionTotal: 0,
      attractions: [],
      selectAttractions: [],
      dialogTableAttractions: false,
      //农家乐
      countryTravelTotal: 0,
      countryTravels: [],
      selectCountryTravels: [],
      dialogTableCountryTravels: false,
      //酒店
      hotelTotal: 0,
      hotels: [],
      selectHotels: [],
      dialogTableHotels: false,
      //民宿
      homestayTotal: 0,
      homestays: [],
      selectHomestays: [],
      dialogTableHomestays: false,
      //线路
      peripheryTotal: 0,
      peripherys: [],
      selectPeripherys: [],
      dialogTablePeripherys: false,
      showMode: false,
      //关联表
      objs: [],
      isShow: true,
      //图片上传组件信息
      uploadGroupAvatar: {
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
    avatarValue: function (data) {
      this.info.headImg = data.filePath;
    },
    addUsers: function () {
      this.dialogTableUsers = true;
      usersApi
        .getAllList(this.page)
        .then((result) => {
          this.users = result.rows;
          this.$nextTick(function () {
            this.users.forEach((user, i) => {
              this.selectUsers.forEach((selectUser, j) => {
                if (
                  this.users[i] != null &&
                  this.selectUsers[j] != null &&
                  this.users[i].id == this.selectUsers[j].id
                ) {
                  this.$refs.usersTable.toggleRowSelection(this.users[i], true);
                }
              });
            });
          });
          this.loading = false; //关掉加载动画
        })
        .catch(() => {
          this.loading = false; //关掉加载动画
          this.$message.error("查询出错");
        });
    },
    confirmUsers: function () {
      this.dialogTableUsers = false;
      this.selectUsers = this.$refs.usersTable.selection;
      this.traditem = [];
      for (let i = 0; i < this.selectUsers.length; i++) {
        let user = this.selectUsers[i];
        let tradingUser = this.info;
        let trad = {
          id: "",
          userid: user.id,
          miniOpenid: user.miniOpenid,
          username: user.username,
          nickname: user.nickname,
          byid: tradingUser.id,
        };
        this.traditem.push(trad);
      }
    },
    cooperationChange: function () {
      if (this.info.cooperationMode == 2) {
        this.showMode = true;
      } else {
        this.showMode = false;
        this.info.rate = 0.0;
      }
    },
    pushObjs: function () {
      for (let i = 0; i < this.selectAttractions.length; i++) {
        let obj = {
          id: "",
          tid: "",
          oid: this.selectAttractions[i].id,
          type: 1, // 产品类型:0酒店;1景点;2线路;3民宿;4农家乐
        };
        this.objs.push(obj);
      }
      for (let i = 0; i < this.selectCountryTravels.length; i++) {
        let obj = {
          id: "",
          tid: "",
          oid: this.selectCountryTravels[i].id,
          type: 4, // 产品类型:0酒店;1景点;2线路;3民宿;4农家乐
        };
        this.objs.push(obj);
      }
      for (let i = 0; i < this.selectHotels.length; i++) {
        let obj = {
          id: "",
          tid: "",
          oid: this.selectHotels[i].id,
          type: 0, // 产品类型:0酒店;1景点;2线路;3民宿;4农家乐
        };
        this.objs.push(obj);
      }
      for (let i = 0; i < this.selectHomestays.length; i++) {
        let obj = {
          id: "",
          tid: "",
          oid: this.selectHomestays[i].id,
          type: 3, // 产品类型:0酒店;1景点;2线路;3民宿;4农家乐
        };
        this.objs.push(obj);
      }
      for (let i = 0; i < this.selectPeripherys.length; i++) {
        let obj = {
          id: "",
          tid: "",
          oid: this.selectPeripherys[i].id,
          type: 2, // 产品类型:0酒店;1景点;2线路;3民宿;4农家乐
        };
        this.objs.push(obj);
      }
    },
    addClasses: function () {
      this.dialogTableClasses = true;
      classApi
        .getAllList(this.page)
        .then((result) => {
          this.classes = result.rows;
          this.classesTotal = result.total;
          this.$nextTick(function () {
            this.classes.forEach((classes, i) => {
              this.selectClasses.forEach((selectClasses, j) => {
                if (
                  this.classes[i] != null &&
                  this.selectClasses[j] != null &&
                  this.classes[i].id == this.selectClasses[j].id
                ) {
                  this.$refs.classesTable.toggleRowSelection(this.classes[i], true);
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
    confirmClasses: function () {
      this.selectClasses = [];
      this.info.classId = "";
      this.dialogTableClasses = false;
      this.selectClasses = this.$refs.classesTable.selection;
      for (let i = 0; i < this.selectClasses.length; i++) {
        this.info.classId += this.selectClasses[i].id + ",";
      }
    },
    addAttractions: function () {
      this.dialogTableAttractions = true;
      attractionApi
        .getAllList(this.page)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.attractions = result.rows;
          this.attractionTotal = result.total;
          this.$nextTick(function () {
            this.attractions.forEach((attraction, i) => {
              this.selectAttractions.forEach((selectAttraction, j) => {
                if (
                  this.attractions[i] != null &&
                  this.selectAttractions[j] != null &&
                  this.attractions[i].id == this.selectAttractions[j].id
                ) {
                  this.$refs.attractionsTable.toggleRowSelection(
                    this.attractions[i],
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
    confirmAttractions: function () {
      this.selectAttractions = [];
      this.objs = [];
      this.dialogTableAttractions = false;
      this.selectAttractions = this.$refs.attractionsTable.selection;
    },
    //农家乐
    addCountryTravels: function () {
      this.dialogTableCountryTravels = true;
      countryTravelApi
        .getAllList(this.page)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.countryTravels = result.rows;
          this.countryTravelTotal = result.total;
          this.$nextTick(function () {
            this.countryTravels.forEach((countryTravel, i) => {
              this.selectCountryTravels.forEach((selectCountryTravel, j) => {
                if (
                  this.countryTravels[i] != null &&
                  this.selectCountryTravels[j] != null &&
                  this.countryTravels[i].id == this.selectCountryTravels[j].id
                ) {
                  this.$refs.countryTravelsTable.toggleRowSelection(
                    this.countryTravels[i],
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
    confirmCountryTravels: function () {
      this.selectCountryTravels = [];
      this.objs = [];
      this.dialogTableCountryTravels = false;
      this.selectCountryTravels = this.$refs.countryTravelsTable.selection;
    },
    //酒店
    addHotels: function () {
      this.dialogTableHotels = true;
      hotelApi
        .getAllList(this.page)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.hotels = result.rows;
          this.hotelTotal = result.total;
          this.$nextTick(function () {
            this.hotels.forEach((hotel, i) => {
              this.selectHotels.forEach((selectHotel, j) => {
                if (
                  this.hotels[i] != null &&
                  this.selectHotels[j] != null &&
                  this.hotels[i].id == this.selectHotels[j].id
                ) {
                  this.$refs.hotelsTable.toggleRowSelection(this.hotels[i], true);
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
    confirmHotels: function () {
      this.selectHotels = [];
      this.objs = [];
      this.dialogTableHotels = false;
      this.selectHotels = this.$refs.hotelsTable.selection;
    },
    //民宿
    addHomestays: function () {
      this.dialogTableHomestays = true;
      homestayApi
        .getAllList(this.page)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.homestays = result.rows;
          this.homestayTotal = result.total;
          this.$nextTick(function () {
            this.homestays.forEach((homestay, i) => {
              this.selectHomestays.forEach((selectHomestay, j) => {
                if (
                  this.homestays[i] != null &&
                  this.selectHomestays[j] != null &&
                  this.homestays[i].id == this.selectHomestays[j].id
                ) {
                  this.$refs.homestaysTable.toggleRowSelection(this.homestays[i], true);
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
    confirmHomestays: function () {
      this.selectHomestays = [];
      this.objs = [];
      this.dialogTableHomestays = false;
      this.selectHomestays = this.$refs.homestaysTable.selection;
    },
    //线路
    addPeripherys: function () {
      this.dialogTablePeripherys = true;
      peripheryApi
        .getAllList(this.page)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.peripherys = result.rows;
          this.peripheryTotal = result.total;
          this.$nextTick(function () {
            this.peripherys.forEach((periphery, i) => {
              this.selectPeripherys.forEach((selectPeriphery, j) => {
                if (
                  this.peripherys[i] != null &&
                  this.selectPeripherys[j] != null &&
                  this.peripherys[i].id == this.selectPeripherys[j].id
                ) {
                  this.$refs.peripherysTable.toggleRowSelection(this.peripherys[i], true);
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
    confirmPeripherys: function () {
      this.selectPeripherys = [];
      this.objs = [];
      this.dialogTablePeripherys = false;
      this.selectPeripherys = this.$refs.peripherysTable.selection;
    },
    //提交表单
    onSubmit: function () {
      this.info.objs = [];
      this.info.traditem = [];
      this.info.roleIds = [];
      this.objs = [];
      this.pushObjs();
      if (this.objs != null && this.objs != "") {
        analysisResolution(this.info, "objs", this.objs);
      }
      if (this.traditem != null && this.traditem != "") {
        this.info.openid = "";
        analysisResolution(this.info, "traditem", this.traditem);
        for (let i = 0; i < this.traditem.length; i++) {
          if (this.traditem[i].miniOpenid != null && this.traditem[i].miniOpenid != "") {
            this.info.openid += this.traditem[i].miniOpenid + ",";
          }
        }
      }
      this.info.businessAddress = this.baiduInfo.address;
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
              name: "tradingUserList",
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
        // .catch(() => {
        //   if (this.info.id) {
        //     this.$message.error("数据更新失败");
        //   } else {
        //     this.$message.error("数据添加失败");
        //   }
        // });
    },
    //取消按钮事件
    close: function () {
      this.$router.go(-1);
    },
    //获取详情信息
    getAdvert: function () {
      if (this.$route.params && this.$route.params.id) {
        api
          .detailed({ id: this.$route.params.id })
          .then((result) => {
            this.uploadGroupAvatar.fileList = [];
            this.selectClasses = [];
            this.selectAttractions = [];
            this.selectCountryTravels = [];
            this.selectHotels = [];
            this.selectHomestays = [];
            this.selectPeripherys = [];
            this.selectUsers = [];
            this.traditem = [];
            this.info = result.tradingUser;
            this.baiduInfo.address = this.info.businessAddress;
            this.baiduInfo.longitude = this.info.longitude;
            this.baiduInfo.latitude = this.info.latitude;
            this.$refs.baiduMap.getClickInfo;
            this.$refs.baiduMap.getLngAndLat();
            if (this.info.headImg != null && this.info.headImg != "") {
              this.uploadGroupAvatar.fileList.push({
                url: baseURL.releaseUrl + this.info.headImg,
              });
            }
            if (result.tlist != "" && result.tlist != null) {
              this.selectClasses = result.tlist;
            }
            if (result.alist != "" && result.alist != null) {
              this.selectAttractions = result.alist;
            }
            if (result.clist != "" && result.clist != null) {
              this.selectCountryTravels = result.clist;
            }
            if (result.hlist != "" && result.hlist != null) {
              this.selectHotels = result.hlist;
            }
            if (result.mlist != "" && result.mlist != null) {
              this.selectHomestays = result.mlist;
            }
            if (result.plist != "" && result.plist != null) {
              this.selectPeripherys = result.plist;
            }
            if (result.ulist != "" && result.ulist != null) {
              this.selectUsers = result.ulist;
            }
            if (result.trlist != "" && result.trlist != null) {
              this.traditem = result.trlist;
            }
            if (this.info.cooperationMode == 2) {
              this.showMode = true;
            }
            this.isShow = false;
          })
          // .catch(() => {
          //   this.$message.error("数据获取失败");
          // });
      }
    },
  },
  created() {
    // this.getAdvert();
  },
  //keep-alive 生命周期，
  activated() {
    //flow：true,则刷新界面，
    this.getAdvert();
    // if (this.$route.params && this.$route.params.flow) {
    //   this.getAdvert();
    // }
  },
};
</script>
