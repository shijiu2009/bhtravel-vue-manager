<template>
  <div>
    <div class="handle-box">
      <Screen :screenCondition="screenCondition"></Screen>
      <!-- 操作按钮 -->
    </div>
    <div class="data_list">
      <el-table
        :data="themeList"
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
          prop="ctName"
          label="乡村旅游名称"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="ticketSum"
          label="数量"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="users"
          label="用户数"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="titcketCount"
          label="购买门票数量"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="status_2"
          label="付款订单数"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <!-- <el-table-column
          prop="status_1"
          label="未付款订单数"
          align="center"
          show-overflow-tooltip
        ></el-table-column> -->
        <el-table-column
          prop="status_-1"
          label="取消订单数"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="priceSum"
          label="价格总和"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
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
import api from "@/api/reserveManager/countryTravelOrder.js";
import { mapMutations,mapGetters } from "vuex";
import Screen from "@/components/screen/screen.vue";
export default {
  name: "countryProjectOrderCountList",
  components: {
    Screen,
  },
  data() {
    return {
      //加载
      loading: true,
      themeList: [],
      //搜索栏数据
      screenCondition: {
        input: [
          {
            name: "ctName",
            title: "乡村旅游名称",
          },
        ],
        date: true,
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
      searchDate: [],
      multipleSelection: [],
      url: this.$baseUrl.releaseUrl,
      imgList: [],
    };
  },
  methods: {
    ...mapMutations({
      setTagsList: "SET_TAGSLIST",
    }),
    //触发搜索按钮
    handleSearch: function (data) {
      if (data != null) {
        if (data.date != null && data.date.length > 0) {
          data["startTime"] = data.date[0];
          data["endTime"] = data.date[1];
        } else {
          data["startTime"] = null;
          data["endTime"] = null;
        }
        data["page"] = this.page.page;
        data["totalCount"] = this.page.totalCount;
        data["rows"] = this.page.rows;
        data["classId"] = this.page.classId;
        this.searchDate = data;
      } else {
        data = this.page;
      }
      api
        .statistics(data)
        .then((result) => {
          //当页面只有一条数据且并不是第一页时，防止删除的时候页面无法获得数据
          if (result.rows.length == 0 && this.page.page > 1) {
            this.page.page = this.page.page - 1;
            this.statistics();
          }
          this.loading = false; //关掉加载动画
          this.themeList = result.rows;
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
          message: "请选择提交项",
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
      this.$confirm("此操作将提交该订单么, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //在列表中删除数据
          return api.updatestatus2({ ids: id });
        })
        .then(() => {
          this.getList();
          this.$message({
            type: "success",
            message: "修改成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "修改失败",
          });
        });
    },
    createOrEditBtn: function (id) {
      //判断是添加还是编辑
      let name = "addTheme";
      if (id) {
        name = "editTheme";
      }
      this.$router.push({
        name: name,
        params: { id: id },
      });
    },
    //获取线路列表
    getList: function () {
      this.loading = true;
      api
        .statistics(this.page)
        .then((result) => {
          //当页面只有一条数据且并不是第一页时，防止删除的时候页面无法获得数据
          if (result.rows.length == 0 && this.page.page > 1) {
            this.page.page = this.page.page - 1;
            this.statistics();
          }
          this.loading = false; //关掉加载动画
          this.themeList = result.rows;
          this.page.totalCount = result.total;
        })
        .catch(() => {
          this.loading = false; //关掉加载动画
          this.$message.error("查询出错");
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
    this.getList();
  },
  computed: {
    ...mapGetters([
      "getHeight",
      // ...
    ]),
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
    //flow=true,则刷新界面
    if (this.$route.params && this.$route.params.flow) {
      this.getList();
    }
  },
};
</script>
