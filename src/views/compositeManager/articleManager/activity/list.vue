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
          @click="delAllSelection"
          >批量删除</el-button
        >
        <!-- 添加按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="handle-del mr10"
          size="mini"
          @click="createOrEditBtn('')"
          >添加</el-button
        >
      </div>
    </div>
    <div class="data_list">
      <el-table
        :data="activityList"
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
          prop="title"
          label="名称"
          sortable
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          sortable
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
              @click="createOrEditBtn(scope.row.id)"
            ></el-button>
            <el-button
              type="success"
              round
              icon="el-icon-eleme"
              circle
              size="small"
              title="查看"
              @click="detailed(scope.$index)"
            ></el-button>
            <el-button
              type="danger"
              round
              icon="el-icon-delete"
              circle
              size="small"
              title="删除"
              @click.native.prevent="
                openDeleteWarning(scope.$index, scope.row.id)
              "
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
    <Detailed :content="activityDetailed" ref="detailedMound"></Detailed>
  </div>
</template>
<script>
import api from "@/api/activity.js";
import { mapState, mapMutations, mapGetters } from "vuex";
//调用详细内容页面
import Detailed from "./component/detailed";
import Screen from "@/components/screen/screen.vue";
export default {
  name: "activityList",
  components: {
    Detailed,
    Screen,
  },
  data() {
    return {
      //搜索栏数据
      screenCondition: {
        input: [
          {
            name: "title",
            title: "主题名称",
          },
        ],
        date: false,
      },
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
    ...mapGetters([
      "getHeight",
      // ...
    ]),
  },
  methods: {
    ...mapMutations({
      setTagsList: "SET_TAGSLIST",
      deleteInclude: "DELETE_INCLUDE",
    }),
    //触发搜索按钮
    handleSearch: function (data) {
      if (data != null) {
        data["page"] = this.page.page;
        data["totalCount"] = this.page.totalCount;
        data["rows"] = this.page.rows;
        this.searchDate = data;
      } else {
        data = this.page;
      }
      api
        .getActivitys(data)
        .then((result) => {
          //当页面只有一条数据且并不是第一页时，防止删除的时候页面无法获得数据
          if (result.rows.length == 0 && this.page.page > 1) {
            this.page.page = 1;
            this.handleSearch(this.searchDate);
          }
          this.loading = false; //关掉加载动画
          this.activityList = result.rows;
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
      this.openDeleteWarning(0, ids);
    },
    //点击删除后弹出提示框
    openDeleteWarning: function (index, id) {
      this.$confirm("此操作将永久删除该数据么, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //在列表中删除数据
          return api.deleted({ ids: id });
        })
        .then(() => {
          this.getActivitys();
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
    createOrEditBtn: function (id) {
      //判断是添加还是编辑
      let name = "addActivity";
      if (id) {
        name = "editActivity";
      }
      this.$router.push({
        name: name,
        params: { id: id },
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
      api
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
      this.handleSearch(this.searchDate);
    },
    // 防抖函数
    debounce(func, wait, immediate) {
      var timeout;
      return function () {
        var context = this,
          args = arguments;
        var later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },
  },
  created() {
    this.getActivitys();
  },
  mounted() {
    let that = this;
    // 添加resize的回调函数，但是只允许它每300毫秒执行一次
    window.addEventListener(
      "resize",
      this.debounce(function () {
        that.$store.state.tableHeight = window.innerHeight;
      }, 300)
    );
  },
  beforeDestroy() {
    // 在组件生命周期结束的时候销毁。
    let that = this;
    window.removeEventListener(
      "resize",
      this.debounce(function () {
        that.$store.state.tableHeight = window.innerHeight;
      }, 300)
    );
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