<template>
  <div>
    <div class="handle-box">
      <div>
        <!-- 输入搜索条件input框 -->
        <div class="searChfactor input-box">
          <el-input
            v-model="queryInfo.name"
            placeholder="用户名"
            class="handle-input mr10"
            size="mini"
            clearable
          ></el-input>
        </div>
        <!-- 时间选择器 -->
        <div class="block searChfactor">
          <el-date-picker
            v-model="queryInfo.date"
            size="mini"
            type="datetimerange"
            :picker-options="timePicker.pickerOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
        </div>
        <!-- 搜索确定按钮 -->
        <el-button
          class="searChfactor"
          type="primary"
          size="mini"
          icon="el-icon-search"
          @click="handleSearch"
        >搜索</el-button>
      </div>
      <!-- 操作按钮 -->
      <div class="operation">
        <!-- 批量删除按钮 -->
        <el-button
          type="primary"
          icon="el-icon-delete"
          class="handle-del mr10"
          size="mini"
          v-role="'4003004'"
          @click="delAllSelection"
        >批量删除</el-button>
        <!-- 添加按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="handle-del mr10"
          size="mini"
          v-role="'4003002'"
          @click="createOrEditBtn(true)"
        >添加</el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="handle-del mr10"
          size="mini"
          v-role="'4003002'"
          v-delete-warning="{status:'fail',openWarning:openWarning}"
        >测试指令按钮</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      queryInfo: {
        name: "",
        date: "",
      },
    };
  },
  computed: {
    ...mapState({
      timePicker: "timePicker",
    }),
  },
  methods: {
    handleSearch: function () {
      console.log(this.queryInfo);
    },
    delAllSelection: function () {
      console.log("delete");
    },
    createOrEditBtn: function () {
      console.log("createOrEdit");
    },
    openWarning:function(){
      console.log("OK")
    }
  },
};
</script>