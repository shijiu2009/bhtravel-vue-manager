<template>
  <div>
    <div class="data_list">
      <el-table
        :data="ticketList"
        border
        ref="multipleTable"
        :max-height="this.getHeight"
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="52" align="center"></el-table-column>
        <el-table-column type="index" width="50" align="center" label="序号" sortable></el-table-column>
        <el-table-column prop="attrName" label="景点名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orderNo" label="订单号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="姓名" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="schedule" label="预定日期" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="totalQuantity" label="数量" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="totalPrice" label="总价" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" width="80" align="center">
          <template slot-scope="scope" >
            <el-tag
              type="warning"
              v-if="scope.row.status==1"
              disable-transitions
            >未付款</el-tag>
            <el-tag
              type="info"
              v-if="scope.row.status==2"
              disable-transitions
            >已付款</el-tag>
            <el-tag
              v-if="scope.row.status==3"
              disable-transitions
            >已确认</el-tag>
            <el-tag
              type="success"
              v-if="scope.row.status==4"
              disable-transitions
            >已完成</el-tag>
            <el-tag
              type="danger"
              v-if="scope.row.status==-1"
              disable-transitions
            >已取消</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="退款状态" width="80" align="center">
          <template slot-scope="scope" >
            <el-tag
              v-if="scope.row.refund==0"
              disable-transitions
            >正常</el-tag>
            <el-tag
              type="success"
              v-if="scope.row.refund==1"
              disable-transitions
            >申请中</el-tag>
            <el-tag
              type="info"
              v-if="scope.row.refund==2"
              disable-transitions
            >退款中</el-tag>
            <el-tag
              type="warning"
              v-if="scope.row.refund==3"
              disable-transitions
            >已退款</el-tag>
            <el-tag
              type="danger"
              v-if="scope.row.refund==-1"
              disable-transitions
            >已取消</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="添加时间" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
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
  </div>
</template>

<script>
import api from "@/api/reserveManager/order.js";
import { mapMutations,mapGetters } from "vuex";

export default {
  name: "ticketList",
  data() {
    return {
      //加载
      loading: true,
      ticketList: [],

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
        rows: 10,
      },
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
          this.getList();
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
    //获取线路列表
    getList: function () {
      this.loading = true;
      api
        .getTicketList(this.page)
        .then((result) => {
          //当页面只有一条数据且并不是第一页时，防止删除的时候页面无法获得数据
          if (result.rows.length == 0 && this.page.page > 1) {
            this.page.page = this.page.page - 1;
            this.getList();
          }
          this.loading = false; //关掉加载动画
          this.ticketList = result.rows;
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
      this.getList();
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