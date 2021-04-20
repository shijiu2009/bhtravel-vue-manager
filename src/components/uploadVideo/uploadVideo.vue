<template>
  <div>
    <el-upload
      class="files_upload"
      drag
      action="#"
      :http-request="uploadSectionFile"
      :auto-upload="true"
      :limit="uploadGroup.limitCount"
      :file-list="uploadGroup.fileList"
      :on-change="onChange"
      :on-remove="handleRemove"
      v-loading="loading"
      multiple
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="el-upload__tip" slot="tip" style="text-align: center; width: 600px">
        只能上传视频文件，且不超过100mb
      </div>
    </el-upload>
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
  data() {
    return {
      hideUpload: false,
      loading: false,
    };
  },
  methods: {
    //提交文件
    async uploadSectionFile(params) {
      this.loading = true;
      let file = params.file;
      // fileType = file.type;
      // 定义新的formData
      let fromdata = new FormData();
      fromdata.append("file", file);
      //   fromdata.append("filetype", "mp4");
      //   fromdata.append("type", fileType);
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
              message: "视频上传成功",
              type: "success",
            });
            this.loading = false;
          } else {
            //文件上传失败
            params.onError(result);
            this.$message({
              showClose: true,
              message: "视频上传失败",
              type: "error",
            });
            this.loading = false;
          }
        })
        .catch(() => {
          //文件上传失败
          params.onError();
          this.$message({
            showClose: true,
            message: "视频上传失败",
            type: "error",
          });
          this.loading = false;
        });
    },
    //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    onChange: function (file, fileList) {
      this.hideUpload = fileList.length >= this.uploadGroup.limitCount;
    },
    //文件列表移除文件时的钩子
    handleRemove: function (file, fileList) {
      for(let i=0;i<this.uploadGroup.fileList.length;i++){
        let fileData = this.uploadGroup.fileList[i]
        if(file.url == fileData.url){
          this.uploadGroup.fileList.splice(i,1)
        }
      }
      this.hideUpload = fileList.length >= this.uploadGroup.limitCount;
    },
  },
  created() {
    this.onChange({}, this.uploadGroup.fileList);
  },
};
</script>
