<template>
  <div>
    <div class="container">
      <!-- <quill-editor ref="myTextEditor" v-model="content" :options="editorOption"></quill-editor> -->
      <quill-editor ref="myTextEditor" v-model="content" :options="quillOption"></quill-editor>
    </div>
  </div>
</template>

<script>
import quillConfig from "@/assets/js/quill-config.js";
import { quillEditor } from "vue-quill-editor";
export default {
  data: function () {
    return {
      content: "",
      editorOption: {
        placeholder: "Hello World",
      },
      quillOption: quillConfig,
    };
  },
  components: {
    quillEditor,
  },
  methods: {
    onEditorChange({ editor, html, text }) {
      console.log(editor);
      console.log(text);
      this.content = html;
    },
    submit() {
      console.log(this.content);
      this.$message.success("提交成功！");
    },
  },
};
</script>
<style scoped>
.editor-btn {
  margin-top: 20px;
}
</style>