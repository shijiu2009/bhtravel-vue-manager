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
        :data="roleList"
        border
        ref="multipleTable"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        class="adjustTable"
        :max-height="this.$tableHeight"
      >
        <!-- 固定参数 -->
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

        <!-- 模块参数 -->
        <el-table-column
          prop="rname"
          label="名称"
          sortable
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="info"
          label="详情"
          sortable
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="rid"
          label="角色编码"
          sortable
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="orgId"
          label="组织id"
          sortable
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="角色类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.flag == 1 ? 'success' : 'primary'"
              disable-transitions
            >
              {{ scope.row.ptype == 1 ? "全局" : "私有" }}</el-tag
            >
          </template>
        </el-table-column>
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
              @click="createOrEditBtn(scope.row.rid)"
            ></el-button>
            <el-button
              type="danger"
              round
              icon="el-icon-delete"
              circle
              size="small"
              title="删除"
              @click.native.prevent="openDeleteWarning(scope.row.rid)"
            ></el-button>
          </div>
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
import api from "@/api/systemManager/role.js";
import Screen from "@/components/screen/screen.vue";
import { mapState } from "vuex";
export default {
  name: "role_list",
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
            name: "rname",
            title: "名称",
          },
        ],
        date: false,
      },
      roleList: [],
      //多选数据
      multipleSelection: [],
      searchDate: [],
    };
  },
  computed: {
    ...mapState({
      page: "page",
    }),
  },
  methods: {
    //点击分页按钮
    handlePageChange: function (index) {
      this.page.page = index;
      this.getList();
    },
    //触发搜索按钮
    handleSearch: function (data) {
      if (data != null && data.date != null && data.date.length > 0) {
        data["start"] = data.date[0];
        data["end"] = data.date[1];
      }
      if (data["rname"] == null || data["rname"] == "") {
        this.$delete(data, "rname");
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
          this.roleList = result.rows;
          this.page.totalCount = result.total;
        })
        .catch(() => {
          this.loading = false; //关掉加载动画
          this.$message.error("查询出错");
        });
    },
    createOrEditBtn: function (id) {
      //判断是添加还是编辑
      let name = "role_add";
      if (id) {
        name = "role_edit";
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
          this.roleList = result.rows;
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
        .openDeleteWarning("/api/manager/role/delete", { rid: ids })
        .then(() => {
          this.getList();
        })
        .catch(() => {});
    },
  },
  activated() {
    this.getList();
  },
  created() {
    this.getList();
  },
};
</script>
