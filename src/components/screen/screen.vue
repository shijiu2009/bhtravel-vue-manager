<template>
  <div>
    <div class="wrapper">
      <!-- 输入框 -->
      <div
        class="searChfactor input-box"
        v-for="item in screenCondition.input"
        :key="item.name"
      >
        <el-input
          v-model="screenInfo[item.name]"
          :placeholder="item.title"
          class="handle-input mr10"
          size="mini"
          clearable
        >
        </el-input>
      </div>
      <!-- 下拉选择框 -->
      <div
        class="select searChfactor"
        v-for="(item, index) in screenCondition.select"
        :key="index"
      >
       <div class="title">{{item.title}}:</div>
        <el-select
          size="mini"
          v-model="screenInfo[item.name]"
          filterable
          :placeholder="item.title"
        >
          <el-option
            size="mini"
            v-for="itemList in item.list"
            :key="itemList.label"
            :label="itemList.label"
            :value="itemList.value"
          ></el-option>
        </el-select>
      </div>
      <!-- 时间筛选器 -->
      <div class="block searChfactor" v-if="screenCondition.date">
        <el-date-picker
          v-model="screenInfo.date"
          size="mini"
          type="datetimerange"
          :picker-options="timePicker.pickerOptions"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
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
        >搜索
      </el-button>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: {
    screenCondition: Object,
  },
  data() {
    return {
      // screenCondition: null,
      screenInfo: {},
    };
  },
  computed: {
    ...mapState({
      timePicker: "timePicker",
    }),
  },
  methods: {
    //触发搜索按钮
    handleSearch: function () {
      this.$parent.handleSearch(this.screenInfo);
    },
    // 触发默认值
    clear: function () {
      this.handleSearch();
    },
  },
  //组件创建前
  // beforeCreate() {
  //   // console.log(this["_props"])
  //   // if (!this["_props"]) {
  //   //   return;
  //   // }

  // },
  created() {
    //  if (!this["_props"]) {
    //   return;
    // }
    // 生成v-model的数据
    for (let key in this.screenCondition) {
      if (key == "input") {
        this.screenCondition[key].forEach((value) => {
          this.$set(this.screenInfo, value.name, "");
        });
      }
      if (key == "select") {
        let selectList = this.screenCondition[key];
        selectList.forEach((e) => {
          e.list.unshift({
            value: "",
            label: "全部",
          });
        });
        Object.keys(selectList).forEach((key) => {
          this.$set(this.screenInfo, selectList[key].name, "");
        });
      }
      if (key == "date") {
        if (this.screenCondition[key]) {
          this.$set(this.screenInfo, key, "");
        }
      }
    }
  },
};
</script>
<style scoped>
.wrapper{
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.searChfactor{
  margin-right: 16px;
}
.select{
  display: flex;
  align-items: center;
}
.title{
  margin: 0 10px 0px 0px;
}
</style>
