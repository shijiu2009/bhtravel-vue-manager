<template>
  <!-- 对话框 -->
  <el-dialog
    title="关联产品"
    :visible.sync="dialogTableProducts"
    class="dialog"
  >
    <el-row :gutter="20" class="products-div">
      <el-col :span="6">
        <div class="products-label">产品名称</div
        ><el-input v-model="productName" placeholder="产品名称"></el-input>
      </el-col>
      <el-col :span="6">
        <div class="products-label">分类</div>
        <el-select v-model="productClass" placeholder="请选择">
          <el-option :key="''" :label="'全部'" :value="''"></el-option>
          <el-option :key="1" :label="'美食'" :value="1"></el-option>
          <el-option :key="2" :label="'特产'" :value="2"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <div class="products-label">是否上架</div>
        <el-select v-model="productDown" placeholder="请选择">
          <el-option :key="1" :label="'是'" :value="1"></el-option>
          <el-option :key="0" :label="'否'" :value="0"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <div style="height: 59px; display: flex; align-items: flex-end">
          <el-button type="primary" @click="searchProducts">搜 索</el-button>
        </div>
      </el-col>
    </el-row>

    <el-table :data="products" ref="productsTable">
      <el-table-column type="selection"> </el-table-column>
      <el-table-column property="name" label="名称" width="200">
        <template slot-scope="scope">
          <!-- <el-input :placeholder="scope.row.name" :disabled="true"></el-input> -->
          <div>{{scope.row.name}}</div>
        </template>
      </el-table-column>
      <el-table-column property="classId" label="所属分类" width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.classId == '1' ? 'success' : 'primary'"
            disable-transitions
            >{{ scope.row.classId == "1" ? "美食" : "特产" }}</el-tag
          >
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
      <el-table-column label="">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="handleDelete(scope.$index, scope.row)"
            >添加</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      small
      layout="prev, pager, next"
      :total="page.totalCount"
      :page-size="page.rows"
      :current-page="page.page"
      @current-change="changePageProducts"
    >
    </el-pagination>
    <div slot="footer" class="dialog-footer">
      <!-- <el-button @click="dialogTableVisible = false">取 消</el-button> -->
      <el-button type="primary" @click="confirmProducts">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import productApi from "@/api/reserveManager/product.js";
export default {
  props: {
    dialogTableProduct: {
      default: false,
    },
  },
  data() {
    return {
      dialogTableProducts: false,
      //对话框选项
      productName: "",
      productClass: "",
      productDown: "",
      selectProducts: [],
      items: [],
      products: [],
      total: 0,
      //分页数据
      page: {
        // 默认显示第几页
        page: 1,
        // 总条数，根据接口获取数据长度(注意：这里不能为空)
        totalCount: 0,
        // 个数选择器（可修改）
        // 默认每页显示的条数（可修改）
        rows: 6,
      },
    };
  },
  created() {
    productApi
      .getAllList(this.page)
      .then((result) => {
        this.loading = false; //关掉加载动画
        this.products = result.rows;
        this.page.totalCount = result.total;
        this.$nextTick(function () {
          this.products.forEach((product, i) => {
            this.selectProducts.forEach((selectProduct, j) => {
              if (
                this.products[i] != null &&
                this.selectProducts[j] != null &&
                this.products[i].id == this.selectProducts[j].id
              ) {
                this.$refs.productsTable.toggleRowSelection(
                  this.products[i],
                  true
                );
              }
            });
          });
        });
      })
      .catch(() => {
        this.loading = false; //关掉加载动画
        this.$message.error("查询出错");
      });
  },
  watch: {
    dialogTableProduct(newvalue) {
      this.dialogTableProducts = newvalue;
    },
    dialogTableProducts(newval) {
      this.$emit("update:dialogTableProduct", newval);
    },
  },
  methods: {
    changePageProducts(index) {
      this.page.page = index;
      productApi
        .getAllList(this.page)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.products = result.rows;
          this.page.totalCount = result.total;
          this.$nextTick(function () {
            this.products.forEach((product, i) => {
              this.selectProducts.forEach((selectProduct, j) => {
                if (
                  this.products[i] != null &&
                  this.selectProducts[j] != null &&
                  this.products[i].id == this.selectProducts[j].id
                ) {
                  this.$refs.productsTable.toggleRowSelection(
                    this.products[i],
                    true
                  );
                }
              });
            });
          });
        })
        .catch(() => {
          this.loading = false; //关掉加载动画
          this.$message.error("查询出错");
        });
    },
    searchProducts: function () {
      this.page.page = 1;
      if (this.productName != null && this.productName != "") {
        this.page["name"] = this.productName;
      } else {
        this.$delete(this.page, "name");
      }
      if (this.productClass != null && this.productClass != "") {
        this.page["classId"] = this.productClass;
      } else {
        this.$delete(this.page, "classId");
      }
      if (this.productDown !== null && this.productDown !== "") {
        console.log(1)
        this.page["down"] = this.productDown;
      } else {
        this.$delete(this.page, "down");
      }
      productApi
        .getAllList(this.page)
        .then((result) => {
          this.loading = false; //关掉加载动画
          this.products = result.rows;
          this.page.totalCount = result.total;
          this.$nextTick(function () {
            this.products.forEach((product, i) => {
              this.selectProducts.forEach((selectProduct, j) => {
                if (
                  this.products[i] != null &&
                  this.selectProducts[j] != null &&
                  this.products[i].id == this.selectProducts[j].id
                ) {
                  this.$refs.productsTable.toggleRowSelection(
                    this.products[i],
                    true
                  );
                }
              });
            });
          });
        })
        .catch(() => {
          this.loading = false; //关掉加载动画
          this.$message.error("查询出错");
        });
    },
    confirmProducts: function () {
      //弹框的显示隐藏
      this.dialogTableProducts = false;

      this.selectProducts.push.apply(
        this.selectProducts,
        this.$refs.productsTable.selection
      );
       this.$nextTick(() => {
        this.$emit("SelectionComplete", this.selectProducts);
      });
    },
    handleDelete(index, item) {
      // console.log(index,item);
      this.dialogTableProducts = false;
      this.selectProducts.push(item);
      this.$nextTick(() => {
        this.$emit("SelectionComplete", this.selectProducts);
      });
    },
  },
};
</script>

<style scoped>
.products-div{
  display: flex;
  align-items: flex-end;
}
.products-label{
  margin-bottom: 10px;
}
</style>