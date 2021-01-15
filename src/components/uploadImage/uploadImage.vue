<template>
  <div>
    <el-upload
      :class="{ hide: hideUpload }"
      class="images_upload"
      action="#"
      ref="upload"
      list-type="picture-card"
      :http-request="uploadSectionFile"
      :auto-upload="uploadGroup.autoUpload"
      :limit="uploadGroup.limitCount"
      :file-list="uploadGroup.fileList"
      :on-change="onChange"
      :on-remove="handleRemove"
      multiple
    >
      <i class="el-icon-plus"></i>
      <p
        class="images_size"
        :style="{ 'margin-top': -uploadGroup.height / 2 + 20 + 'px' }"
      >
        {{ uploadGroup.width }}&nbsp;
        <span>*</span>
        &nbsp;{{ uploadGroup.height }}
      </p>
    </el-upload>
    <div style="margin: 10px 0" slot="tip" class="el-upload__tip warning_upload">
      只能上传jpg/png文件，最多只能上传{{ uploadGroup.limitCount }}张图片
    </div>
    <el-button
      style="margin-left: 10px"
      size="small"
      type="success"
      @click="submitUpload"
      v-if="!uploadGroup.autoUpload"
      >上传到服务器</el-button
    >
  </div>
</template>
<script>
import fileUploadApi from "@/api/fileUpload.js";
// import baseUrl from "@/config/baseUrl.js";
export default {
  props: {
    //文件列表
    uploadGroup: {
      default: {
        return: {},
      },
    },
  },
  computed: {
    hideUpload: function () {
      if (this.uploadGroup.fileList) {
        return false;
      }
      return this.uploadGroup.fileList.length >= this.uploadGroup.limitCount;
    },
  },

  methods: {
    //提交文件
    async uploadSectionFile(params) {
      let file = params.file,
        fileType = file.type;
      // 定义新的formData
      let fromdata = new FormData();
      fromdata.append("file", file);
      fromdata.append("filetype", "image");
      fromdata.append("type", fileType);
      fromdata.append("json", "1");
      fileUploadApi
        .fileUpload(fromdata)
        .then((result) => {
          //回传给父组件的值
          if (result.success) {
            params.onSuccess(result);
            this.$emit("uploadValue", result);
            this.$message({
              showClose: true,
              message: "图片上传成功",
              type: "success",
            });
          } else {
            //文件上传失败
            params.onError(result);
            this.$message({
              showClose: true,
              message: "图片上传失败",
              type: "error",
            });
          }
        })
        .catch(() => {
          //文件上传失败
          params.onError();
          this.$message({
            showClose: true,
            message: "图片上传失败",
            type: "error",
          });
        });
    },
    //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    onChange: function (file, fileList) {
      this.uploadGroup.fileList = fileList;
    },
    //文件列表移除文件时的钩子
    handleRemove: function (file, fileList) {
      this.uploadGroup.fileList = fileList;
    },
    //上传文件点击按钮
    submitUpload() {
      this.$refs.upload.submit();
    },
  },
  mounted() {
    // this.onChange({}, this.uploadGroup.fileList);
  },
};
</script>
<style scoped>
.images_size {
  font-size: 16px;
  font-size: 16px;
  cursor: auto;
  line-height: 16px;
  color: #8c939d;
}
</style>
