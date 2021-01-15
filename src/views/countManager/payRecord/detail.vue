<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="90px">
        <div class="form_item">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>订单信息</span>
            </div>
            <div class="text item">公众号apiCode： {{ info.apiCode }}</div>
            <div class="text item">商户订单号： {{ info.orderNo }}</div>
            <div class="text item">支付账号： {{ info.fromUser }}</div>
            <div class="text item">接收账号： {{ info.toUser }}</div>
            <div class="text item">支付网关的订单号： {{ info.trade_no }}</div>
            <div class="text item">记录生成时间： {{ info.createTime }}</div>
            <div class="text item">支付金额： {{ info.totalPrice }}</div>
            <div class="text item">支付详细信息： {{ info.info }}</div>
            <div class="text item">附加信息： {{ info.attach }}</div>
          </el-card>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import api from "@/api/countManager/payRecord.js";
import { mapMutations } from "vuex";
export default {
  components: {},
  name: "showPayRecord",
  data() {
    return {
      info: {
        id: "",
        name: "",
        type: "",
      },
    };
  },
  methods: {
    ...mapMutations({
      deleteTags: "DELETE_TAGSLIST",
    }),
    //获取详情信息
    getAdvert: function () {
      if (this.$route.params && this.$route.params.id) {
        api
          .detailed({ id: this.$route.params.id })
          .then((result) => {
            this.info = result.wxPayRecord;
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