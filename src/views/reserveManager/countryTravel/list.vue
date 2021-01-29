<template>
  <div>
    <div class="handle-box">
      <div>
        <!-- 输入搜索条件input框 -->
        <div class="searChfactor input-box">
          <el-input
            v-model="queryInfo.name"
            placeholder="名称"
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
        >搜索</el-button>
      </div>
      <!-- 操作按钮 -->
      <div class="operation">
        <!-- 批量删除按钮 -->
        <el-button
          type="primary"
          icon="el-icon-delete"
          class="handle-del mr10"
          size="mini"
          @click="delAllSelection"
        >批量删除</el-button>
        <!-- 添加按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="handle-del mr10"
          size="mini"
          @click="editLinkBtn(true)"
        >添加</el-button>
      </div>
    </div>
    <div class="data_list">
      <el-table
        :data="countryTravelList"
        border
        ref="multipleTable"
        :max-height="this.getHeight"
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="52" align="center"></el-table-column>
        <el-table-column type="index" width="50" align="center" label="序号" sortable></el-table-column>
        <el-table-column prop="name" label="名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="indexTip" label="首页提示语" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="address" label="地址" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="opening" label="开放时间" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="是否审核">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.isCheck=='1' ? 'success' : 'primary'"
              disable-transitions
            >{{scope.row.isCheck=="1"?"是":"否"}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否下架">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.down=='1' ? 'success' : 'primary'"
              disable-transitions
            >{{scope.row.down=="1"?"是":"否"}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <div slot-scope="scope">
            <el-button
              type="primary"
              round
              icon="el-icon-edit"
              circle
              size="small"
              title="编辑"
              @click="editLinkBtn(false,scope.row.id)"
            ></el-button>
            <!-- <el-button
              type="success"
              round
              icon="el-icon-eleme"
              circle
              size="small"
              title="查看"
              @click="detailed(scope.$index)"
            ></el-button> -->
            <el-button
              type="danger"
              round
              icon="el-icon-delete"
              circle
              size="small"
              title="删除"
              @click.native.prevent="openDeleteWarning(scope.$index,scope.row.id)"
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
    <Detailed :content="countryTravelDetailed" ref="detailedMound"></Detailed>
  </div>
</template>
<script>
import api from "@/api/reserveManager/countryTravel.js";
import { mapMutations,mapGetters } from "vuex";
//调用详细内容页面
import Detailed from "./component/detailed";

export default {
  name: "countryTravelList",
  components: {
    Detailed,
  },
  data() {
    return {
      //是否显示加载动画效果
      loading: true,
      countryTravelList: [],
      countryTravelDetailed: "",
      //搜索信息
      queryInfo: {
        name: "",
        date: "",
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
    };
  },
  methods: {
    ...mapMutations({
      setTagsList: "SET_TAGSLIST",
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
    //编辑数据
    editLinkBtn: function (flow, id) {
       //判断是添加还是编辑
      let name = "addCountryTravel";
      if (id) {
        name = "editCountryTravel";
      }
      this.$router.push({
        name: name,
        params: { id: id },
      });
    },
    //跳转查看页面
    detailed: function (i) {
      this.$refs.detailedMound.updataComtent(this.countryTravelList[i]);
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
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
          this.countryTravelList = result.rows;
          this.page.totalCount = result.total;
        })
        .catch(() => {
          this.loading = false; //关掉加载动画
          this.$message.error("广告位置列表获取失败");
        });
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
    //flow：true,则刷新界面
    if (this.$route.params && this.$route.params.flow) {
      this.getList();
    }
  },
};
</script>