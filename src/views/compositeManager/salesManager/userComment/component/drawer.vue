<template>
  <div class="drawer">
    <el-drawer
      class
      :visible.sync="isOpen"
      :direction="direction"
      :before-close="beforeClose"
      size="50%"
    >
      <div class="confirmBtn">
        <el-button type="success" size="small" @click="confirmBtn">确定</el-button>
      </div>
      <el-table
        :data="userList"
        border
          ref="multipleTable"
        style="width: 100%"
        v-loading="loading"
        highlight-current-row
        @current-change="handleCurrentChange"
      >
        <el-table-column width="60" align="center">
          <template slot-scope="scope">
            <el-radio v-model="userItem.id" :label="scope.row.id">
              <span></span>
            </el-radio>
          </template>
        </el-table-column>
        
        <el-table-column type="index" width="50" align="center" label="序号" sortable></el-table-column>
        <el-table-column align="center" label="头像" width="70">
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.headImg"
              class="table-td-thumb cell_face"
              :src="scope.row.headImg"
              :preview-src-list="[scope.row.headImg]"
            ></el-image>
            <div v-else class="noAvatar">无</div>
          </template>
        </el-table-column>
        <el-table-column property="name" label="姓名"></el-table-column>
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
    </el-drawer>
  </div>
</template>

<script>
import userApi from "@/api/systemManager/user.js";
export default {
  data() {
    return {
      //是否显示加载动画效果
      loading: true, 
      isOpen: false, //是否打开
      direction: "rtl", //出现的位置
      userList: [], //用户数据
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
      userItem: "", //选中对象
    };
  },
  methods: {
    //打开抽屉
    openDrawer: function () {
      this.isOpen = !this.isOpen;
    },
    //获取评论的用户
    getUsers: function () {
      this.loading = true;
      userApi.getList(this.page).then((result) => {
        this.loading = false;
        this.userList = result.rows;
        this.page.totalCount = result.total;
      });
    },
    //全选操作
    handleCurrentChange: function (val) {
      this.userItem = val;
    },
    //关闭抽屉
    beforeClose: function (done) {
      done();
    },
    //点击分页按钮
    handlePageChange: function (index) {
      this.page.page = index;
      this.getUsers();
    },
    //确定按钮事件
    confirmBtn: function () {
      this.$parent.getDrawer(this.userItem);
     this.isOpen = !this.isOpen;
    },
  },
  created() {
    this.getUsers();
  },
};
</script>
<style scoped>
.drawer_btn {
  padding: 0 20px;
}
.confirmBtn {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>