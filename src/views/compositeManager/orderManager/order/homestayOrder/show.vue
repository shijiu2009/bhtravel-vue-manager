<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="90px">
        <div class="form_item">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>民宿订单信息</span>
            </div>
            <div class="text item">订单号： {{ info.orderNo }}</div>
            <div class="text item">民宿名称： {{ info.hotelName }}</div>
            <div class="text item">
              房间数量： {{ info.roomName }} * {{ info.roomCount }}
            </div>
            <div class="text item">入住时间： {{ info.startDate }}</div>
            <div class="text item">离店时间： {{ info.endDate }}</div>
            <div class="text item">总金额： {{ info.totalPrice }}</div>
            <div class="text item" v-if="info.status == 1">
              订单状态： 未付款
            </div>
            <div class="text item" v-if="info.status == 2">
              订单状态： 已付款
            </div>
            <div class="text item" v-if="info.status == 3">
              订单状态： 已确认
            </div>
            <div class="text item" v-if="info.status == 4">
              订单状态： 已完成
            </div>
            <div class="text item" v-if="info.status == -1">
              订单状态： 已取消
            </div>

            <div class="text item" v-if="info.refund == 0">退款状态： 正常</div>
            <div class="text item" v-if="info.refund == 1">
              退款状态： 申请中
            </div>
            <div class="text item" v-if="info.refund == 2">
              退款状态： 退款中
            </div>
            <div class="text item" v-if="info.refund == 3">
              退款状态： 已退款
            </div>
            <div class="text item" v-if="info.refund == -1">
              退款状态： 已取消
            </div>
            <div class="text item">预定人姓名： {{ info.name }}</div>
            <div class="text item">预定人号码： {{ info.mobile }}</div>
            <div class="text item" v-if="info.refund != 0">
              用户退款原因： {{ info.refundReason }}
            </div>
          </el-card>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import api from "@/api/reserveManager/homestayOrder.js";
import { mapMutations } from "vuex";
export default {
  components: {},
  name: "showHomestayOrder",
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
            this.info = result.homestayOrder;
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
<style scoped>
.box-card .item{
  line-height: 30px;
}
</style>