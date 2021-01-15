<template>
  <div>
    <div class="handle-box">
      <Screen :screenCondition="screenCondition"></Screen>
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
    <div>
      <el-table
        :data="commentList"
        border
        ref="multipleTable"
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="52" align="center"></el-table-column>
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
        <el-table-column label="评论对象类别" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type == 0" type="primary" disable-transitions>{{
              "酒店"
            }}</el-tag>
            <el-tag v-if="scope.row.type == 1" type="primary" disable-transitions>{{
              "景点"
            }}</el-tag>
            <el-tag v-if="scope.row.type == 2" type="primary" disable-transitions>{{
              "线路"
            }}</el-tag>
            <el-tag v-if="scope.row.type == 3" type="primary" disable-transitions>{{
              "民宿"
            }}</el-tag>
            <el-tag v-if="scope.row.type == 4" type="primary" disable-transitions>{{
              "农家乐"
            }}</el-tag>
            <el-tag v-if="scope.row.type == 5" type="primary" disable-transitions>{{
              "民俗文化"
            }}</el-tag>
            <el-tag v-if="scope.row.type == 6" type="primary" disable-transitions>{{
              "美食"
            }}</el-tag>
            <el-tag v-if="scope.row.type == 7" type="primary" disable-transitions>{{
              "特产"
            }}</el-tag>
            <el-tag v-if="scope.row.type == 8" type="primary" disable-transitions>{{
              "文化场馆"
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
  </div>
</template>
<script>
import commentApi from "@/api/travelManager/userComment.js";
import { mapState, mapMutations } from "vuex";
import Screen from "@/components/screen/screen.vue";
export default {
  name: "commentList",
  components: {
    Screen,
  },
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
      //搜索栏数据
      screenCondition: {
        input: [
          {
            name: "userName",
            title: "评论人昵称",
          },
        ],
        select: [
          {
            name: "type",
            title: "类别",
            list: [
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
                label: "民宿",
              },
              {
                value: 4,
                label: "农家乐",
              },
              {
                value: 5,
                label: "民俗文化",
              },
              {
                value: 6,
                label: "美食",
              },
              {
                value: 7,
                label: "特产",
              },
              {
                value: 8,
                label: "文化场馆",
              },
            ],
          },
        ],
        date: false,
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
      searchDate: [],
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
    handleSearch: function (data) {
      if (data != null && data.date != null && data.date.length > 0) {
        data["start"] = data.date[0];
        data["end"] = data.date[1];
      }
      data["page"] = this.page.page;
      data["totalCount"] = this.page.totalCount;
      data["rows"] = this.page.rows;
      this.searchDate = data;
      commentApi
        .getComments(data)
        .then((result) => {
          //当页面只有一条数据且并不是第一页时，防止删除的时候页面无法获得数据
          if (result.rows.length == 0 && this.page.page > 1) {
            this.page.page = 1;
            this.handleSearch(this.searchDate);
          }
          this.loading = false; //关掉加载动画
          this.commentList = result.rows;
          this.page.totalCount = result.total;
        })
        .catch(() => {
          this.loading = false; //关掉加载动画
          this.$message.error("查询出错");
        });
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
      this.handleSearch(this.searchDate);
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
