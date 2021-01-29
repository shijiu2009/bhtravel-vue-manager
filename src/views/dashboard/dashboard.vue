<template>
  <div style="height: 100%" class="home-ex">
    <el-row :gutter="20" style="height: 100%; min-width: 1050px">
      <el-col :span="6" style="height: 100%">
        <!-- 左侧卡片 -->
        <div class="mgb20top">
          <div class="l-c-t">
            <div class="user-info">
              <div class="user-avator">
                <img :src="userimage" class="user-image" alt />
                <div class="pulse"></div>
                <div class="pulse2"></div>
              </div>
              <div class="user-info-cont">
                <div class="user-info-name">
                  {{ store.state.userInfo.username }}
                </div>
                <div class="user-root">{{ store.state.userInfo.rolename }}</div>
              </div>
            </div>
            <div class="ipbox">
              <div class="txtip-box">
                <div class="ipcont ipleft">
                  <div>上次登录时间</div>
                  <div class="ipcolor">
                    {{ store.state.userInfo.lastLoginTime.slice(0, 10) }}
                  </div>
                </div>
                <div class="ipcont">
                  <div>登录IP</div>
                  <div class="ipcolor">{{ store.state.userInfo.ip }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="l-c-b">
            <div class="lebo-box">
              <div class="lebo-icon">
                <div class="lebo-img">
                  <img src="../../assets/images/home1.png" alt="" />
                </div>
                <div class="lebo-txt">订单</div>
              </div>
              <div class="lebo-icon">
                <div class="lebo-img">
                  <img src="../../assets/images/home2.png" alt="" />
                </div>
                <div class="lebo-txt">投诉</div>
              </div>
              <div class="lebo-icon">
                <div class="lebo-img">
                  <img src="../../assets/images/home3.png" alt="" />
                </div>
                <div class="lebo-txt">咨询</div>
              </div>
              <div class="lebo-icon">
                <div class="lebo-img">
                  <img src="../../assets/images/home4.png" alt="" />
                </div>
                <div class="lebo-txt">评论</div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <!-- 右侧 -->
      <el-col :span="18" style="height: 100%; min-height: 430px">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '20px' }">
              <div class="grid-content grid-con-1">
                <i class="el-icon-lx-people grid-con-icon">
                  <img src="../../assets/images/homer1.png" alt="" />
                </i>
                <div class="grid-cont-right">
                  <div class="grid-num-z">
                    {{ topnumData.attractionsViews || "N" }}
                  </div>
                  <div>景区访问量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '20px' }">
              <div class="grid-content grid-con-2">
                <i class="el-icon-lx-notice grid-con-icon">
                  <img src="../../assets/images/homer2.png" alt="" />
                </i>
                <div class="grid-cont-right">
                  <div class="grid-num-z">
                    {{ topnumData.hotelViews || "N" }}
                  </div>
                  <div>酒店访问量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '20px' }">
              <div class="grid-content grid-con-3">
                <i class="el-icon-lx-goods grid-con-icon">
                  <img src="../../assets/images/homer3.png" alt="" />
                </i>
                <div class="grid-cont-right">
                  <div class="grid-num-z">
                    {{ topnumData.peripheryTravelViews || "N" }}
                  </div>
                  <div>线路访问量</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-card shadow="hover" style="height: calc(100% - 160px)">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane
              :label="`景区 ${
                topnumData.ticketOrderCounts
                  ? '(' + topnumData.ticketOrderCounts + ')'
                  : ''
              }`"
              name="first"
            ></el-tab-pane>
            <el-tab-pane
              :label="`酒店 ${
                topnumData.hotelOrderCounts
                  ? ' (' + topnumData.hotelOrderCounts + ')'
                  : ''
              }`"
              name="second"
            ></el-tab-pane>
            <el-tab-pane
              :label="`民宿 ${
                topnumData.homestayOrderCounts
                  ? ' (' + topnumData.homestayOrderCounts + ')'
                  : ''
              }`"
              name="third"
            ></el-tab-pane>
            <el-tab-pane
              :label="`乡村旅游 ${
                topnumData.peripheryTravelViews
                  ? ' (' + topnumData.peripheryTravelViews + ')'
                  : ''
              }`"
              name="fourth"
            ></el-tab-pane>
            <el-tab-pane
              :label="`路线 ${
                topnumData.peripheryTravelOrderCounts
                  ? ' (' + topnumData.peripheryTravelOrderCounts + ')'
                  : ''
              }`"
              name="five"
            ></el-tab-pane>
            <!-- <el-tab-pane label="景区" name="first"></el-tab-pane>
            <el-tab-pane label="酒店" name="second"></el-tab-pane>
            <el-tab-pane label="民宿" name="third"></el-tab-pane>
            <el-tab-pane label="乡村旅游" name="fourth"></el-tab-pane>
            <el-tab-pane label="路线" name="five"></el-tab-pane> -->
          </el-tabs>
          <el-table
            :data="tableData"
            v-loading="loading"
            max-height="570"
            style="width: 100%"
          >
            <el-table-column label="产品" header-align="" width="280">
              <template slot-scope="scope">
                <i class="el-icon-info" style="color: #2983b7"></i>
                <span style="margin-left: 10px">{{
                  scope.row.attrName ||
                  scope.row.ctName ||
                  scope.row.hotelName ||
                  scope.row.title
                }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="tabNameArr[tabIndex]">
              <template slot-scope="scope">
                <span v-if="tabIndex == 0 || tabIndex == 3"
                  ><span v-for="(item, index) in scope.row.items" :key="index">
                    {{
                      index > 0
                        ? "、" + item.ticketName
                          ? item.ticketName
                          : item.projectName
                        : item.ticketName
                        ? item.ticketName
                        : item.projectName
                    }}
                  </span></span
                >
                <span v-if="tabIndex == 1 || tabIndex == 2">{{
                  scope.row.roomName
                }}</span>
                <span v-if="tabIndex == 4"
                  ><span
                    v-for="(item, index) in scope.row.subOrders"
                    :key="index"
                    >{{
                      index > 0 ? "、" + item.psubTitle : item.psubTitle
                    }}</span
                  ></span
                >
              </template>
            </el-table-column>

            <el-table-column label="订单号">
              <template slot-scope="scope">
                <span>{{ scope.row.orderNo }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量">
              <template slot-scope="scope">
                <span
                  >×{{
                    scope.row.totalQuantity ||
                    scope.row.roomCount ||
                    scope.row.quantity ||
                    "?"
                  }}</span
                >
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <span style="color: red">{{
                  scope.row.status == 3 ? "未处理" : "未知"
                }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import store from "@/store/modules/user.js";
import api from "@/api/api.js";

export default {
  name: "dashboard",
  data() {
    return {
      loading: true,
      store: store,
      tabIndex: 0, //表格index
      tabNameArr: ["门票", "房型", "房型", "门票", "价格"], //第二列的表头名称
      userimage:
        "https://travel.gxucreate.com/travelbh" + store.state.userInfo.avatar, //用户头像
      activeName: "first", //默认选择项
      topnumData: "", //访问量数据
      urlarr: [
        "ticketOrderList",
        "hotelOrderList",
        "homestayOrderList",
        "coutryProjectOrderList",
        "peripheryTravelOrderList",
      ],
      tableData: [],
      //  localStorage.getItem("token")
      todoList: [],
      data: [],
      options: {
        title: "最近七天每天的用户访问量",
        showValue: false,
        fillColor: "rgb(45, 140, 240)",
        bottomPadding: 30,
        topPadding: 30,
      },
      options2: {
        title: "最近七天用户访问趋势",
        fillColor: "#FC6FA1",
        axisColor: "#008ACD",
        contentColor: "#EEEEEE",
        bgColor: "#F5F8FD",
        bottomPadding: 30,
        topPadding: 30,
      },
    };
  },
  components: {
    // Schart
  },
  computed: {
    // role() {
    //   return this.name === "admin" ? "超级管理员" : "普通用户";
    // }
  },
  created() {
    this.handleListener();
    this.changeDate();
    this.getdata(this.urlarr[0]); //表格数据请求
    this.getnum();
  },
  activated() {
    this.handleListener();
  },
  deactivated() {},
  methods: {
    //请求访问量
    getnum() {
      api
        .post("/api/travel/index/getViews")
        .then((result) => {
          // console.log(result);
          this.topnumData = result;
        })
        .catch(() => {
          console.log("请求失败");
        });
    },
    //请求表格
    getdata(url) {
      this.loading = true;
      api
        .post("/api/travel/index/" + url)
        .then((result) => {
          this.loading = false; //关掉加载动画
          console.log(result);
          this.tableData = result.list;
          // console.log(this.tableData);
        })
        .catch(() => {
          // this.loading = false; //关掉加载动画
          console.log("请求失败");
        });
    },
    //选择栏
    handleClick(tab) {
      // console.log(tab.index);
      if (this.tabIndex == tab.index) {
        return;
      }
      this.tabIndex = tab.index;
      this.getdata(this.urlarr[tab.index]);
    },
    changeDate() {
      const now = new Date().getTime();
      this.data.forEach((item, index) => {
        const date = new Date(now - (6 - index) * 86400000);
        item.name = `${date.getFullYear()}/${
          date.getMonth() + 1
        }/${date.getDate()}`;
      });
    },
    handleListener() {},
    renderChart() {},
  },
};
</script>


<style scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}
.home-ex >>> .has-gutter tr th {
  border-bottom: 1px solid #ccc;
}

.grid-cont-right {
  flex: 1;
  /* text-align: center; */
  font-size: 14px;
  color: #999;
  margin-left: 30px;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.grid-con-1 .grid-con-icon {
  box-shadow: 8px 14px 24px 0px rgba(71, 204, 232, 0.32);
  background: linear-gradient(180deg, #85e6f5, #3ac7e5);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  box-shadow: 8px 14px 24px 0px rgba(114, 129, 219, 0.32);
  background: linear-gradient(180deg, #a4b2f5, #6776d5);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  box-shadow: 8px 14px 24px 0px rgba(244, 186, 93, 0.32);
  background: linear-gradient(180deg, #fae590, #eeb230);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  /* padding-bottom: 20px;
  margin-bottom: 20px; */
  height: 75%;
}

.user-avator {
  /* margin: 10px 0; */
  width: 130px;
  height: 130px;
  /* border-radius: 50%; */
  /* background: #e7f7ff; */
  padding: 10px;
  overflow: hidden;
  /* background: red; */
  display: flex;
  align-content: center;
  justify-content: center;
  position: relative;
}
.user-image {
  margin-top: 5px;
  width: 120px;
  height: 120px;
  overflow: hidden;
  border-radius: 50%;
  z-index: 2;
  background: #c7c7c7;
}
/* .user-info-name{
  background: red;
} */
.user-info-cont {
  /* padding-left: 50px; */
  flex: 1;
  font-size: 14px;
  color: #999;
}

/* 保持大小不变的小圆圈  */
/* 产生动画（向外扩散变大）的圆圈  */
.pulse {
  position: absolute;
  width: 120px;
  height: 120px;
  left: 3px;
  top: 3px;
  border: 12px solid red;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  z-index: 1;
  opacity: 0;
  -webkit-animation: warn 3s ease-out;
  -moz-animation: warn 3s ease-out;
  animation: warn 3s ease-out;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
}
.pulse2 {
  position: absolute;
  width: 120px;
  height: 120px;
  left: 3px;
  top: 3px;
  border: 12px solid #e7f7ff;
  background: #e7f7ff;
  border-radius: 50%;
}
@keyframes warn {
  /* 0% {
    transform: scale(0);
    opacity: 0;
  }
  25% {
    transform: scale(0);
    opacity: 0.1;
  }
  50% {
    transform: scale(0.1);
    opacity: 0.3;
  }
  75% {
    transform: scale(0.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  } */
  0% {
    transform: scale(0);
    opacity: 0;
  }
  25% {
    transform: scale(0);
    opacity: 0.1;
  }
  50% {
    transform: scale(0.1);
    opacity: 0.3;
  }
  75% {
    transform: scale(0.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.user-root {
  width: 88px;
  height: 30px;
  background: linear-gradient(153deg, #40c6f9, #1aa2dc);
  box-shadow: 0px 0px 66px 0px rgba(66, 139, 201, 0.24);
  border-radius: 14px;
  text-align: center;
  line-height: 30px;
  color: #fff;
  margin-top: 10px;
}
.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
  text-align: center;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}
.mgb20top {
  margin-bottom: 20px;
  max-width: 480px;
  min-width: 250px;
  /* height: 100%; */
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 5px;
  min-height: 430px;

  height: calc(100% + 2px);
}
.l-c-t {
  flex: 2;
  /* height: 100%;
  width: 100%; */
  /* background: #1aa2dc; */
  /* padding-top: 10px; */
}
.l-c-b {
  flex: 3;
  /* background: pink; */
  display: flex;
  align-items: center;
  justify-content: center;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
.ipbox {
  /* background: rgb(236, 199, 199); */
  height: 90px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
}
.txtip-box {
  /* background: red; */
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ipleft {
  border-right: 1px solid #e6e6e6;
}
.ipcont {
  width: 150px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  font-size: 14px;
  font-family: SourceHanSansCN;
  font-weight: 400;
  color: #808080;
}
.ipcolor {
  color: rgb(85, 77, 77);
  font-weight: 900;
}
.lebo-box {
  /* margin-top: 60px; */
  height: 332px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  /* background: red; */
}
.lebo-icon {
  margin: 10px;
  width: 40%;
  /* height: 154px; */
  background: linear-gradient(180deg, #f3fcff, #e4f6ff);
  border-radius: 20px;
  font-size: 30px;
  font-family: SourceHanSansCN;
  font-weight: 400;
  color: #2983b7;
  /* padding: 25px; */
}
.lebo-img {
  margin: 27px;
  width: 35px;
  height: 38px;
  overflow: hidden;
}
.lebo-txt {
  margin-left: 20px;
}
@media screen and (max-height: 800px) {
  .lebo-box {
    height: 200px;
    width: 100%;
  }
  .l-c-b {
    flex: 3;
    /* background: red; */
  }
  .lebo-icon {
    margin: 10px;
    width: 40%;
    height: 44%;
    font-size: 18px;
  }
  .lebo-img {
    margin: 10px;
    margin-left: 20px;
  }
}
@media screen and (max-height: 680px) {
  .lebo-box {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: nowrap;
    align-items: center;
  }
  .l-c-b {
    flex: 3;
  }
  .lebo-icon {
    margin: 0 2px;
    margin-top: 14px;
    width: 22%;
    height: 84px;
    border-radius: 20px;
    font-size: 14px;
  }
  .lebo-img {
    margin: 10px;
    margin-left: 12px;
  }
  .lebo-txt {
    margin-left: 10px;
  }
}

.lebo-img img {
  width: 100%;
}

.grid-num-z {
  margin-left: -4px;
  font-size: 40px;
  font-family: SourceHanSansCN;
  font-weight: bold;
  color: #000;
}
</style>
