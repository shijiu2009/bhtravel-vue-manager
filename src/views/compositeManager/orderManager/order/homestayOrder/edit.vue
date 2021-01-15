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
            <div class="text item" v-if="info.status == 1">订单状态： 未付款</div>
            <div class="text item" v-if="info.status == 2">订单状态： 已付款</div>
            <div class="text item" v-if="info.status == 3">订单状态： 已确认</div>
            <div class="text item" v-if="info.status == 4">订单状态： 已完成</div>
            <div class="text item" v-if="info.status == -1">订单状态： 已取消</div>

            <div class="text item" v-if="info.refund == 0">退款状态： 正常</div>
            <div class="text item" v-if="info.refund == 1">退款状态： 申请中</div>
            <div class="text item" v-if="info.refund == 2">退款状态： 退款中</div>
            <div class="text item" v-if="info.refund == 3">退款状态： 已退款</div>
            <div class="text item" v-if="info.refund == -1">退款状态： 已取消</div>
            <div class="text item">预定人姓名： {{ info.name }}</div>
            <div class="text item">预定人号码： {{ info.mobile }}</div>
            <div class="text item" v-if="info.refund != 0">
              用户退款原因： {{ info.refundReason }}
            </div>
          </el-card>
          <br />
          <div v-if="info.refund == 0 || info.refund == -1">
            <el-form-item v-if="info.status == -1" label="商家备注">
              <el-input v-model="info.remark"></el-input>
            </el-form-item>
            <!-- <el-form-item
              v-if="info.status == 2 || info.status == 3 || info.status == 4"
              label="订单状态"
              style="width: 50%"
            >
              <el-select v-model="info.status" placeholder="请选择">
                <el-option
                  v-for="item in statuses"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item> -->
          </div>
          <el-form-item v-show="refundShow" label="退款状态" style="width: 50%">
            <el-select v-model="info.refund" placeholder="请选择">
              <el-option
                v-for="item in refunds"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="refundShow" label="拒绝退款理由">
            <el-input v-model="info.refundContent"></el-input>
          </el-form-item>
        </div>
        <br />
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
import api from "@/api/reserveManager/homestayOrder.js";
import { mapMutations } from "vuex";
export default {
  components: {},
  name: "editHomestayOrder",
  data() {
    return {
      info: {
        id: "",
        name: "",
        type: "",
      },
      statuses: [
        {
          value: 1,
          label: "未付款",
        },
        {
          value: 2,
          label: "未付款",
        },
        {
          value: 3,
          label: "已确认",
        },
        {
          value: 4,
          label: "已完成",
        },
        {
          value: -1,
          label: "取消或拒绝",
        },
      ],
      refunds: [
        {
          value: 1,
          label: "申请中",
        },
        {
          value: 3,
          label: "已退款",
        },
        {
          value: -1,
          label: "取消退款",
        },
      ],
      refundShow: false,
    };
  },
  methods: {
    ...mapMutations({
      deleteTags: "DELETE_TAGSLIST",
    }),
    //提交表单
    onSubmit: function () {
      this.info.user = [];
      api
        .edit(this.info)
        .then((result) => {
          if (result.success) {
            this.$message.success("提交成功！");
            this.deleteTags(this.$route.fullPath); //关闭当前窗口
            //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
            this.$router.push({
              name: "hotelOrderList",
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
            this.info = result.homestayOrder;
            if (this.info.refund == 1) {
              this.refundShow = true;
            }
            if (this.info.refund == 0 || this.info.refund == -1) {
              if (this.info.status == 2) {
                this.statuses = [
                  {
                    value: 3,
                    label: "确认订单",
                  },
                  {
                    value: -1,
                    label: "取消订单",
                  },
                ];
              }
              if (this.info.status == 3) {
                this.statuses = [
                  {
                    value: 4,
                    label: "完成订单",
                  },
                ];
              }
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
