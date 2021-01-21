<template>
  <div>
    <div class="handle-box">
      <Screen :screenCondition="screenCondition"></Screen>
    </div>
    <div class="data_list">
      <el-table
        :data="ticketList"
        border
        ref="multipleTable"
        style="width: 100%"
        v-loading="loading"
        :max-height="this.$tableHeight"
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
          prop="ctName"
          label="农家乐名称"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="orderNo"
          label="订单号"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="schedule"
          label="预定日期"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="totalQuantity"
          label="数量"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="totalPrice"
          label="总价"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="状态" width="80" align="center">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.status == 1" disable-transitions
              >未付款</el-tag
            >
            <el-tag type="info" v-if="scope.row.status == 2" disable-transitions
              >已付款</el-tag
            >
            <el-tag v-if="scope.row.status == 3" disable-transitions>已确认</el-tag>
            <el-tag type="success" v-if="scope.row.status == 4" disable-transitions
              >已完成</el-tag
            >
            <el-tag type="danger" v-if="scope.row.status == -1" disable-transitions
              >已取消</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="退款状态" width="80" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.refund == 0" disable-transitions>正常</el-tag>
            <el-tag type="success" v-if="scope.row.refund == 1" disable-transitions
              >申请中</el-tag
            >
            <el-tag type="info" v-if="scope.row.refund == 2" disable-transitions
              >退款中</el-tag
            >
            <el-tag type="warning" v-if="scope.row.refund == 3" disable-transitions
              >已退款</el-tag
            >
            <el-tag type="danger" v-if="scope.row.refund == -1" disable-transitions
              >已取消</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="添加时间"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
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
              title="详情"
              @click="showBtn(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
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
import api from "@/api/reserveManager/countryTravelOrder.js";
import { mapMutations } from "vuex";
import Screen from "@/components/screen/screen.vue";
export default {
  name: "countryTravelOrderList",
  components: {
    Screen,
  },
  data() {
    return {
      //加载
      loading: true,
      ticketList: [],

      //搜索栏数据
      screenCondition: {
        input: [
          {
            name: "attrName",
            title: "景点名称",
          },
          {
            name: "orderNo",
            title: "订单号",
          },
        ],
        select: [
          {
            name: "status",
            title: "状态",
            list: [
              {
                value: "1",
                label: "未付款",
              },
              {
                value: "3",
                label: "已确认",
              },
              {
                value: "4",
                label: "已完成",
              },
              {
                value: "-1",
                label: "已取消",
              },
            ],
          },
          {
            name: "refund",
            title: "退款状态",
            list: [
              {
                value: "0",
                label: "正常",
              },
              {
                value: "2",
                label: "已确认",
              },
              {
                value: "3",
                label: "已退款",
              },
              {
                value: "-1",
                label: "已取消",
              },
            ],
          },
        ],
        date: false,
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
    showBtn: function (id) {
      let name = "showCountryTravelOrder";
      this.$router.push({
        name: name,
        params: { id: id },
      });
    },
    createOrEditBtn: function (id) {
      this.loading = true;
      this.$confirm("此操作将退款该订单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //在列表中删除数据
          return api.refund({ oid: id });
        })
        .then((result) => {
          if (result.success) {
            this.$message({
              type: "success",
              message: "退款成功!",
            });
            this.getList();
          } else {
            this.$message({
              type: "error",
              message: result.errmsg,
            });
          }
          this.loading = false;
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "修改失败",
          });
          this.loading = false;
        });
      //判断是添加还是编辑
      // let name = "editCountryTravelOrder";
      // this.$router.push({
      //   name: name,
      //   params: { id: id },
      // });
    },
    //触发搜索按钮
    handleSearch: function (data) {
      data["page"] = this.page.page;
      data["totalCount"] = this.page.totalCount;
      data["rows"] = this.page.rows;
      this.searchDate = data;
      api
        .getList(data)
        .then((result) => {
          //当页面只有一条数据且并不是第一页时，防止删除的时候页面无法获得数据
          if (result.rows.length == 0 && this.page.page > 1) {
            this.page.page = 1;
            this.handleSearch(this.searchDate);
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
        .getList(this.page)
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
      this.handleSearch(this.searchDate);
    },
  },
  created() {
    this.getList();
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
