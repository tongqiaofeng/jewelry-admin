<template>
  <div class="stock-inquiry-container" id="stock-inquiry">
    <!-- 原材料库存查询 -->
    <div class="stock-inquiry-pc">
      <div v-show="siteSel == 0">
        <div class="stock-inquiry-top" id="stockWarehouseCheck">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="材料名称：">
              <el-select
                v-model="materialstate"
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
            <el-form-item label="状态：">
              <el-select
                v-model="state"
                placeholder="请选择"
                style="width: 150px;"
                :popper-append-to-body="false"
              >
                <el-option
                  v-for="flag in stateList"
                  :key="flag.id"
                  :label="flag.name"
                  :value="flag.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="仓库/加工厂：">
              <el-select
                v-model="storageIdList"
                multiple
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
            <el-form-item label="入库时间：">
              <el-date-picker
                v-model="time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <div style="display: flex;">
                <el-input
                  style="width: 350px;"
                  v-model="keyword"
                  placeholder="可输入材料名称、统一编号、采购发票号进行搜索"
                  clearable
                >
                </el-input>
                <el-button
                  style="margin-left: 10px;"
                  type="primary"
                  @click="checkStockInquiry"
                  >查 询</el-button
                >
              </div>
            </el-form-item>
          </el-form>
          <div class="top-right">
            <el-tooltip
              class="item"
              style="margin-left: 20px;height: 40px;"
              effect="dark"
              content="图表切换"
              placement="bottom-end"
            >
              <img
                :src="stockInquiryParam.sel == 1 ? img1 : img2"
                @click="listOrChart"
                style="cursor:pointer;"
              />
            </el-tooltip>
          </div>
        </div>
        <div class="stock-inquiry-main">
          <div v-if="stockInquiryParam.sel == 1" class="svg-style">
            <!-- <h3>图形</h3> -->
            <div style="text-align: center;" v-if="stockInList.length == 0">
              <p>{{ stockInMsg }}</p>
            </div>
            <div v-else class="border-every-style">
              <div
                v-for="(warehouse, index) in stockInList"
                :key="index"
                style="display: flex;margin-top: 20px;"
              >
                <div
                  class="border-style"
                  @click="imgInquiryDetails(warehouse.id)"
                >
                  <p style="margin: 0">{{ warehouse.name }}</p>
                  <p style="margin: 0;font-size: 13px;font-weight: 600;">
                    总数：{{ warehouse.total }}
                  </p>
                </div>
                <div
                  class="every-style"
                  v-if="index < stockInList.length - 1"
                ></div>
              </div>
            </div>
          </div>
          <div v-if="stockInquiryParam.sel == 0" style="padding: 20px;">
            <el-table
              style="width: 100%;"
              ref="multipleTable"
              :data="stockListPage"
              :row-key="getRowKeys"
              tooltip-effect="dark"
              border
              highlight-current-row
              @row-click="checkDeviceDetails"
              @row-dblclick="dblDeviceDetails"
            >
              <el-table-column align="center" label="出库" width="80px">
                <template>
                  <div>
                    <span style="cursor: pointer;color: #3d81fd;">出库</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="打印标签" width="100px">
                <template>
                  <div>
                    <span style="cursor: pointer;color: #3d81fd;">打印</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="materialName"
                label="材料名称"
              >
              </el-table-column>
              <el-table-column
                align="center"
                prop="productNumber"
                label="统一编号"
              >
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
                      scope.row.chargeUnit == '粒' ||
                        scope.row.chargeUnit == '件' ||
                        scope.row.chargeUnit == '条'
                    "
                  >
                    <span>{{
                      scope.row.number + " " + scope.row.chargeUnit
                    }}</span>
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
                    <span
                      :style="{
                        color:
                          scope.row.storageType == 1 &&
                          (scope.row.state == 0 || scope.row.state == 1)
                            ? '#3d81fd'
                            : '#666',
                        cursor:
                          scope.row.storageType == 1 &&
                          (scope.row.state == 0 || scope.row.state == 1)
                            ? 'pointer'
                            : 'inherit',
                      }"
                      v-show="scope.row.state == e.id && e.name != '全部'"
                      @click="updateState(scope.row)"
                      >{{ e.name }}</span
                    >
                  </div>
                </template>
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
        </div>
      </div>
      <div
        v-show="siteSel == 1"
        class="stock-inquiry-main"
        style="padding: 20px;margin: 0;"
      >
        <div
          style="width: 60px;margin-bottom: 20px;display: flex;justify-content:space-between;cursor: pointer;"
          @click="backToImg"
        >
          <img src="../../assets/imgs/home/goback.png" style="height: 21px;" />
          <p style="margin: 0;">返回</p>
        </div>
        <el-table
          ref="multipleTableSel"
          :data="imgMaterialList"
          :row-key="getRowKeys"
          tooltip-effect="dark"
          border
          highlight-current-row
          @row-click="checkDeviceDetails"
          @row-dblclick="dblDeviceDetails"
        >
          <el-table-column align="center" label="出库" width="80px">
            <template>
              <div>
                <span style="cursor: pointer;color: #3d81fd;">出库</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="打印标签" width="100px">
            <template>
              <div>
                <span style="cursor: pointer;color: #3d81fd;">打印</span>
              </div>
            </template>
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
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <div v-for="(e, index) in stateList" :key="index">
                <span
                  :style="{
                    color:
                      scope.row.storageType == 1 &&
                      (scope.row.state == 0 || scope.row.state == 1)
                        ? '#3d81fd'
                        : '#666',
                    cursor:
                      scope.row.storageType == 1 &&
                      (scope.row.state == 0 || scope.row.state == 1)
                        ? 'pointer'
                        : 'inherit',
                  }"
                  v-show="scope.row.state == e.id && e.name != '全部'"
                  @click="updateState(scope.row)"
                  >{{ e.name }}</span
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="width: 100%;height: 50px;">
          <div style="margin:15px 0;position:absolute;right:6%;">
            <el-pagination
              @current-change="handleMateChange"
              :current-page="pageMate"
              layout="total, prev, pager, next, jumper"
              :total="totalMate"
            >
            </el-pagination>
          </div>
        </div>
      </div>
      <div v-show="siteSel == 2" style="padding: 20px;background-color: #fff;">
        <div
          style="width: 60px;margin-bottom: 20px;display: flex;justify-content:space-between;cursor: pointer;"
          @click="backToList"
        >
          <img src="../../assets/imgs/home/goback.png" style="height: 21px;" />
          <p style="margin: 0;">返回</p>
        </div>
        <div class="add-left">
          <el-form
            ref="topDataRef"
            :model="deliveryData"
            :rules="deliveryRules"
            label-width="134px"
          >
            <el-form-item label="出库类型：" prop="type">
              <el-select
                v-model="deliveryData.type"
                class="input-style"
                @change="typeChange"
                :popper-append-to-body="false"
              >
                <el-option
                  v-for="item in deliveryType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="目的地："
              prop="endStorageId"
              v-if="deliveryData.type == 0"
            >
              <el-select
                v-model="endStorageMsg"
                placeholder="请选择"
                class="input-style"
                :popper-append-to-body="false"
                @change="storageChange"
                value-key="id"
              >
                <el-option
                  v-for="item in warehouseFilterList"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="加工厂库存状态："
              required
              v-if="deliveryData.type == 0 && endStorageMsg.type == 1"
            >
              <el-select
                v-model="deliveryData.isProcessing"
                placeholder="请选择"
                class="input-style"
                :popper-append-to-body="false"
              >
                <el-option label="库存中" value="0"> </el-option>
                <el-option label="加工中" value="1"> </el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label="销售发票号："
              prop="sellBillNumber"
              v-if="deliveryData.type == 1"
            >
              <el-input
                v-model="deliveryData.sellBillNumber"
                placeholder="请输入"
                clearable
                class="input-style"
              ></el-input>
            </el-form-item>
            <el-row :gutter="10" v-if="deliveryData.type == 1">
              <el-col :span="12">
                <el-form-item label="销售员：" prop="solder">
                  <el-input
                    v-model="deliveryData.solder"
                    placeholder="请输入"
                    clearable
                    class="input-style"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="销售组：" prop="group">
                  <el-autocomplete
                    class="input-style"
                    v-model="deliveryData.group"
                    :fetch-suggestions="groupQuery"
                    placeholder="请选择/输入销售组"
                    @select="handleGroupSelect"
                  ></el-autocomplete>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-if="deliveryData.type == 1">
              <el-col :span="12">
                <el-form-item label="顾客姓名：" prop="customer">
                  <el-input
                    v-model="deliveryData.customer"
                    placeholder="请输入"
                    clearable
                    class="input-style"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="顾客类型：" prop="customerType">
                  <el-autocomplete
                    class="input-style"
                    v-model="deliveryData.customerType"
                    :fetch-suggestions="customerTypeQuery"
                    placeholder="请选择/输入类型"
                    @select="handleModelSelect"
                  ></el-autocomplete>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item
              label="出售币种："
              v-if="deliveryData.type == 1"
              prop="saleCurrency"
            >
              <el-radio-group
                v-model="deliveryData.saleCurrency"
                @change="currencyChange"
              >
                <el-radio label="CNY">CNY</el-radio>
                <el-radio label="EUR">EUR</el-radio>
                <el-radio label="USD">USD</el-radio>
                <el-radio label="HKD">HKD</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>

          <el-collapse accordion v-if="deliveryData.stockOutList.length > 0">
            <el-collapse-item
              v-for="(item, index) in deliveryData.stockOutList"
              :key="item.id"
            >
              <template slot="title">
                {{ item.materialName + " " + item.productNumber
                }}<i
                  @click="delNum(item.id)"
                  class="el-icon-delete"
                  style="margin-left: 10px;font-size: 20px;color: red;"
                ></i>
              </template>
              <div>
                <el-form label-width="124px" id="left">
                  <el-form-item label="库存总数量：" style="margin-bottom: 0;">
                    <span style="padding-left: 15px">{{
                      item.chargeUnit == "粒"
                        ? item.totalNum + " " + item.chargeUnit
                        : item.totalNum
                    }}</span>
                  </el-form-item>

                  <el-form-item
                    label="库存总重量："
                    style="margin-bottom: 5px;"
                  >
                    <span style="padding-left: 15px">{{
                      item.totalWeight == 0
                        ? item.totalWeight
                        : item.totalWeight + " " + item.chargeUnit
                    }}</span>
                  </el-form-item>

                  <el-form-item label="出库数量：">
                    <el-input v-model="item.number" @input="changeNum(index)"
                      ><i
                        slot="suffix"
                        style="color: #606266;margin-right:10%;font-style:normal;"
                        >{{
                          item.chargeUnit == "粒"
                            ? item.chargeUnit
                            : item.chargeUnit == "件"
                            ? item.chargeUnit
                            : ""
                        }}</i
                      >
                    </el-input>
                  </el-form-item>

                  <el-form-item label="出库重量：">
                    <el-input v-model="item.weight" @input="changeWeight(index)"
                      ><i
                        slot="suffix"
                        style="color: #606266;margin-right:10%;font-style:normal;"
                        >{{
                          item.chargeUnit !== "粒"
                            ? item.chargeUnit != "件"
                              ? item.chargeUnit
                              : ""
                            : ""
                        }}</i
                      >
                    </el-input>
                  </el-form-item>

                  <el-form-item
                    label="出售外币金额："
                    v-if="deliveryData.type == 1"
                    :rules="[
                      {
                        required: true,
                        message: '请输入出售金额',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input
                      @input="moneyChange"
                      @change="totalChange(item)"
                      v-model="item.saleMoney"
                      placeholder="请输入出售金额"
                      clearable
                      class="input-style"
                      ><i
                        slot="suffix"
                        style="color: #606266;margin-right:10%;font-style:normal;"
                        >{{ deliveryData.saleCurrency }}</i
                      ></el-input
                    >
                  </el-form-item>
                  <el-form-item
                    label="外币兑港币汇率："
                    v-if="deliveryData.type == 1"
                  >
                    <el-input
                      @input="totalToHkRateChange"
                      v-model="deliveryData.totalToHkRate"
                      placeholder="请输入"
                      clearable
                      class="input-style"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="出售港币金额："
                    v-if="deliveryData.type == 1"
                  >
                    <el-input
                      v-model="item.sellTotalHkPrice"
                      placeholder="请输入"
                      clearable
                      class="input-style"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="其他支出费用："
                    v-if="deliveryData.type == 1"
                  >
                    <el-input
                      @change="totalChange(item)"
                      v-model="item.otherExpenses"
                      placeholder="请输入金额"
                      clearable
                      class="input-style"
                    >
                      <i
                        slot="suffix"
                        style="color: #606266;margin-right:10%;font-style:normal;"
                        >HKD</i
                      >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="货物转移记录：">
                    <Note
                      :note="item.transferRemarks"
                      :id="item.id"
                      @noteContent="noteProListContent"
                    ></Note>
                  </el-form-item>
                </el-form>
              </div>
            </el-collapse-item>
          </el-collapse>

          <el-form
            style="margin-top: 40px;"
            :model="deliveryData"
            :rules="deliveryRules"
            ref="deliveryForm"
            label-width="124px"
          >
            <el-form-item
              label="出库时间："
              prop="stockOutTime"
              v-if="deliveryData.type == 1"
            >
              <el-date-picker
                class="input-style"
                v-model="deliveryData.stockOutTime"
                type="date"
                placeholder="请选择"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="领货人：" prop="receiver">
              <el-input
                class="input-style"
                v-model="deliveryData.receiver"
              ></el-input>
            </el-form-item>
            <el-form-item label="备注：" prop="outNote">
              <el-input
                type="textarea"
                class="input-style"
                v-model="deliveryData.outNote"
              ></el-input>
            </el-form-item>
          </el-form>
          <div style="margin-top: 30px;text-align: right;">
            <el-button
              style="width: 120px;"
              type="primary"
              @click="stockInSubmit('deliveryForm')"
              v-preventClick
              >提 交</el-button
            >
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
        title="修改加工厂材料库存状态"
        :visible.sync="dialogStateUpdateVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :append-to-body="false"
        id="delInven"
      >
        <div style="padding-top: 30px">
          <el-form>
            <el-form-item label="库存状态：">
              <el-select
                v-model="isProcessing"
                placeholder="请选择"
                :popper-append-to-body="false"
              >
                <el-option label="库存中" value="0"> </el-option>
                <el-option label="加工中" value="1"> </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer">
          <el-button @click="dialogStateUpdateVisible = false">取 消</el-button>
          <el-button type="primary" @click="stateUpdateSure" v-preventClick
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  stockMaterialInfoPort,
  materialListPort,
  stockMaterialPort,
  warehouseFactoryPort,
} from "_req/api/common";
import {
  materialOutDoPort,
  warehouseStockPort,
  materialStatePort,
} from "_req/api/material";

import { customerTypeMixins, groupMixins } from "@/mixins";

import Note from "@/components/note.vue";
import materialMsgUpdate from "@/components/material-msg-update.vue";
export default {
  components: {
    Note,
    materialMsgUpdate,
  },
  props: {
    stockInquiryParam: {
      type: Object,
    },
  },
  mixins: [customerTypeMixins, groupMixins],
  data() {
    return {
      img1: require("../../assets/imgs/list.png"),
      img2: require("../../assets/imgs/camer.png"),

      state: 0,
      materialstate: "",
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
      storageIdList: [],
      time: "",

      siteSel: 0,

      stockInMsg: "数据加载中...",
      stockInList: [],
      stockListPage: [],
      total: 0,
      page: 1,
      keyword: "",

      dialogMaterialMsgUpdateVisible: false,
      deviceDetail: {},

      materialList: [],
      imgMaterialList: [],

      startTime: "",
      endTime: "",

      endStorageMsg: {},
      deliveryData: {
        type: 0,
        isProcessing: "0",
        endStorageId: "",
        storageType: 0,
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
      warehouseFilterList: [],
      params: {},

      storageId: null,
      totalMate: 0,
      pageMate: 1,

      timeout: null,

      isProcessing: "0",
      stateUpdateId: null,
      dialogStateUpdateVisible: false,
    };
  },

  created() {
    this.warehouseKeywordCheck();
    this.warehouseStockCheck();
    this.getWarehouseFactoryList();
    this.getMaterialList();
  },

  methods: {
    // 目的地
    storageChange() {
      console.log("目的地", this.endStorageMsg);
      this.deliveryData.endStorageId = this.endStorageMsg.id;
    },

    // 修改加工厂产品状态 库存中/加工中
    updateState(row) {
      if (row.storageType == 1 && (row.state == 0 || row.state == 1)) {
        this.isProcessing = row.state + "";
        this.stateUpdateId = row.id;
        this.dialogStateUpdateVisible = true;
      }
    },

    // 确定修改
    stateUpdateSure() {
      this.dialogStateUpdateVisible = false;
      materialStatePort({
        id: this.stateUpdateId,
        state: this.isProcessing,
      }).then((res) => {
        console.log("修改状态", res);
        this.$message.success("状态修改成功");

        this.warehouseKeywordCheck();
        this.getWarehouseMaterial();
      });
    },

    // 确定修改裸石信息
    sureUpdateMaterial(val) {
      this.dialogMaterialMsgUpdateVisible = false;
      if (val == 1) {
        this.warehouseKeywordCheck();
        this.getWarehouseMaterial();
      }
    },

    // 待出库清单  货物转移记录
    noteProListContent(val) {
      console.log("货物转移记录变化赋值", val);

      this.deliveryData.stockOutList[0].transferRemarks = val.record;
    },

    // 出库类型变化
    typeChange() {
      this.$refs.deliveryForm.clearValidate();
      this.$refs.topDataRef.clearValidate();
    },
    // 材料出库
    stockInSubmit(formName) {
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
              for (let i = 0; i < this.deliveryData.stockOutList.length; i++) {
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
              materialOutDoPort(this.deliveryData)
                .then((res) => {
                  console.log("材料出库");
                  console.log(res);
                  this.$message.success({
                    message: "出库成功",
                    showClose: true,
                    duration: 1500,
                  });
                  this.$refs.deliveryForm.resetFields();
                  this.$refs.topDataRef.resetFields();

                  this.backList();
                  sessionStorage.setItem("scrollTopHeight", 0);
                  this.warehouseKeywordCheck();
                  this.warehouseStockCheck();
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
    // 选择出库材料
    handleImgSelectionChange(val) {
      console.log(val);
      if (val.state != 0) {
        this.$message.error({
          message: "该产品未在库存中，不能出库",
          showClose: true,
          duration: 2000,
        });
      } else {
        this.deliveryData.totalToHkRate = "";
        this.deliveryData.saleCurrency = "CNY";
        this.deliveryData.stockOutList = [];
        this.endStorageMsg = {};

        this.$refs.deliveryForm.resetFields();
        this.$refs.topDataRef.resetFields();
        this.siteSel = 2;

        let num = "";
        if (val.chargeUnit == "件") {
          num = 1;
        } else {
          num = val.number > 1 ? 0 : val.number;
        }
        this.deliveryData.stockOutList.push({
          id: val.id,
          materialName: val.materialName,
          productNumber: val.productNumber,
          number: num,
          weight: val.weight,
          totalNum: val.number,
          totalWeight: val.weight,
          chargeUnit: val.chargeUnit,
          saleMoney: "",
          otherExpenses: "",
          transferRemarks: val.transferRemarks
            ? JSON.parse(val.transferRemarks)
            : [],
        });
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

        for (const item of this.deliveryData.stockOutList) {
          item.sellTotalHkPrice = item.saleMoney;
        }
      } else {
        this.deliveryData.totalToHkRate = "";

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
        for (const item of this.deliveryData.stockOutList) {
          item.sellTotalHkPrice = item.saleMoney;
        }
      } else {
        this.priceGlobalGet();
      }

      this.deliveryData.stockOutList = JSON.parse(
        JSON.stringify(this.deliveryData.stockOutList)
      );
    },

    priceGlobalGet() {
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
        }
      }
    },

    // 操作
    checkDeviceDetails(row, column) {
      console.log(row, column);
      if (column.label == "出库") {
        this.handleImgSelectionChange(row);
      } else if (column.label == "打印标签") {
        console.log("打印标签");

        this.printLabel(row);
      }
    },
    // 打印标签
    printLabel(row) {
      this.$axios
        .post("http://127.0.0.1:8079", {
          CMD: "1",
          CMDDATA: row.id,
        })
        .then((res) => {
          console.log(res);
          this.$message.success({
            message: "标签打印成功",
            showClose: true,
            duration: 2000,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 查看材料详情
    dblDeviceDetails(row) {
      this.deviceDetail = {};

      stockMaterialInfoPort({
        id: row.id,
      }).then((res) => {
        console.log("材料详情");
        console.log(res);
        this.deviceDetail = res.data.data;

        this.dialogMaterialMsgUpdateVisible = true;
      });
    },

    getRowKeys(row) {
      return row.id;
    },

    // 图形展示仓库/加工厂下的材料列表
    imgInquiryDetails(id) {
      this.storageId = id;
      this.pageMate = 1;
      this.getWarehouseMaterial();

      this.siteSel = 1;
    },
    // 获取该仓库下材料列表
    getWarehouseMaterial() {
      stockMaterialPort({
        state: this.state,
        materialId: this.materialstate,
        storageIdList: [this.storageId],
        startTime: this.time == null ? "" : this.time[0],
        endTime: this.time == null ? "" : this.time[1],
        keyword: this.keyword,
        page: this.pageMate,
        pageNum: 10,
      }).then((res) => {
        console.log("原材料库存列表查询");
        console.log(res);

        this.totalMate = res.data.data.total;
        this.imgMaterialList = res.data.data.list;
      });
    },
    // 分页
    handleMateChange(val) {
      this.pageMate = val;
      this.getWarehouseMaterial();
      document.getElementById("stock-inquiry").scrollIntoView();
    },
    backToImg() {
      this.siteSel = 0;
    },
    // 图表切换
    listOrChart() {
      if (this.stockInquiryParam.sel == 0) {
        this.stockInquiryParam.sel = 1;
      } else if (this.stockInquiryParam.sel == 1) {
        this.stockInquiryParam.sel = 0;
      }
    },
    // 模糊搜索原材料列表
    warehouseKeywordCheck() {
      stockMaterialPort({
        state: this.state,
        materialId: this.materialstate,
        storageIdList: this.storageIdList,
        startTime: this.time == null ? "" : this.time[0],
        endTime: this.time == null ? "" : this.time[1],
        keyword: this.keyword,
        page: this.page,
        pageNum: 10,
      }).then((res) => {
        console.log("原材料库存列表查询");
        console.log(res);

        this.total = res.data.data.total;
        this.stockListPage = res.data.data.list;
      });
    },
    // 查找有原材料的仓库
    warehouseStockCheck() {
      this.stockInMsg = "数据加载中";
      warehouseStockPort({
        state: this.state,
        materialId: this.materialstate,
        storageIdList: this.storageIdList,
        startTime: this.time == null ? "" : this.time[0],
        endTime: this.time == null ? "" : this.time[1],
        keyword: this.keyword,
      }).then((res) => {
        console.log("有原材料的仓库");
        console.log(res);

        this.stockInList = res.data.data;
        if (this.stockInList.length == 0) {
          this.stockInMsg = "暂无数据";
        }
      });
    },

    backToList() {
      if (this.stockInquiryParam.sel == 0) {
        this.siteSel = 0;
      } else {
        this.siteSel = 1;
      }
    },
    backList() {
      this.siteSel = 0;
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
    checkStockInquiry() {
      this.page = 1;
      this.warehouseStockCheck();
      this.warehouseKeywordCheck();
    },
    // 分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;

      this.warehouseKeywordCheck();

      document.getElementById("stock-inquiry").scrollIntoView();
    },
  },
};
</script>
<style scoped lang="scss">
.add-left {
  width: 900px;
  text-align: left;

  .num span {
    cursor: pointer;
    font-size: 16px;
  }
}
.stock-inquiry-container {
  width: 100%;

  .stock-inquiry-top {
    padding: 22px 30px;
    padding-bottom: 0;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: #aaa;
    text-align: left;
    display: flex;
    justify-content: space-between;

    .top-right {
      display: flex;

      p {
        margin: 0;
        cursor: pointer;
      }
    }
  }

  .stock-inquiry-main {
    margin-top: 20px;
    background-color: #fff;
    border-radius: 6px;

    .svg-style {
      width: auto;
      padding: 20px;
      padding-top: 0;
      overflow: hidden;
      position: relative;

      .border-every-style {
        display: flex;
        flex-wrap: wrap;

        .border-style {
          width: auto;
          height: 40px;
          padding: 5px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border: 1px solid #3d81fd;
          background-color: #e3edff;
          border-radius: 4px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        .every-style {
          width: 50px;
          height: 2px;
          margin-top: 25px;
          background-color: #3d81fd;
        }
      }
    }
  }

  .input-style {
    width: 100%;
    height: 34px !important;
    padding-left: 0;
    line-height: 34px !important;
    border: none;
    border-radius: 0;
  }

  .qrcode {
    display: inline-block;
    margin-left: 15px;
    cursor: pointer;
  }
}

text {
  pointer-events: none;
  font-size: 14px;
  font-weight: bold;
}

circle {
  cursor: pointer;
}
</style>
<style lang="scss">
#noteStyle {
  .el-textarea__inner {
    display: block;
    resize: vertical;
    padding: 5px 15px;
    line-height: 1.5;
    box-sizing: border-box;
    width: 100%;
    font-size: inherit;
    color: #606266;
    background-color: #fff;
    background-image: none;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
}
#stock-inquiry {
  .el-dialog__body {
    height: 600px;
    overflow: auto;
    padding: 0 20px;
  }
}

#stockWarehouseCheck {
  .el-button--info {
    color: #000;
    background-color: #d1d8de;
    border-color: #d1d8de;
  }
}

.el-dialog__header {
  text-align: left;
}
</style>
