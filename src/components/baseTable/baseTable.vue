<template>
  <div>
    <div class="handle-box">
      <Screen :screenCondition="screenCondition"></Screen>
      <div>
        <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" size="mini" @click="delAllSelection">
          批量删除</el-button>
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" size="mini" @click="delAllSelection">添加
        </el-button>
      </div>
    </div>
    <div class="data_list">
      <el-table :data="tableData.slice((page.pageIndex-1)*page.PageSize,page.pageIndex*page.PageSize)" border
        ref="multipleTable"
        :max-height="this.$tableHeight" style="width: 100%" @selection-change="handleSelectionChange" 
        class="adjustTable">
        <!-- table标题-->
        <el-table-column type="selection" width="52" align="center"></el-table-column>
        <el-table-column type="index" width="50" align="center" label="序号" sortable></el-table-column>
        <el-table-column :prop="item.prop" :label="item.label" v-for="(item,index) in tableTitle" :key="index" sortable
          show-overflow-tooltip resizable scope.row></el-table-column>
        <!-- 列表操作 -->
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" round icon="el-icon-edit" circle size="small" title="编辑"></el-button>
            <el-button type="success" round icon="el-icon-eleme" circle size="small" title="查看"></el-button>
            <el-button type="danger" round icon="el-icon-delete" circle size="small" title="删除"
              @click.native.prevent="openDeleteWarning(scope.$index, tableData)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页操作 -->
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next,jumper" :page-size="page.pageSize"
          :total="page.totalCount" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import Screen from "@/components/screen/screen.vue";
export default {
  components: {
    Screen,
  },
  props: {
    //表单标题
    tableTitle: {
      default: {
        return: [],
      },
    },
    //表单数据
    tableData: {
      default: {
        return: [],
      },
    },
  },
  data() {
    return {
      screenCondition: {
        input: ["name"],
        select: {
          options: {
            name: "screenClass",
            title: "类别",
            list: [
              {
                value: "选项1",
                label: "黄金糕",
              },
              {
                value: "选项2",
                label: "双皮奶",
              },
              {
                value: "选项3",
                label: "蚵仔煎",
              },
              {
                value: "选项4",
                label: "龙须面",
              },
              {
                value: "选项5",
                label: "北京烤鸭",
              },
            ],
          },
          options2: {
            name: "screenClass2",
            title: "类别2",
            list: [
              {
                value: "选项1",
                label: "黄金糕",
              },
              {
                value: "选项2",
                label: "双皮奶",
              },
              {
                value: "选项3",
                label: "蚵仔煎",
              },
            ],
          },
        },
        date: true,
      },
      //分页数据
      page: {
        // 总数据
        tableData: [],
        // 默认显示第几页
        pageIndex: 1,
        // 总条数，根据接口获取数据长度(注意：这里不能为空)
        totalCount: 300,
        // 个数选择器（可修改）
        // 默认每页显示的条数（可修改）
        PageSize: 10,
      },
      //可选择下拉搜索框信息
      selectInfo: {
        options: [
          {
            value: "选项1",
            label: "黄金糕",
          },
          {
            value: "选项2",
            label: "双皮奶",
          },
          {
            value: "选项3",
            label: "蚵仔煎",
          },
          {
            value: "选项4",
            label: "龙须面",
          },
          {
            value: "选项5",
            label: "北京烤鸭",
          },
        ],
        //选择的值
        value: "",
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
        // 时间选择器的值,
        value: "",
      },
    };
  },
  methods: {
    //点击删除后弹出提示框
    openDeleteWarning: function (index, rows) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //在列表中删除数据
          rows.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //改变页面后
    handlePageChange: function (index) {
      this.page.pageIndex = index;
      console.log(this.page.pageIndex);
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //删除所有选中项
    delAllSelection: function (val) {
      console.log(val);
    },
    //触发搜索按钮
    handleSearch: function (screenInfo) {
      console.log(screenInfo);
    },
    //下拉框值改变后触发事件
    changeSelect: function (val) {
      console.log("下拉框值改变后触发事件--", val);
    },
    //搜索条件输入框失去焦点或用户按下回车时触发
    changeSearchInput: function (value) {
      console.log("仅在输入框失去焦点或用户按下回车时触发---", value);
    },
    //时间选择器，用户确认选定的值时触发该事件
    defineTimePicker: function () {
      console.log(
        "时间选择器，用户确认选定的值时触发该事件---",
        this.timePicker.value
      );
    },
  },
};
</script>