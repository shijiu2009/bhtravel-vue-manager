<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="purviewInfo" label-width="120px">
        <div class="form_item">
          <el-form-item
            label="名称"
            :required="true"
            v-finger-tips="{ content: '权限名称，与页面的name一致' }"
          >
            <el-input v-model="purviewInfo.aliasname" >
            </el-input>
          </el-form-item>

          <el-form-item
            label="标题"
            :required="true"
            v-finger-tips="{ content: '显示的名称' }"
          >
            <el-input
              v-model="purviewInfo.pname"
              ref="el_input_title"
              maxlength="20"
              minlength="1"
            >
            </el-input>
          </el-form-item>

          <el-form-item
            label="路径"
            :required="true"
            v-finger-tips="{ content: '路由路径' }"
          >
            <el-input
              v-model="purviewInfo.link"
              ref="el_input_title"
              maxlength="100"
              minlength="1"
            >
            </el-input>
          </el-form-item>

          <el-form-item
            label="图标"
            v-finger-tips="{ content: '路由图标,用于菜单显示' }"
          >
            <el-input
              v-model="purviewInfo.icon"
              ref="el_input_title"
              maxlength="100"
              minlength="1"
            >
            </el-input>
          </el-form-item>

          <el-form-item
            label="权限编码"
            :required="true"
            v-finger-tips="{ content: '权限编码' }"
          >
            <el-input
              v-model="purviewInfo.pid"
              ref="el_input_title"
              maxlength="30"
              minlength="1"
            >
            </el-input>
          </el-form-item>

          <el-form-item
            label="排序"
            :required="true"
            v-finger-tips="{ content: '排序,数字越大越靠前,且只能输入数字' }"
          >
            <el-input
              type="text"
              v-model.number="purviewInfo.sort"
              ref="el_input_title"
              maxlength="30"
              minlength="1"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="上级" v-finger-tips="{ content: '节点的上级' }">
            <el-input
              type="readonly"
              v-model="byName"
              readonly
              ref="readonly"
              @focus="openDrawer"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="vue文件路径"
            :required="true"
            v-finger-tips="{ content: '.vue文件路径' }"
          >
            <el-input
              v-model="purviewInfo.component"
              ref="el_input_title"
              maxlength="300"
              minlength="1"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="权限类型" :required="true">
            <el-radio v-model="purviewInfo.ptype" :label="0">菜单显示</el-radio>
            <el-radio v-model="purviewInfo.ptype" :label="1">执行类型</el-radio>
          </el-form-item>

          <!-- <el-form-item label="是否显示在菜单" :required="true">
            <el-radio v-model="purviewInfo.hidden" :label="1">显示</el-radio>
            <el-radio v-model="purviewInfo.hidden" :label="0">隐藏</el-radio>
          </el-form-item>

          <el-form-item label="页面是否缓存" :required="true">
            <el-radio v-model="purviewInfo.noCache" :label="1">是</el-radio>
            <el-radio v-model="purviewInfo.noCache" :label="0">否</el-radio>
          </el-form-item>

          <el-form-item label="是否显示在标签" :required="true">
            <el-radio v-model="purviewInfo.noBreadcrumb" :label="1"
              >是</el-radio
            >
            <el-radio v-model="purviewInfo.noBreadcrumb" :label="0"
              >否</el-radio
            >
          </el-form-item> -->
        </div>
        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">表单提交</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <byBrawer ref="byBrawer"></byBrawer>
  </div>
</template>
<script>
import byBrawer from "./byBrawer";
import purViewApi from "@/api/systemManager/purview.js";
import { mapMutations } from "vuex";
export default {
  components: {
    byBrawer,
  },
  data() {
    return {
      purviewInfo: {
        aliasname: "",
        pname: "",
        link: "",
        icon: "",
        pid: "",
        sort: 0,
        byid: "",
        component: "",
        ptype: 0,
        hidden: 1,
        noCache: 1,
        noBreadcrumb: 1,
      },
      byName: "",
    };
  },
  methods: {
    ...mapMutations({
      deleteTags: "DELETE_TAGSLIST",
    }),
    //打开抽屉
    openDrawer() {
      this.$refs.byBrawer.openDrawer(); //打开抽屉
      this.$refs.readonly.blur(); //失去焦点
    },
    //提交表单
    onSubmit: function () {
      this.$global
        .addOrEdit({
          path: "/api/manager/purview/add",
          data: this.purviewInfo,
        })
        .then(() => {
          this.deleteTags(this.$route.fullPath); //删除当前的tags
          // //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
          this.$router.push({
            name: "purview_treeList",
            params: {
              flow: true,
            },
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    //返回
    close: function () {
      this.$router.go(-1);
    },
    // 获取父级
    getByPurView(byid) {
      if (byid) {
        purViewApi
          .getPurView({ spid: byid })
          .then((result) => {
            if (result.status && result.data) {
              this.purviewInfo.byid = result.data.pid;
              this.byName = result.data.pname + "----" + result.data.pid;
            }
          })
          .catch(() => {
            this.$message.error("父级权限查询失败");
          });
      } else {
        this.byName = "--根权限--";
      }
    },
    //获取信息
    getPurView() {
      if (this.$route.params && this.$route.params.id) {
        purViewApi
          .getPurView({ spid: this.$route.params.id })
          .then((result) => {
            if (result.status && result.data) {
              this.purviewInfo = result.data;
            } else {
              this.$message.error("权限数据查询失败");
            }
            this.getByPurView(result.data.byid);
          })
          .catch(() => {
            this.$message.error("权限数据查询失败");
          });
      }
      if (this.$route.params && this.$route.params.byid) {
        this.getByPurView(this.$route.params.byid);
      }
    },
    //抽屉提交过来的事件
    getByDrawer(data) {
      this.purviewInfo.byid = data.pid;
      this.byName = data.pname;
    },
  },
  created() {
    //重新获取页面数据，
    this.getPurView();
  },
  activated() {
    //重新获取页面数据，
    this.getPurView();
  },
};
</script>
<style scoped>
.form-box >>> .el-form-item{
  max-width: 600px;
}
.drawer_btn {
  padding: 0 20px;
}
.confirmBtn {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
