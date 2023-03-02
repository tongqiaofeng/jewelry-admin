<template>
  <div class="stock-pending-container">
    <!-- <h1>销售报表</h1> -->
    <div v-if="dialogProductMsgUpdateVisible == false">
      <div style="display:flex;justify-content: space-between;">
        <el-form :inline="true">
          <!-- <el-form-item label="统计币种：">
            <el-select
              v-model="currencySel"
              placeholder="请选择"
              @change="keywordChange"
              :popper-append-to-body="false"
            >
              <el-option
                v-for="item in currencySelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="产品类别：">
            <el-select
              v-model="productType"
              placeholder="请选择"
              @change="keywordChange"
              :popper-append-to-body="false"
            >
              <el-option
                v-for="item in productTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="销售组：">
            <el-select
              v-model="group"
              placeholder="请选择"
              @change="keywordChange"
              :popper-append-to-body="false"
            >
              <el-option label="全部" value="全部"> </el-option>
              <el-option
                v-for="item in groupList"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="销售时间：">
            <el-date-picker
              v-model="time"
              type="monthrange"
              range-separator="至"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
              format="yyyy-MM"
              value-format="yyyy-MM"
              @change="keywordChange"
              clearable
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              style="margin-left: 10px;"
              type="primary"
              @click="getSalesList"
              >查 询</el-button
            >
          </el-form-item>
        </el-form>
        <div>
          <el-button type="primary" @click="reportData">导出数据</el-button>
        </div>
      </div>
      <el-tabs v-model="activeTabName" @tab-click="handleClick">
        <el-tab-pane label="可结算" name="first">
          <div>
            <div
              class="total-style"
              v-if="salesList.length > 0 && currencySel == 1"
            >
              <div class="style-every">总数量：{{ total }}</div>
              <div class="style-every">
                人民币销售额：{{ formatNumberRgx(totalSaleMoney) + " CNY" }}
              </div>
              <div class="style-every">
                总利润：{{ formatNumberRgx(totalProfit) + " CNY" }}
              </div>
            </div>
            <div
              class="total-style"
              v-if="salesList.length > 0 && currencySel == 2"
            >
              <div class="style-every">总数量：{{ total }}</div>
              <div class="style-every">
                港币销售额：{{ formatNumberRgx(totalSaleMoney) + " HKD" }}
              </div>
              <div class="style-every">
                总利润：{{ formatNumberRgx(totalProfit) + " HKD" }}
              </div>
            </div>
            <el-table
              style="width: 100%;"
              border
              ref="multipleTable"
              :data="salesList"
              tooltip-effect="dark"
              @row-click="handleDeviceListChange"
              @row-dblclick="dblDeviceListChange"
              @expand-change="onExpandChange"
              :row-key="getRowKeys"
              :expand-row-keys="expandRowKeys"
            >
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form
                    label-width="135px"
                    label-position="left"
                    class="demo-table-expand"
                  >
                    <el-form-item label="最低售价：">
                      <span>{{
                        formatNumberRgx(props.row.lowestSellPrice) + " CNY"
                      }}</span>
                    </el-form-item>
                    <el-form-item label="建议批发价：">
                      <span>{{
                        formatNumberRgx(props.row.adviceWholesalePrice) +
                          " " +
                          scope.row.type ==
                        "成品"
                          ? "HKD"
                          : scope.row.saleCurrency
                      }}</span>
                    </el-form-item>
                    <el-form-item label="建议零售价：">
                      <span>{{
                        formatNumberRgx(props.row.adviseSellPrice) +
                          " " +
                          scope.row.type ==
                        "成品"
                          ? "HKD"
                          : scope.row.saleCurrency
                      }}</span>
                    </el-form-item>
                    <el-form-item label="利润：">
                      <div
                        :style="{
                          color: props.row.profit < 0 ? 'red' : '#666',
                        }"
                      >
                        {{
                          props.row.profit == 0
                            ? "--"
                            : formatNumberRgx(props.row.profit) +
                              " " +
                              (currencySel == 1 ? "CNY" : "HKD")
                        }}
                      </div>
                    </el-form-item>
                    <el-form-item label="利润率：">
                      <div
                        :style="{
                          color: props.row.profitRate < 0 ? 'red' : '#666',
                        }"
                      >
                        {{
                          props.row.profitRate == 0
                            ? "--"
                            : props.row.profitRate + "%"
                        }}
                      </div>
                    </el-form-item>
                    <el-form-item label="买家：">
                      <span>{{ props.row.customer }}</span>
                    </el-form-item>
                    <el-form-item label="销售员：">
                      <span>{{ props.row.solder }}</span>
                    </el-form-item>
                    <el-form-item label="销售组：">
                      <span>{{ props.row.group }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>

              <el-table-column
                prop="productNumber"
                align="center"
                label="统一编号"
              >
              </el-table-column>
              <el-table-column align="center" label="图片" width="120px">
                <template slot-scope="scope">
                  <div>
                    <img
                      v-if="scope.row.img != ''"
                      :src="
                        axiosUrl + '/file/' + imgListFilter(scope.row.img)[0]
                      "
                      style="width: 100px;height: 100px;object-fit: cover;"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="productName"
                label="产品名称"
              >
              </el-table-column>

              <el-table-column align="center" prop="type" label="产品类别">
              </el-table-column>
              <el-table-column
                width="150px"
                align="center"
                prop="params"
                label="参数"
              >
                <template slot-scope="scope">
                  <div>
                    <el-tooltip
                      class="item"
                      effect="light"
                      :content="scope.row.params"
                      placement="bottom"
                    >
                      <div class="tooltipFlow">{{ scope.row.params }}</div>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="stockInTime"
                label="入库时间"
              >
              </el-table-column>
              <el-table-column
                prop="stockOutTime"
                align="center"
                label="销售时间"
              >
              </el-table-column>
              <el-table-column align="center" label="成本">
                <template slot-scope="scope">
                  <div :style="{ color: scope.row.cost == 0 ? 'red' : '#666' }">
                    {{ formatNumberRgx(scope.row.cost) + " "
                    }}{{ currencySel == 1 ? "CNY" : "HKD" }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="出库价">
                <template slot-scope="scope">
                  <div>
                    {{
                      formatNumberRgx(scope.row.saleMoney) +
                        " " +
                        scope.row.saleCurrency
                    }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="人民币出库价"
                align="center"
                v-if="currencySel == 1"
              >
                <template slot-scope="scope">
                  <div>
                    {{ formatNumberRgx(scope.row.saleCnyOrHkdMoney) + " CNY" }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="港币出库价"
                align="center"
                v-if="currencySel == 2"
              >
                <template slot-scope="scope">
                  <div>
                    {{ formatNumberRgx(scope.row.saleCnyOrHkdMoney) + " HKD" }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <span style="color: #3d81fd;cursor: pointer;">撤销销售</span>
              </el-table-column>
            </el-table>
            <div style="width: 100%;height: 50px;">
              <div style="margin:15px 0;position:absolute;right:6%;">
                <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page="page"
                  layout="total, prev, pager, next, jumper"
                  :total="total"
                >
                </el-pagination>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="不可结算" name="second">
          <div>
            <div class="total-style" v-if="salesList.length > 0">
              <div class="style-every">总数量：{{ total }}</div>
            </div>
            <el-table
              style="width: 100%;"
              ref="multipleTable"
              :data="salesList"
              tooltip-effect="dark"
              @row-click="handleDeviceListChange"
              @row-dblclick="dblDeviceListChange"
              border
            >
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form
                    label-width="97px"
                    label-position="left"
                    class="demo-table-expand"
                  >
                    <el-form-item label="最低售价：">
                      <span>{{
                        formatNumberRgx(props.row.lowestSellPrice) + " CNY"
                      }}</span>
                    </el-form-item>
                    <el-form-item label="建议批发价(HKD)：">
                      <span>{{
                        formatNumberRgx(props.row.adviceWholesalePrice) + " CNY"
                      }}</span>
                    </el-form-item>
                    <el-form-item label="建议零售价(HKD)：">
                      <span>{{
                        formatNumberRgx(props.row.adviseSellPrice) + " CNY"
                      }}</span>
                    </el-form-item>
                    <el-form-item label="利润：">
                      <div
                        :style="{
                          color: props.row.profit < 0 ? 'red' : '#666',
                        }"
                      >
                        {{
                          props.row.profit == 0
                            ? "--"
                            : formatNumberRgx(props.row.profit) +
                              " " +
                              (currencySel == 1 ? "CNY" : "HKD")
                        }}
                      </div>
                    </el-form-item>
                    <el-form-item label="利润率：">
                      <div
                        :style="{
                          color: props.row.profitRate < 0 ? 'red' : '#666',
                        }"
                      >
                        {{
                          props.row.profitRate == 0
                            ? "--"
                            : props.row.profitRate + "%"
                        }}
                      </div>
                    </el-form-item>
                    <el-form-item label="买家：">
                      <span>{{ props.row.customer }}</span>
                    </el-form-item>
                    <el-form-item label="销售员：">
                      <span>{{ props.row.solder }}</span>
                    </el-form-item>
                    <el-form-item label="销售组：">
                      <span>{{ props.row.group }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>

              <el-table-column
                prop="productNumber"
                align="center"
                label="统一编号"
              >
              </el-table-column>
              <el-table-column align="center" label="图片" width="120px">
                <template slot-scope="scope">
                  <div>
                    <img
                      v-if="scope.row.img != ''"
                      :src="
                        axiosUrl + '/file/' + imgListFilter(scope.row.img)[0]
                      "
                      style="width: 100px;height: 100px;object-fit: cover;"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="productName"
                label="产品名称"
              >
              </el-table-column>

              <el-table-column align="center" prop="type" label="产品类别">
              </el-table-column>
              <el-table-column
                width="150px"
                align="center"
                prop="params"
                label="参数"
              >
                <template slot-scope="scope">
                  <div>
                    <el-tooltip
                      class="item"
                      effect="light"
                      :content="scope.row.params"
                      placement="bottom"
                    >
                      <div class="tooltipFlow">{{ scope.row.params }}</div>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="stockInTime"
                label="入库时间"
              >
              </el-table-column>
              <el-table-column
                prop="stockOutTime"
                align="center"
                label="销售时间"
              >
              </el-table-column>
              <el-table-column align="center" label="成本">
                <template slot-scope="scope">
                  <div :style="{ color: scope.row.cost == 0 ? 'red' : '#666' }">
                    {{ formatNumberRgx(scope.row.cost) + " "
                    }}{{ currencySel == 1 ? "CNY" : "HKD" }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="出库价">
                <template slot-scope="scope">
                  <div>
                    {{
                      formatNumberRgx(scope.row.saleMoney) +
                        " " +
                        scope.row.saleCurrency
                    }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="人民币出库价"
                align="center"
                v-if="currencySel == 1"
              >
                <template slot-scope="scope">
                  <div>
                    {{ formatNumberRgx(scope.row.saleCnyOrHkdMoney) + " CNY" }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="港币出库价"
                align="center"
                v-if="currencySel == 2"
              >
                <template slot-scope="scope">
                  <div>
                    {{ formatNumberRgx(scope.row.saleCnyOrHkdMoney) + " HKD" }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <span style="color: #3d81fd;cursor: pointer;">撤销销售</span>
              </el-table-column>
            </el-table>
            <div style="width: 100%;height: 50px;">
              <div style="margin:15px 0;position:absolute;right:6%;">
                <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page="page"
                  layout="total, prev, pager, next, jumper"
                  :total="total"
                >
                </el-pagination>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        v-if="dialogDelSalesVisible"
        title="撤销销售"
        :visible.sync="dialogDelSalesVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :append-to-body="false"
        style="margin-top:20px"
        id="delSale"
      >
        <div class="del-style">
          确定撤销该销售记录吗？撤销后不可修改
        </div>
        <div slot="footer">
          <el-button @click="dialogDelSalesVisible = false">取 消</el-button>
          <el-button type="primary" @click="delSaleSure">确 定</el-button>
        </div>
      </el-dialog>

      <div v-if="dialogMaterialMsgUpdateVisible">
        <materialMsgUpdate
          :dialogMaterialMsgUpdateVisible="dialogMaterialMsgUpdateVisible"
          :updateMaterialMsg="materialCheckDetail"
          @sureUpdateMaterial="sureUpdateMaterial"
        ></materialMsgUpdate>
      </div>
    </div>

    <!-- 修改成品信息 -->
    <div v-else>
      <productMsgUpdate
        :dialogProductMsgUpdateVisible="dialogProductMsgUpdateVisible"
        :updateProductMsg="inventoryCheckDetail"
        @sureUpdateProduct="sureUpdateProduct"
      ></productMsgUpdate>
    </div>
  </div>
</template>

<script>
import { labelMixins, brandJointlyMixins, groupMixins } from "@/mixins";

import { base_request_url } from "_req/http";
import { productInfoPort, stockMaterialInfoPort } from "_req/api/common";

import { reportExportPort, salesReportPort } from "_req/api/admin";

import { materialSellDetailRevokePort } from "_req/api/material";
import { productSellDetailRevokePort } from "_req/api/product";

import productMsgUpdate from "@/components/product-msg-update.vue";

export default {
  mixins: [labelMixins, brandJointlyMixins, groupMixins],
  components: { productMsgUpdate },
  data() {
    return {
      axiosUrl: "",
      currencySel: 2,
      currencySelList: [
        {
          id: 1,
          name: "人民币",
        },
        {
          id: 2,
          name: "港币",
        },
      ],
      productType: 0,
      productTypeList: [
        {
          id: 0,
          name: "全部",
        },
        {
          id: 1,
          name: "原材料",
        },
        {
          id: 2,
          name: "成品",
        },
      ],
      group: "全部",
      salesList: [],
      time: null,
      total: 0,
      page: 1,

      delItemMsg: null,
      dialogDelSalesVisible: false,

      dialogProductMsgUpdateVisible: false,
      inventoryCheckDetail: {},

      dialogMaterialMsgUpdateVisible: false,
      materialCheckDetail: {},

      activeTabName: "first",
      totalSaleMoney: 0,
      totalProfit: 0,

      expandRowKeys: [],
    };
  },
  created() {
    this.axiosUrl = base_request_url;
    this.getSalesList();
  },
  methods: {
    // 设置展开行每次只展开一行
    onExpandChange(row) {
      if (row.id === this.expandRowKeys[0]) {
        this.expandRowKeys = [];
      } else {
        this.expandRowKeys = [row.id];
      }
    },
    getRowKeys(row) {
      return row.id;
    },

    // tab切换
    handleClick(tab, event) {
      console.log(tab, event);
      console.log(this.activeTabName);
      this.page = 1;
      this.getSalesList();
    },

    // 确定修改裸石信息
    sureUpdateMaterial(val) {
      this.dialogMaterialMsgUpdateVisible = false;
      if (val == 1) {
        this.getSalesList();
      }
    },

    // 确定修改成品信息
    sureUpdateProduct(val) {
      this.dialogProductMsgUpdateVisible = false;
      if (val == 1) {
        this.getSalesList();
      }
    },

    // 查看详情
    handleDeviceListChange(row, column) {
      console.log(row);
      if (column.label == "操作") {
        this.delSale(row);
      }
    },
    dblDeviceListChange(row) {
      if (row.isMaterial == 0) {
        productInfoPort({
          id: row.id,
        }).then((res) => {
          console.log("成品详情");
          console.log(res);
          this.inventoryCheckDetail = res.data.data;
          if (this.inventoryCheckDetail) {
            this.dialogProductMsgUpdateVisible = true;
          }
        });
      } else if (row.isMaterial == 1) {
        stockMaterialInfoPort({
          id: row.id,
        }).then((res) => {
          console.log("原材料详情");
          console.log(res);
          this.materialCheckDetail = res.data.data;
          if (this.materialCheckDetail) {
            this.dialogMaterialMsgUpdateVisible = true;
          }
        });
      }
    },
    // 撤销销售
    delSale(item) {
      this.delItemMsg = item;
      this.dialogDelSalesVisible = true;
    },
    // 确定撤销
    delSaleSure() {
      this.dialogDelSalesVisible = false;
      if (this.delItemMsg.type == "原材料") {
        materialSellDetailRevokePort({
          id: this.delItemMsg.id,
        }).then((res) => {
          console.log("撤销销售");
          console.log(res);

          this.$message.success({
            message: "撤销成功",
            showClose: true,
            duration: 2000,
          });
          this.getSalesList();
        });
      } else {
        productSellDetailRevokePort({
          id: this.delItemMsg.id,
        }).then((res) => {
          console.log("撤销销售");
          console.log(res);

          this.$message.success({
            message: "撤销成功",
            showClose: true,
            duration: 2000,
          });
          this.getSalesList();
        });
      }
    },
    // 导出数据
    reportData() {
      reportExportPort({
        type: this.productType,
        group: this.group,
        startTime: this.time == null ? "" : this.time[0],
        endTime: this.time == null ? "" : this.time[1],
        page: 1,
        currency: this.currencySel == 1 ? "CNY" : "HKD",
      }).then((res) => {
        console.log("导出销售报表");
        console.log(res);
        location.href = this.axiosUrl + res.data.data.url;
      });
    },
    // 获取销售报表列表
    getSalesList() {
      this.salesList = [];

      salesReportPort({
        type: this.productType,
        group: this.group,
        startTime: this.time == null ? "" : this.time[0],
        endTime: this.time == null ? "" : this.time[1],
        page: this.page,
        pageNum: 10,
        state: this.activeTabName == "first" ? 1 : -1,
        currency: this.currencySel == 1 ? "CNY" : "HKD",
      }).then((res) => {
        console.log("销售报表列表");
        console.log(res);
        this.total = res.data.data.total;
        this.totalSaleMoney = res.data.data.allSaleMoney;
        this.totalProfit = res.data.data.allProfit;
        this.salesList = res.data.data.list;
      });
    },

    keywordChange() {
      this.page = 1;
      this.activeTabName = "first";
    },
    // 分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.getSalesList();
      (function smoothscroll() {
        let currentScroll =
          document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
          window.requestAnimationFrame(smoothscroll);
          window.scrollTo(0, currentScroll - currentScroll / 5);
        }
      })();
    },
  },
};
</script>

<style lang="scss" scoped>
.demo-table-expand {
  .el-form-item {
    margin-bottom: 0;
  }
}

.total-style {
  display: flex;
  align-items: center;

  .style-every {
    margin-right: 30px;
    margin-bottom: 20px;
    font-size: 16px;
  }
}
.upload-imgs {
  display: flex;
  margin-bottom: 10px;
  position: relative;
  .delImg {
    margin-left: 10px;
  }
  .add {
    width: 100px;
    height: 100px;
    position: relative;
    border: 1px solid #ddd;
    border-radius: 5px;
    display: flex;

    .addIcon {
      width: 50px;
      height: 50px;
      position: absolute;
      top: 45%;
      left: 45%;
      z-index: 1;
    }

    .inputUpload {
      position: absolute;
      display: block;
      width: 100px;
      height: 100px;
      opacity: 0;
      cursor: pointer;
      z-index: 999;
    }
  }

  .spanStyle {
    width: 15px;
    height: 15px;
    position: absolute;
    top: 1px;
    right: 1px;
    text-align: center;
    line-height: 0.9;
    background-color: rgb(221, 221, 221);
    color: rgb(255, 255, 255);
    border: 1px solid rgb(221, 221, 221);
    border-radius: 50%;
    z-index: 999;
    cursor: pointer;
  }

  .previewImg {
    display: flex;
    z-index: 1;
  }
}
.delImg {
  margin-left: 10px;
}
.stock-pending-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 6px;
  text-align: left;
}
.font-title-style {
  margin-top: 20px;
  margin-bottom: 10px;
  color: #6a6a6a;
  font-size: 18px;
  font-weight: bold;
  text-align: left;
}

.font-div {
  border: 1px solid #ccc;
  border-bottom: none;

  .div-one {
    // height: 34px;
    display: flex;
    line-height: 34px;
    border-bottom: 1px solid #ccc;

    .one-left {
      width: 160px;
      border-right: 1px solid #ccc;
      text-align: center;
      background-color: #f2f2f2;
    }

    .one-right {
      width: 373px;
      padding-left: 10px;
    }
  }

  .div-one-note {
    height: 100px;
    display: flex;
    line-height: 100px;
    border-bottom: 1px solid #ccc;

    .one-left {
      width: 94px;
      border-right: 1px solid #ccc;
      text-align: center;
      background-color: #f2f2f2;
    }

    .one-right {
      width: 373px;
      padding-left: 10px;
    }
  }
}
</style>
<style lang="scss">
#delSale {
  .el-dialog__body {
    height: 80px;
    overflow: auto;
    padding: 0 20px;
  }
}
.stock-pending-container {
  .el-dialog__body {
    height: 600px;
    overflow: auto;
    padding: 0 20px;
  }
}

.el-dialog__header {
  text-align: left;
}
</style>
