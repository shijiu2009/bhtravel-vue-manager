<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="120px">
        <div class="form_item">
          <el-form-item label="组织名称" :required="true">
            <el-input
              v-model="info.orgName"
              ref="el_input_title"
              maxlength="20"
              minlength="1"
            ></el-input>
          </el-form-item>

          <el-form-item label="组织Id" :required="true">
            <el-input
              v-model="info.orgId"
              ref="el_input_title"
              maxlength="20"
              minlength="1"
            ></el-input>
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

          <el-form-item label="组织类型" style="width: 50%">
            <el-select v-model="info.orgType" placeholder="请选择">
              <el-option
                v-for="item in orgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
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
import api from "@/api/systemManager/org.js";
import { mapMutations } from "vuex";
export default {
  components: {
    byBrawer,
  },
  data() {
    return {
      info: {
        orgId: "",
        orgName: "",
        byOrg: "",
        orgType: "",
      },
      purViewTree: [], //数据
      expandedKeys: [], //默认展开的节点
      checkedKeys: [], //默认选中的节点
      filterText: "", //过滤条件
      orgs: [
        {
          value: 1,
          label: "测试2",
        },

        {
          value: 0,
          label: "测试1",
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
      let path = "/api/manager/org/add";
      // if (this.info.orgId != "" && this.info.orgId != null) {
      //   path = "/api/manager/org/edit";
      // }
      this.$global
        .addOrEdit({
          path: path,
          data: this.info,
        })
        .then(() => {
          this.deleteTags(this.$route.fullPath); //删除当前的tags
          // //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
          this.$router.push({
            name: "org_treeList",
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
        api
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
      console.log(this.$route.params.id);
      if (this.$route.params && this.$route.params.id) {
        api
          .getDetail({ orgId: this.$route.params.id })
          .then((result) => {
            if (result.status && result.data) {
              this.info = result.data;
              this.getByOrg(result.data.byOrg);
            } else {
              this.$message.error("角色数据查询失败");
            }
          })
          .catch(() => {
            this.$message.error("角色数据查询失败");
          });
      }
      if (this.$route.params && this.$route.params.byOrg) {
        this.getByOrg(this.$route.params.byOrg);
      }
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
    //抽屉提交过来的事件
    getByDrawer(data) {
      this.info.byOrg = data.orgId;
      this.byName = data.pname;
    },
  },
  created() {},
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