<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="108px">
        <div class="form_item">
          <!-- <el-form-item label="所属分类" style="width: 50%">
            <el-radio :label="1">休闲</el-radio>
            <el-radio :label="2">娱乐</el-radio>
          </el-form-item> -->
          <el-form-item label="休闲娱乐名称">
            <el-input v-model="info.name"></el-input>
          </el-form-item>
          <el-form-item label="副标题">
            <el-input v-model="info.subTitle"></el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="info.sort" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="推荐指数">
            <el-rate v-model="info.recommendationIndex" show-text> </el-rate>
          </el-form-item>
          <el-row>
            <el-col :span="3">
              <el-form-item label="内容封面图片(640*428)"></el-form-item>
            </el-col>
            <UploadFile
              @uploadValue="titleValue"
              :uploadGroup="uploadGroupTitle"
            ></UploadFile>
          </el-row>
          <el-row>
            <el-col :span="3">
              <el-form-item label="列表缩略图片(280*187)"></el-form-item>
            </el-col>
            <UploadFile
              @uploadValue="thumbValue"
              :uploadGroup="uploadGroupThumb"
            ></UploadFile>
          </el-row>
          <el-form-item label="推荐理由" :required="true">
            <vue-ueditor-wrap
              v-model="info.recommandReason"
              :config="myConfig"
            ></vue-ueditor-wrap>
          </el-form-item>

          <el-form-item label="关联商家">
            <el-button type="success" @click="addTradingUsers">添加</el-button>
          </el-form-item>

          <el-card class="box-card">
            <span v-for="o in selectTradingUsers" :key="o.id" class="text item">
              {{ o.name }}
            </span>
          </el-card>
          <br />

          <el-form-item label="特产详情(微信,App)" :required="true">
            <vue-ueditor-wrap v-model="info.info" :config="myConfig"></vue-ueditor-wrap>
          </el-form-item>
          <!-- <el-form-item label="特产详情(web)" :required="true">
            <quill-editor
              ref="my2TextEditor"
              v-model="info.infoWeb"
              :options="options.webOption"
            ></quill-editor>
          </el-form-item> -->
          <el-form-item label="热门搜索">
            <el-radio-group v-model="info.hotSearch">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- <el-form-item label="开放预定">
            <el-radio-group v-model="info.isOpen">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="是否显示">
            <el-radio-group v-model="info.down">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">表单提交</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 对话框 -->
    <el-dialog title="关联商家" :visible.sync="dialogTableTradingUsers">
      <el-row :gutter="20" class="products-div">
        <el-col :span="12">
          <label class="products-label">商家名称</label
          ><el-input v-model="productName" placeholder="商家名称"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="searchProducts">搜 索</el-button>
        </el-col>
      </el-row>

      <el-table :data="tradingUsers" ref="tradingUsersTable">
        <el-table-column type="selection"> </el-table-column>
        <el-table-column property="username" label="登录名称" width="150">
          <template slot-scope="scope">
            <el-input :placeholder="scope.row.username" :disabled="true"></el-input>
          </template>
        </el-table-column>
        <el-table-column property="name" label="登录中文名" width="150">
          <template slot-scope="scope">
            <el-input :placeholder="scope.row.name" :disabled="true"></el-input>
          </template>
        </el-table-column>
        <el-table-column property="mobile" label="联系电话" width="150">
          <template slot-scope="scope">
            <el-input :placeholder="scope.row.mobile" :disabled="true"></el-input>
          </template>
        </el-table-column>
        <el-table-column property="email" label="电子邮箱" width="150">
          <template slot-scope="scope">
            <el-input :placeholder="scope.row.email" :disabled="true"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination small layout="prev, pager, next" :total="total"> </el-pagination>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogTableVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="confirmTradingUsers">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from "@/api/publicManager/leisure.js";
import tApi from "@/api/bussManager/tradingUser.js";
import { mapMutations } from "vuex";
//富文本框
import VueUeditorWrap from "vue-ueditor-wrap";
import ueditor from "@/assets/js/ueditorConfig.js";
import UploadFile from "@/components/uploadImage/uploadImage.vue";
import baseURL from "@/config/baseUrl.js";
export default {
  components: {
    VueUeditorWrap,
    UploadFile,
  },
  name: "addOrEditLeisure",
  data() {
    return {
      info: {
        id: "",
        name: "",
        classId: 0,
        status: 0,
        subTitle: "",
        titleImg: "",
        icon: "",
        recommandReason: "",
        info: "",
        infoWeb: "",
        hotSearch: 0,
        isOpen: 0,
        down: 0,
        todayPrice: "",
        sort: 0,
        typeId: "",
      },
      myConfig: ueditor.myConfig,
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
      //对话框选项
      productName: "",
      //关联商家
      tradingUsers: [],
      selectTradingUsers: [],
      dialogTableTradingUsers: false,
      total: 0,
      statuses: [
        {
          value: 0,
          label: "待审核",
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
      classes: [],
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
      imgPaths: [],
    };
  },
  methods: {
    ...mapMutations({
      deleteTags: "DELETE_TAGSLIST",
    }),
    searchProducts: function () {
      this.page.page = 1;
      if (this.productName != null && this.productName != "") {
        this.page["businessName"] = this.productName;
      }
      tApi
        .getAllList(this.page)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.tradingUsers = result.rows;
          this.page.totalCount = result.total;
          this.$nextTick(function () {
            this.tradingUsers.forEach((tradingUser, i) => {
              this.selectTradingUsers.forEach((selectTradingUser, j) => {
                if (
                  this.tradingUsers[i] != null &&
                  this.selectTradingUsers[j] != null &&
                  this.tradingUsers[i].id == this.selectTradingUsers[j].id
                ) {
                  this.$refs.tradingUsersTable.toggleRowSelection(
                    this.tradingUsers[i],
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
    changePageProducts(index) {
      this.page.page = index;
      tApi
        .getAllList(this.page)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.tradingUsers = result.rows;
          this.page.totalCount = result.total;
          this.$nextTick(function () {
            this.tradingUsers.forEach((tradingUser, i) => {
              this.selectTradingUsers.forEach((selectTradingUser, j) => {
                if (
                  this.tradingUsers[i] != null &&
                  this.selectTradingUsers[j] != null &&
                  this.tradingUsers[i].id == this.selectTradingUsers[j].id
                ) {
                  this.$refs.tradingUsersTable.toggleRowSelection(
                    this.tradingUsers[i],
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
    addTradingUsers: function () {
      this.dialogTableTradingUsers = true;
      tApi
        .getAllList(this.page)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.tradingUsers = result.rows;
          this.total = result.total;
          this.$nextTick(function () {
            this.tradingUsers.forEach((tradingUser, i) => {
              this.selectTradingUsers.forEach((selectTradingUser, j) => {
                if (
                  this.tradingUsers[i] != null &&
                  this.selectTradingUsers[j] != null &&
                  this.tradingUsers[i].id == this.selectTradingUsers[j].id
                ) {
                  this.$refs.tradingUsersTable.toggleRowSelection(
                    this.tradingUsers[i],
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
    confirmTradingUsers: function () {
      this.selectTradingUsers = [];
      this.info.tradingIds = "";
      this.dialogTableTradingUsers = false;
      this.selectTradingUsers = this.$refs.tradingUsersTable.selection;
      for (let i = 0; i < this.selectTradingUsers.length; i++) {
        this.info.tradingIds += this.selectTradingUsers[i].id + ",";
      }
    },
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
      this.info.titleImg = data.filePath;
    },
    thumbValue: function (data) {
      this.info.icon = data.filePath;
    },
    //提交表单
    onSubmit: function () {
      // let isCheck = this.infoChange();
      // if (!isCheck) {
      //   return;
      // }
      api
        .addOrEdit(this.info)
        .then((result) => {
          if (result.success) {
            this.$message.success("提交成功！");
            this.deleteTags(this.$route.fullPath); //关闭当前窗口
            //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
            this.$router.push({
              name: "leisureList",
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
      if (this.$route.params && this.$route.params.Id) {
        api
          .detailed({ id: this.$route.params.Id })
          .then((result) => {
            this.uploadGroupTitle.fileList = [];
            this.uploadGroupThumb.fileList = [];
            this.info = result.leisure;
            this.selectTradingUsers = result.tlist;
            this.uploadGroupTitle.fileList.push({
              url: baseURL.releaseUrl + result.leisure.titleImg,
            });
            this.uploadGroupThumb.fileList.push({
              url: baseURL.releaseUrl + result.leisure.icon,
            });
          })
          .catch(() => {
            this.$message.error("数据获取失败");
          });
      } else {
        //重置参数
        Object.keys(this.info).map((key) => (this.info[key] = ""));
        this.info = {
          id: "",
          name: "",
          classId: 0,
          status: 0,
          subTitle: "",
          titleImg: "",
          icon: "",
          recommandReason: "",
          info: "",
          infoWeb: "",
          hotSearch: 0,
          isOpen: 0,
          down: 0,
          todayPrice: "",
          sort: 0,
          typeId: "",
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

<style scoped>
.el-rate {
    display: inline-flex;
}
</style>