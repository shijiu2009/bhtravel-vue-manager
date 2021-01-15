<!--进行类切换的例子-->
<template>
  <div id="app">
    <input v-model="somebody" />
    <p>hello {{somebody}}</p>
  </div>
</template>
<script>
export default {
  name: "#app",
  data() {
    return {
      somebody: "小明",
    };
  },
};
</script>