<template>
  <div>
    <div>
      <div class="handle-box">
        <Screen :screenCondition="screenCondition"></Screen>
      </div>
      <div class="data_list">
        <el-table
          :data="themeList"
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
            prop="apiCode"
            label="公众号apiCode"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="orderNo"
            label="商户订单号"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="fromUser"
            label="支付账号"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="toUser"
            label="接收账号"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="trade_no"
            label="支付网关的订单号"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="totalPrice"
            label="支付金额"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="createTime"
            label="记录生成时间"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">
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
import api from "@/api/countManager/payRecord.js";
import { mapMutations,mapGetters } from "vuex";
import Screen from "@/components/screen/screen.vue";
export default {
  name: "payRecordList",
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
    showBtn: function (id) {
      let name = "showPayRecord";
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
    //触发搜索按钮
    handleSearch: function (data) {
      this.loading = true;
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
    // this.getList();
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
    // if (this.$route.params && this.$route.params.flow) {
    this.getList();
    // }
  },
};
</script>
