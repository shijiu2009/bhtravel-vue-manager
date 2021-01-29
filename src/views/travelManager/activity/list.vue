<template>
  <div>
    <div class="handle-box">
      <div>
        <!-- 输入搜索条件input框 -->
        <div class="searChfactor input-box">
          <el-input v-model="queryInfo.name" placeholder="用户名" class="handle-input mr10" size="mini" clearable>
          </el-input>
        </div>
        <!-- 时间选择器 -->
        <div class="block searChfactor">
          <el-date-picker v-model="queryInfo.date" size="mini" type="datetimerange"
            :picker-options="timePicker.pickerOptions" range-separator="-" start-placeholder="开始日期"
            end-placeholder="结束日期" align="right"></el-date-picker>
        </div>
        <!-- 搜索确定按钮 -->
        <el-button class="searChfactor" type="primary" size="mini" icon="el-icon-search" @click="handleSearch">搜索
        </el-button>
      </div>
      <!-- 操作按钮 -->
      <div class="operation">
        <!-- 批量删除按钮 -->
        <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" size="mini" v-role="'4003004'"
          @click="delAllSelection">批量删除</el-button>
        <!-- 添加按钮 -->
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" size="mini" v-role="'4003002'"
          @click="createOrEditBtn(true)">添加</el-button>
      </div>
    </div>
    <div class="data_list">
      <el-table :data="activityList" border ref="multipleTable"
        :max-height="this.getHeight" style="width: 100%" v-loading="loading"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="52" align="center"></el-table-column>
        <el-table-column type="index" width="50" align="center" label="序号" sortable></el-table-column>
        <el-table-column prop="title" label="名称" sortable align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="是否排序">
          <template slot-scope="scope">
            <el-tag :type="scope.row.sort=='1' ? 'success' : 'primary'" disable-transitions>
              {{scope.row.sort=="1"?"是":"否"}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <div slot-scope="scope">
            <el-button type="primary" round icon="el-icon-edit" circle size="small" title="编辑" v-role="'4003003'"
              @click="createOrEditBtn(false,scope.row.id)"></el-button>
            <el-button type="success" round icon="el-icon-eleme" circle size="small" title="查看" v-role="'4003005'"
              @click="detailed(scope.$index)"></el-button>
            <el-button type="danger" round icon="el-icon-delete" circle size="small" title="删除" v-role="'4003004'"
              @click.native.prevent="openDeleteWarning(scope.row.id)"></el-button>
          </div>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next,jumper" :page-size="page.rows"
          :total="page.totalCount" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
    <Detailed :content="activityDetailed" ref="detailedMound"></Detailed>
  </div>
</template>
<script>
import activityApi from "@/api/activity.js";
import { mapState, mapMutations } from "vuex";
//调用详细内容页面
import Detailed from "./component/detailed";

export default {
  name: "activityList",
  components: {
    Detailed,
  },
  data() {
    return {
      queryInfo: {},
      //是否显示加载动画效果
      loading: true,
      activityList: [],
      activityDetailed: "",
      //多选数据
      multipleSelection: [],
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
      deleteInclude: "DELETE_INCLUDE",
    }),
    handleSearch() {},
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
        .openDeleteWarning("/manager/activity/delete.do", { ids: ids })
        .then(() => {
          this.getActivitys();
        });
    },
    //编辑数据
    createOrEditBtn: function (flow, id) {
      //判断是添加还是编辑
      let path = "addActivity";
      if (id) {
        path = "editActivity";
      }
      this.$router.push({
        name: path,
        params: { flow: flow, id: id },
      });
    },
    //打开查看页面
    detailed: function (i) {
      this.$refs.detailedMound
        .updataComtent(this.activityList[i])
        .then((result) => {
          console.log(result);
        });
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getActivitys: function () {
      this.loading = true;
      activityApi
        .getActivitys(this.page)
        .then((result) => {
          //当页面只有一条数据且并不是第一页时，防止删除的时候页面无法获得数据
          if (result.rows.length == 0 && this.page.page > 1) {
            this.page.page = this.page.page - 1;
            this.getActivitys();
          }
          this.loading = false; //关掉加载动画
          this.activityList = result.rows;
          this.page.totalCount = result.total;
        })
        .catch(() => {
          this.loading = false; //关掉加载动画
          this.$message.error("活动列表获取失败");
        });
    },
    //点击分页按钮
    handlePageChange: function (index) {
      this.page.page = index;
      this.getActivitys();
    },
  },
  created() {
    this.getActivitys();
  },
  //keep-alive 生命周期，
  activated() {
    //flow：true,则刷新界面，
    if (this.$route.params && this.$route.params.flow) {
      this.getActivitys();
    }
  },
};
// activated,deactivated这两个生命周期函数一定是要在使用了keep-alive组件后才会有的
</script>