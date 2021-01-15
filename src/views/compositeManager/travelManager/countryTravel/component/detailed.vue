<template>
  <div class="modelBox" :class="[isShow?'isShow':'isHide']">
    <div class="detailed_item">
      <div class="detailed info_box" v-show="isShow">
        <div class="detailed_item">
          <div class="detailed_btn">
            <el-button type="success" size="small" @click="switchContent(true)">pc端</el-button>
            <el-button type="success" size="small" @click="switchContent(false)">移动端</el-button>
            <el-button type="success" @click="closeDetailed" size="small" class="close">
              <i class="el-icon-close"></i>
            </el-button>
          </div>
          <div class="htmlContent">
            <div v-show="contentMode" class="grid-content bg-purple ql-editor">
              <div class="example" v-html="content.pcContent"></div>
            </div>
            <div v-show="!contentMode" class="grid-content bg-purple ql-editor mobile">
              <div class="example" v-html="content.mobileContent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      content: {},
      isShow: false,
      contentMode: true,
    };
  },
  methods: {
    //显示
    updataComtent: function (content) {
      this.content = content;
      this.isShow = true;
    },
    // 是否关闭
    closeDetailed: function () {
      this.isShow = false;
    },
    //切换模式
    switchContent: function (bool) {
      this.contentMode = bool;
    },
  },
  created() {},
};
</script>
<style scoped>
div {
  box-sizing: border-box;
}
.modelBox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  z-index: 999;
  padding: 0;
  transition: all 500ms ease;
  transform: translateY(0%);
  background: rgba(0, 0, 0, 0.6);
}
.detailed_item {
  will-change: transform;
  transition: all 500ms ease;
  transform: translateY(4%);
  width: 100%;
}
.detailed {
  width: 100%;
  height: 100%;
  border-radius: 0;
  padding: 4px 30px;
}
.htmlContent {
  height: calc(100% - 46px);
}

.mobile {
  width: 375px;
  height: 667px;
  margin: auto;
}
.isShow {
  opacity: 1;
  height: 100%;
}
.isShow .detailed_item {
  transform: translateY(0%);
  height: 100%;
}

.detailed .detailed_item {
  position: relative;
  height: 100%;
}
.detailed_btn {
  padding: 4px 0px 10px;
  color: #ffffff;
}
i.el-icon-close {
  color: #ffffff;
}
.detailed .el-row,
.grid-content {
  border-radius: 0;
  background: #ffffff;
}
.title_box {
  text-align: right;
}
.info_box .row-bg.row_box {
  margin-bottom: 0;
}
</style>