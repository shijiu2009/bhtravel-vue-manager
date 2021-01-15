<template>
  <div class="popUpSelect" :class="{isShow:isShow}">
    <div class="popUpSelect_box">
      <h3 class="title">请选择职位</h3>
      <el-form ref="form">
        <el-form-item>
          <el-select v-model="selectData" value-key filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button @click="updataShow">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="cloth"></div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      default: {
        return: {},
      },
    },
  },
  data() {
    return {
      selectData: "",
      isShow: false,
    };
  },
  methods: {
    //设置是否显示
    updataShow: function () {
      this.isShow = !this.isShow;
    },
    //确定按钮事件
    onSubmit: function () {
      this.updataShow();
      this.$emit("jobInfo", this.selectData);
    },
  },
};
</script>
<style scoped>
.popUpSelect {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 999;
  transition: all 2s;
  -webkit-transition: all 2s; /* Safari */
  display: none;
}
.popUpSelect_box {
  width: 440px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: inline-block;
  border: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding-bottom: 10px;
  vertical-align: middle;
  background-color: #fff;
  border-radius: 4px;
  margin-top: 270px;
  padding: 20px;
  transition: all 2s;
  -webkit-transition: all 2s; /* Safari */
}
.cloth {
  background: #333;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0;
  z-index: -1;
  transition: all 2s;
  -webkit-transition: all 2s; /* Safari */
}
.title {
  font-size: 16px;
  font-weight: 100;
  margin-bottom: 10px;
}
.isShow {
  display: block;
}
.isShow .cloth {
  opacity: 0.4;
}
</style>