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
          <el-row :gutter="20" class="products-div">
            <el-col :span="6">
              <label class="products-label">景点名称</label
              ><el-input v-model="attrName" placeholder="景点名称"></el-input>
            </el-col>
            <el-col :span="6">
              <label class="products-label">是否开放预定</label>
              <el-select v-model="attrOpen" placeholder="请选择">
                <el-option :key="'1'" :label="'是'" :value="'1'"></el-option>
                <el-option :key="'0'" :label="'否'" :value="'0'"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <label class="products-label">是否上架</label>
              <el-select v-model="attrDown" placeholder="请选择">
                <el-option :key="'1'" :label="'上架'" :value="'1'"></el-option>
                <el-option :key="'0'" :label="'下架'" :value="'0'"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" @click="searchAttrs">搜 索</el-button>
            </el-col>
          </el-row>

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
            <el-table-column label="是否上架">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.down == '1' ? 'success' : 'primary'"
                  disable-transitions
                  >{{ scope.row.down == "0" ? "是" : "否" }}</el-tag
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            small
            layout="prev, pager, next"
            :total="attrPage.totalCount"
            :page-size="attrPage.rows"
            :current-page="attrPage.page"
            @current-change="changePageAttrs"
          >
          </el-pagination>
          <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="dialogTableVisible = false">取 消</el-button> -->
            <el-button type="primary" @click="confirmAttractions">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 对话框 -->
        <el-dialog title="可查看农家乐" :visible.sync="dialogTableCountryTravels">
          <el-row :gutter="20" class="products-div">
            <el-col :span="6">
              <label class="products-label">农家乐名称</label
              ><el-input v-model="ctName" placeholder="景点名称"></el-input>
            </el-col>
            <el-col :span="6">
              <label class="products-label">是否开放预定</label>
              <el-select v-model="ctOpen" placeholder="请选择">
                <el-option :key="'1'" :label="'是'" :value="'1'"></el-option>
                <el-option :key="'0'" :label="'否'" :value="'0'"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <label class="products-label">是否上架</label>
              <el-select v-model="ctDown" placeholder="请选择">
                <el-option :key="'0'" :label="'上架'" :value="'0'"></el-option>
                <el-option :key="'1'" :label="'下架'" :value="'1'"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" @click="searchCts">搜 索</el-button>
            </el-col>
          </el-row>

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
            <el-table-column label="是否上架">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.down == '1' ? 'success' : 'primary'"
                  disable-transitions
                  >{{ scope.row.down == "0" ? "是" : "否" }}</el-tag
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            small
            layout="prev, pager, next"
            :total="ctPage.totalCount"
            :page-size="ctPage.rows"
            :current-page="ctPage.page"
            @current-change="changePageCts"
          >
          </el-pagination>
          <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="dialogTableVisible = false">取 消</el-button> -->
            <el-button type="primary" @click="confirmCountryTravels">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 对话框 -->
        <el-dialog title="可查看酒店" :visible.sync="dialogTableHotels">

          <el-row :gutter="20" class="products-div">
            <el-col :span="6">
              <label class="products-label">酒店名称</label
              ><el-input v-model="hName" placeholder="酒店名称"></el-input>
            </el-col>
            <el-col :span="6">
              <label class="products-label">是否开放预定</label>
              <el-select v-model="hOpen" placeholder="请选择">
                <el-option :key="'1'" :label="'是'" :value="'1'"></el-option>
                <el-option :key="'0'" :label="'否'" :value="'0'"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <label class="products-label">是否上架</label>
              <el-select v-model="hDown" placeholder="请选择">
                <el-option :key="'0'" :label="'上架'" :value="'0'"></el-option>
                <el-option :key="'1'" :label="'下架'" :value="'1'"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" @click="searchHs">搜 索</el-button>
            </el-col>
          </el-row>

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
            <el-table-column label="是否上架">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.down == '1' ? 'success' : 'primary'"
                  disable-transitions
                  >{{ scope.row.down == "0" ? "是" : "否" }}</el-tag
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            small
            layout="prev, pager, next"
            :total="hPage.totalCount"
            :page-size="hPage.rows"
            :current-page="hPage.page"
            @current-change="changePageHs"
          >
          </el-pagination>
          <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="dialogTableVisible = false">取 消</el-button> -->
            <el-button type="primary" @click="confirmHotels">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 对话框 -->
        <el-dialog title="可查看民宿" :visible.sync="dialogTableHomestays">

          <el-row :gutter="20" class="products-div">
            <el-col :span="6">
              <label class="products-label">民宿名称</label
              ><el-input v-model="hmName" placeholder="民宿名称"></el-input>
            </el-col>
            <el-col :span="6">
              <label class="products-label">是否开放预定</label>
              <el-select v-model="hmOpen" placeholder="请选择">
                <el-option :key="'1'" :label="'是'" :value="'1'"></el-option>
                <el-option :key="'0'" :label="'否'" :value="'0'"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <label class="products-label">是否上架</label>
              <el-select v-model="hmDown" placeholder="请选择">
                <el-option :key="'0'" :label="'上架'" :value="'0'"></el-option>
                <el-option :key="'1'" :label="'下架'" :value="'1'"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" @click="searchHms">搜 索</el-button>
            </el-col>
          </el-row>

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
            <el-table-column label="是否上架">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.down == '1' ? 'success' : 'primary'"
                  disable-transitions
                  >{{ scope.row.down == "0" ? "是" : "否" }}</el-tag
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            small
            layout="prev, pager, next"
            :total="hmPage.totalCount"
            :page-size="hmPage.rows"
            :current-page="hmPage.page"
            @current-change="changePageHms"
          >
          </el-pagination>
          <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="dialogTableVisible = false">取 消</el-button> -->
            <el-button type="primary" @click="confirmHomestays">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 对话框 -->
        <el-dialog title="可查看线路" :visible.sync="dialogTablePeripherys">

          <el-row :gutter="20" class="products-div">
            <el-col :span="6">
              <label class="products-label">民宿名称</label
              ><el-input v-model="pName" placeholder="民宿名称"></el-input>
            </el-col>
            <el-col :span="6">
              <label class="products-label">是否开放预定</label>
              <el-select v-model="pOpen" placeholder="请选择">
                <el-option :key="'1'" :label="'是'" :value="'1'"></el-option>
                <el-option :key="'0'" :label="'否'" :value="'0'"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <label class="products-label">是否上架</label>
              <el-select v-model="pDown" placeholder="请选择">
                <el-option :key="'0'" :label="'上架'" :value="'0'"></el-option>
                <el-option :key="'1'" :label="'下架'" :value="'1'"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" @click="searchPs">搜 索</el-button>
            </el-col>
          </el-row>

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
            <el-table-column label="是否上架">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.down == '1' ? 'success' : 'primary'"
                  disable-transitions
                  >{{ scope.row.down == "0" ? "是" : "否" }}</el-tag
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            small
            layout="prev, pager, next"
            :total="pPage.totalCount"
            :page-size="pPage.rows"
            :current-page="pPage.page"
            @current-change="changePagePs"
          >
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
      //景点对话框选项
      attrName: "",
      attrOpen: "",
      attrDown: "",
      //景点分页数据
      attrPage: {
        // 默认显示第几页
        page: 1,
        // 总条数，根据接口获取数据长度(注意：这里不能为空)
        totalCount: 0,
        // 个数选择器（可修改）
        // 默认每页显示的条数（可修改）
        rows: 10,
      },
      //农家乐对话框选项
      ctName: "",
      ctOpen: "",
      ctDown: "",
      //农家乐分页数据
      ctPage: {
        // 默认显示第几页
        page: 1,
        // 总条数，根据接口获取数据长度(注意：这里不能为空)
        totalCount: 0,
        // 个数选择器（可修改）
        // 默认每页显示的条数（可修改）
        rows: 10,
      },
      //酒店对话框选项
      hName: "",
      hOpen: "",
      hDown: "",
      //酒店分页数据
      hPage: {
        // 默认显示第几页
        page: 1,
        // 总条数，根据接口获取数据长度(注意：这里不能为空)
        totalCount: 0,
        // 个数选择器（可修改）
        // 默认每页显示的条数（可修改）
        rows: 10,
      },
      //民宿对话框选项
      hmName: "",
      hmOpen: "",
      hmDown: "",
      //民宿分页数据
      hmPage: {
        // 默认显示第几页
        page: 1,
        // 总条数，根据接口获取数据长度(注意：这里不能为空)
        totalCount: 0,
        // 个数选择器（可修改）
        // 默认每页显示的条数（可修改）
        rows: 10,
      },
      //线路对话框选项
      pName: "",
      pOpen: "",
      pDown: "",
      //线路分页数据
      pPage: {
        // 默认显示第几页
        page: 1,
        // 总条数，根据接口获取数据长度(注意：这里不能为空)
        totalCount: 0,
        // 个数选择器（可修改）
        // 默认每页显示的条数（可修改）
        rows: 10,
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
    //景点
    searchAttrs: function () {
      this.attrPage.page = 1;
      if (this.attrName != null && this.attrName != "") {
        this.attrPage["name"] = this.attrName;
      } else {
        this.$delete(this.attrPage, "name");
      }
      if (this.attrOpen != null && this.attrOpen != "") {
        this.attrPage["isOpen"] = this.attrOpen;
      } else {
        this.$delete(this.attrPage, "isOpen");
      }
      if (this.attrDown != null && this.attrDown != "") {
        this.attrPage["down"] = this.attrDown;
      } else {
        this.$delete(this.attrPage, "down");
      }
      attractionApi
        .getAttractions(this.attrPage)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.attractions = result.rows;
          this.attrPage.totalCount = result.total;
          this.$nextTick(function () {
            this.products.forEach((product, i) => {
              this.selectProducts.forEach((selectProduct, j) => {
                if (
                  this.products[i] != null &&
                  this.selectProducts[j] != null &&
                  this.products[i].id == this.selectProducts[j].id
                ) {
                  this.$refs.productsTable.toggleRowSelection(this.products[i], true);
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
    changePageAttrs(index) {
      this.attrPage.page = index;
      attractionApi
        .getAttractions(this.attrPage)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.attractions = result.rows;
          this.attrPage.totalCount = result.total;
          this.$nextTick(function () {
            this.products.forEach((product, i) => {
              this.selectProducts.forEach((selectProduct, j) => {
                if (
                  this.products[i] != null &&
                  this.selectProducts[j] != null &&
                  this.products[i].id == this.selectProducts[j].id
                ) {
                  this.$refs.productsTable.toggleRowSelection(this.products[i], true);
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
    addAttractions: function () {
      this.dialogTableAttractions = true;
      attractionApi
        .getAttractions(this.attrPage)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.attractions = result.rows;
          this.attrPage.totalCount = result.total;
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
    searchCts: function () {
      this.ctPage.page = 1;
      if (this.ctName != null && this.ctName != "") {
        this.ctPage["name"] = this.ctName;
      } else {
        this.$delete(this.ctPage, "name");
      }
      if (this.ctOpen != null && this.ctOpen != "") {
        this.ctPage["isOpen"] = this.ctOpen;
      } else {
        this.$delete(this.ctPage, "isOpen");
      }
      if (this.ctDown != null && this.ctDown != "") {
        this.ctPage["down"] = this.ctDown;
      } else {
        this.$delete(this.ctPage, "down");
      }
      countryTravelApi
        .getList(this.ctPage)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.countryTravels = result.rows;
          this.ctPage.totalCount = result.total;
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
    changePageCts(index) {
      this.ctPage.page = index;
      countryTravelApi
        .getAttractions(this.ctPage)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.countryTravels = result.rows;
          this.ctPage.totalCount = result.total;
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
    addCountryTravels: function () {
      this.dialogTableCountryTravels = true;
      countryTravelApi
        .getList(this.ctPage)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.countryTravels = result.rows;
          this.ctPage.totalCount = result.total;
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
    searchHs: function () {
      this.hPage.page = 1;
      if (this.hName != null && this.hName != "") {
        this.hPage["name"] = this.hName;
      } else {
        this.$delete(this.hPage, "name");
      }
      if (this.hOpen != null && this.hOpen != "") {
        this.hPage["isOpen"] = this.hOpen;
      } else {
        this.$delete(this.hPage, "isOpen");
      }
      if (this.hDown != null && this.hDown != "") {
        this.hPage["down"] = this.hDown;
      } else {
        this.$delete(this.hPage, "down");
      }
      hotelApi
        .getList(this.hPage)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.hotels = result.rows;
          this.hPage.totalCount = result.total;
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
    changePageHs(index) {
      this.hPage.page = index;
      hotelApi
        .getList(this.hPage)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.hotels = result.rows;
          this.hPage.totalCount = result.total;
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
    addHotels: function () {
      this.dialogTableHotels = true;
      hotelApi
        .getList(this.hPage)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.hotels = result.rows;
          this.hPage.totalCount = result.total;
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
    searchHms: function () {
      this.hmPage.page = 1;
      if (this.hmName != null && this.hmName != "") {
        this.hmPage["name"] = this.hmName;
      } else {
        this.$delete(this.hmPage, "name");
      }
      if (this.hmOpen != null && this.hmOpen != "") {
        this.hmPage["isOpen"] = this.hmOpen;
      } else {
        this.$delete(this.hmPage, "isOpen");
      }
      if (this.hmDown != null && this.hmDown != "") {
        this.hmPage["down"] = this.hmDown;
      } else {
        this.$delete(this.hmPage, "down");
      }
      homestayApi
        .getList(this.hmPage)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.homestays = result.rows;
          this.hmPage.totalCount = result.total;
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
    changePageHms(index) {
      this.hmPage.page = index;
      homestayApi
        .getList(this.hmPage)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.homestays = result.rows;
          this.hmPage.totalCount = result.total;
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
    addHomestays: function () {
      this.dialogTableHomestays = true;
      alert(this.hmPage.page)
      homestayApi
        .getList(this.hmPage)
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
    searchPs: function () {
      this.pPage.page = 1;
      if (this.pName != null && this.pName != "") {
        this.pPage["title"] = this.pName;
      } else {
        this.$delete(this.pPage, "title");
      }
      if (this.pOpen != null && this.pOpen != "") {
        this.pPage["isOpen"] = this.pOpen;
      } else {
        this.$delete(this.pPage, "isOpen");
      }
      if (this.pDown != null && this.pDown != "") {
        this.pPage["down"] = this.pDown;
      } else {
        this.$delete(this.pPage, "down");
      }
      peripheryApi
        .getList(this.pPage)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.peripherys = result.rows;
          this.pPage.totalCount = result.total;
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
    changePagePs(index) {
      this.pPage.page = index;
      peripheryApi
        .getList(this.pPage)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.peripherys = result.rows;
          this.pPage.totalCount = result.total;
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
    addPeripherys: function () {
      this.dialogTablePeripherys = true;
      peripheryApi
        .getList(this.pPage)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.peripherys = result.rows;
          this.pPage.totalCount = result.total;
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
      api.addOrEdit(this.info).then((result) => {
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
      });
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
        api.detailed({ id: this.$route.params.id }).then((result) => {
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
        });
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
