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
        <!-- 可选择下拉搜索 -->
        <div class="searChfactor">
          <el-select
            size="mini"
            v-model="queryInfo.job"
            clearable
            filterable
            placeholder="评论对象类别"
          >
            <el-option
              size="mini"
              v-for="item in ctypeList"
              :key="item.value"
              :label="item.label"
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
          v-role="'4007004'"
          @click="delAllSelection"
          >批量删除</el-button
        >
        <!-- 添加按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="handle-del mr10"
          size="mini"
          v-role="'4007002'"
          @click="createOrEditBtn(true)"
          >添加</el-button
        >
      </div>
    </div>
    <div class="data_list">
      <el-table
        :data="commentList"
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
          prop="objectName"
          sortable
          label="评论对象名称"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="userName"
          sortable
          label="评论人昵称"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="评论对象类别"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag type="primary" disable-transitions>{{
              scope.row.type == "0"
                ? "酒店"
                : scope.row.type == "1"
                ? "景区"
                : scope.row.type == "2"
                ? "线路"
                : "产品"
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.reviewed == '1'
                  ? 'success'
                  : scope.row.reviewed == '0'
                  ? 'erroe'
                  : 'danger'
              "
              disable-transitions
              >{{
                scope.row.reviewed == "0"
                  ? "未审核"
                  : scope.row.reviewed == "1"
                  ? "通过"
                  : "不通过"
              }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="content"
          label="内容"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <div slot-scope="scope">
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
          </div>
        </el-table-column>
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
  </div>
</template> 
<script>
import commentApi from "@/api/travelManager/userComment.js";
import { mapState, mapMutations } from "vuex";
export default {
  name: "commentList",
  data() {
    return {
      //是否显示加载动画效果
      loading: true,
      //评论信息列表
      commentList: [],
      //搜索信息
      queryInfo: {
        job: "",
        name: "",
        date: "",
      },
      multipleSelection: [],
      //评论对象类别列表，用做筛选条件
      ctypeList: [
        {
          value: 0,
          label: "酒店",
        },
        {
          value: 1,
          label: "景区",
        },
        {
          value: 2,
          label: "线路",
        },
        {
          value: 3,
          label: "产品",
        },
      ],
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
    //删除
    openDeleteWarning: function (ids) {
      this.$confirm("此操作将永久删除该数据么, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //在列表中删除数据
          return commentApi.deleteComment({ ids: ids });
        })
        .then(() => {
          //删除成功刷新界面数据
          this.getUserComments();
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
    //新增或编辑信息
    createOrEditBtn: function (flow, id) {
      //判断是添加还是编辑
      let path = "addComment";
      if (id) {
        path = "editComment";
      }
      this.$router.push({
        name: path,
        params: { flow: flow, id: id },
      });
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //点击分页按钮
    handlePageChange: function (index) {
      this.page.page = index;
      this.getUserComments();
    },
    
    //获取评论
    getUserComments: function () {
      commentApi.getComments(this.page).then((result) => {
        //当页面只有一条数据且并不是第一页时，防止删除的时候页面无法获得数据
        if (result.rows.length == 0 && this.page.page > 1) {
          this.page.page = this.page.page - 1;
          this.getUserComments();
        }
        this.loading = false; //关掉加载动画
        this.commentList = result.rows;
        this.page.totalCount = result.total;
      });
    },
  },
  created() {
    this.getUserComments();
  },
  //keep-alive 生命周期，
  activated() {
    //flow：true,则刷新界面，
    if (this.$route.params && this.$route.params.flow) {
      this.getUserComments();
    }
  },
};
</script>