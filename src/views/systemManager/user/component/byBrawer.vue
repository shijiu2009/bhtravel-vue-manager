<template>
  <div>
    <el-drawer class :visible.sync="isOpen" :direction="direction" :before-close="beforeClose" size="50%">
      <div>
        <el-button type="success" size="small" class="confirmBtn" @click="confirmBtn">确定</el-button>
        <el-table :data="orgList.slice((page.page-1)*page.rows,page.page*page.rows)" border ref="multipleTable"

          v-loading="loading" highlight-current-row @row-click="rowClick">
          <el-table-column width="60" align="center">
            <template slot-scope="scope">
              <el-radio v-model="info.orgId" :label="scope.row.orgId">
                <span></span>
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column type="index" width="50" align="center" label="序号" sortable></el-table-column>
          <el-table-column property="orgName" label="标题"></el-table-column>
          <el-table-column property="byOrg" label="父级id"></el-table-column>
          <el-table-column property="orgId" label="orgId"></el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next,jumper" :page-size="page.rows"
          :total="page.totalCount" @current-change="handlePageChange"></el-pagination>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import api from "@/api/systemManager/org.js";
export default {
  data() {
    return {
      //是否显示加载动画效果
      loading: true,
      isOpen: false, //是否打开
      direction: "rtl", //出现的位置
      orgList: [],
      //分页数据
      page: {
        // 默认显示第几页
        page: 1,
        // 总条数，根据接口获取数据长度
        totalCount: 0,
        // 默认每页显示的条数（可修改）
        rows: 15,
      },
      info: {
        orgId: "",
        orgName: "",
      },
    };
  },
  methods: {
    getByOrgs: function () {
      this.loading = true;
      //添加参数
      this.page.orgId = "";
      api
        .getByOrgs(this.page)
        .then((result) => {
          this.loading = false;
          if (result.status) {
            this.orgList = result.data;
            this.page.totalCount = result.data.length;
          }
        })
        .catch(() => {
          this.$message.error("抽屉数据添加失败");
        });
    },
    //关闭抽屉
    beforeClose: function (done) {
      done();
    },
    //打开抽屉
    openDrawer: function () {
      this.isOpen = !this.isOpen;
    },
    //确定按钮事件
    confirmBtn: function () {
      this.$parent.getByDrawer(this.info);
      this.isOpen = !this.isOpen;
    },
    //点击分页按钮
    handlePageChange: function (index) {
      this.page.page = index;
    },
    // 点击单元格事件
    rowClick: function (row) {
      this.info.orgId = row.orgId;
      this.info.pname = row.orgName;
    },
  },
  created() {
    this.getByOrgs();
  },
};
</script>