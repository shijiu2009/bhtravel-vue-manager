<template>
  <div>
    <el-upload
      action="#"
      ref="upload"
      list-type="picture-card"
      :http-request="uploadSectionFile"
      :auto-upload="false"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <div
      style="margin:10px 0"
      slot="tip"
      class="el-upload__tip warning_upload"
    >上传图片</div>
    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
  </div>
</template>
<script>
import fileUploadApi from "@/api/fileUpload.js";
export default {
  data() {
    return {};
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
    //上传文件点击按钮
    submitUpload() {
      this.$refs.upload.submit();
    },
    
  },
};
</script>
<style  scoped>
.warning_upload {
  padding: 4px 0;
  color: #e6a23c;
}
</style>