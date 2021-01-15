<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="120px">
        <div class="form_item">
          <el-form-item label="角色名称" :required="true">
            <el-input
              v-model="info.rname"
              ref="el_input_title"
              maxlength="20"
              minlength="1"
            ></el-input>
          </el-form-item>

          <el-form-item label="所属组织" v-finger-tips="{ content: '节点的上级' }">
            <el-input
              type="readonly"
              v-model="byName"
              readonly
              ref="readonly"
              @focus="openDrawer"
            ></el-input>
          </el-form-item>

          <el-form-item label="角色类型">
            <el-radio-group v-model="info.flag">
              <el-radio :label="0">私有角色</el-radio>
              <el-radio :label="1">全局角色</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="角色说明">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="info.info"
            ></el-input>
          </el-form-item>
        </div>

        <div>
          <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
          <div class="custom-tree-container">
            <div class="block">
              <el-tree
                class="filter-tree"
                ref="purViewTree"
                :data="purViewTree"
                show-checkbox
                node-key="id"
                :default-expanded-keys="expandedKeys"
                :default-checked-keys="checkedKeys"
                :expand-on-click-node="false"
                :auto-expand-parent="false"
                @node-expand="nodeExpand"
                @node-collapse="nodeCollapse"
                :filter-node-method="filterNode"
              ></el-tree>
            </div>
          </div>
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
import api from "@/api/systemManager/role.js";
import orgApi from "@/api/systemManager/org.js";
import purViewApi from "@/api/systemManager/purview.js";
import { mapMutations } from "vuex";
export default {
  components: {
    byBrawer,
  },
  data() {
    return {
      info: {
        rid: "",
        rname: "",
        info: "",
        flag: 0,
        orgId: "",
        pids: [],
        purviews: [],
        users: [],
      },
      purViewTree: [], //数据
      expandedKeys: [], //默认展开的节点
      checkedKeys: [], //默认选中的节点
      filterText: "", //过滤条件
      orgs: [
        {
          value: 0,
          label: "测试1",
        },
        {
          value: 1,
          label: "测试2",
        },
        {
          value: 2,
          label: "测试3",
        },
      ],
      byName: "",
    };
  },
  watch: {
    filterText(val) {
      this.$refs.purViewTree.filter(val);
    },
  },
  methods: {
    ...mapMutations({
      deleteTags: "DELETE_TAGSLIST",
    }),
    openDrawer() {
      this.$refs.byBrawer.openDrawer(); //打开抽屉
      this.$refs.readonly.blur(); //失去焦点
    },
    //抽屉提交过来的事件
    getByDrawer(data) {
      this.info.orgId = data.orgId;
      this.byName = data.pname + "----" + data.orgId;
    },
    //递归整理参数
    adjustPurView: function (data) {
      let itemArr = [];
      for (let i = 0; i < data.length; i++) {
        let node = data[i];
        node.label = node.text;
        if (node.nodes && node.nodes.length > 0) {
          node.add = true;
          node.children = this.adjustPurView(node.nodes);
        }
        itemArr.push(node);
      }
      return itemArr;
    },
    //提交表单
    onSubmit: function () {
      let purviews = this.$refs.purViewTree.getCheckedNodes(false, true);
      this.info.pids = [];
      for (let i = 0; i < purviews.length; i++) {
        this.info.pids.push(purviews[i].id);
      }
      this.info.purviews = [];
      this.info.users = [];
      let path = "/api/manager/role/add";
      if (this.info.rid != "" && this.info.rid != null) {
        path = "/api/manager/role/edit";
      }
      this.$global
        .addOrEdit({
          path: path,
          data: this.info,
        })
        .then(() => {
          this.deleteTags(this.$route.fullPath); //删除当前的tags
          // //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
          this.$router.push({
            name: "role_list",
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
    getByOrg(byid) {
      if (byid) {
        orgApi
          .getDetail({ orgId: byid })
          .then((result) => {
            if (result.status && result.data) {
              this.info.byOrg = result.data.orgId;
              this.byName = result.data.orgName + "----" + result.data.orgId;
            }
          })
          .catch(() => {
            this.$message.error("父级权限查询失败");
          });
      }
    },
    //获取信息
    getDetail() {
      if (this.$route.params && this.$route.params.id) {
        api
          .getDetail({ rid: this.$route.params.id })
          .then((result) => {
            if (result.status && result.data) {
              this.info = result.data;
              this.checkedKeys = [];
              for (let i = 0; i < this.info.purviews.length; i++) {
                this.checkedKeys.push(this.info.purviews[i].pid);
              }
            } else {
              this.$message.error("角色数据查询失败");
            }
            if (this.info.orgId) {
              this.getByOrg(this.info.orgId);
            }
          })
          .catch(() => {
            this.$message.error("角色数据查询失败");
          });
        console.log(this.info.orgId);
      }
      purViewApi
        .getPurViewTree({ showicon: true, showcheckbox: true, rid: -1, qs: 0 })
        .then((result) => {
          if (result.status) {
            this.purViewTree = this.adjustPurView(result.data);
          } else {
            this.$message({
              type: "error",
              message: result.msg,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //节点被展开事件
    nodeExpand(data) {
      if (this.expandedKeys.indexOf(data.id) < 0) {
        this.expandedKeys.push(data.id);
      }
    },
    //节点被关闭时事件
    nodeCollapse: function (data) {
      var index = this.expandedKeys.indexOf(data.id);
      if (index >= 0) {
        this.expandedKeys.splice(index, 1);
      }
    },
    //过滤树节点
    filterNode: function (value, data) {
      if (!value) return true;
      else if (data.label.indexOf(value) !== -1) {
        this.nodeExpand(data);
        return true;
      }
      return false;
    },
  },
  created() {
     //重新获取页面数据，
    this.getDetail();
  },
  activated() {
    //重新获取页面数据，
    this.getDetail();
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
