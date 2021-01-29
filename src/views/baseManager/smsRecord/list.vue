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
          >搜索</el-button
        >
      </div>
    </div>
    <div class="data_list">
      <el-table
        :data="smsRecordList"
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
          prop="phone"
          label="手机号"
          sortable
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="ip"
          label="请求IP"
          sortable
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="message"
          label="发送状态"
          sortable
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="validates"
          label="验证码"
          sortable
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="请求时间"
          sortable
          align="center"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
    </div>
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
    <Detailed :content="smsRecordDetailed" ref="detailedMound"></Detailed>
  </div>
</template>
<script>
import smsRecordApi from "@/api/smsRecord.js";
import { mapState, mapMutations } from "vuex";
//调用详细内容页面
import Detailed from "./component/detailed";

export default {
  name: "smsRecordList",
  components: {
    Detailed,
  },
  data() {
    return {
      //是否显示加载动画效果
      loading: true,
      smsRecordList: [],
      smsRecordDetailed: "",
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
        rows: 20,
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
      setSmsRecordsList: "SET_TAGSLIST",
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
          return smsRecordApi.deleteSmsRecord({ ids: ids });
        })
        .then(() => {
          //删除成功刷新界面数据
          this.getSmsRecords();
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
      let path = "addSmsRecord";
      if (id) {
        path = "editSmsRecord";
      }
      this.$router.push({
        name: path,
        params: { flow: flow, id: id },
      });
    },
    //打开查看页面
    detailed: function (i) {
      this.$refs.detailedMound.updataComtent(this.smsRecordList[i]);
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getSmsRecord: function () {
      this.loading = true;
      smsRecordApi
        .getSmsRecord(this.page)
        .then((result) => {
          //当页面只有一条数据且并不是第一页时，防止删除的时候页面无法获得数据
          if (result.rows.length == 0 && this.page.page > 1) {
            this.page.page = this.page.page - 1;
            this.getSmsRecord();
          }
          this.loading = false; //关掉加载动画
          this.smsRecordList = result.rows;
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
      this.getSmsRecord();
    },
  },
  created() {
    this.getSmsRecord();
  },
  //keep-alive 生命周期，
  activated() {
    //flow：true,则刷新界面，
    if (this.$route.params && this.$route.params.flow) {
      this.getSmsRecord();
    }
  },
};
// activated,deactivated这两个生命周期函数一定是要在使用了keep-alive组件后才会有的
</script>