<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="userInfo" label-width="80px">
        <div class="form_item">
          <el-form-item label="名称">
            <el-input v-model="userInfo.name"></el-input>
            <el-alert
              :title="errorInfo.name.err"
              v-show="errorInfo.name.isErr"
              type="error"
              :closable="false"
              show-icon
            ></el-alert>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="userInfo.phone" @change="phoneInputChange"></el-input>
            <el-alert
              :title="errorInfo.phone.err"
              v-show="errorInfo.phone.isErr"
              type="error"
              :closable="false"
              show-icon
            ></el-alert>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input v-model="userInfo.age" @change="ageInputChange"></el-input>
            <el-alert
              :title="errorInfo.age.err"
              v-show="errorInfo.age.isErr"
              type="error"
              :closable="false"
              show-icon
            ></el-alert>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userInfo.email" @change="emailInputChange"></el-input>
            <el-alert
              :title="errorInfo.email.err"
              v-show="errorInfo.email.isErr"
              type="error"
              :closable="false"
              show-icon
            ></el-alert>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="userInfo.gender">
              <el-radio label="true">男</el-radio>
              <el-radio label="false">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="生日">
            <div class="timePicker">
              <el-date-picker v-model="userInfo.birthday" type="date" placeholder="选择日期"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="职务">
            <!--  readonly -->
            <el-input v-model="userInfo.job" @click.native="updataShow"></el-input>
          </el-form-item>
        </div>
        <!-- 工作经历列表 -->
        <el-form-item label="工作经历">
          <el-button type="success" size="small" @click="addProgress">添加</el-button>
          <div>
            <el-row :gutter="20" v-for="(eItem,index) in userInfo.progress" :key="index">
              <el-col :span="10">
                <div class="timePicker">
                  <el-date-picker
                    v-model="eItem.time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                </div>
              </el-col>
              <el-col :span="10">
                <el-input v-model="eItem.company" placeholder="请输入内容"></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteProgress(index)"
                  circle
                ></el-button>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <!-- 个人说明 -->
        <el-form-item class>
          <quill-editor ref="myTextEditor" v-model="userInfo.description" :options="editorOption"></quill-editor>
        </el-form-item>
        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">表单提交</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import userApi from "@/api/user.js";
import regular from "@/assets/js/regular.js";
import { mapMutations } from "vuex";
//富文本框
import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor,
  },
  data() {
    return {
      //工作经历属性字段
      progressItem: {
        time: "",
        company: "",
      },
      //表单属性
      userInfo: {
        id: "",
        name: "",
        phone: "",
        age: "",
        email: "",
        gender: "true",
        birthday: "",
        job: "",
        description: "",
        progress: [
        ],
      },
      editorOption: {
        placeholder: "请输入内容",
      },
      //错误信息
      errorInfo: {
        name: {
          isErr: false,
          err: "用户名不符合规范",
        },
        phone: {
          isErr: false,
          err: "电话号码不符合规范",
        },
        age: {
          isErr: false,
          err: "年龄不符合规范",
        },
        email: {
          isErr: false,
          err: "邮箱不符合规范",
        },
      },
      //职务选择
      options: [
        {
          value: "前端开发工程师",
          label: "前端开发工程师",
        },
        {
          value: "后端开发工程师",
          label: "后端开发工程师",
        },
        {
          value: "行政部门",
          label: "行政部门",
        },
        {
          value: "市场部",
          label: "市场部",
        },
        {
          value: "销售部",
          label: "销售部",
        },
      ],
    };
  },
  methods: {
    ...mapMutations({
      deleteTags: "DELETE_TAGSLIST",
    }),
    //电话号码校验
    phoneInputChange: function (value) {
      this.errorInfo.phone.isErr = !regular.checkPhone(value);
    },
    //年龄校验
    ageInputChange: function (value) {
      this.errorInfo.age.isErr = !regular.checkNumber(value);
    },
    //邮箱校验
    emailInputChange: function (value) {
      this.errorInfo.email.isErr = !regular.checkEmail(value);
    },
    //添加工作经历
    addProgress: function () {
      this.userInfo.progress.push(this.copyProgress(this.progressItem));
    },
    //点击选中职位
    updataShow: function () {
      this.$refs.popUpSelect.updataShow();
    },
    //获取form数据的job信息
    jobInfo: function (data) {
      this.userInfo.job = data;
    },
    //删除工作经历
    deleteProgress: function (index) {
      this.userInfo.progress.splice(index, 1)[0];
    },
    //清空工作经历无效集合
    closeProgress: function () {
      this.userInfo.progress.forEach((item, index) => {
        if (!item.time || !item.company) {
          this.userInfo.progress.splice(index, 1)[0];
        }
      });
    },
    //提交表单
    onSubmit: function () {
      this.closeProgress();
      let isSubmit = true;
      // //判断用户名是否为空
      if (!this.userInfo.name.trim()) {
        isSubmit = false;
        this.errorInfo.name.isErr = true;
      }
      //判断电话号码是否符合规范
      if (!regular.checkPhone(this.userInfo.phone)) {
        isSubmit = false;
        this.errorInfo.phone.isErr = true;
      }
      //判断年龄是否符合规范
      if (!regular.checkNumber(this.userInfo.age)) {
        isSubmit = false;
        this.errorInfo.age.isErr = true;
      }
      //判断邮箱是否符合规范
      if (!regular.checkEmail(this.userInfo.email)) {
        isSubmit = false;
        this.errorInfo.email.isErr = true;
      }
      //不满足规范，停止执行
      if (!isSubmit) {
        return;
      }
      
      let $this = this;
      //调用添加或编辑的方法
      userApi
        .addUser(this.userInfo)
        .then(() => {
          $this.$message.success("提交成功！");
          this.deleteTags($this.$route.fullPath); //关闭当前窗口
          this.$router.push("/userList");
        })
        .catch(() => {
          $this.$message.error("提交失败！");
        });
    },
    //深拷贝Object对象
    copyProgress: function (obj) {
      let newObj = JSON.stringify(obj);
      return JSON.parse(newObj);
    },
  },
  created() {
    //判断是否传过来ID，
    if (this.$route.params && this.$route.params.Id) {
      //根据ID获取用户数据
      userApi.getUserId({ id: this.$route.params.Id }).then((result) => {
        for (let item in this.userInfo) {
          this.userInfo[item] = result[0][item];
        }
        if (!this.userInfo["progress"]) {
          this.userInfo.progress = [];
          this.userInfo.progress.push(this.copyProgress(this.progressItem));
        }
      });
    }
    // 初始化添加工作经历
    this.userInfo.progress.push(this.copyProgress(this.progressItem));
  },
};
</script>