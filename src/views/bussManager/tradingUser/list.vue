<template>
  <div>
    <div>
      <div class="handle-box">
        <!-- 操作按钮 -->
        <div class="operation">
          <!-- 批量删除按钮 -->
          <el-button
            type="primary"
            icon="el-icon-delete"
            class="handle-del mr10"
            size="mini"
            @click="delAllSelection"
            >批量删除</el-button
          >
          <!-- 添加按钮 -->
          <el-button
            type="primary"
            icon="el-icon-plus"
            class="handle-del mr10"
            size="mini"
            @click="createOrEditBtn('')"
            >添加</el-button
          >
        </div>
      </div>
      <div class="data_list">
        <el-table
          :data="themeList"
          border
                    ref="multipleTable"
          :max-height="this.getHeight"
          style="width: 100%"
          v-loading="loading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="52"
            align="center"
          ></el-table-column>
          <el-table-column
            type="index"
            width="50"
            align="center"
            label="序号"
            sortable
          ></el-table-column>
          <el-table-column
            prop="username"
            label="登录名称"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="name"
            label="中文名称"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="mobile"
            label="电话号码"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="email"
            label="电子邮箱"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="businessName"
            label="商家名称"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                type="primary"
                round
                icon="el-icon-edit"
                circle
                size="small"
                title="编辑"
                @click="createOrEditBtn(scope.row.id)"
              ></el-button>
              <el-button
                type="success"
                round
                icon="el-icon-eleme"
                circle
                size="small"
                title="修改密码"
                @click="openDialog(scope.row.id)"
              ></el-button>
              <el-button
                type="danger"
                round
                icon="el-icon-delete"
                circle
                size="small"
                title="删除"
                @click.native.prevent="
                  openDeleteWarning(scope.$index, scope.row.id)
                "
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 对话框 -->
        <el-dialog title="修改密码" :visible.sync="dialogPassword">
          <div class="demo-input-suffix">
            新密码：
            <el-input v-model="newpass1" show-password></el-input>
          </div>
          <div class="demo-input-suffix">
            再次输入新密码：
            <el-input v-model="newpass2" show-password></el-input>
          </div>
          <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="dialogTableVisible = false">取 消</el-button> -->
            <el-button type="primary" @click="confirmPassword">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <!-- 分页操作 -->
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next,jumper"
          :page-size="page.rows"
          :total="page.totalCount"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/bussManager/tradingUser.js";
import { mapMutations, mapGetters } from "vuex";

export default {
  name: "tradingUserList",
  data() {
    return {
      //加载
      loading: true,
      themeList: [],

      //搜索信息
      queryInfo: {
        job: "",
        name: "",
        date: "",
      },
      userId: "",
      newpass1: "",
      newpass2: "",
      //广告位置列表，用做筛选条件
      loctions: {
        options: [],
      },
      //时间选择器
      timePicker: {
        //   快捷选项
        pickerOptions: {
          shortcuts: [
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
              },
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              },
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
              },
            },
          ],
        },
      },
      //分页数据
      page: {
        // 默认显示第几页
        page: 1,
        // 总条数，根据接口获取数据长度(注意：这里不能为空)
        totalCount: 0,
        // 个数选择器（可修改）
        // 默认每页显示的条数（可修改）
        rows: 20,
      },
      multipleSelection: [],
      url: this.$baseUrl.releaseUrl,
      imgList: [],
      //对话框
      dialogPassword: false,
    };
  },
  methods: {
    ...mapMutations({
      setTagsList: "SET_TAGSLIST",
    }),
    openDialog: function (id) {
      this.userId = id;
      this.dialogPassword = true;
    },
    confirmPassword: function () {
      api
        .changePassword({
          id: this.userId,
          newpass1: this.newpass1,
          newpass2: this.newpass2,
        })
        .then((result) => {
          if (result.success) {
            this.$message({
              type: "success",
              message: "修改成功!",
            });
          } else {
            this.$message({
              type: "warning",
              message: result.msg,
            });
          }
        });
      this.dialogPassword = false;
    },
    //触发搜索按钮
    handleSearch: function () {},
    //删除所有选中项(批量删除)
    delAllSelection: function () {
      //判断是否有选中项
      if (this.multipleSelection.length <= 0) {
        this.$message({
          type: "warning",
          message: "请选择删除项",
        });
        return;
      }
      let ids = "";
      this.multipleSelection.forEach((item) => {
        ids += item.id + ",";
      });
      ids = ids.slice(0, ids.length - 1);
      //批量删除
      this.openDeleteWarning(0, ids);
    },
    //点击删除后弹出提示框
    openDeleteWarning: function (index, id) {
      this.$confirm("此操作将永久删除该数据么, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //在列表中删除数据
          return api.deleted({ ids: id });
        })
        .then(() => {
          this.getList();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "删除失败",
          });
        });
    },
    createOrEditBtn: function (id) {
      //判断是添加还是编辑
      let name = "addTradingUser";
      if (id) {
        name = "editTradingUser";
      }
      this.$router.push({
        name: name,
        params: { id: id },
      });
    },
    //获取线路列表
    getList: function () {
      this.loading = true;
      api
        .getList(this.page)
        .then((result) => {
          //当页面只有一条数据且并不是第一页时，防止删除的时候页面无法获得数据
          if (result.rows.length == 0 && this.page.page > 1) {
            this.page.page = this.page.page - 1;
            this.getList();
          }
          this.loading = false; //关掉加载动画
          this.themeList = result.rows;
          this.page.totalCount = result.total;
        })
        .catch(() => {
          this.loading = false; //关掉加载动画
          this.$message.error("查询出错");
        });
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //点击分页按钮
    handlePageChange: function (index) {
      this.page.page = index;
      this.getList();
    },
    // 防抖函数
    debounce(func, wait, immediate) {
      var timeout;
      return function () {
        var context = this,
          args = arguments;
        var later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters([
      "getHeight",
      // ...
    ]),
  },
  mounted() {
    let that = this;
    // 添加resize的回调函数，但是只允许它每300毫秒执行一次
    window.addEventListener(
      "resize",
      this.debounce(function () {
        that.$store.state.tableHeight = window.innerHeight;
      }, 300)
    );
  },
  beforeDestroy() {
    // 在组件生命周期结束的时候销毁。
    let that = this;
    window.removeEventListener(
      "resize",
      this.debounce(function () {
        that.$store.state.tableHeight = window.innerHeight;
      }, 300)
    );
  },
  //keep-alive 生命周期，
  activated() {
    //flow=true,则刷新界面
    if (this.$route.params && this.$route.params.flow) {
      this.getList();
    }
  },
};
</script>
