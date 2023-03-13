<template>
  <div class="warehouse-management-container" id="warehouse">
    <!-- <h1>原材料出库管理</h1> -->
    <div style="margin-top: 20px;">
      <div class="materials-apply-add">
        <div class="add-left">
          <p class="title-font">待出库清单</p>

          <el-form ref="topDataRef" :model="deliveryData" :rules="deliveryRules" label-width="106px">
            <el-form-item label="出库类型：" prop="type">
              <el-select v-model="deliveryData.type" class="input-style" @change="typeChange"
                :popper-append-to-body="false">
                <el-option v-for="item in deliveryType" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="目的地：" prop="endStorageId" v-if="deliveryData.type == 0">
              <el-select v-model="endStorageMsg" placeholder="请选择" class="input-style" :popper-append-to-body="false"
                @change="storageChange" value-key="id">
                <el-option v-for="item in warehouseFilterList" :key="item.id" :label="item.name" :value="item">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="销售发票号：" prop="sellBillNumber" v-if="deliveryData.type == 1">
              <el-input v-model="deliveryData.sellBillNumber" placeholder="请输入" clearable class="input-style"></el-input>
            </el-form-item>
            <el-row :gutter="10" v-if="deliveryData.type == 1">
              <el-col :span="12">
                <el-form-item label="销售员：" prop="solder">
                  <el-input v-model="deliveryData.solder" placeholder="请输入" clearable class="input-style"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="销售组：" prop="group">
                  <el-autocomplete class="input-style" v-model="deliveryData.group" :fetch-suggestions="groupQuery"
                    placeholder="请选择/输入销售组" @select="handleGroupSelect"></el-autocomplete>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-if="deliveryData.type == 1">
              <el-col :span="12">
                <el-form-item label="顾客姓名：" prop="customer">
                  <el-input v-model="deliveryData.customer" placeholder="请输入" clearable class="input-style"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="顾客类型：" prop="customerType">
                  <el-autocomplete class="input-style" v-model="deliveryData.customerType"
                    :fetch-suggestions="customerTypeQuery" placeholder="请选择/输入类型"
                    @select="handleModelSelect"></el-autocomplete>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="出售币种：" v-if="deliveryData.type == 1" prop="saleCurrency">
              <el-radio-group v-model="deliveryData.saleCurrency" @change="currencyChange">
                <el-radio label="CNY">CNY</el-radio>
                <el-radio label="EUR">EUR</el-radio>
                <el-radio label="USD">USD</el-radio>
                <el-radio label="HKD">HKD</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>

          <el-collapse accordion v-if="deliveryData.stockOutList.length > 0">
            <el-collapse-item v-for="(item, index) in deliveryData.stockOutList" :key="item.id">
              <template slot="title">
                {{ item.materialName + " " + item.productNumber
                }}<i @click="delNum(item.id)" class="el-icon-delete"
                  style="margin-left: 10px;font-size: 20px;color: red;"></i>
              </template>
              <div>
                <el-form label-width="134px" id="left">
                  <el-form-item label="库存总数量：" style="margin-bottom: 0;">
                    <span style="padding-left: 15px">{{
                      item.chargeUnit == "粒"
                      ? item.totalNum + " " + item.chargeUnit
                      : item.totalNum
                    }}</span>
                  </el-form-item>

                  <el-form-item label="库存总重量：" style="margin-bottom: 5px;">
                    <span style="padding-left: 15px">{{
                      item.totalWeight == 0
                      ? item.totalWeight
                      : item.totalWeight + " " + item.chargeUnit
                    }}</span>
                  </el-form-item>

                  <el-form-item label="出库数量：">
                    <el-input v-model="item.number" @input="changeNum(index)"><i slot="suffix"
                        style="color: #606266;margin-right:10%;font-style:normal;">{{
                          item.chargeUnit == "粒"
                          ? item.chargeUnit
                          : item.chargeUnit == "件"
                            ? item.chargeUnit
                            : ""
                        }}</i>
                    </el-input>
                  </el-form-item>

                  <el-form-item label="出库重量：">
                    <el-input v-model="item.weight" @input="changeWeight(index)"><i slot="suffix"
                        style="color: #606266;margin-right:10%;font-style:normal;">{{
                          item.chargeUnit !== "粒"
                          ? item.chargeUnit != "件"
                            ? item.chargeUnit
                            : ""
                          : ""
                        }}</i>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="加工厂库存状态：" required v-if="deliveryData.type == 0 && endStorageMsg.type == 1">
                    <el-select v-model="item.isProcessing" placeholder="请选择" class="input-style"
                      :popper-append-to-body="false">
                      <el-option label="库存中" value="0"> </el-option>
                      <el-option label="加工中" value="1"> </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="出售外币金额：" v-if="deliveryData.type == 1" :rules="[
                    {
                      required: true,
                      message: '请输入出售金额',
                      trigger: 'blur',
                    },
                  ]">
                    <el-input @input="moneyChange" @change="totalChange(item)" v-model="item.saleMoney"
                      placeholder="请输入出售金额" clearable class="input-style"><i slot="suffix"
                        style="color: #606266;margin-right:10%;font-style:normal;">{{ deliveryData.saleCurrency
                        }}</i></el-input>
                  </el-form-item>
                  <el-form-item label="外币兑港币汇率：" v-if="deliveryData.type == 1">
                    <el-input @input="totalToHkRateChange" v-model="deliveryData.totalToHkRate" placeholder="请输入"
                      clearable class="input-style"></el-input>
                  </el-form-item>
                  <el-form-item label="出售港币金额：" v-if="deliveryData.type == 1">
                    <el-input v-model="item.sellTotalHkPrice" placeholder="请输入" clearable class="input-style"></el-input>
                  </el-form-item>
                  <el-form-item label="其他支出费用：" v-if="deliveryData.type == 1">
                    <el-input @change="totalChange(item)" v-model="item.otherExpenses" placeholder="请输入金额" clearable
                      class="input-style">
                      <i slot="suffix" style="color: #606266;margin-right:10%;font-style:normal;">HKD</i>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="货物转移记录：">
                    <Note :note="item.transferRemarks" :id="item.id" @noteContent="noteProListContent"></Note>
                  </el-form-item>
                </el-form>
              </div>
            </el-collapse-item>
          </el-collapse>
          <div v-else style="font-size: 15px;">
            右侧选择出库产品
          </div>

          <el-form style="margin-top: 40px;" :model="deliveryData" :rules="deliveryRules" ref="deliveryForm"
            label-width="124px">
            <el-form-item label="出售总金额：" v-if="deliveryData.type == 1">
              <div>{{ saleTotalMoney + " " + deliveryData.saleCurrency }}</div>
            </el-form-item>

            <el-form-item label="出售总港币金额：" v-if="deliveryData.type == 1">
              <div>{{ webShowHkPrice + " HKD" }}</div>
            </el-form-item>

            <el-form-item label="其他支出总费用：" v-if="deliveryData.type == 1">
              <div>{{ otherTotalMoney + " HKD" }}</div>
            </el-form-item>

            <el-form-item label="出库时间：" prop="stockOutTime" v-if="deliveryData.type == 1">
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
        </div>
        <div class="add-right">
          <div>
            <p class="title-font">库存查询</p>
            <div>
              <el-form label-width="110px">
                <el-form-item label="仓库/加工厂：" required>
                  <el-select style="width:66%;" v-model="storageIdList" multiple clearable placeholder="可多选"
                    :popper-append-to-body="false">
                    <el-option v-for="item in warehouseList" v-show="item.isOwn == 1 || item.id == 0" :key="item.id"
                      :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="关键字：">
                  <el-input style="width:66%;" v-model="warehouseKeyword" @change="keywordChange"
                    placeholder="可输入材料名称、统一编号、备注进行搜索" clearable>
                  </el-input>
                  <el-button style="margin-left: 10px;" type="primary" @click="warehouseCheck(9)">查 询</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <el-table ref="singleTable" :data="deviceFilterList" highlight-current-row @row-click="handleDeviceListChange"
            @row-dblclick="dblDeviceListChange" style="width: 100%" border>
            <el-table-column align="center" prop="materialName" label="材料名称">
            </el-table-column>
            <el-table-column align="center" prop="productNumber" label="统一编号">
            </el-table-column>
            <el-table-column align="center" label="库存地">
              <template slot-scope="scope">
                <div>
                  <span>{{ scope.row.storageName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="库存总数量">
              <template slot-scope="scope">
                <div>
                  <span>{{
                    scope.row.weight !== 0
                    ? scope.row.number
                    : scope.row.number + " " + scope.row.chargeUnit
                  }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="库存总重量">
              <template slot-scope="scope">
                <div>
                  <span>{{
                    scope.row.weight == 0
                    ? "--"
                    : scope.row.weight + " " + scope.row.chargeUnit
                  }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template>
                <el-button type="text">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div v-if="dialogMaterialMsgUpdateVisible">
            <materialMsgUpdate :dialogMaterialMsgUpdateVisible="dialogMaterialMsgUpdateVisible"
              :updateMaterialMsg="inventoryCheckDetail" @sureUpdateMaterial="sureUpdateMaterial"></materialMsgUpdate>
          </div>
          <div style="width: 100%;height: 50px;padding-bottom: 20px;">
            <div style="margin:40px 0 0;position:absolute;right:30px;">
              <el-pagination @current-change="handleCurrentChange" :current-page="page" :page-size="10"
                layout="total, prev, pager, next, jumper" :total="total">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { base_request_url } from "_req/http";
import {
  stockMaterialInfoPort,
  stockMaterialPort,
  warehouseFactoryPort,
} from "_req/api/common";
import { materialOutDoPort } from "_req/api/material";

import { customerTypeMixins, groupMixins } from "@/mixins";

import Note from "@/components/note.vue";
import materialMsgUpdate from "@/components/material-msg-update.vue";

export default {
  components: {
    Note,
    materialMsgUpdate,
  },
  mixins: [customerTypeMixins, groupMixins],
  data() {
    return {
      axiosUrl: "",
      materialId: "",
      storageIdList: [],
      time: "",

      dialogDeviceCheckVisible: false,

      multipleSelection: [],
      deviceFilterList: [],
      dialogDeliveryVisible: false,
      deliveryType: [
        {
          id: 0,
          name: "货物转移",
        },
        {
          id: 1,
          name: "出售",
        },
      ],
      saleTotalMoney: 0,
      webShowHkPrice: 0,
      otherTotalMoney: 0,
      endStorageMsg: {},
      deliveryData: {
        type: 0,
        endStorageId: "",
        solder: "", // 销售员
        group: "",
        customer: "",
        customerType: "",
        saleCurrency: "CNY",
        stockOutTime: "",
        receiver: "",
        outNote: "",
        stockOutList: [],
        totalToHkRate: "",
        sellBillNumber: "",
      },
      deliveryRules: {
        type: [
          {
            required: true,
            message: "请选择出库类型",
            trigger: "change",
          },
        ],
        endStorageId: [
          {
            required: true,
            message: "请选择目的地",
            trigger: "change",
          },
        ],
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
      warehouseKeyword: "",
      page: 1,
      pageNum: 10,
      total: 0,
      certificateshow2: false,
      dialogMaterialMsgUpdateVisible: false,
      inventoryCheckDetail: {},

      isUpdate: 0,
      imgList: [],
      activeStockName: "first",

      params: {},
      warehouseList: [],
      warehouseFilterList: [],

      imgSortList: [],
      count: 0,

      activeName: "1",
    };
  },
  created() {
    this.axiosUrl = base_request_url;
    this.getWarehouseFactoryList();
  },
  mounted() {
    document.getElementById("warehouse").scrollIntoView();
  },
  methods: {
    // 目的地
    storageChange() {
      console.log("目的地", this.endStorageMsg);
      this.deliveryData.endStorageId = this.endStorageMsg.id;
    },

    // 待出库清单  货物转移记录
    noteProListContent(val) {
      console.log("货物转移记录变化赋值", val);
      for (const index in this.deliveryData.stockOutList) {
        if (this.deliveryData.stockOutList[index].id == val.id) {
          this.deliveryData.stockOutList[index].transferRemarks = val.record;
          return;
        }
      }
    },

    // 各种价格输入
    totalChange(item) {
      console.log(item);
      item.saleMoney = this.getPriceNum(item.saleMoney);

      this.saleTotalMoney = 0;
      this.otherTotalMoney = 0;
      for (const every of this.deliveryData.stockOutList) {
        this.saleTotalMoney += Number(every.saleMoney);
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
            if (this.deliveryData.type == 1) {
              for (const pro of this.deliveryData.stockOutList) {
                console.log(pro);
                if (!pro.saleMoney) {
                  this.$message.error({
                    message:
                      pro.materialName +
                      " " +
                      pro.productNumber +
                      "出售金额为空，请填写",
                    duration: 3000,
                  });
                  return;
                }
              }
            }
            this.$refs[formName].validate((valid) => {
              if (valid) {
                for (
                  let i = 0;
                  i < this.deliveryData.stockOutList.length;
                  i++
                ) {
                  if (this.changeNum(i, 1) == false) {
                    return;
                  } else if (this.changeWeight(i, 1) == false) {
                    return;
                  }

                  this.deliveryData.stockOutList[
                    i
                  ].transferRemarks = JSON.stringify(
                    this.deliveryData.stockOutList[i].transferRemarks
                  );
                }

                console.log("我要提交啦-----------");
                materialOutDoPort(this.deliveryData)
                  .then((res) => {
                    console.log("材料出库");
                    console.log(res);
                    this.$message.success({
                      message: "出库成功",
                      showClose: true,
                      duration: 1500,
                    });
                    // this.$refs.deliveryForm.resetFields();
                    // this.$refs.topDataRef.resetFields();
                    this.clearSubmitData();
                    this.warehouseCheck();
                    document.getElementById("warehouse").scrollIntoView();
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
    // 提交成功 初始化部分数据
    clearSubmitData() {
      this.deliveryData.endStorageId = "";
      this.deliveryData.customer = "";
      this.deliveryData.customerType = "";
      this.deliveryData.saleCurrency = "CNY";
      this.deliveryData.outNote = "";
      this.deliveryData.stockOutList = [];
      this.deliveryData.totalToHkRate = "";
      this.deliveryData.sellBillNumber = "";
    },
    // 数量变化
    changeNum(index, val) {
      console.log(this.deliveryData.stockOutList[index]);
      if (this.deliveryData.stockOutList[index].totalNum !== 0) {
        if (this.deliveryData.stockOutList[index].number < 1) {
          this.$message.error({
            message: val
              ? this.deliveryData.stockOutList[index].materialName +
              "出库数量最少为1"
              : "出库数量最少为1",
            showClose: true,
            duration: 1500,
          });
          console.log("出库数量最少为1");
          return false;
        } else if (
          this.deliveryData.stockOutList[index].number >
          this.deliveryData.stockOutList[index].totalNum
        ) {
          this.$message.error({
            message: val
              ? this.deliveryData.stockOutList[index].materialName +
              "出库数量不能大于库存总数量"
              : "出库数量不能大于库存总数量",
            showClose: true,
            duration: 1500,
          });
          console.log("出库数量不能大于库存总数量");
          return false;
        }
      } else {
        this.$message.error({
          message: val
            ? this.deliveryData.stockOutList[index].materialName +
            "库存数量为0，不可出库"
            : "该材料库存数量为0，不可出库",
          showClose: true,
          duration: 1500,
        });
        console.log("该材料库存数量为0，不可出库");
        return false;
      }
    },
    // 重量变化
    changeWeight(index, val) {
      if (
        this.deliveryData.stockOutList[index].chargeUnit == "ct" ||
        this.deliveryData.stockOutList[index].chargeUnit == "g"
      ) {
        if (this.deliveryData.stockOutList[index].totalWeight !== 0) {
          if (this.deliveryData.stockOutList[index].weight < 0) {
            this.$message.error({
              message: val
                ? this.deliveryData.stockOutList[index].materialName +
                "出库重量不能为负"
                : "出库重量不能为负",
              showClose: true,
              duration: 1500,
            });
            return false;
          } else if (
            this.deliveryData.stockOutList[index].weight >
            this.deliveryData.stockOutList[index].totalWeight
          ) {
            this.$message.error({
              message: val
                ? this.deliveryData.stockOutList[index].materialName +
                "出库重量不能大于库存总重量"
                : "出库重量不能大于库存总重量",
              showClose: true,
              duration: 1500,
            });
            return false;
          } else if (this.deliveryData.stockOutList[index].weight == 0) {
            this.$message.error({
              message: val
                ? this.deliveryData.stockOutList[index].materialName +
                "出库重量不能为零"
                : "出库重量不能为零",
              showClose: true,
              duration: 1500,
            });
            return false;
          }
        } else {
          this.$message.error({
            message: val
              ? this.deliveryData.stockOutList[index].materialName +
              "库存重量为0，不可出库"
              : "该材料库存重量为0，不可出库",
            showClose: true,
            duration: 1500,
          });
          return false;
        }
      }
    },
    // 删
    delNum(id) {
      for (const index in this.deliveryData.stockOutList) {
        if (this.deliveryData.stockOutList[index].id == id) {
          this.deliveryData.stockOutList.splice(index, 1);
          return;
        }
      }
    },
    // 选择出库材料
    handleDeviceListChange(row, column) {
      this.activeStockName = "first";
      if (column.label == "操作") {
        this.stockOutDetails(row);
      }
    },
    dblDeviceListChange(row) {
      if (this.deliveryData.stockOutList.length == 0) {
        let num = "";
        if (row.chargeUnit == "件") {
          num = 1;
        } else {
          num = row.number > 1 ? 0 : row.number;
        }
        this.deliveryData.stockOutList.push({
          id: row.id,
          materialName: row.materialName,
          productNumber: row.productNumber,
          number: num,
          weight: row.weight,
          totalNum: row.number,
          totalWeight: row.weight,
          chargeUnit: row.chargeUnit,
          saleMoney: "",
          otherExpenses: "",
          transferRemarks: row.transferRemarks
            ? JSON.parse(row.transferRemarks)
            : [],
          isProcessing: "0",
        });
      } else {
        console.log(this.filterSel(row));
        if (this.filterSel(row)) {
          this.$message.error({
            message: "请勿重复添加",
            showClose: true,
            duration: 2000,
          });
        } else {
          let num = "";
          if (row.chargeUnit == "件") {
            num = 1;
          } else {
            num = row.number > 1 ? 0 : row.number;
          }
          this.deliveryData.stockOutList.push({
            id: row.id,
            materialName: row.materialName,
            productNumber: row.productNumber,
            number: num,
            weight: row.weight,
            totalNum: row.number,
            totalWeight: row.weight,
            chargeUnit: row.chargeUnit,
            saleMoney: "",
            otherExpenses: "",
            transferRemarks: row.transferRemarks
              ? JSON.parse(row.transferRemarks)
              : [],
            isProcessing: "0",
          });
        }
      }
    },
    filterSel(val) {
      for (const item of this.deliveryData.stockOutList) {
        if (item.id == val.id) {
          return true;
        }
      }
      return false;
    },
    // 修改查看材料
    stockOutDetails(row) {
      console.log(row);

      stockMaterialInfoPort({
        id: row.id,
      }).then((res) => {
        console.log("材料详情");
        console.log(res);
        this.inventoryCheckDetail = res.data.data;

        this.dialogMaterialMsgUpdateVisible = true;
      });
    },
    // 确定修改裸石信息
    sureUpdateMaterial(val) {
      this.dialogMaterialMsgUpdateVisible = false;
      if (val == 1) {
        this.warehouseCheck();
      }
    },

    // 模糊搜索
    keywordChange() {
      this.page = 1;
    },
    warehouseCheck(val) {
      if (val) {
        this.storageSelChange();
      }
      stockMaterialPort({
        storageIdList: this.storageIdList,
        state: 0,
        keyword: this.warehouseKeyword,
        page: this.page,
        pageNum: this.pageNum,
      }).then((res) => {
        console.log("条件查找库存列表");
        console.log(res);

        this.total = res.data.data.total;
        this.deviceFilterList = res.data.data.list;
      });
    },
    // 分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;

      this.warehouseCheck();
      document.getElementById("warehouse").scrollIntoView();
    },
    // 获取仓库/加工厂列表
    getWarehouseFactoryList() {
      warehouseFactoryPort().then((res) => {
        console.log("仓库/加工厂");
        console.log(res);

        this.warehouseList = res.data.data;
        this.warehouseFilterList = this.warehouseList;

        this.warehouseCheck();
      });
    },
    // 过滤目的地列表
    storageSelChange() {
      console.log("过滤");
      this.warehouseFilterList = this.warehouseList;
      if (this.storageIdList.length > 0) {
        this.warehouseFilterList = this.warehouseFilterList.filter((item) => {
          return item && this.storageIdList.indexOf(item.id) == -1;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.warehouse-management-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 6px;
  text-align: left;

  .input-style {
    width: 100%;
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

      .qrcodeClick {
        width: 100px;
        height: 34px;
        float: right;
        line-height: 34px;
        background-color: #3d82fe;
        color: #fff;
        font-size: 13px;
        text-align: center;
        cursor: pointer;
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

  .materials-apply-add {
    display: flex;
    justify-content: space-between;

    .add-left {
      width: 55%;
      text-align: left;

      .num span {
        cursor: pointer;
        font-size: 16px;
      }
    }

    .add-right {
      width: 44%;
      text-align: left;
    }
  }

  .title-font {
    height: 48px;
    margin: 0;
    text-align: left;
    color: #6a6a6a;
    font-size: 18px;
    font-weight: bold;
  }

  .upload-imgs {
    width: 100%;
    margin-bottom: 10px;
    position: relative;
    display: flex;

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
}
</style>
<style lang="scss">
#msg {
  .el-dialog__body {
    height: 500px;
    overflow: auto;
  }
}

#one-note {
  .el-input__inner {
    width: 100%;
    height: 100px !important;
    // padding-left: 0;
    line-height: 100px !important;
    border: none;
    border-radius: 0;
  }
}

#left {
  .el-input__suffix {
    width: 17px;
    right: 20px;
  }
}
</style>
