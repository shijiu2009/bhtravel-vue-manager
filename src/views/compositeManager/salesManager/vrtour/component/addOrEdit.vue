<template>
  <div class="info_box">
    <div class="form-box">
      <el-form ref="form" :model="info" label-width="90px">
        <div class="form_item">
          <el-form-item label="名称">
            <el-input v-model="info.title"></el-input>
          </el-form-item>

          <el-form-item label="封面图片">
            <UploadFile
              @uploadValue="titleValue"
              ref="uploadGroupTitle"
              :uploadGroup="uploadGroupTitle"
            ></UploadFile>
          </el-form-item>

          <el-form-item label="关联类型">
            <el-radio-group v-model="info.typeId" @change="showChange">
              <el-radio :label="1">景点</el-radio>
              <el-radio :label="2">农家乐</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="关联景点" v-show="showAttractions">
            <el-tag>{{ showName1 }}</el-tag
            >&nbsp;&nbsp;
            <el-button type="success" @click="addAttractions">添加</el-button>
          </el-form-item>

          <el-form-item label="关联农家乐" v-show="showCountryTravels">
            <el-tag>{{ showName2 }}</el-tag
            >&nbsp;&nbsp;
            <el-button type="success" @click="addCountryTravels">添加</el-button>
          </el-form-item>

          <el-row>
            <el-col :span="3">
              <el-form-item label="视频"></el-form-item>
            </el-col>
            <UploadFileVideo
              @uploadValue="uploadValue"
              :uploadGroup="uploadGroup"
            ></UploadFileVideo>
          </el-row>

          <el-row>
            <el-col :span="3">
              <el-form-item label="全景图"></el-form-item>
            </el-col>
            <UploadFileVideo
              @uploadValue="uploadVR"
              :uploadGroup="uploadGroupVR"
            ></UploadFileVideo>
          </el-row>

          <el-form-item label="是否展示">
            <el-radio-group v-model="info.isShow">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <!-- 对话框 -->
        <el-dialog title="关联景点" :visible.sync="dialogTableAttractions">
          <el-table
            :data="attractions"
            ref="attractionsTable"
            highlight-current-row
            @current-change="handleCurrentChange1"
          >
            <el-table-column property="name" label="名称" width="150">
              <template slot-scope="scope">
                <el-input :placeholder="scope.row.name" :disabled="true"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="isOpen" label="开放预定">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.isOpen == '1' ? 'success' : 'primary'"
                  disable-transitions
                  >{{ scope.row.isOpen == "1" ? "是" : "否" }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column property="hotSearch" label="热门搜索">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.hotSearch == '1' ? 'success' : 'primary'"
                  disable-transitions
                  >{{ scope.row.hotSearch == "1" ? "是" : "否" }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="是否下架">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.down == '1' ? 'success' : 'primary'"
                  disable-transitions
                  >{{ scope.row.down == "1" ? "是" : "否" }}</el-tag
                >
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-pagination small layout="prev, pager, next" :total="total1">
          </el-pagination>
          <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="dialogTableVisible = false">取 消</el-button> -->
            <el-button type="primary" @click="confirmAttractions">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 对话框 -->
        <el-dialog title="关联农家乐" :visible.sync="dialogTableCountryTravels">
          <el-table
            :data="countryTravels"
            ref="countryTravelsTable"
            highlight-current-row
            @current-change="handleCurrentChange2"
          >
            <el-table-column property="name" label="名称" width="150">
              <template slot-scope="scope">
                <el-input :placeholder="scope.row.name" :disabled="true"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="isOpen" label="开放预定">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.isOpen == '1' ? 'success' : 'primary'"
                  disable-transitions
                  >{{ scope.row.isOpen == "1" ? "是" : "否" }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column property="hotSearch" label="热门搜索">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.hotSearch == '1' ? 'success' : 'primary'"
                  disable-transitions
                  >{{ scope.row.hotSearch == "1" ? "是" : "否" }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="是否下架">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.down == '1' ? 'success' : 'primary'"
                  disable-transitions
                  >{{ scope.row.down == "1" ? "是" : "否" }}</el-tag
                >
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-pagination small layout="prev, pager, next" :total="total2">
          </el-pagination>
          <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="dialogTableVisible = false">取 消</el-button> -->
            <el-button type="primary" @click="confirmCountryTravels">确 定</el-button>
          </div>
        </el-dialog>

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
import api from "@/api/travelManager/vrtour.js";
import { mapMutations } from "vuex";
import UploadFileVideo from "@/components/uploadVideo/uploadVideo.vue";
import UploadFile from "@/components/uploadImage/uploadImage.vue";
import baseURL from "@/config/baseUrl.js";
import attractionApi from "@/api/reserveManager/attractions.js";
import countryTravelApi from "@/api/reserveManager/countryTravel.js";
export default {
  components: {
    UploadFile,
    UploadFileVideo,
  },
  name: "addOrEditVrtour",
  data() {
    return {
      info: {
        id: "",
        title: "",
        titleimg: "",
        video: "",
        url: "",
        aid: "",
        cid: "",
        isShow: 0,
        typeId: 1,
      },
      //視頻上传组件信息
      uploadGroup: {
        //文件列表
        fileList: [],
        limitCount: 1,
      },
      uploadGroupVR: {
        //文件列表
        fileList: [],
        limitCount: 1,
      },
      uploadGroupTitle: {
        //文件列表
        fileList: [],
        limitCount: 1,
        autoUpload: true,
      },
      //景点
      attractions: [],
      dialogTableAttractions: false,
      total1: 0,
      currentRowId1: "",
      currentRowName1: "无",
      showName1: "无",
      showAttractions: true,
      //农家乐
      countryTravels: [],
      dialogTableCountryTravels: false,
      total2: 0,
      currentRowId2: "",
      currentRowName2: "无",
      showName2: "无",
      showCountryTravels: false,
    };
  },
  methods: {
    ...mapMutations({
      deleteTags: "DELETE_TAGSLIST",
    }),
    //添加路径
    titleValue: function (data) {
      this.info.titleimg = data.filePath;
    },
    uploadValue: function (data) {
      this.info.video = data.filePath;
    },
    uploadVR: function (data) {
      this.info.url = data.filePath;
    },
    showChange: function () {
      if (this.info.typeId == 1) {
        this.showAttractions = true;
        this.showCountryTravels = false;
        this.info.cid = "";
      } else {
        this.showAttractions = false;
        this.showCountryTravels = true;
        this.info.aid = "";
      }
    },
    //景点
    addAttractions: function () {
      this.dialogTableAttractions = true;
      attractionApi
        .getAllList(this.page)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.attractions = result.rows;
          this.total1 = result.total;
        })
        .catch(() => {
          this.loading = false; //关掉加载动画
          this.$message.error("查询出错");
        });
    },
    handleCurrentChange1(val) {
      this.currentRowId1 = val.id;
      this.currentRowName1 = val.name;
    },
    confirmAttractions: function () {
      this.dialogTableAttractions = false;
      this.info.aid = this.currentRowId1;
      this.showName1 = this.currentRowName1;
    },
    //农家乐
    addCountryTravels: function () {
      this.dialogTableCountryTravels = true;
      countryTravelApi
        .getAllList(this.page)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.countryTravels = result.rows;
          this.total2 = result.total;
        })
        .catch(() => {
          this.loading = false; //关掉加载动画
          this.$message.error("查询出错");
        });
    },
    handleCurrentChange2(val) {
      this.currentRowId2 = val.id;
      this.currentRowName2 = val.name;
    },
    confirmCountryTravels: function () {
      this.dialogTableCountryTravels = false;
      this.info.cid = this.currentRowId2;
      this.showName2 = this.currentRowName2;
    },
    //提交表单
    onSubmit: function () {
      api
        .addOrEdit(this.info)
        .then((result) => {
          if (result.success) {
            this.$message.success("提交成功！");
            this.deleteTags(this.$route.fullPath); //关闭当前窗口
            //跳转到列表页面，返回flow:true ，刷新界面，不返回则不刷新界面
            this.$router.push({
              name: "vrtourList",
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
            this.uploadGroupTitle.fileList = [];
            this.info = result.vrtour;
            let file = result.vrtour.url;
            let fileName = file.substring(file.lastIndexOf("/") + 1);
            this.uploadGroupVR.fileList = [
              {
                name: fileName,
                url: result.vrtour.url,
              },
            ];
            let file2 = result.vrtour.video;
            let fileName2 = file2.substring(file2.lastIndexOf("/") + 1);
            this.uploadGroup.fileList = [
              {
                name: fileName2,
                url: result.vrtour.video,
              },
            ];
            if (result.vrtour.titleimg != null && result.vrtour.titleimg != "") {
              this.uploadGroupTitle.fileList.push({
                url: baseURL.releaseUrl + result.vrtour.titleimg,
              });
            }
            if (
              result.vrtour.objName != null &&
              result.vrtour.objName != "" &&
              result.vrtour.typeId == 1
            ) {
              this.showName1 = result.vrtour.objName;
            }
            if (
              result.vrtour.objName != null &&
              result.vrtour.objName != "" &&
              result.vrtour.typeId == 2
            ) {
              this.showName2 = result.vrtour.objName;
            }
            if (result.vrtour.typeId == 1) {
              this.showAttractions = true;
              this.showCountryTravels = false;
            } else {
              this.showAttractions = false;
              this.showCountryTravels = true;
            }
          })
          .catch(() => {
            this.$message.error("数据获取失败");
          });
      } else {
        //重置参数
        Object.keys(this.info).map((key) => (this.info[key] = ""));
        this.info = {
          id: "",
          title: "",
          titleimg: "",
          video: "",
          url: "",
          aid: "",
          cid: "",
          isShow: 0,
          typeId: 1,
        };
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
