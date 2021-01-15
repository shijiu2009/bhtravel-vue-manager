<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="90px">
        <div class="form_item">
          
          <el-form-item label="主题名称">
            <el-input v-model="info.name"></el-input>
          </el-form-item>

          <el-form-item label="类型" style="width:50%">
            <el-select v-model="info.type" placeholder="请选择">
              <el-option
                v-for="item in statuses"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">表单提交</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import api from "@/api/reserveManager/theme.js";
import { mapMutations } from "vuex";
export default {
  components: {
  },
  name: "addOrEditTheme",
  data() {
    return {
      info: {
        id: "",
        name: "",
        type: ""
      },
      statuses: [
        {
          value: 0,
          label: "酒店",
        },
        {
          value: 1,
          label: "景点",
        },
        {
          value: 2,
          label: "线路",
        },
        {
          value: 3,
          label: "产品",
        },
      ],
    };
  },
  methods: {
    ...mapMutations({
      deleteTags: "DELETE_TAGSLIST",
    }),
    //提交表单
    onSubmit: function () {
      api
        .addOrEdit(this.info)
        .then((result) => {
          if (result.success) {
            this.$message.success("提交成功！");
            this.deleteTags(this.$route.fullPath); //关闭当前窗口
            //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
            this.$router.push({
              name: "themeList",
              params: { flow: true },
            });
          } else {
            if (this.info.id) {
              if(result.fielderrors){
                let errors = ''
                for(let i=0;i<result.fielderrors.length;i++){
                  let error = result.fielderrors[i].error
                  errors += error+'\n'
                }
                this.$message.error(errors);
              }
            } else {
              if(result.fielderrors){
                let errors = ''
                for(let i=0;i<result.fielderrors.length;i++){
                  let error = result.fielderrors[i].error
                  errors += error+'\n'
                }
                this.$message.error(errors);
              }
            }
          }
        })
        .catch(() => {
          if (this.info.id) {
            this.$message.error("数据更新失败");
          } else {
            this.$message.error("数据添加失败");
          }
        });
    },
    //取消按钮事件
    close: function () {
      this.$router.go(-1);
    },
    //获取详情信息
    getAdvert: function () {
      if (this.$route.params && this.$route.params.Id) {
        api
          .detailed({ id: this.$route.params.Id })
          .then((result) => {
            this.info = result.theme;
          })
          .catch(() => {
            this.$message.error("数据获取失败");
          });
      }
      api.getClassList().then((result) => {
        if (result.rows && result.rows.length > 0) {
          for (let i = 0; i < result.rows.length; i++) {
            let obj = result.rows[i];
            let classes = {
              value: obj.id,
              label: obj.name,
            };
            this.classes.push(classes);
          }
        }
      });
    },
  },
  created() {},
  //keep-alive 生命周期，
  activated() {
    this.getAdvert();
  },
};
</script>