<template>
  <div style="margin-top: -20px;padding-top: 20px;" class="warehouse-management-container" id="warehouse">
    <div class="back-img" @click="goBack">
      <img class="back-icon" src="../assets/imgs/goback.png" />
      <span class="font">返回</span>
    </div>
    <div class="add-left">
      <el-form ref="topDataRef" :model="deliveryData" :rules="deliveryRules" label-width="125px">
        <el-form-item label="销售发票号：" prop="sellBillNumber">
          <el-input v-model="deliveryData.sellBillNumber" placeholder="请输入" class="input-style" readonly></el-input>
        </el-form-item>

        <el-form-item label="销售员：" prop="solder">
          <el-input v-model="deliveryData.solder" placeholder="请输入" clearable class="input-style"></el-input>
        </el-form-item>

        <el-form-item label="销售组：" prop="group">
          <el-autocomplete class="input-style" v-model="deliveryData.group" :fetch-suggestions="groupQuery"
            placeholder="请选择/输入销售组" @select="handleGroupSelect"></el-autocomplete>
        </el-form-item>

        <el-form-item label="顾客姓名：" prop="customer">
          <el-input v-model="deliveryData.customer" placeholder="请输入" clearable class="input-style"></el-input>
        </el-form-item>

        <el-form-item label="顾客类型：" prop="customerType">
          <el-autocomplete class="input-style" v-model="deliveryData.customerType" :fetch-suggestions="customerTypeQuery"
            placeholder="请选择/输入类型" @select="handleModelSelect"></el-autocomplete>
        </el-form-item>

        <el-form-item label="出售币种：" prop="saleCurrency">
          <el-radio-group v-model="deliveryData.saleCurrency" @change="currencyChange">
            <el-radio label="CNY">CNY</el-radio>
            <el-radio label="EUR">EUR</el-radio>
            <el-radio label="USD">USD</el-radio>
            <el-radio label="HKD">HKD</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="外币兑港币汇率：" prop="totalToHkRate">
          <el-input @input="totalToHkRateChange" v-model="deliveryData.totalToHkRate" placeholder="请输入" clearable
            class="input-style"></el-input>
        </el-form-item>
      </el-form>

      <el-table :data="deliveryData.stockOutList" v-if="deliveryData.stockOutList" :key="9">
        <el-table-column align="center" prop="materialName" label="产品名称">
        </el-table-column>
        <el-table-column align="center" prop="productNumber" label="统一编号">
        </el-table-column>
        <el-table-column align="center" label="出售数量">
          <template slot-scope="scope">
            <div>
              {{
                scope.row.chargeUnit == "粒" || scope.row.chargeUnit == "件"
                ? scope.row.number + " " + scope.row.chargeUnit
                : scope.row.number
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="出售重量">
          <template slot-scope="scope">
            <div>
              {{
                scope.row.weight == 0
                ? scope.row.weight
                : scope.row.weight + " " + scope.row.chargeUnit
              }}
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" label="出售外币金额">
          <template slot-scope="scope">
            <div>
              <el-input @input="moneyChange" @change="totalChange(scope.row)" v-model="scope.row.saleMoney"
                placeholder="请输入" clearable class="input-style">
                <i slot="suffix" class="el-input__icon" style="color: #606266;font-style:normal;">{{
                  deliveryData.saleCurrency
                }}</i>
              </el-input>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" label="出售港币金额">
          <template slot-scope="scope">
            <div>
              <el-input v-model="scope.row.sellTotalHkPrice" @change="totalChange(scope.row)" placeholder="请输入" clearable
                class="input-style"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="其他支出费用">
          <template slot-scope="scope">
            <div>
              <el-input @change="totalChange(scope.row)" v-model="scope.row.otherExpenses" placeholder="请输入" clearable>
                <i slot="suffix" class="el-input__icon" style="color: #606266;font-style:normal;">HKD</i>
              </el-input>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" width="120px" label="操作">
          <template slot-scope="scope">
            <div style="display: flex;justify-content: center;">
              <el-button type="text" @click="recordDetail(scope.row, scope.$index)">转移详情</el-button>
              <el-button style="margin-left: 10px;" type="text" @click="delNum(scope.row.id)"> 删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-form style="margin-top: 40px;" :model="deliveryData" :rules="deliveryRules" ref="deliveryForm"
        label-width="124px">
        <el-form-item label="出售总金额：">
          <div>{{ saleTotalMoney + " " + deliveryData.saleCurrency }}</div>
        </el-form-item>

        <el-form-item label="出售总港币金额：">
          <div>{{ webShowHkPrice + " HKD" }}</div>
        </el-form-item>

        <el-form-item label="其他支出总费用：">
          <div>{{ otherTotalMoney + " HKD" }}</div>
        </el-form-item>

        <el-form-item label="出库时间：" prop="stockOutTime">
          <el-date-picker class="input-style" v-model="deliveryData.stockOutTime" type="date" placeholder="请选择"
            value-format="yyyy-MM-dd" format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="领货人：" prop="receiver">
          <el-input class="input-style" v-model="deliveryData.receiver"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="outNote">
          <el-input type="textarea" class="input-style" v-model="deliveryData.outNote"></el-input>
        </el-form-item>
      </el-form>
      <div style="margin-top: 30px;text-align: right;">
        <el-button style="width: 120px;" type="primary" @click="stockInSubmit('deliveryForm')" v-preventClick>提
          交</el-button>
      </div>

      <el-dialog title="货物转移记录" v-if="dialogRecordVisible" :visible.sync="dialogRecordVisible"
        :close-on-press-escape="false" :close-on-click-modal="false" :modal-append-to-body="false" :append-to-body="false"
        id="recordDialog">
        <div style="text-align: center;">
          <Note :note="recordMsg" @noteContent="noteProListContent"></Note>
        </div>
        <div slot="footer">
          <el-button @click="dialogRecordVisible = false">取 消</el-button>
          <el-button type="primary" @click="recordMsgSure" v-preventClick>确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  warehouseFactoryPort,
  sellOrderGetPort,
  sellOrderSavePort,
} from "_req/api/common";

import { customerTypeMixins, groupMixins } from "@/mixins";

import Note from "@/components/note.vue";

export default {
  components: {
    Note,
  },
  mixins: [customerTypeMixins, groupMixins],

  props: {
    updateSaleRecordMsg: {},
  },
  data() {
    return {
      materialId: "",
      time: "",
      dialogDeviceCheckVisible: false,

      multipleSelection: [],
      dialogDeliveryVisible: false,
      saleTotalMoney: 0,
      webShowHkPrice: 0,
      otherTotalMoney: 0,
      deliveryData: {},
      deliveryRules: {
        solder: [
          {
            required: true,
            message: "请输入销售员",
            trigger: "blur",
          },
        ],
        group: [
          {
            required: true,
            message: "请选择/输入销售组",
            trigger: "change",
          },
        ],
        customer: [
          {
            required: true,
            message: "请输入顾客姓名",
            trigger: "blur",
          },
        ],
        sellBillNumber: [
          {
            required: true,
            message: "请输入销售发票号",
            trigger: "blur",
          },
        ],
        stockOutTime: [
          {
            required: true,
            message: "请选择出库时间",
            trigger: "blur",
          },
        ],
        receiver: [
          {
            required: true,
            message: "请输入领货人",
            trigger: "blur",
          },
        ],
      },

      isUpdate: 0,
      imgList: [],
      activeStockName: "first",

      params: {},
      warehouseFilterList: [],

      imgSortList: [],
      count: 0,

      activeName: "1",

      recordIndex: null,
      recordMsg: '',
      dialogRecordVisible: false,
      recordNewMsg: [],
    };
  },
  created() {
    this.sellOrderMsgGet();

    this.getWarehouseFactoryList();
  },
  mounted() {
    document.getElementById("mainContainer").scrollIntoView();
  },
  methods: {
    // 获取销售单详情
    sellOrderMsgGet() {
      sellOrderGetPort({
        sellBillNumber: this.updateSaleRecordMsg.sellBillNumber,
      }).then((res) => {
        console.log("销售单详情", res);
        this.deliveryData = res.data.data;
        this.saleTotalMoney = 0;
        this.webShowHkPrice = 0;
        this.otherTotalMoney = 0;
        for (const every of this.deliveryData.stockOutList) {
          every.transferRemarks = JSON.parse(every.transferRemarks);
          this.saleTotalMoney += Number(every.saleMoney);
          this.webShowHkPrice += Number(every.sellTotalHkPrice)
          this.otherTotalMoney += Number(every.otherExpenses);
        }
      });
    },

    // 返回上一级
    goBack() {
      this.$emit("updateSaleSure", 1);
    },

    // 货物转移
    recordDetail(item, index) {
      console.log(item, index);
      this.recordIndex = index;
      this.recordMsg = item.transferRemarks;
      this.dialogRecordVisible = true;
    },
    recordMsgSure() {
      console.log(this.recordIndex);
      console.log(this.recordNewMsg);
      this.deliveryData.stockOutList[this.recordIndex].transferRemarks = this.recordNewMsg;
      console.log(this.deliveryData.stockOutList);

      this.dialogRecordVisible = false;
    },
    // 待出库清单  货物转移记录
    noteProListContent(val) {
      console.log("货物转移记录变化赋值", val);
      this.recordNewMsg = val;
    },

    // 各种价格输入
    totalChange(item) {
      console.log(item);
      item.saleMoney = this.getPriceNum(item.saleMoney);

      this.saleTotalMoney = 0;
      this.webShowHkPrice = 0;
      this.otherTotalMoney = 0;
      for (const every of this.deliveryData.stockOutList) {
        this.saleTotalMoney += Number(every.saleMoney);
        this.webShowHkPrice += Number(every.sellTotalHkPrice)
        this.otherTotalMoney += Number(every.otherExpenses);
      }
    },
    // 汇率变化
    totalToHkRateChange() {
      this.priceGlobalGet();
      console.log(this.deliveryData.stockOutList);
      this.deliveryData.stockOutList = JSON.parse(
        JSON.stringify(this.deliveryData.stockOutList)
      );
    },
    // 币种变化
    currencyChange() {
      if (this.deliveryData.saleCurrency == "HKD") {
        this.deliveryData.totalToHkRate = 1;

        this.webShowHkPrice = 0;
        for (const item of this.deliveryData.stockOutList) {
          item.sellTotalHkPrice = item.saleMoney;
          this.webShowHkPrice += Number(item.sellTotalHkPrice);
        }
      } else {
        this.deliveryData.totalToHkRate = "";
        this.webShowHkPrice = 0;
        for (const item of this.deliveryData.stockOutList) {
          item.sellTotalHkPrice = "";
        }
      }

      this.deliveryData.stockOutList = JSON.parse(
        JSON.stringify(this.deliveryData.stockOutList)
      );
    },
    // 外币金额变化
    moneyChange() {
      if (this.deliveryData.saleCurrency == "HKD") {
        this.webShowHkPrice = 0;
        for (const item of this.deliveryData.stockOutList) {
          item.sellTotalHkPrice = item.saleMoney;
          this.webShowHkPrice += Number(item.sellTotalHkPrice);
        }
      } else {
        this.priceGlobalGet();
      }

      this.deliveryData.stockOutList = JSON.parse(
        JSON.stringify(this.deliveryData.stockOutList)
      );
    },

    priceGlobalGet() {
      this.webShowHkPrice = 0;
      if (this.deliveryData.totalToHkRate) {
        for (const item of this.deliveryData.stockOutList) {
          if (this.deliveryData.saleCurrency == "CNY") {
            if (this.deliveryData.totalToHkRate >= 1) {
              item.sellTotalHkPrice = Number(
                item.saleMoney * this.deliveryData.totalToHkRate
              ).toFixed(0);
            } else {
              item.sellTotalHkPrice = Number(
                item.saleMoney / this.deliveryData.totalToHkRate
              ).toFixed(0);
            }
          } else {
            item.sellTotalHkPrice = Number(
              item.saleMoney * this.deliveryData.totalToHkRate
            ).toFixed(0);
          }

          this.webShowHkPrice += Number(item.sellTotalHkPrice);
        }
      }
    },

    // 出库类型变化
    typeChange() {
      this.$refs.deliveryForm.clearValidate();
      this.$refs.topDataRef.clearValidate();
    },
    // 材料出库
    stockInSubmit(formName) {
      if (this.deliveryData.stockOutList.length == 0) {
        this.$message.warning({
          message: "请选择出库材料",
          showClose: true,
          duration: 2000,
        });
      } else {
        this.$refs["topDataRef"].validate((valid) => {
          if (valid) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                if (this.deliveryData.type == 1) {
                  for (const pro of this.deliveryData.stockOutList) {
                    console.log(pro);
                    if (!pro.saleMoney) {
                      this.$message.error({
                        message:
                          pro.materialName +
                          " " +
                          pro.productNumber +
                          "出售外币金额为空，请填写",
                        duration: 3000,
                      });
                      return;
                    }
                  }
                }

                for (const item of this.deliveryData.stockOutList) {
                  item.transferRemarks = JSON.stringify(item.transferRemarks);
                }
                console.log('我要提交数据喽----');
                console.log(this.deliveryData);

                sellOrderSavePort(this.deliveryData)
                  .then((res) => {
                    console.log("材料出库");
                    console.log(res);
                    this.$message.success({
                      message: "提交成功",
                      showClose: true,
                      duration: 1500,
                    });
                    this.$refs.deliveryForm.resetFields();
                    this.$refs.topDataRef.resetFields();
                    this.deliveryData.stockOutList = [];

                    this.$emit("updateSaleSure", 0);

                    document.getElementById("mainContainer").scrollIntoView();
                  })
                  .catch((err) => {
                    console.log(err);
                    for (const item of this.deliveryData.stockOutList) {
                      item.transferRemarks = JSON.parse(item.transferRemarks);
                    }
                  });
              } else {
                console.log("error submit!!");
                return false;
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
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
.warehouse-management-container {
  text-align: left;

  .input-style {
    width: 100%;
  }

  .add-left {
    width: 85%;
  }
}
</style>
<style lang="scss">
#left {
  .el-input__suffix {
    width: 17px;
    right: 20px;
  }
}
</style>
