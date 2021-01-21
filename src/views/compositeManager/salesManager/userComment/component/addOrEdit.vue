<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="commentInfo" label-width="108px">
        <div class="form_item">
          <el-form-item label="评论对象类别" :required="true">
            <el-input v-model="ctypeList[commentInfo.type].label" style="width:400px" disabled></el-input>
          </el-form-item>
          <el-form-item label="评论对象id" :required="true">
            <el-input v-model="commentInfo.objectId" style="width:400px" disabled></el-input>
          </el-form-item>
          <el-form-item label="评论对象名称" :required="true">
            <el-input v-model="commentInfo.objectName" style="width:400px" disabled></el-input>
          </el-form-item>
          <el-form-item label="评论用户ID" :required="true">
            <el-input v-model="commentInfo.userId" style="width:400px" disabled></el-input>
          </el-form-item>
          <el-form-item label="评论用户账号" :required="true">
            <el-input v-model="commentInfo.userName" style="width:400px" disabled></el-input>
          </el-form-item>
          <el-form-item label="星级" :required="true" class="rank">
            <el-rate v-model="commentInfo.star" show-text disabled> </el-rate>
          </el-form-item>
          <el-form-item label="审核" :required="true">
            <el-select v-model="commentInfo.reviewed" placeholder="请选择">
              <el-option
                v-for="item in isAuditList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="评论内容" :required="true" >
            <el-input
              type="textarea"
              rows="10"
              maxlength="255"
              disabled
              v-model="commentInfo.content"
            ></el-input>
          </el-form-item>
          <el-form-item label="回复内容" :required="true">
            <el-input
              type="textarea"
              rows="10"
              maxlength="255"
              v-model="commentInfo.replyContent"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否回复">
            <el-radio-group v-model="commentInfo.reply">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">表单提交</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <Drawer ref="drawer"></Drawer>
  </div>
</template>

<script>
import commentApi from "@/api/travelManager/userComment.js";
import { mapMutations } from "vuex";
//引入抽屉
import Drawer from "./drawer.vue";
export default {
  name: "addOrEditComment",
  components: {
    Drawer,
  },
  data() {
    return {
      //信息
      commentInfo: {
        id: "",
        objectId: "", //评论对象id
        objectName: "", //评论对象名称
        type: "", //评论对象类别（0-酒店，1-景区，2-线路，3-产品）
        star: 0,
        userId: "", //评论人id
        userName: "", //评论人昵称
        openId: "",
        reviewed: "", //是否通过审核 0未审核 1通过 2不通过
        content: "", //评论内容
        replyContent: "", //回复内容
        reply: 0,
      },
      //提示信息
      tips: {},
      // 评论对象类别列表
      ctypeList: [
        {
          value: 0,
          label: "酒店",
        },
        {
          value: 1,
          label: "景区",
        },
        {
          value: 2,
          label: "线路",
        },
        {
          value: 3,
          label: "民宿",
        },
        {
          value: 4,
          label: "农家乐",
        },
        {
          value: 5,
          label: "民俗文化",
        },
        {
          value: 6,
          label: "美食",
        },
        {
          value: 7,
          label: "特产",
        },
        {
          value: 8,
          label: "文化场馆",
        },
      ],
      //是否通过审核列表
      isAuditList: [
        {
          value: 0,
          label: "未审核",
        },
        {
          value: 1,
          label: "通过",
        },
        {
          value: 2,
          label: "不通过",
        },
      ],
      starts: [
        {
          value: 0,
          label: "无星级",
        },
        {
          value: 1,
          label: "1星级",
        },
        {
          value: 2,
          label: "2星级",
        },
        {
          value: 3,
          label: "3星级",
        },
        {
          value: 4,
          label: "4星级",
        },
        {
          value: 5,
          label: "5星级",
        },
      ],
    };
  },
  methods: {
    ...mapMutations({
      deleteTags: "DELETE_TAGSLIST",
    }),
    //取消按钮事件
    close: function () {
      this.$router.go(-1);
    },
    //根据id获取详情信息
    getComment: function () {
      //判断是否传ID过来
      if (this.$route.params && this.$route.params.id) {
        //获取详情
        commentApi
          .detailedComment({ id: this.$route.params.id })
          .then((result) => {
            this.commentInfo = result.comment;
          })
          .catch(() => {
            this.$message.error("数据获取失败");
          });
      } else if (this.$route.params && this.$route.params.flow) {
        //重置参数
        Object.keys(this.commentInfo).map((key) => (this.commentInfo[key] = ""));
        this.commentInfo.isShow = 0;
      }
    },
    //提交表单
    onSubmit: function () {
      commentApi
        .addOrEditComment(this.commentInfo)
        .then((result) => {
          if (result.success) {
            this.$message.success("提交成功！");
            this.deleteTags(this.$route.fullPath); //关闭当前窗口
            //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
            this.$router.push({ name: "commentList", params: { flow: true } });
          } else {
            if (this.commentInfo.id) {
              if (result.fielderrors) {
                let errors = "";
                for (let i = 0; i < result.fielderrors.length; i++) {
                  let error = result.fielderrors[i].error;
                  errors += error + "\n";
                }
                this.$message.error(errors);
              }
            } else {
              if (result.fielderrors) {
                let errors = "";
                for (let i = 0; i < result.fielderrors.length; i++) {
                  let error = result.fielderrors[i].error;
                  errors += error + "\n";
                }
                this.$message.error(errors);
              }
            }
          }
        })
        .catch(() => {
          if (this.commentInfo.id) {
            this.$message.error("数据更新失败");
          } else {
            this.$message.error("数据添加失败");
          }
        });
    },
    //点击评论人弹出抽屉
    openUserDrawer: function () {
      this.$refs.drawer.openDrawer();
      //失去焦点
      this.$refs.readonly.blur();
    },
    //抽屉提交过来的事件
    getDrawer(data) {
      this.commentInfo.mid = data.id;
      this.commentInfo.mname = data.name;
    },
  },
  created() {},
  //keep-alive 生命周期，
  activated() {
    this.getComment();
  },
};
</script>

<style scoped>
.rank{
  display: flex;
  align-items: center;
}
.rank >>> .el-form-item__content{
  margin-left: 0px !important;
}
</style>>

