<template>
  <div class="content">
    <div class="detailed info_box">
      <div>
        <el-button type="primary" @click="updateUser" size="mini">修改</el-button>
        <el-button size="mini"><router-link to="/userList">返回列表</router-link></el-button>
      </div>
      <div class="user_face">
        <el-avatar shape="square" :size="100" fit="fill" :src="userInfo.face"></el-avatar>
      </div>
      <el-row type="flex" class="row-bg row_box" :gutter="20">
        <el-col :span="3">
          <div class="grid-content bg-purple title_box">
            <span>姓名:</span>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="grid-content bg-purple-light">
            <span>{{userInfo.name}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg row_box" :gutter="20">
        <el-col :span="3">
          <div class="grid-content bg-purple title_box">
            <span>年龄:</span>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="grid-content bg-purple-light">
            <span>{{userInfo.age}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg row_box" :gutter="20">
        <el-col :span="3">
          <div class="grid-content bg-purple title_box">
            <span>邮箱:</span>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="grid-content bg-purple-light">
            <span>{{userInfo.email}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg row_box" :gutter="20">
        <el-col :span="3">
          <div class="grid-content bg-purple title_box">
            <span>电话:</span>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="grid-content bg-purple-light">
            <span>{{userInfo.phone}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg row_box" :gutter="20">
        <el-col :span="3">
          <div class="grid-content bg-purple title_box">
            <span>生日:</span>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="grid-content bg-purple-light">
            <span>{{userInfo.birthday}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg row_box" :gutter="20">
        <el-col :span="3">
          <div class="grid-content bg-purple title_box">
            <span>创建时间:</span>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="grid-content bg-purple-light">
            <span>{{userInfo.createDate}}</span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import userApi from "@/api/user.js";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      userInfo: {},
    };
  },
  methods: {
    ...mapMutations({
      setTagsList: "SET_TAGSLIST",
    }),
    updateUser: function () {
      this.$router.push({
        name: "addOrEditUser",
        params: { Id: this.userInfo.id },
      });
      this.setTagsList("/addOrEditUser");
    },
  },
  created() {
    //判断是否传过来ID，
    if (this.$route.params && this.$route.params.Id) {
      //根据ID获取用户数据
      userApi.getUserId({ id: this.$route.params.Id }).then((result) => {
        this.userInfo = result[0];
      });
    }
  },
};
</script>
<style scoped>
.user_face {
  margin-top: 20px;
}
.detailed .el-row,
.grid-content {
  background: #ffffff;
  line-height: 36px;
}
.title_box {
  text-align: right;
  background: #ffffff;
}
.info_box .row-bg.row_box {
  margin-bottom: 0;
}
</style>