<template>
  <div v-if="show">
    <div class="loading">
      <div class="iconItem">
        <i class="el-icon-loading"></i>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "Loading",
  props: {
    show: Boolean,
  },
  computed: {
    ...mapState({}),
  },
};
</script>
<style scoped>
.loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: 9999;
  text-align: center;
}
.iconItem {
  height: 100%;
  font-size: 38px;
  transform: translateY(50%);
  margin-top: -14px;
  color: #000;
}
</style>