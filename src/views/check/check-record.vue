<template>
  <div class="purchase-record">
    <!-- <h1>盘点记录</h1> -->
    <el-form :inline="true" style="text-align: left;">
      <!-- <el-form-item label="材料名称：">
        <el-select v-model="materialId" placeholder="请选择" style="width: 150px;" :popper-append-to-body="false">
          <el-option v-for="material in materialList" :key="material.id" :label="material.name"
            :value="material.id"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="盘点仓库：">
        <el-select v-model="storageId" clearable placeholder="可多选" style="width: 150px;" :popper-append-to-body="false">
          <el-option v-for="item in warehouseFilterList" v-show="item.isOwn == 1" :key="item.id" :label="item.name"
            :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="盘点时间：">
        <el-date-picker v-model="checkTime" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button style="margin-left: 10px;" type="primary" @click="handleCurrentChange(1)">查 询</el-button>
      </el-form-item>
    </el-form>

    <div
      style="width: 100%;padding: 20px 0;margin-top: 20px;text-align: center;background-color: #fff;border-radius: 6px;"
      v-if="checkDataList.length == 0">
      暂无数据
    </div>
    <div v-else style="margin-top: 20px">
      <div v-for="(item, index) in checkDataList" :key="index"
        style="margin-bottom: 40px;background-color: #fff;border-radius: 6px;">
        <div class="bill-container">
          <div class="container-top-left">
            <div style="font-size: 16px; color: #000">
              盘点仓库：<span style="font-size: 14px; color: #666">{{
                item.storageName ? item.storageName : '--'
              }}</span>
            </div>
            <div style="margin-left: 20px;font-size: 16px; color: #000;">
              盘点总数量：<span style="font-size: 14px; color: #666">{{
                item.allCheckNum
              }}</span>
            </div>
            <div style="margin-left: 20px;font-size: 16px; color: #000">
              盘点总金额：<span style="font-size: 14px; color: #666">{{
                formatNumberRgx(item.allCheckTotalHkMoney) + ' HKD'
              }}</span>
            </div>
          </div>
          <div>
            <el-button type="danger" size="small" @click.prevent="inventoryDelete(item)">删除记录</el-button>
          </div>
        </div>
        <el-table ref="multipleTableSel" :data="item.sortList" tooltip-effect="dark" border highlight-current-row>
          <el-table-column align="center" prop="materialName" label="材料名称">
          </el-table-column>
          <el-table-column align="center" label="盘点时库存数量">
            <template slot-scope="scope">
              {{ scope.row.stockNum }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="当前库存数量">
            <template slot-scope="scope">
              {{ scope.row.currentStockNum }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="checkNum" label="盘点数量">
          </el-table-column>

          <el-table-column align="center" label="盘点金额">
            <template slot-scope="scope">
              <div>
                <span>{{
                  formatNumberRgx(scope.row.checkTotalHkMoney) +
                  " HKD"
                }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div style="width: 100%;height: 50px;">
        <div style="margin:15px 0;position:absolute;right:6%;">
          <el-pagination @current-change="handleCurrentChange" :current-page="page"
            layout="total, prev, pager, next, jumper" :page-size="5" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>


    <el-dialog title="删除盘点记录" :visible.sync="dialogDeleteCheckVisible" :close-on-press-escape="false"
      :close-on-click-modal="false" :modal-append-to-body="false" :append-to-body="false" id="delInven">
      <div style="text-align: center;">
        <p style="margin: 30px 0 0 0;font-size: 16px;color: #4e4e4e;">
          确定删除该盘点记录？删除后不可恢复
        </p>
      </div>
      <template #footer>
        <div>
          <el-button size="large" @click="dialogDeleteCheckVisible = false">取 消</el-button>
          <el-button type="primary" size="large" v-preventClick @click="inventoryDeleteSure">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { inventoryCheckOrderListPort, inventoryCheckOrderDelPort } from '_req/api/check'

import {
  materialListPort,
  warehouseFactoryPort,
} from "_req/api/common";

export default {
  data() {
    return {
      checkTime: '',
      materialList: [],
      warehouseFilterList: [],
      page: 1,
      total: 0,
      storageId: null,
      checkDataList: [],

      delBuyId: null,
      dialogDeleteCheckVisible: false,

      deleteId: {},
    };
  },
  created() {
    this.getMaterialList();
    this.getWarehouseFactoryList();
    this.getCheckOrderList();
  },
  methods: {
    // 删除材料
    inventoryDelete(val) {
      console.log(val);
      this.deleteId = val.id;
      this.dialogDeleteCheckVisible = true;
    },
    // 确定
    inventoryDeleteSure() {
      inventoryCheckOrderDelPort({
        id: this.deleteId,
      }).then((res) => {
        console.log("删除盘点");
        console.log(res);
        this.$message.success({
          message: "删除成功",
          showClose: true,
          duration: 2000,
        });
        this.dialogDeleteCheckVisible = false;
        this.page = 1;
        this.getCheckOrderList();
      });

    },

    getRowKeys(row) {
      return row.id;
    },

    // 获取盘点记录列表
    getCheckOrderList() {
      inventoryCheckOrderListPort({
        startTime: this.checkTime ? this.checkTime[0] : '',
        endTime: this.checkTime ? this.checkTime[1] : '',
        page: this.page,
        pageNum: 5,
        storageId: this.storageId,
      })
        .then((res) => {
          console.log("原材料盘点记录", res);
          this.checkDataList = res.data.data.list;
          this.total = res.data.data.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.getCheckOrderList();

      document.getElementById("mainContainer").scrollTop = 0;
    },
    // 获取原材料名称列表
    getMaterialList() {
      materialListPort().then((res) => {
        console.log("原材料");
        console.log(res);
        this.materialList = res.data.data;
      });
    },

    // 获取仓库/加工厂列表
    getWarehouseFactoryList() {
      warehouseFactoryPort().then((res) => {
        console.log("仓库/加工厂");
        console.log(res);

        this.warehouseFilterList = res.data.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.purchase-record {
  padding: 20px;
  background-color: #fff;
  border-radius: 6px;
}

.bill-container {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .container-top-left {
    display: flex;
    align-items: center;
  }

  span {
    font-size: 14px;
  }
}
</style>
