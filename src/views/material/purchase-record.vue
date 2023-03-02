<template>
  <div class="purchase-record">
    <!-- <h1>采购记录</h1> -->
    <el-form :inline="true" style="text-align: left;">
      <el-form-item label="材料名称：">
        <el-select
          v-model="materialId"
          placeholder="请选择"
          style="width: 150px;"
          :popper-append-to-body="false"
        >
          <el-option
            v-for="material in materialList"
            :key="material.id"
            :label="material.name"
            :value="material.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仓库/加工厂：">
        <el-select
          v-model="storageId"
          clearable
          placeholder="可多选"
          style="width: 150px;"
          :popper-append-to-body="false"
        >
          <el-option
            v-for="item in warehouseFilterList"
            v-show="item.isOwn == 1"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <div style="display: flex;">
          <el-input
            style="width: 400px;"
            v-model="keyword"
            placeholder="可输入发票号、材料名称、统一编号、备注进行搜索"
            clearable
          >
          </el-input>
          <el-button
            style="margin-left: 10px;"
            type="primary"
            @click="handleCurrentChange(1)"
            >查 询</el-button
          >
        </div>
      </el-form-item>
    </el-form>

    <div
      style="width: 100%;padding: 20px 0;margin-top: 20px;text-align: center;background-color: #fff;border-radius: 6px;"
      v-if="purchaseDataList.length == 0"
    >
      暂无数据
    </div>
    <div v-else style="margin-top: 20px">
      <div
        v-for="(item, index) in purchaseDataList"
        :key="index"
        style="margin-bottom: 40px;background-color: #fff;border-radius: 6px;"
      >
        <div class="bill-container">
          <div class="container-top-left">
            <div style="font-size: 16px; color: #000">
              发票号：<span style="font-size: 14px; color: #666">{{
                item.billNumber
              }}</span>
            </div>
          </div>
          <el-button
            type="danger"
            size="small"
            @click.prevent="inventoryDelete(item, 0)"
            >删除记录</el-button
          >
        </div>
        <el-table
          ref="multipleTableSel"
          :data="item.materialList"
          :row-key="getRowKeys"
          tooltip-effect="dark"
          border
          highlight-current-row
          @row-click="inventoryLook"
          @row-dblclick="updatePurchase"
        >
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
          <el-table-column align="center" label="库存量">
            <template slot-scope="scope">
              <div
                v-if="
                  scope.row.chargeUnit == '粒' || scope.row.chargeUnit == '件'
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
          <el-table-column align="center" prop="storageName" label="库存地">
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <div v-for="(e, index) in stateList" :key="index">
                <span v-show="scope.row.state == e.id && e.name != '全部'">{{
                  e.name
                }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="90px">
            <template>
              <el-button type="text" style="color: red;">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div style="width: 100%;height: 50px;">
        <div style="margin:15px 0;position:absolute;right:6%;">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="page"
            layout="total, prev, pager, next, jumper"
            :page-size="5"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <div v-if="dialogMaterialMsgUpdateVisible">
      <materialMsgUpdate
        :dialogMaterialMsgUpdateVisible="dialogMaterialMsgUpdateVisible"
        :updateMaterialMsg="deviceDetail"
        @sureUpdateMaterial="sureUpdateMaterial"
      ></materialMsgUpdate>
    </div>
    <el-dialog
      title="删除采购记录"
      :visible.sync="dialogDeletePurchseVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :append-to-body="false"
      id="delInven"
    >
      <div style="text-align: center;">
        <p style="margin: 30px 0 0 0;font-size: 16px;color: #4e4e4e;">
          确定删除该采购记录？删除后不可恢复
        </p>
      </div>
      <template #footer>
        <div>
          <el-button size="large" @click="dialogDeletePurchseVisible = false"
            >取 消</el-button
          >
          <el-button
            type="primary"
            size="large"
            v-preventClick
            @click="inventoryDeleteSure"
            >确 定</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  materialBuyOrderPort,
  materialDeletePort,
  materialBuyOrderDelPort,
} from "_req/api/material";
import {
  materialListPort,
  warehouseFactoryPort,
  stockMaterialInfoPort,
} from "_req/api/common";

import materialMsgUpdate from "@/components/material-msg-update.vue";
export default {
  components: {
    materialMsgUpdate,
  },
  data() {
    return {
      stateList: [
        {
          id: "",
          name: "全部",
        },
        {
          id: 0,
          name: "库存中",
        },
        {
          id: 1,
          name: "加工中",
        },
        {
          id: 2,
          name: "加工完成",
        },
        {
          id: 3,
          name: "已出售",
        },
      ],
      materialList: [],
      warehouseFilterList: [],
      keyword: "",
      materialId: null,
      page: 1,
      total: 0,
      storageId: null,
      purchaseDataList: [],

      delBuyId: null,
      dialogDeletePurchseVisible: false,

      deviceDetail: {},
      dialogMaterialMsgUpdateVisible: false,

      inventoryDeleteDetail: {},
      delNum: 0,
    };
  },
  created() {
    this.getMaterialList();
    this.getWarehouseFactoryList();
    this.getBuyOrderList();
  },
  methods: {
    // 修改采购记录信息
    updatePurchase(item) {
      console.log(item);

      stockMaterialInfoPort({
        id: item.id,
      }).then((res) => {
        console.log("材料详情");
        console.log(res);
        this.deviceDetail = res.data.data;

        this.dialogMaterialMsgUpdateVisible = true;
      });
    },
    // 确定修改采购记录
    sureUpdateMaterial(val) {
      this.dialogMaterialMsgUpdateVisible = false;
      if (val == 1) {
        this.getBuyOrderList();
      }
    },

    // 查看修改材料详情
    inventoryLook(row, column) {
      if (column.label == "操作") {
        this.inventoryDelete(row, 1);
      }
    },

    // 删除材料
    inventoryDelete(val, num) {
      this.delNum = num;
      console.log(val);
      this.inventoryDeleteDetail = val;
      this.dialogDeletePurchseVisible = true;
    },
    // 确定
    inventoryDeleteSure() {
      this.dialogDeletePurchseVisible = false;
      if (this.delNum === 0) {
        materialBuyOrderDelPort({
          billNumber: this.inventoryDeleteDetail.billNumber,
        }).then((res) => {
          console.log("删除材料信息");
          console.log(res);
          this.$message.success({
            message: "删除成功",
            showClose: true,
            duration: 2000,
          });
          this.dialogDeletePurchseVisible = false;
          this.getBuyOrderList();
        });
      } else {
        materialDeletePort({
          id: this.inventoryDeleteDetail.id,
        }).then((res) => {
          console.log("删除材料信息");
          console.log(res);
          this.$message.success({
            message: "删除成功",
            showClose: true,
            duration: 2000,
          });
          this.dialogDeletePurchseVisible = false;
          this.getBuyOrderList();
        });
      }
    },

    getRowKeys(row) {
      return row.id;
    },

    // 获取采购记录列表
    getBuyOrderList() {
      materialBuyOrderPort({
        keyword: this.keyword,
        materialId: this.materialId,
        page: this.page,
        pageNum: 5,
        storageId: this.storageId,
      })
        .then((res) => {
          console.log("原材料采购记录", res);
          this.purchaseDataList = res.data.data.list;
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
      this.getBuyOrderList();

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
