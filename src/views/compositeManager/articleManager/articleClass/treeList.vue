<template>
  <div>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText">
    </el-input>
    <div class="custom-tree-container">
      <div class="block">
        <el-tree class="filter-tree" ref="viewTree" :data="viewTree" show-checkbox node-key="id"
          :default-expanded-keys="expandedKeys" :expand-on-click-node="false" :auto-expand-parent="false"
          @node-expand="nodeExpand" @node-collapse="nodeCollapse" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ node,data}">
            <span>{{node.label}}</span>
            <span>
              <el-button type="text" size="mini" v-if="data.add" @click="add(node)">
                添加
              </el-button>
              <el-button type="text" size="mini" @click="edit(node)">
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
import api from "@/api/travelManager/articleClass.js";
export default {
  name: "articleClassList",
  data() {
    return {
      viewTree: [], //数据
      expandedKeys: [], //默认展开的节点
      filterText: "", //过滤条件
    };
  },
  watch: {
    filterText(val) {
      this.$refs.viewTree.filter(val);
    },
  },
  methods: {
    //递归整理参数
    adjust: function (data) {
      let itemArr = [];
      for (let i = 0; i < data.length; i++) {
        let node = data[i];
        node.label = node.text;
        if (node.nodes && node.nodes.length > 0) {
          node.add=true;
          node.children = this.adjust(node.nodes);
        }
        itemArr.push(node);
      }
      return itemArr;
    },
    //新增按钮
    add: function (node) {
      //判断是添加还是编辑
      this.$router.push({
        name: "addArticleClass",
        params: { byid: node.key },
      });
    },
    //编辑按钮
    edit: function (node) {
      this.$router.push({
        name: "editArticleClass",
        params: { id: node.key },
      });
    },
    //打开删除弹窗
    openDeleteWarning: function (node, data) {
      this.$global
        .openDeleteWarning("/api/travel/articleClass/delete", { spid: node.key})
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
    },
    //获取树列表
    getViewTree: function () {
      api
        .getViewTree({ showcheckbox: true })
        .then((result) => {
          if (result.success) {
            this.viewTree = this.adjust(result.menus);
          } else {
            this.$message({
              type: "error",
              message: result.msg,
            });
          }
        })
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
    this.getViewTree();
  },
};
</script>