<template>
  <div>
    <div class="handle-box">
      <div>
        <!-- 可选择下拉搜索 -->
        <div class="searChfactor">
          <el-select
            size="mini"
            v-model="queryInfo.job"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              size="mini"
              v-for="item in jobList.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <!-- 输入搜索条件input框 -->
        <div class="searChfactor input-box">
          <el-input
            v-model="queryInfo.name"
            placeholder="用户名"
            class="handle-input mr10"
            size="mini"
            clearable
          ></el-input>
        </div>
        <!-- 时间选择器 -->
        <div class="block searChfactor">
          <el-date-picker
            v-model="queryInfo.date"
            size="mini"
            type="datetimerange"
            :picker-options="timePicker.pickerOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
        </div>
        <!-- 搜索确定按钮 -->
        <el-button
          class="searChfactor"
          type="primary"
          size="mini"
          icon="el-icon-search"
          @click="handleSearch"
          >搜索</el-button
        >
      </div>
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
          @click="editLinkBtn('')"
          >添加</el-button
        >
      </div>
    </div>
    <div class="data_list">
      <el-table
        :data="
          userList.slice((page.page - 1) * page.rows, page.page * page.rows)
        "
        border
        ref="multipleTable"
        :max-height="this.getHeight"
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <!-- table标题-->
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
        <el-table-column align="center" label="头像" width="70">
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.headImg"
              class="table-td-thumb cell_face"
              :src="scope.row.headImg"
              :preview-src-list="[scope.row.headImg]"
            ></el-image>
            <div v-else class="noAvatar">无</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="age" label="年龄" align="center" width="50"></el-table-column> -->
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="nickName"
          label="公司名称"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="电话"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <!-- 列表操作 -->
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              round
              icon="el-icon-edit"
              circle
              size="small"
              title="编辑"
              @click="editLinkBtn(scope.row.id)"
            ></el-button>
            <el-button
              type="success"
              round
              icon="el-icon-eleme"
              circle
              size="small"
              title="查看"
              @click="userDetailed(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              round
              icon="el-icon-delete"
              circle
              size="small"
              title="删除"
              @click.native.prevent="
                openDeleteWarning(scope.$index, scope.row.id, userList)
              "
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
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
</template>

<script>
import userApi from "@/api/user.js";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      //加载
      loading: true,
      //   用户数据
      userList: [],
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
      //可选择下拉搜索框信息
      jobList: {
        options: [
          {
            value: "0",
            label: "技术部",
          },
          {
            value: "1",
            label: "后勤部",
          },
          {
            value: "2",
            label: "行政部",
          },
          {
            value: "3",
            label: "市场部",
          },
          {
            value: "4",
            label: "销售部",
          },
        ],
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
      //搜索信息
      queryInfo: {
        job: "",
        name: "",
        date: "",
      },
      multipleSelection: [],
    };
  },
  methods: {
    ...mapMutations({
      setTagsList: "SET_TAGSLIST",
    }),
    //获取用户列表
    getUsers: function () {
      userApi
        .getUsers(this.page)
        .then((result) => {
          console.log(result);
          this.userList = result.rows;
          this.page.totalCount = this.userList.length;
          this.loading = false;
        })
        .catch(() => {
          this.$message.error("查询出错");
        });
    },
    //点击删除后弹出提示框
    openDeleteWarning: function (index, id, rows) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return userApi.deleteUser({ id: id });
          //在列表中删除数据
        })
        .then(() => {
          rows.splice(id, 1);
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
    //改变页面后
    handlePageChange: function (index) {
      this.page.page = index;
    },
    // 多选操作
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    //删除所有选中项(批量删除)
    delAllSelection: function () {
      console.log(this.multipleSelection);
    },
    //触发搜索按钮
    handleSearch: function () {
      console.log(this.queryInfo);
    },
    //跳转编辑界面
    editLinkBtn: function (id) {
      this.$router.push({ name: "addOrEditUser", params: { Id: id } });
      this.setTagsList("/addOrEditUser");
    },
    //跳转用户详情界面
    userDetailed: function (id) {
      this.$router.push({ name: "userDetailed", params: { Id: id } });
      this.setTagsList("/userDetailed");
    },
  },
  created() {
    this.getUsers();
  },
};
</script>