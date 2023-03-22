<template>
  <div class="add-check-container" id="addCheck">
    <!-- 新增盘点 -->
    <div class="check-top">
      <el-form label-width="82px">
        <el-form-item label="盘点仓库：">
          <el-select v-model="storageId" clearable placeholder="请选择" :popper-append-to-body="false"
            @change="handleTabsClick">
            <el-option v-for="item in warehouseFactoryList" :key="item.id" :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div>
        <el-button style="width: 120px;" type="primary" @click="submitCheck">提 交</el-button>
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleTabsClick">
      <el-tab-pane v-for="item in materialList" :key="item.id" :label="item.name" :name="item.id + ''">
        <el-table style="width: 100%;" ref="multipleCheckTable" :data="materialProductList" tooltip-effect="dark" border
          highlight-current-row row-key="id" @selection-change="handleSelectionChange">
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
              <span>{{ scope.row.number }}</span>

            </template>
          </el-table-column>
          <el-table-column align="center" prop="checkNum" label="盘点数量">
            <template slot-scope="scope">
              <el-input v-model="scope.row.checkNum" @input="numCheckInput(scope.row)"> </el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" type="selection" width="55" reserve-selection>
          </el-table-column>
        </el-table>

        <div style="margin:15px 0;text-align: right;">
          <el-pagination @current-change="handleCurrentChange" :current-page="page" :page-size="5"
            layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
        <div class="check-top" style="margin-top: 40px;">
          <el-form label-width="117px">
            <el-form-item label="总金额(HKD)：" :rules="[
              {
                required: true,
                message: '请输入盘点金额',
                trigger: 'blur',
              },
            ]">
              <el-input style="width: 300px" v-model="item.checkTotalHkMoney" placeholder="请输入总金额" clearable></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import { InventoryCheckOrderSavePort } from '_req/api/check'
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

      storageId: "",
      page: 1,
      total: 0,
      materialProductList: [],

      sortList: [],
    };
  },
  created() {
    this.getMaterialList();
    this.getWarehouseFactoryList();
  },
  methods: {
    // 盘点数量校验
    numCheckInput(item) {
      if (item.checkNum > item.number) {
        this.$message.error({
          message: `${item.productNumber} 的盘点数量不能大于库存数量，请重新填写`
        })
      }
    },
    // 选择盘点产品
    handleSelectionChange(val) {
      console.log("盘点产品", val);
      // 如果当前原材料分类表格内的选中项变为0，则清除盘点产品内该原材料分类数据
      if (val.length === 0) {
        for (const i in this.sortList) {
          if (this.sortList[i].materialId === this.activeName) {
            this.sortList.splice(i, 1)
          }
        }
      } else {
        let list = []
        for (const item of val) {
          list.push({
            checkNum: item.checkNum,
            productNumber: item.productNumber,
            stockId: item.id,
            stockNum: item.chargeUnit === '粒' || item.chargeUnit === '件' || item.chargeUnit === '条' ? item.number : item.weight,
            storageId: item.storageId
          })
        }

        let obj = {
          materialId: this.activeName,
          detailList: list
        }

        if (this.sortList.length === 0) {
          this.sortList.push(obj);
        } else {
          let mateList = this.sortList.map(item => { return item.materialId })
          console.log(mateList);
          if (mateList.includes(this.activeName)) {
            for (const item of this.sortList) {
              if (item.materialId === this.activeName) {
                item.detailList = list
              }
            }
          } else {
            this.sortList.push(obj);
          }
        }
      }

      console.log(this.sortList);
    },
    // 提交盘点
    submitCheck() {
      if (this.sortList.length == 0) {
        this.$message.error("请选择盘点产品");
      } else {
        for (let i = 0; i < this.sortList.length; i++) {
          for (let j = 0; j < this.materialList.length; j++) {
            if (this.sortList[i].materialId == this.materialList[j].id) {
              if (!this.materialList[j].checkTotalHkMoney) {
                this.$message.error(`${this.materialList[j].name}盘点总金额为空，请输入`);
                return
              } else {
                this.sortList[i].checkTotalHkMoney = this.materialList[j].checkTotalHkMoney;
              }
            }
          }
        }

        console.log(this.sortList);

        InventoryCheckOrderSavePort({
          storageId: this.storageId,
          sortList: this.sortList
        }).then(res => {
          console.log('新增盘点', res);
          this.$message.success({
            message: '提交成功'
          })
          this.sortList = [];
          this.$nextTick(() => {
            let list = this.$refs.multipleCheckTable;
            for (const item of list) {
              item.clearSelection();
            }
          })

          this.page = 1;
          this.warehouseKeywordCheck();
        })
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
        storageIdList: this.storageId ? [this.storageId] : [],
        page: this.page,
        pageNum: 5,
      }).then((res) => {
        console.log("原材料库存列表查询");
        console.log(res);

        this.total = res.data.data.total;
        let list = res.data.data.list;
        list.map(item => {
          item.checkNum = '';
          return item
        })
        this.materialProductList = list;
        console.log(this.materialProductList);

        if (this.sortList.length > 0) {
          for (let i = 0; i < this.sortList.length; i++) {
            for (let j = 0; j < this.materialProductList.length; j++) {
              for (let k = 0; k < this.sortList[i].detailList.length; k++) {
                if (this.sortList[i].detailList[k].stockId == this.materialProductList[j].id) {
                  this.materialProductList[j].checkNum = this.sortList[i].detailList[k].checkNum
                }

              }
            }
          }
        }

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
        let list = res.data.data;
        this.materialList = list.map(item => {
          item.checkTotalHkMoney = ''
          return item
        })
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
