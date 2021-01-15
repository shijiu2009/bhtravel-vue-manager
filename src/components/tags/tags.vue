<template>
  <div class="tags" ref="tags" v-if="showTags">
    <ul>
      <li class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item)}" :key="index">
        <el-tooltip class="item" effect="light" :content="dropdownTitle([item.meta.parentName,item.meta.title])"
          placement="bottom">
          <router-link :to="item.path" class="tags-li-title">{{item.meta.title}}</router-link>
        </el-tooltip>

        <span class="tags-li-icon" @click="closeTags(index)">
          <i class="el-icon-close"></i>
        </span>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      elHeight: 0,
    };
  },
  listData: function () {
    this.$nextTick(function () {
      //some code
      console.log("ok");
    });
  },
  methods: {
    ...mapMutations({
      setTagsList: "SET_TAGSLIST",
      clearTagsList: "CLEAR_TAGSLIST",
      deleteTags: "DELETE_TAGSLIST",
    }),
    isActive(item) {
      return item.index === this.$route.fullPath;
    },
    // 关闭单个标签
    closeTags(index) {
      //删除仓库中tags对应的属性
      const delItem = this.tagsList[index]; //获取对应的tag
      this.deleteTags(this.tagsList[index].path); //删除对应的tag
      //   获取删除tag的下一个tag属性,如果删除的是最后一个，则获取上一个tag属性
      const item = this.tagsList[index]
        ? this.tagsList[index]
        : this.tagsList[index - 1];
      // 判断是否为空
      if (item) {
        //页面内容跳转到下一个tab页面
        if (delItem.path === this.$route.fullPath) {
          this.$router.push(item.path);
        }
      } else {
        this.$router.push("/");
      }
    },
    // 设置标签
    handleTags: function (command) {
      command === "other" ? this.closeOther() : this.closeAll();
    },
    //dropdown提示内容设置
    dropdownTitle: function (command) {
      let str = "";
      // 进行字符串拼接
      command.forEach((item) => {
        if (item) {
          str += item + " / ";
        }
      });
      str;
      return str.substr(0, str.length - 3); //返回截取的字符串
    },
    updateTableHeight(height) {
      this.elHeight = height;
      let handle = document.querySelector(".handle-box");
      let table = document.querySelector(".adjustTable");
      if (!handle || !table) {
        return;
      }
      let mHeight = parseInt(handle.offsetHeight) + parseInt(height) + 119;
      table.style.maxHeight = window.innerHeight - mHeight + "px";
      let tableWrapper = document.querySelector(
        ".adjustTable .el-table__body-wrapper"
      );
      let tableRight = document.querySelector(
        ".adjustTable .el-table__fixed-body-wrapper"
      );
      if (tableRight) {
        tableRight.style.maxHeight = window.innerHeight - mHeight -104  + "px";
      }
      if (tableWrapper) {
        tableWrapper.style.maxHeight = window.innerHeight - mHeight - 104 + "px";
      }
      this.$tableHeight = window.innerHeight - mHeight;
    },
  },
  computed: {
    ...mapState({
      tagsList: "tagsList",
    }),
    //用于判断是否因此tabs标签栏
    showTags() {
      return this.tagsList.length > 0;
    },
  },
  mounted() {
    // let element = this.$refs.tags;
    // //监视对DOM树所做更改的能力
    // let MutationObserver =
    //   window.MutationObserver ||
    //   window.WebKitMutationObserver ||
    //   window.MozMutationObserver;
    // // 配置MutationObserver在DOM更改匹配给定选项时，通过其回调函数开始接收通知。
    // let observer = new MutationObserver(() => {
    //   let height = element.offsetHeight;
    //   if (this.elHeight != height) {
    //     this.updateTableHeight(height);
    //   }
    // });
    // // 观察器的配置（需要观察什么变动）
    // observer.observe(element, {
    //   attributes: true,
    //   childList: true,
    //   subtree: true,
    // });
  },
};
</script>


<style>
.tags {
  position: relative;
  overflow: hidden;
  /* background: #fff; */
  padding: 5px 10px 0px 10px;
  border-bottom: 1px solid #e5e5e5;
  /* box-shadow: 0 5px 10px #ddd; */
}

.tags ul {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.tags-li {
  float: left;
  margin: 3px 5px 0px 3px;
  border-radius: 3px;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 23px;
  line-height: 23px;
  border: 1px solid #e9eaec;
  margin-bottom: -1px;
  background: #fff;
  padding: 0 5px 0 12px;
  vertical-align: middle;
  color: #666;
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
}

.tags-li:not(.active):hover {
  background: #f8f8f8;
}

.tags-li.active {
  color: #fff;
}

.tags-li-title {
  float: left;
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
  color: #666;
}

.tags-close-box {
  position: absolute;
  right: 12px;
  top: 5px;
  box-sizing: border-box;
  padding-top: 1px;
  text-align: center;
  width: 110px;
  height: 30px;
  /* background: #fff; */
  /* box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1); */
  z-index: 10;
}
.el-icon-close {
  color: #606266;
}
.active {
  background: #d4d4d4;
  color: #eeeeeebd;
}
</style>
