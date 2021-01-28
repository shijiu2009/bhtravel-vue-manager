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
        :data="purviewList"
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
          prop="aliasname"
          label="名称"
          sortable
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="pname"
          label="标题"
          sortable
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="link"
          label="路径"
          sortable
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="pid"
          label="权限编码"
          sortable
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="sort"
          label="排列循序"
          sortable
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="图标" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <i v-if="scope.row.icon" :class="scope.row.icon"></i>
            <span v-else>无</span>
          </template>
        </el-table-column>

        <el-table-column
          label="是否拥有权限"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.ptype == 1 ? 'success' : 'primary'"
              disable-transitions
            >
              {{ scope.row.ptype == 1 ? "是" : "否" }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column
          label="是否在菜单栏显示"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.hidden == 1 ? 'success' : 'primary'"
              disable-transitions
            >
              {{ scope.row.hidden == 1 ? "是" : "否" }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column
          label="页面是否缓存"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.noCache == 1 ? 'success' : 'primary'"
              disable-transitions
            >
              {{ scope.row.noCache == 1 ? "是" : "否" }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column
          label="是否显示在标签"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.noBreadcrumb == 1 ? 'success' : 'primary'"
              disable-transitions
            >
              {{ scope.row.noBreadcrumb == 1 ? "是" : "否" }}</el-tag
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
              @click="createOrEditBtn(scope.row.pid)"
            ></el-button>
            <el-button
              type="danger"
              round
              icon="el-icon-delete"
              circle
              size="small"
              title="删除"
              @click.native.prevent="openDeleteWarning(scope.row.pid)"
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
import purViewApi from "@/api/systemManager/purview.js";
import Screen from "@/components/screen/screen.vue";
import { mapState } from "vuex";
export default {
  name: "purview_list",
  components: {
    Screen,
  },
  data() {
    return {
      //是否显示加载动画效果
      loading: false,
      //搜索栏数据
      screenCondition: {
        input: ["name"],
        select: {
          options: {
            name: "screenClass",
            title: "类别",
            list: [
              {
                value: "选项4",
                label: "龙须面",
              },
              {
                value: "选项5",
                label: "北京烤鸭",
              },
            ],
          },
        },
        date: true,
      },
      purviewList: [],
      //多选数据
      multipleSelection: [],
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
      this.getPurViews();
    },
    //触发搜索按钮
    handleSearch: function (screenInfo) {
      console.log(screenInfo);
    },
    createOrEditBtn: function (id) {
      //判断是添加还是编辑
      let name = "purview_add";
      if (id) {
        name = "purview_edit";
      }
      this.$router.push({
        name: name,
        params: { id: id },
      });
    },
    //获取菜单权限列表
    getPurViews: function () {
      this.loading = true;
      purViewApi.getPurViews(this.page).then((result) => {
        //当页面只有一条数据且并不是第一页时，防止删除的时候页面无法获得数据
        if (result && result.rows) {
          if (result.rows.length == 0 && this.page.page > 1) {
            this.page.page = this.page.page - 1;
            this.getPurViews();
          }
          this.loading = false; //关掉加载动画
          this.purviewList = result.rows;
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
        .openDeleteWarning("/api/manager/purview/delete", { ids: ids })
        .then(() => {
          this.getPurViews();
        })
        .catch(() => {});
    },
  },
  activated() {
    this.getPurViews();
  },
};
</script>