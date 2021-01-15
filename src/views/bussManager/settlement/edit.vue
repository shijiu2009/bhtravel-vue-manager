<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="90px">
        <div class="form_item">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>财务结算信息</span>
            </div>
            <div class="text item">订单号： {{ info.orderNo }}</div>
            <div class="text item">订单名称： {{ info.orderName }}</div>
            <div class="text item" v-if="info.type == 0">订单类型： 酒店</div>
            <div class="text item" v-if="info.type == 1">订单类型： 景点</div>
            <div class="text item" v-if="info.type == 2">订单类型： 线路</div>
            <div class="text item" v-if="info.type == 3">订单类型： 旅游产品</div>
            <div class="text item" v-if="info.type == 4">订单类型： 农家乐</div>
            <div class="text item" v-if="info.type == 5">订单类型： 民宿</div>
            <div class="text item">订单创建时间: {{ info.createTime }}</div>
            <div class="text item">订单完成时间: {{ info.createTime }}</div>
            <div class="text item">成交金额: {{ info.totalPrice }}</div>
            <div class="text item">商家应收: {{ info.receivable }}</div>
            <div class="text item">商家应收: {{ info.receivable }}</div>
            <div class="text item" v-if="info.status == 0">状态： 未提交</div>
            <div class="text item" v-if="info.status == 1">状态： 已结算</div>
            <div class="text item" v-if="info.status == 2">状态： 未结算</div>
            <div class="text item" v-if="info.status == 3">状态： 有争议</div>
            <div class="text item" v-if="info.status == 4">状态： 废单</div>
            <div class="text item">交易用户id: {{ info.tradingUid }}</div>
            <div class="text item" v-if="info.accountsMethod == 1">
              结算方式: 结算底价
            </div>
            <div class="text item" v-if="info.accountsMethod == 2">
              结算方式: 佣金比例
            </div>
            <div class="text item">订单人姓名: {{ info.userName }}</div>
            <div class="text item">订单人联系电话: {{ info.mobile }}</div>
          </el-card>
          <br />
          <el-form-item
            v-if="info.status == 2"
            v-show="statusShow"
            label="状态"
            style="width: 50%"
          >
            <el-select v-model="info.status" placeholder="请选择">
              <el-option
                v-for="item in status"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <br />
        <!-- 操作按钮 -->
        <el-form-item v-show="statusShow">
          <el-button type="primary" @click="onSubmit">表单提交</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import api from "@/api/bussManager/settlement.js";
import { mapMutations } from "vuex";
export default {
  components: {},
  name: "editSettlement",
  data() {
    return {
      info: {
        id: "",
        name: "",
        type: "",
      },
      statuses: [],
      status: [
        {
          value: 1,
          label: "已结算",
        },
        {
          value: 2,
          label: "未结算",
        },
        {
          value: 3,
          label: "有争议",
        },
        {
          value: 4,
          label: "废单",
        },
      ],
      statusShow: false,
    };
  },
  methods: {
    ...mapMutations({
      deleteTags: "DELETE_TAGSLIST",
    }),
    //提交表单
    onSubmit: function () {
      this.info.businessIds = [];
      api
        .edit(this.info)
        .then((result) => {
          if (result.success) {
            this.$message.success("提交成功！");
            this.deleteTags(this.$route.fullPath); //关闭当前窗口
            //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
            this.$router.push({
              name: "settlementList",
              params: { flow: true },
            });
          } else {
            if (this.info.id) {
              if (result.fielderrors) {
                let errors = "";
                for (let i = 0; i < result.fielderrors.length; i++) {
                  let error = result.fielderrors[i].error;
                  errors += error + "\n";
                }
                this.$message.error(errors);
              }
              if (result.msg) {
                this.$message.error(result.msg);
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
              if (result.msg) {
                this.$message.error(result.msg);
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
      if (this.$route.params && this.$route.params.id) {
        api
          .detailed({ id: this.$route.params.id })
          .then((result) => {
            this.info = result.settlementRecord;
            if (this.info.status == 2) {
              this.statusShow = true;
            }
          })
          .catch(() => {
            this.$message.error("数据获取失败");
          });
      }
    },
  },
  created() {},
  //keep-alive 生命周期，
  activated() {
    this.getAdvert();
  },
};
</script>
