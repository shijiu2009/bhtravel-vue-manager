<template>
  <div>
    <div class="handle-box">
      <Screen :screenCondition="screenCondition"></Screen>
      <div>
        <el-button
          type="primary"
          icon="el-icon-delete"
          class="handle-del mr10"
          size="mini"
          @click="delAllSelection"
        >
          批量删除</el-button
        >
        <!-- 添加按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="handle-del mr10"
          size="mini"
          @click="createOrEditBtn('')"
        >
          添加</el-button
        >
      </div>
    </div>
    <div class="data_list">
      <el-table
        :data="userList"
        border
        ref="multipleTable"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        class="adjustTable"
        :max-height="this.$tableHeight"
      >
        <!-- 固定参数 -->
        <el-table-column type="selection" width="52" align="center"></el-table-column>
        <el-table-column
          type="index"
          width="50"
          align="center"
          label="序号"
          sortable
        ></el-table-column>

        <!-- 模块参数 -->
        <el-table-column
          prop="username"
          label="登录名"
          sortable
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="realname"
          label="真实姓名"
          sortable
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="mobile"
          label="路径"
          sortable
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="email"
          label="电子邮箱"
          sortable
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createtime"
          label="创建时间"
          sortable
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <!-- 操作 -->
        <el-table-column fixed="right" label="操作" align="center" width="150">
          <div slot-scope="scope">
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
              @click.native.prevent="openDeleteWarning(scope.row.id)"
            ></el-button>
          </div>
        </el-table-column>
      </el-table>
      <!-- 对话框 -->
      <el-dialog title="修改密码" :visible.sync="dialogPassword">
        <div class="demo-input-suffix">
          新密码：
          <el-input v-model="passwordParams.newpass1" show-password></el-input>
        </div>
        <div class="demo-input-suffix">
          再次输入新密码：
          <el-input v-model="passwordParams.newpass2" show-password></el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <!-- <el-button @click="dialogTableVisible = false">取 消</el-button> -->
          <el-button type="primary" @click="confirmPassword">确 定</el-button>
        </div>
      </el-dialog>
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
import api from "@/api/systemManager/user.js";
import Screen from "@/components/screen/screen.vue";
import { mapState } from "vuex";
export default {
  name: "user_list",
  components: {
    Screen,
  },
  data() {
    return {
      //是否显示加载动画效果
      loading: false,
      //搜索栏数据
      screenCondition: {
        input: [
          {
            name: "username",
            title: "用户名",
          },
        ],
        date: false,
      },
      userList: [],
      //多选数据
      multipleSelection: [],
      //对话框
      dialogPassword: false,
      passwordParams: [{
        userId: "",
        newpass1: "",
        newpass2: "",
      }],
      searchDate: [],
    };
  },
  computed: {
    ...mapState({
      page: "page",
    }),
  },
  methods: {
    openDialog: function (id) {
      this.passwordParams.userId = id;
      this.dialogPassword = true;
    },
    confirmPassword: function () {
      api.changePassword(this.passwordParams).then((result) => {
        alert(result.msg);
      });
      this.dialogPassword = false;
    },
    //点击分页按钮
    handlePageChange: function (index) {
      this.page.page = index;
      this.handleSearch(this.searchDate);
    },
    //触发搜索按钮
    handleSearch: function (data) {
      if (data != null && data.date != null && data.date.length > 0) {
        data["start"] = data.date[0];
        data["end"] = data.date[1];
      }
      if (data["username"] == null || data["username"] == "") {
        this.$delete(data, "username");
      }
      data["page"] = this.page.page;
      data["totalCount"] = this.page.totalCount;
      data["rows"] = this.page.rows;
      this.searchDate = data;
      api
        .getList(data)
        .then((result) => {
          //当页面只有一条数据且并不是第一页时，防止删除的时候页面无法获得数据
          if (result.rows.length == 0 && this.page.page > 1) {
            this.page.page = 1;
            this.handleSearch(this.searchDate);
          }
          this.loading = false; //关掉加载动画
          this.userList = result.rows;
          this.page.totalCount = result.total;
        })
        .catch(() => {
          this.loading = false; //关掉加载动画
          this.$message.error("查询出错");
        });
    },
    createOrEditBtn: function (id) {
      //判断是添加还是编辑
      let name = "user_add";
      if (id) {
        name = "user_edit";
      }
      this.$router.push({
        name: name,
        params: { id: id },
      });
    },
    //获取菜单权限列表
    getList: function () {
      this.loading = true;
      api.getList(this.page).then((result) => {
        //当页面只有一条数据且并不是第一页时，防止删除的时候页面无法获得数据
        if (result && result.rows) {
          if (result.rows.length == 0 && this.page.page > 1) {
            this.page.page = this.page.page - 1;
            this.getList();
          }
          this.loading = false; //关掉加载动画
          this.userList = result.rows;
          this.page.totalCount = result.total;
        }
      });
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //删除所有选中项(批量删除)
    delAllSelection: function () {
      //调用方法拼接字符串
      this.$global.idSplicing(this.multipleSelection).then((result) => {
        this.openDeleteWarning(result.ids);
      });
    },
    //点击删除后弹出提示框
    openDeleteWarning: function (ids) {
      this.$global
        .openDeleteWarning("/api/manager/user/delete", { uid: ids })
        .then(() => {
          this.getList();
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "删除失败",
          });
        });
    },
  },
  created() {
    this.getList();
  },
  activated() {
    if (this.$route.params && this.$route.params.flow) {
      //重新获取页面数据，
      this.getList();
    }
  },
};
</script>
