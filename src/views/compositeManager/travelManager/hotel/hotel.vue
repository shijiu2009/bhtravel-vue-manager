<template>
  <div>
    <transition name="slide-top">
      <keep-alive :include="include">
        <router-view />
      </keep-alive>
    </transition>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      include: "include",
    }),
  },
};
</script>