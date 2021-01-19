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
          @click="editLinkBtn(true)"
          >添加</el-button
        >
      </div>
    </div>
    <div class="data_list">
      <el-table
        :data="attractionsList"
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
          prop="name"
          label="名称"
          align="center"  
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="opening"
          label="开放时间"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="开放预定">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.isOpen == '1' ? 'success' : 'primary'"
              disable-transitions
              >{{ scope.row.isOpen == "1" ? "是" : "否" }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="是否上架">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.down == '0' ? 'success' : 'primary'"
              disable-transitions
              >{{ scope.row.down == "0" ? "是" : "否" }}</el-tag
            >
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
              @click="editLinkBtn(false, scope.row.id)"
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
              @click.native.prevent="openDeleteWarning(scope.$index, scope.row.id)"
            ></el-button>
          </div>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          show-overflow-tooltip
          sortable
        ></el-table-column>
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
    <Detailed :content="attractionsDetailed" ref="detailedMound"></Detailed>
  </div>
</template>
<script>
import attractionsApi from "@/api/reserveManager/attractions.js";
import { mapMutations } from "vuex";
import Screen from "@/components/screen/screen.vue";
//调用详细内容页面
import Detailed from "./component/detailed";

export default {
  name: "attractionsList",
  components: {
    Detailed,
    Screen,
  },
  data() {
    return {
      //是否显示加载动画效果
      loading: true,
      attractionsList: [],
      attractionsDetailed: "",
      //搜索栏数据
      screenCondition: {
        input: [
          {
            name: "name",
            title: "景点名称",
          },
        ],
        select: [
          {
            name: "isOpen",
            title: "开放预定",
            list: [
              {
                value: "0",
                label: "否",
              },
              {
                value: "1",
                label: "是",
              },
            ],
          },
        ],
        date: false,
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
    };
  },
  methods: {
    ...mapMutations({
      setTagsList: "SET_TAGSLIST",
      deleteInclude: "DELETE_INCLUDE",
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
      attractionsApi
        .getAttractions(data)
        .then((result) => {
          //当页面只有一条数据且并不是第一页时，防止删除的时候页面无法获得数据
          if (result.rows.length == 0 && this.page.page > 1) {
            this.page.page = 1;
            this.handleSearch(this.searchDate);
          }
          this.loading = false; //关掉加载动画
          this.attractionsList = result.rows;
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
          return attractionsApi.deleteAttractions({ ids: id });
        })
        .then(() => {
          this.getAttractions();
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
      let name = "addAttractions";
      if (id) {
        name = "editAttractions";
      }
      this.$router.push({
        name: name,
        params: { id: id },
      });
    },
    //跳转查看页面
    detailed: function (i) {
      this.$refs.detailedMound.updataComtent(this.attractionsList[i]);
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getAttractions: function () {
      this.loading = true;
      attractionsApi
        .getAttractions(this.page)
        .then((result) => {
          //当页面只有一条数据且并不是第一页时，防止删除的时候页面无法获得数据
          if (result.rows.length == 0 && this.page.page > 1) {
            this.page.page = this.page.page - 1;
            this.getAttractions();
          }
          this.loading = false; //关掉加载动画
          this.attractionsList = result.rows;
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
      this.handleSearch(this.searchDate);
    },
  },
  created() {
    this.getAttractions();
  },
  //keep-alive 生命周期，
  activated() {
    //flow：true,则刷新界面
    if (this.$route.params && this.$route.params.flow) {
      this.getAttractions();
    }
  },
};
</script>
