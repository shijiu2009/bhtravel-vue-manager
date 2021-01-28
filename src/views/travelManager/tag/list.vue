<template>
  <div>
    <div class="handle-box">
      <div>
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
        >搜索</el-button>
      </div>
      <!-- 操作按钮 -->
      <div class="operation">
        <!-- 批量删除按钮 -->
        <el-button
          type="primary"
          icon="el-icon-delete"
          class="handle-del mr10"
          size="mini"
          v-role="'4003004'"
          @click="delAllSelection"
        >批量删除</el-button>
        <!-- 添加按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="handle-del mr10"
          size="mini"
          v-role="'4003002'"
          @click="createOrEditBtn(true)"
        >添加</el-button>
      </div>
    </div>
    <div class="data_list">
      <el-table
        :data="tagList"
        border
        ref="multipleTable"
        :max-height="this.$tableHeight"
        style="width: 100%"
        v-loading="loading"
        
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="52" align="center"></el-table-column>
        <el-table-column type="index" width="50" align="center" label="序号" sortable></el-table-column>
        <el-table-column prop="name" label="名称" sortable align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="musName" label="所属类别" sortable align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sort" label="排序" sortable align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" sortable align="center" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <div slot-scope="scope">
            <el-button
              type="primary"
              round
              icon="el-icon-edit"
              circle
              size="small"
              title="编辑"
              v-role="'4003003'"
              @click="createOrEditBtn(false,scope.row.id)"
            ></el-button>
            <el-button
              type="success"
              round
              icon="el-icon-eleme"
              circle
              size="small"
              title="查看"
              v-role="'4003005'"
              @click="detailed(scope.$index)"
            ></el-button>
            <el-button
              type="danger"
              round
              icon="el-icon-delete"
              circle
              size="small"
              title="删除"
              v-role="'4003004'"
              @click.native.prevent="openDeleteWarning(scope.row.id)"
            ></el-button>
          </div>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
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
    <Detailed :content="tagDetailed" ref="detailedMound"></Detailed>
  </div>
</template>
<script>
import tagApi from "@/api/tag.js";
import { mapState, mapMutations } from "vuex";
//调用详细内容页面
import Detailed from "./component/detailed";

export default {
  name: "tagList",
  components: {
    Detailed,
  },
  data() {
    return {
      //是否显示加载动画效果
      loading: true,
      tagList: [],
      tagDetailed: "",
      //搜索信息
      queryInfo: {
        name: "",
        date: "",
      },
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
      //多选数据
      multipleSelection: [],
    };
  },
  computed: {
    ...mapState({
      timePicker: "timePicker",
    }),
  },
  methods: {
    ...mapMutations({
      setTagsList: "SET_TAGSLIST",
      deleteInclude: "DELETE_INCLUDE",
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
      //拼接ID
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
          return tagApi.deleteTag({ ids: ids });
        })
        .then(() => {
          //删除成功刷新界面数据
          this.getTags();
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
    //编辑数据
    createOrEditBtn: function (flow, id) {
      //判断是添加还是编辑
      let path = "addTag";
      if (id) {
        path = "editTag";
      }
      this.$router.push({
        name: path,
        params: { flow: flow, id: id },
      });
    },
    //打开查看页面
    detailed: function (i) {
      this.$refs.detailedMound.updataComtent(this.tagList[i]);
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getTag: function () {
      this.loading = true;
      tagApi
        .getTag(this.page)
        .then((result) => {
          //当页面只有一条数据且并不是第一页时，防止删除的时候页面无法获得数据
          if (result.rows.length == 0 && this.page.page > 1) {
            this.page.page = this.page.page - 1;
            this.getTag();
          }
          this.loading = false; //关掉加载动画
          this.tagList = result.rows;
          this.page.totalCount = result.total;
        })
        .catch(() => {
          this.loading = false; //关掉加载动画
          //this.$message.error("广告位置列表获取失败");
        });
    },
    //点击分页按钮
    handlePageChange: function (index) {
      this.page.page = index;
      this.getTag();
    },
  },
  created() {
    this.getTag();
  },
  //keep-alive 生命周期，
  activated() {
    //flow：true,则刷新界面，
    if (this.$route.params && this.$route.params.flow) {
      this.getTag();
    }
  },
};
// activated,deactivated这两个生命周期函数一定是要在使用了keep-alive组件后才会有的
</script>