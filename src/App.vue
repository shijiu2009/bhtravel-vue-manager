<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
// import userApi from "@/api/user.js";
export default {
  methods: {
    ...mapActions({
      logout: "logout",
    }),
  },
  created() {
    // this.$loading.show()
  },
  destroyed() {
    this.logout();
  },
};
</script>
<style>
@import "./assets/css/dome.css";
@import "./assets/css/style.css";
@import "./assets/fonts/fonts.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
.slide-top-enter-active {
  will-change: transform;
  transition: all 500ms;
}
.slide-top-enter {
  opacity: 0;
  transform: translateY(4%);
}
.loadingItem .el-icon-loading {
  color: black;
  font-size: 20px;
}
</style>
