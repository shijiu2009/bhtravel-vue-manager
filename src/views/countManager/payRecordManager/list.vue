<template>
  <div>
    <div>
      <div class="handle-box">
        <Screen :screenCondition="screenCondition"></Screen>
        <!-- 操作按钮 -->
        <div class="operation">
          <!-- 批量删除按钮 -->
          <el-button
            type="primary"
            class="handle-del mr10"
            size="mini"
            @click="delAllSelection"
            >批量提交</el-button
          >
        </div>
      </div>
      <div class="data_list">
        <el-table
          :data="themeList"
          border
          ref="multipleTable"
        :max-height="this.$tableHeight"
          style="width: 100%"
          v-loading="loading"
          :max-height="this.$tableHeight"
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
            prop="orderNo"
            label="订单号"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="orderName"
            label="订单名称"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="类型" width="60" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.type == 0" disable-transitions
                >酒店</el-tag
              >
              <el-tag v-if="scope.row.type == 1" disable-transitions
                >景点</el-tag
              >
              <el-tag v-if="scope.row.type == 2" disable-transitions
                >线路</el-tag
              >
              <el-tag v-if="scope.row.type == 3" disable-transitions
                >产品</el-tag
              >
              <el-tag v-if="scope.row.type == 4" disable-transitions
                >农家乐</el-tag
              >
              <el-tag v-if="scope.row.type == 5" disable-transitions
                >民宿</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="orderCreateTime"
            label="订单创建时间"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="createTime"
            label="订单完成时间"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="totalPrice"
            label="成交金额"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="receivable"
            label="商家应收"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-tag
                type="info"
                v-if="scope.row.status == 0"
                disable-transitions
                >未提交</el-tag
              >
              <el-tag
                type="success"
                v-if="scope.row.status == 1"
                disable-transitions
                >已结算</el-tag
              >
              <el-tag v-if="scope.row.status == 2" disable-transitions
                >未结算</el-tag
              >
              <el-tag
                type="warning"
                v-if="scope.row.status == 3"
                disable-transitions
                >有争议</el-tag
              >
              <el-tag
                type="danger"
                v-if="scope.row.status == 4"
                disable-transitions
                >废单</el-tag
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
                title="提交"
                @click="openDeleteWarning(scope.$index, scope.row.id)"
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
  </div>
</template>

<script>
import api from "@/api/bussManager/settlement.js";
import { mapMutations } from "vuex";
import Screen from "@/components/screen/screen.vue";
export default {
  name: "settlementRecordList",
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
            name: "orderNo",
            title: "订单号",
          },
        ],
        select: [
          {
            name: "type",
            title: "类别",
            list: [
              {
                value: "0",
                label: "酒店",
              },
              {
                value: "1",
                label: "景点",
              },
              {
                value: "2",
                label: "线路",
              },
              {
                value: "3",
                label: "旅游产品",
              },
              {
                value: "4",
                label: "农家乐",
              },
              {
                value: "5",
                label: "民宿",
              },
            ],
          },
          {
            name: "status",
            title: "状态",
            list: [
              {
                value: "0",
                label: "未提交",
              },
              {
                value: "1",
                label: "已结算",
              },
              {
                value: "2",
                label: "未结算",
              },
              {
                value: "3",
                label: "有争议",
              },
              {
                value: "4",
                label: "废单",
              },
            ],
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
      api
        .getList(data)
        .then((result) => {
          //当页面只有一条数据且并不是第一页时，防止删除的时候页面无法获得数据
          if (result.rows.length == 0 && this.page.page > 1) {
            this.page.page = 1;
            this.handleSearch(this.searchDate);
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
      this.$confirm("此操作将提交该结算, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //在列表中删除数据
          return api.updatestatus({ ids: id });
        })
        .then((result) => {
          if (result.success) {
            this.getList();
            this.$message({
              type: "success",
              message: "提交成功!",
            });
          } else {
            this.$message({
              type: "error",
              message: result.msg,
            });
          }
        });
      // .catch(() => {
      //   this.$message({
      //     type: "error",
      //     message: "提交失败",
      //   });
      // });
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
        .getList(this.page)
        .then((result) => {
          //当页面只有一条数据且并不是第一页时，防止删除的时候页面无法获得数据
          if (result.rows.length == 0 && this.page.page > 1) {
            this.page.page = this.page.page - 1;
            this.getList();
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
