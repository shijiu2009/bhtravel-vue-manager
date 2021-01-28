<template>
  <div>
    <div class="handle-box">
      <div>
        <!-- 输入搜索条件input框 -->
        <div class="searChfactor input-box">
          <el-input
            v-model="queryInfo.name"
            placeholder="名称"
            class="handle-input mr10"
            size="mini"
            clearable
          ></el-input>
        </div>
        <!-- 可选择下拉搜索 -->
        <div class="searChfactor">
          <el-select
            size="mini"
            v-model="queryInfo.job"
            clearable
            filterable
            placeholder="所处位置"
          >
            <el-option
              size="mini"
              v-for="item in loctions.options"
              :key="item.id"
              :label="item.codeName"
              :value="item.value"
            ></el-option>
          </el-select>
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
          v-role="'4006014'"
          @click="delAllSelection"
          >批量删除</el-button
        >
        <!-- 添加按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="handle-del mr10"
          size="mini"
          v-role="'4006012'"
          @click="createOrEditBtn(true)"
          >添加</el-button
        >
      </div>
    </div>
    <div class="data_list">
      <el-table
        :data="advertList"
        border
        ref="multipleTable"
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
          prop="name"
          label="名称"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="图片" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.path"
              class="table-td-thumb cell_face"
              :src="url + scope.row.path"
              :preview-src-list="[scope.row.path]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="所处位置" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <p v-text="scope.row.loction"></p>
          </template>
        </el-table-column>
        <el-table-column label="是否显示">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.isShow == '1' ? 'success' : 'primary'"
              disable-transitions
              >{{ scope.row.isShow == "1" ? "是" : "否" }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="是否排序">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.sort == '1' ? 'success' : 'primary'"
              disable-transitions
              >{{ scope.row.sort == "1" ? "是" : "否" }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              round
              icon="el-icon-edit"
              circle
              size="small"
              title="编辑"
              @click="createOrEditBtn(false, scope.row.id)"
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
import advertApi from "@/api/advert.js";
import { mapState, mapMutations } from "vuex";

export default {
  name: "advertList",
  data() {
    return {
      //加载
      loading: true,
      advertList: [],

      //搜索信息
      queryInfo: {
        job: "",
        name: "",
        date: "",
      },
      //广告位置列表，用做筛选条件
      loctions: {
        options: [],
      },
      //分页数据
      //多选数据
      multipleSelection: [],
      url: this.$baseUrl.releaseUrl,
    };
  },
  computed: {
    ...mapState({
      timePicker: "timePicker",
      page: "page",
    }),
  },
  methods: {
    ...mapMutations({
      setTagsList: "SET_TAGSLIST",
    }),
    //触发搜索按钮
    handleSearch: function () {
      console.log(this.queryInfo);
    },
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
      this.openDeleteWarning(ids);
    },
    //点击删除后弹出提示框
    openDeleteWarning: function (ids) {
      this.$confirm("此操作将永久删除该数据么, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //在列表中删除数据
          return advertApi.deleteAdvert({ ids: ids });
        })
        .then(() => {
          //删除成功刷新界面数据
          this.getAdverts();
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
    //编辑
    createOrEditBtn: function (flow, id) {
      //判断是添加还是编辑
      let path = "addAdvert";
      if (id) {
        path = "editAdvert";
      }
      this.$router.push({
        name: path,
        params: { flow: flow, id: id },
      });
    },
    //获取广告列表
    getAdverts: function () {
      this.loading = true;
      advertApi
        .getAdverts(this.page)
        .then((result) => {
          //当页面只有一条数据且并不是第一页时，防止删除的时候页面无法获得数据
          if (result.rows.length == 0 && this.page.page > 1) {
            this.page.page = this.page.page - 1;
            this.getAdverts();
          }
          this.loading = false; //关掉加载动画
          this.advertList = result.rows;
          this.page.totalCount = result.total;
        })
        .catch(() => {
          this.loading = false; //关掉加载动画
          this.$message.error("查询出错");
        });
    },
    //获取广告位置列表
    getLoctions: function () {
      advertApi
        .getLoctions()
        .then((result) => {
          this.loctions.options = result.all;
        })
        .catch(() => {
          this.$message.error("广告位置列表获取失败");
        });
    },
    // 获取广告位置信息
    getLoction: function (id) {
      advertApi
        .detailedAdvertSite({ id: id })
        .then((result) => {
          // this.advertInfo = result.advertSite;
          return result.advertSite.codeName;
        })
        .catch(() => {
          // this.$message.error("数据获取失败");
          return "";
        });
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //点击分页按钮
    handlePageChange: function (index) {
      this.page.page = index;
      this.getAdverts();
    },
  },
  created() {
    this.getAdverts();
    this.getLoctions();
  },
  //keep-alive 生命周期，
  activated() {
    //flow=true,则刷新界面
    if (this.$route.params && this.$route.params.flow) {
      this.getAdverts();
    }
  },
};
</script>