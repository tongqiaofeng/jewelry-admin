<template>
  <div class="add-check-container" id="addCheck">
    <!-- 新增盘点 -->
    <div class="check-top">
      <el-form label-width="100px">
        <el-form-item label="仓库/加工厂：">
          <!-- multiple -->
          <el-select
            v-model="storageIdList"
            clearable
            placeholder="请选择"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="item in warehouseFactoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div>
        <el-button style="width: 120px;" type="primary" @click="submitCheck"
          >提 交</el-button
        >
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleTabsClick">
      <el-tab-pane
        v-for="item in materialList"
        :key="item.id"
        :label="item.name"
        :name="item.id + ''"
      >
        <el-table
          style="width: 100%;"
          ref="multipleTable"
          :data="materialProductList"
          tooltip-effect="dark"
          border
          highlight-current-row
          row-key="id"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" prop="storageName" label="库存地">
          </el-table-column>
          <el-table-column align="center" prop="materialName" label="材料名称">
          </el-table-column>
          <el-table-column align="center" prop="productNumber" label="统一编号">
          </el-table-column>
          <el-table-column align="center" label="单价">
            <template slot-scope="scope">
              <div>
                <span>{{
                  scope.row.currency != ""
                    ? scope.row.unitPrice + " " + scope.row.currency
                    : "--"
                }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="总价">
            <template slot-scope="scope">
              <div>
                <span>{{
                  scope.row.currency != ""
                    ? formatNumberRgx(scope.row.totalPrice) +
                      " " +
                      scope.row.currency
                    : "--"
                }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="库存数量">
            <template slot-scope="scope">
              <div
                v-if="
                  scope.row.chargeUnit == '粒' ||
                    scope.row.chargeUnit == '件' ||
                    scope.row.chargeUnit == '条'
                "
              >
                <span>{{ scope.row.number + " " + scope.row.chargeUnit }}</span>
              </div>
              <div v-else>
                <span>{{
                  scope.row.currency == ""
                    ? scope.row.weight >= 0
                      ? scope.row.weight + scope.row.chargeUnit
                      : "--"
                    : scope.row.weight + " " + scope.row.chargeUnit
                }}</span
                ><span>{{
                  scope.row.number > 1
                    ? " " + "/" + " " + scope.row.number + "件"
                    : ""
                }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="盘点数量">
            <template slot-scope="scope">
              <div>
                <el-input
                  v-model="scope.row.checkNum"
                  placeholder="请输入"
                ></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            type="selection"
            width="55"
            reserve-selection
          >
          </el-table-column>
        </el-table>
        <div style="margin:15px 0;text-align: right;">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="page"
            layout="total, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="check-top" style="margin-top: 40px;">
      <el-form label-width="117px">
        <el-form-item label="总金额(HKD)：" prop="totalHkPrice" required>
          <el-input
            style="width: 300px"
            v-model="totalHkPrice"
            placeholder="请输入总金额"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import { base_request_url } from "_req/http";
import {
  materialListPort,
  warehouseFactoryPort,
  stockMaterialPort,
} from "_req/api/common";
export default {
  data() {
    return {
      activeName: "",
      materialList: [],
      warehouseFactoryList: [],

      storageIdList: "",
      page: 1,
      total: 0,
      materialProductList: [],

      totalHkPrice: "",
      checkProductList: [],
    };
  },
  created() {
    this.getMaterialList();
    this.getWarehouseFactoryList();
  },
  methods: {
    // 选择盘点产品
    handleSelectionChange(val) {
      console.log("盘点产品", val);
      this.checkProductList = val;
    },
    // 提交盘点
    submitCheck() {
      if (this.checkProductList.length == 0) {
        this.$message.warning("请选择盘点产品");
      } else {
        if (!this.totalHkPrice) {
          this.$message.error("请输入总金额");
        }
      }
    },
    // 产品分类选择
    handleTabsClick() {
      console.log(this.activeName);
      this.page = 1;
      this.warehouseKeywordCheck();
    },
    // 模糊搜索原材料列表
    warehouseKeywordCheck() {
      stockMaterialPort({
        state: 0,
        materialId: this.activeName,
        storageIdList: this.storageIdList ? [this.storageIdList] : [],
        page: this.page,
        pageNum: 10,
      }).then((res) => {
        console.log("原材料库存列表查询");
        console.log(res);

        this.total = res.data.data.total;
        this.materialProductList = res.data.data.list;
      });
    },
    // 分页
    handleCurrentChange(val) {
      this.page = val;
      this.warehouseKeywordCheck();

      document.getElementById("addCheck").scrollIntoView();
    },

    // 获取原材料名称列表
    getMaterialList() {
      materialListPort().then((res) => {
        console.log("原材料");
        console.log(res);
        this.materialList = res.data.data;

        this.activeName = this.materialList[0].id + "";
        this.warehouseKeywordCheck();
      });
    },
    // 获取仓库/加工厂列表
    getWarehouseFactoryList() {
      warehouseFactoryPort({
        isOwn: 1,
      }).then((res) => {
        console.log("仓库/加工厂");
        console.log(res);
        this.warehouseFactoryList = res.data.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.add-check-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 6px;

  .check-top {
    display: flex;
    justify-content: space-between;
  }
}
</style>
