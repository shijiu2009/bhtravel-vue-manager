<template>
  <div>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText">
    </el-input>
    <div class="custom-tree-container">
      <div class="block">
        <el-tree class="filter-tree" ref="orgTree" :data="orgTree" show-checkbox node-key="id"
          :default-expanded-keys="expandedKeys" :expand-on-click-node="false" :auto-expand-parent="false"
          @node-expand="nodeExpand" @node-collapse="nodeCollapse" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ node,data}">
            <span>{{node.label}}</span>
            <span>
              <el-button type="text" size="mini" v-if="data.add" @click="addOrg(node)">
                添加
              </el-button>
              <el-button type="text" size="mini" @click="editOrg(node)">
                编辑
              </el-button>
              <el-button type="text" size="mini" @click="openDeleteWarning(node,data)">
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/systemManager/org.js";
export default {
  name: "org_treeList",
  data() {
    return {
      orgTree: [], //数据
      expandedKeys: [], //默认展开的节点
      filterText: "", //过滤条件
    };
  },
  watch: {
    filterText(val) {
      this.$refs.orgTree.filter(val);
    },
  },
  methods: {
    //递归整理参数
    adjustOrg: function (data) {
      let itemArr = [];
      console.log(data)
      for (let i = 0; i < data.length; i++) {
        console.log(data[i])
        let node = data[i];
        node.label = node.text;
        if (node.nodes && node.nodes.length > 0) {
          node.add=true;
          node.children = this.adjustOrg(node.nodes);
        }
        itemArr.push(node);
      }
      return itemArr;
    },
    //新增按钮
    addOrg: function (node) {
      //判断是添加还是编辑
      this.$router.push({
        name: "org_add",
        params: { byid: node.key },
      });
    },
    //编辑按钮
    editOrg: function (node) {
      this.$router.push({
        name: "org_edit",
        params: { id: node.key },
      });
    },
    //打开删除弹窗
    openDeleteWarning: function (node, data) {
      this.$global
        .openDeleteWarning("/api/manager/org/delete", { orgId: node.key })
        .then((result) => {
          //删除成功后将数据移出tree
          if (result.status) {
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex((d) => d.id === data.id);
            children.splice(index, 1);
          } else {
            this.$message({
              type: "error",
              message: result.msg,
            });
          }
        })
        .catch(() => {});
    },
    //获取树列表
    getOrgTree: function () {
      api
        .getOrgTree({ showicon: true, showcheckbox: true, rid: -1, qs: 0 })
        .then((result) => {
          if (result.status) {
            this.orgTree = this.adjustOrg(result.data);
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
  activated() {
    this.getOrgTree();
  },
};
</script>