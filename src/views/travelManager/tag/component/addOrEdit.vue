<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="tagInfo" label-width="98px">
        <div class="form_item">
          <el-form-item label="名称" :required="true">
            <el-input
              v-model="tagInfo.name"
              @change="infoChange"
              ref="el_input_title"
              maxlength="20"
              minlength="1"
              v-focus
            ></el-input>
          </el-form-item>
          <el-form-item label="所属类别" :required="true">
            <el-select v-model="tagInfo.musId" placeholder="请选择">
              <el-option
                v-for="item in tagMusters"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                :reserve-keyword="true"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" :required="true">
            <el-input
              v-model="tagInfo.sort"
              @change="infoChange"
              ref="el_input_title"
              maxlength="20"
              minlength="1"
              v-focus
            ></el-input>
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
import tagApi from "@/api/tag.js";
import quillConfig from "@/assets/js/quill-config.js";
import { mapMutations} from "vuex";
//富文本框
// import { quillEditor } from "vue-quill-editor";
export default {
  name: "addOrEditTag",
  components: {
    
  },
  data() {
    return {
      tagInfo: {
        id: "",
        name: "",
        code: "",
        musId: "",
        tagMusters:[],
        createTime: "", //
      },
      //提示信息
      tigs: {
        name: {
          isShow: false,
          content: "请输入标题，且标题长度不可大于20个字符",
        },
      },
      options: {
        pcEditorOption: quillConfig,
        mEditorOption: quillConfig,
      },
      //标签分类列表
      tagMusters: [],
    };
  },
  methods: {
    ...mapMutations({
      deleteTags: "DELETE_TAGSLIST",
    }),
    getTagMusters: function () {
      tagApi
        .getTagMusters()
        .then((result) => {
          
          this.tagMusters = result.all;
          this.tagInfo.musId = this.tagInfo.musId
            ? this.tagInfo.musId
            : this.tagMusters[0].id; //默认赋值
        })
        .catch(() => {
          this.$message.error("标签类别列表获取失败");
        });
    },
    //信息校验
    infoChange: function () {
      let isCheck = true;
      if (this.tagInfo.name) {
        this.tigs.name.isShow = false;
      } else {
        this.tigs.name.isShow = true;
        isCheck = false;
      }
      return isCheck;
    },
    //提交表单
    onSubmit: function () {
      let isCheck = this.infoChange();
      if (!isCheck) {
        return;
      }
      this.tagInfo.tagMusters = [];
      tagApi
        
        .addOrEditTag(this.tagInfo)
        .then((result) => {
          this.tagMusters = result.all;
          if (result.success) {
            this.$message.success("提交成功！");
            this.deleteTags(this.$route.fullPath); //关闭当前窗口
            //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
            this.$router.push({ name: "tagList", params: { flow: true } });
          } else {
            console.info(this.tagInfo.id)
            if (this.tagInfo.id) {
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
          console.info(this.tagInfo.id)
          if (this.tagInfo.id) {
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
    getTag: function () {
      //判断是否传ID过来
      if (this.$route.params && this.$route.params.id) {
        //获取详情
        tagApi
          .detailedTag({ id: this.$route.params.id })
          .then((result) => {
            this.tagInfo = JSON.parse(JSON.stringify(result.tag));
            //取消富文本框焦点，防止页面滚动
            //this.$refs.myTextEditor.quill.enable(false); //刚开始时，不聚焦
          })
          .catch(() => {
            this.$message.error("数据获取失败");
          });
      } else if (this.$route.params && this.$route.params.flow) {
        //重置参数
        Object.keys(this.tagInfo).map(
          (key) => (this.tagInfo[key] = "")
        );
        this.tagInfo.sort = 1;
      }
    },
  },
  created() {
    this.getTag();
    this.getTagMusters();
  },
  //keep-alive 生命周期，
  activated() {
    //重新获取页面数据，
    this.getTag();
  },
};
</script>