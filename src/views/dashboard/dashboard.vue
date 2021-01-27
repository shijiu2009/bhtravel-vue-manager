<template>
  <div style="height:100%;" class="home-ex">
    <el-row :gutter="20" style="height:100%;min-width:1040px;">
      <el-col :span="6"  style="height:100%;">
        <!-- 左侧卡片 -->
        <el-card shadow="hover" class="mgb20" style="max-width:400px;min-width:250px;min-height:780px;height:100%">
          <div class="user-info" >
            <div class="user-avator">
            <img :src="userimage" class="user-image" alt />
            </div>
            <div class="user-info-cont">
              <div class="user-info-name">{{store.state.userInfo.username}}</div>
              <div class="user-root">{{store.state.userInfo.rolename}}</div>
            </div>

          </div>
          <div class="ipbox">
            <div class="txtip-box">
              <div class="ipcont ipleft">
                <div>上次登录时间</div>
                <div class="ipcolor">{{store.state.userInfo.lastLoginTime.slice(0,10)}}</div>
                </div>
              <div class="ipcont">
                <div>登录IP</div>
                <div class="ipcolor">{{store.state.userInfo.ip}}</div>
              </div>
            </div>
          </div>

          <div class="lebo-box">
            <div class="lebo-icon">
              <div class="lebo-img"><img src="../../assets/images/home1.png" alt=""></div>
              <div class="lebo-txt">订单</div>
            </div>
            <div class="lebo-icon">
              <div class="lebo-img"><img src="../../assets/images/home2.png" alt=""></div>
              <div class="lebo-txt">投诉</div>
            </div>
            <div class="lebo-icon">
              <div class="lebo-img"><img src="../../assets/images/home3.png" alt=""></div>
              <div class="lebo-txt">咨询</div>
            </div>
            <div class="lebo-icon">
              <div class="lebo-img"><img src="../../assets/images/home4.png" alt=""></div>
              <div class="lebo-txt">评论</div>
            </div>
          </div>

        </el-card>
        <!-- <el-card shadow="hover" style="height:252px;">
          <div slot="header" class="clearfix">
            <span>语言详情</span>
          </div>Vue
          <el-progress :percentage="71.3" color="#42b983"></el-progress>JavaScript
          <el-progress :percentage="24.1" color="#f1e05a"></el-progress>CSS
          <el-progress :percentage="3.7"></el-progress>HTML
          <el-progress :percentage="0.9" color="#f56c6c"></el-progress>
        </el-card> -->
      </el-col>
      <!-- 右侧 -->
      <el-col :span="18" style="min-height:780px;height:100%;">
         <el-row :gutter="20" class="mgb20"> 
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '20px'}">
              <div class="grid-content grid-con-1">
                <i class="el-icon-lx-people grid-con-icon">
                 <img src="../../assets/images/homer1.png" alt="">
                </i>
                <div class="grid-cont-right">
                  <div class="grid-num-z">1234</div>
                  <div>景区访问量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '20px'}">
              <div class="grid-content grid-con-2">
                <i class="el-icon-lx-notice grid-con-icon">
                   <img src="../../assets/images/homer2.png" alt="">
                </i>
                <div class="grid-cont-right">
                  <div class="grid-num-z">321</div>
                  <div>酒店访问量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '20px'}">
              <div class="grid-content grid-con-3">
                <i class="el-icon-lx-goods grid-con-icon">
                   <img src="../../assets/images/homer3.png" alt="">
                </i>
                <div class="grid-cont-right">
                  <div class="grid-num-z">5000</div>
                  <div>线路访问量</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row > 

        <el-card shadow="hover" style="height: calc(100% - 160px)">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="tableData[0].num ? '景区(' + tableData[0].num  + ')': '景区'" name="first"></el-tab-pane>
            <el-tab-pane :label="tableData[1].num ? '酒店 (' + tableData[1].num + ')' : '酒店'" name="second"></el-tab-pane>
            <el-tab-pane :label="tableData[2].num ? '民宿 ('+ tableData[2].num  + ')' : '民宿'" name="third"></el-tab-pane>
            <el-tab-pane :label="tableData[3].num ? '乡村旅游 (' + tableData[3].num  + ')' : '乡村旅游'" name="fourth"></el-tab-pane>
            <el-tab-pane :label="tableData[4].num ? '路线 (' + tableData[4].num  + ')' : '路线'" name="five"></el-tab-pane>
          </el-tabs>
             <el-table    

            :data="tableData"
            style="width: 100%">
            <el-table-column
              label="产品"
              >
              <template slot-scope="scope">
                <i class="el-icon-info" style="color:#2983B7;"></i>
                <span style="margin-left: 10px">{{ scope.row.date }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="订单号"
              >
              <template slot-scope="scope">
                <span>{{scope.row.address}}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量">
              <template slot-scope="">
                <span>×1</span>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <span>{{scope.row.static}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <!-- <el-card shadow="hover" style="height:403px;">
          <div slot="header" class="clearfix">
            <span>待办事项</span>
            <el-button style="float: right; padding: 3px 0" type="text">添加</el-button>
          </div>
          <el-table :data="todoList" :show-header="false" style="width: 100%;font-size:14px;">
            <el-table-column width="40">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.status"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <div
                  class="todo-item"
                  :class="{'todo-item-del': scope.row.status}"
                >{{scope.row.title}}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-card> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import store from '@/store/modules/user.js'

export default {
  name: "dashboard",
  data() {
    return {
      store:store,
      userimage: 'https://travel.gxucreate.com/travelbh' + store.state.userInfo.avatar,//用户头像
      activeName: 'first',//默认选择项
        tableData: [{ //表格
          date: '酒店名称',
          name: '王小虎',
          address: '1234',
          static:'未处理',
          num:0,
        }, {
          date: '酒店名称',
          name: '王小虎',
          address: '123455',
          static:'未处理',
          num:3,
        }, {
          date: '酒店名称',
          name: '王小虎',
          address: '222222',
          static:'未处理',
          num:1,
        }, {
          date: '酒店名称',
          name: '王小虎',
          address: '44444',
          static:'未处理',
          num:null,
        }, {
          date: '酒店名称',
          name: '王小虎',
          address: '44444',
          static:'未处理',
          num:5,
        }],
      //  localStorage.getItem("token")
      name:"我的光",
      todoList: [
        {
          title: "今天要修复100个bug",
          status: false
        },
        {
          title: "今天要修复100个bug",
          status: false
        },
        {
          title: "今天要写100行代码加几个bug吧",
          status: false
        },
        {
          title: "今天要修复100个bug",
          status: false
        },
        {
          title: "今天要修复100个bug",
          status: true
        },
        {
          title: "今天要写100行代码加几个bug吧",
          status: true
        }
      ],
      data: [
        {
          name: "2018/09/04",
          value: 1083
        },
        {
          name: "2018/09/05",
          value: 941
        },
        {
          name: "2018/09/06",
          value: 1139
        },
        {
          name: "2018/09/07",
          value: 816
        },
        {
          name: "2018/09/08",
          value: 327
        },
        {
          name: "2018/09/09",
          value: 228
        },
        {
          name: "2018/09/10",
          value: 1065
        }
      ],
      options: {
        title: "最近七天每天的用户访问量",
        showValue: false,
        fillColor: "rgb(45, 140, 240)",
        bottomPadding: 30,
        topPadding: 30
      },
      options2: {
        title: "最近七天用户访问趋势",
        fillColor: "#FC6FA1",
        axisColor: "#008ACD",
        contentColor: "#EEEEEE",
        bgColor: "#F5F8FD",
        bottomPadding: 30,
        topPadding: 30
      }
    };
  },
  components: {
    // Schart
  },
  computed: {
    role() {
      return this.name === "admin" ? "超级管理员" : "普通用户";
    }
  },
  created() {
    this.handleListener();
    this.changeDate();
  },
  activated() {
    this.handleListener();
  },
  deactivated() {
    
  },
  methods: {
    //选择栏
    handleClick(tab, event) {
        console.log(tab, event);
            console.log(this.store.state.userInfo);
            console.log(this.userimage);

    },
    //表格
    handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
    changeDate() {
      const now = new Date().getTime();
      this.data.forEach((item, index) => {
        const date = new Date(now - (6 - index) * 86400000);
        item.name = `${date.getFullYear()}/${date.getMonth() +
          1}/${date.getDate()}`;
      });
    },
    handleListener() {

    },
    renderChart() {

    }
  }
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
.home-ex >>> .has-gutter tr th{
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
  background: linear-gradient(180deg, #85E6F5, #3AC7E5);  
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  box-shadow: 8px 14px 24px 0px rgba(114, 129, 219, 0.32);
  background: linear-gradient(180deg,  #A4B2F5,#6776D5);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  box-shadow: 8px 14px 24px 0px rgba(244, 186, 93, 0.32);
  background: linear-gradient(180deg,  #FAE590,#EEB230);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction:column;
  padding-bottom: 20px;
  margin-bottom: 20px;
  height: 240px;
}

.user-avator {
  margin:10px 0;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #E7F7FF;
  padding: 10px;
  overflow: hidden;
}
.user-image{
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 50%;
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
.user-root{
  width: 88px;
  height: 30px;
  background: linear-gradient(153deg, #40C6F9, #1AA2DC);
  box-shadow: 0px 0px 66px 0px rgba(66, 139, 201, 0.24);
  border-radius: 14px;
  text-align: center;
  line-height: 30px;
  color: #fff;
  margin-top:10px
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
.ipbox{
  /* background: rgb(236, 199, 199); */
  height: 90px;
  margin-bottom:20px;
  border-bottom: 1px solid #ccc;
  
}
.txtip-box{
  /* background: red; */
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ipleft{
  border-right: 1px solid #E6E6E6;
}
.ipcont{
  width: 150px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction:column;
  font-size: 14px;
  font-family: SourceHanSansCN;
  font-weight: 400;
  color: #808080;
}
.ipcolor{
  color:rgb(85, 77, 77);  font-weight: 900;
}
.lebo-box{
  margin-top:40px;
  height: 332px;
  width: 100%;
  display: flex;
  justify-content:center;
  flex-wrap: wrap;
}
.lebo-icon{
  margin: 10px;
  width: 40%;
  /* height: 154px; */
  background: linear-gradient(180deg, #F3FCFF, #E4F6FF);
  border-radius: 20px;
  font-size: 30px;
  font-family: SourceHanSansCN;
  font-weight: 400;
  color: #2983B7;
  
  /* padding: 25px; */
}
.lebo-img{
  margin: 27px ;
  width: 35px;
  height: 38px;
  overflow: hidden;
}
.lebo-img img{
  width: 100%;
}
.lebo-txt{
  margin-left: 20px;
}
.grid-num-z{
  margin-left: -4px;
  font-size: 40px;
  font-family: SourceHanSansCN;
  font-weight: bold;
  color: #000;
}


</style>
