<template>
  <div>
    <div>
      <!-- 输入框 -->
      <div
        class="searChfactor input-box"
        v-for="(item) in screenCondition.input"
        :key="item.name">
        <el-input
          v-model="screenInfo[item.name]"
          :placeholder="item.title"
          class="handle-input mr10"
          size="mini"
          clearable>
        </el-input>
      </div>
      <!-- 下拉选择框 -->
      <div
        class="searChfactor"
        v-for="(item, index) in screenCondition.select"
        :key="index"
      >
        <el-select
          size="mini"
          v-model="screenInfo[item.name]"
          clearable
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
          value-format = "yyyy-MM-dd HH:mm:ss"
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
  },
  //组件创建前
  beforeCreate() {
    if (!this["_props"]) {
      return;
    }

    //生成v-model的数据
    for (let key in this.screenCondition) {
      if (key == "input") {
        this.screenCondition[key].forEach((value) => {
          this.screenInfo[value] = "";
        });
      }
      if (key == "select") {
        let selectList = this.screenCondition[key];
        Object.keys(selectList).forEach((key) => {
          this.screenInfo[selectList[key].name] = "";
        });
      }
      if (key == "date") {
        if (this.screenCondition[key]) {
          this.screenInfo[key] = "";
        }
      }
    }
  },
  created() {},
};
</script>
