<template>
  <div style="margin-top: -20px;padding-top: 20px;">
    <div
      class="warehouse-management-container"
      id="warehouse"
      v-if="chooseimgshow == false"
    >
      <!-- <h1>成品入库管理</h1> -->
      <div class="add-left">
        <el-tabs v-model="activeName">
          <el-tab-pane label="成品信息" name="first">
            <p class="title-font">原材料清单</p>
            <el-table
              :data="deliveryData.stockInList"
              style="width: 100%"
              border
              id="leftCon"
            >
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
              <el-table-column align="center" label="总数量">
                <template slot-scope="scope">
                  <div>
                    <span>{{
                      scope.row.chargeUnit == "粒"
                        ? scope.row.totalNum + " " + scope.row.chargeUnit
                        : scope.row.totalNum
                    }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="总重量">
                <template slot-scope="scope">
                  <div>
                    <span>{{
                      scope.row.totalWeight == 0
                        ? scope.row.totalWeight
                        : scope.row.totalWeight + " " + scope.row.chargeUnit
                    }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="入库数量" width="130">
                <template slot-scope="scope">
                  <div class="num">
                    <el-input
                      v-model="scope.row.number"
                      @input="changeNum(scope.$index)"
                      ><i
                        slot="suffix"
                        style="color: #606266;margin-right:10%;font-style:normal;"
                        >{{
                          scope.row.chargeUnit == "粒"
                            ? scope.row.chargeUnit
                            : scope.row.chargeUnit == "件"
                            ? scope.row.chargeUnit
                            : ""
                        }}</i
                      >
                    </el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="入库重量" width="130">
                <template slot-scope="scope">
                  <div class="num">
                    <!-- :readonly="true" -->
                    <el-input
                      v-model="scope.row.weight"
                      @input="changeWeight(scope.$index)"
                      ><i
                        slot="suffix"
                        style="color: #606266;margin-right:10%;font-style:normal;"
                        >{{
                          scope.row.chargeUnit !== "粒"
                            ? scope.row.chargeUnit != "件"
                              ? scope.row.chargeUnit
                              : ""
                            : ""
                        }}</i
                      >
                    </el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="移除材料" width="120">
                <template slot-scope="scope">
                  <div class="num">
                    <el-button
                      type="text"
                      style="color: red;"
                      @click="delNum(scope.$index)"
                      >移除</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-form
              style="margin-top: 20px;"
              :model="deliveryData"
              :rules="deliveryRules"
              ref="deliveryForm"
              label-width="78px"
            >
              <el-form-item label="设计图" prop="designId">
                <el-button
                  type="text"
                  v-if="chooseimgshow == false"
                  @click="chooseimgshow = true"
                  >点击选择设计图</el-button
                >

                <div
                  v-show="chooseimgshow == false && chooselistimg"
                  style="display:flex;position:relative;flex-wrap: wrap;"
                >
                  <div
                    v-for="(imgurl, index) of imgListFilter(
                      chooselistimgtemp.img
                    )"
                    :key="index"
                    style="margin-left:10px;position:relative;"
                  >
                    <img
                      v-if="imgurl !== '' && imgurl !== null"
                      :src="axiosUrl + '/file/' + imgurl"
                      width="100px"
                      height="100px"
                      style="border-radius:5px;object-fit:cover;"
                    />
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="成品图" prop="img">
                <div>
                  <UploadImg
                    :imgUrl="deliveryData.img"
                    :isUpdate="1"
                    @imgChange="productImgUrlChange"
                  ></UploadImg>
                </div>
              </el-form-item>
              <el-form-item label="详情图" prop="detailImg">
                <UploadImg
                  :imgUrl="deliveryData.detailImg"
                  :isUpdate="1"
                  @imgChange="detailImgUrlChange"
                ></UploadImg>
              </el-form-item>

              <el-form-item label="唯一编号" prop="productNumber">
                <el-input
                  v-model="deliveryData.productNumber"
                  placeholder="请输入唯一编号"
                ></el-input>
              </el-form-item>

              <el-form-item label="成品名称" prop="productName">
                <el-input
                  v-model="deliveryData.productName"
                  placeholder="请输入成品名称"
                ></el-input>
              </el-form-item>

              <el-form-item label="标签" prop="productLabel">
                <el-select
                  v-model="deliveryData.productLabel"
                  placeholder="可输入创建选择/直接多选"
                  multiple
                  filterable
                  allow-create
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in productLabelList"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="品牌系列" prop="brandSeries">
                <el-select
                  style="width: 100%;"
                  v-model="deliveryData.brandSeries"
                  placeholder="可输入创建选择/直接多选"
                  multiple
                  filterable
                  allow-create
                >
                  <el-option
                    v-for="item in brandSeriesList"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="联名系列" prop="coBrandedSeries">
                <el-select
                  style="width: 100%;"
                  v-model="deliveryData.coBrandedSeries"
                  placeholder="可输入创建选择/直接多选"
                  multiple
                  filterable
                  allow-create
                >
                  <el-option
                    v-for="item in brandSeriesList"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="参数" prop="params">
                <el-input
                  type="textarea"
                  v-model="deliveryData.params"
                  placeholder="请输入产品参数"
                ></el-input>
              </el-form-item>
              <el-form-item label="证书编号" prop="certificateNumber">
                <el-input
                  v-model="deliveryData.certificateNumber"
                  placeholder="多个证书编号，用逗号隔开"
                ></el-input>
              </el-form-item>
              <el-form-item label="搭配推荐" prop="collocationIdStr">
                <el-select
                  class="input-style"
                  v-model="deliveryData.collocationIdStr"
                  multiple
                  filterable
                  remote
                  reserve-keyword
                  placeholder="可输入成品名称选择搭配推荐"
                  :remote-method="remoteProductMethod"
                  :loading="loading"
                >
                  <el-option
                    v-for="item in productOptionList"
                    :key="item.id"
                    :label="item.productName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="产品备注" prop="note">
                <el-input
                  type="textarea"
                  class="input-style"
                  placeholder="请输入备注信息"
                  v-model="deliveryData.note"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="价格信息" name="second">
            <el-form
              ref="priceMsgForm"
              :model="deliveryData"
              label-width="124px"
            >
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="裸石成本(HKD)" prop="costPrice">
                    <el-input
                      v-model="deliveryData.costPrice"
                      placeholder="请输入成本金额"
                      @change="getNum"
                      @input="priceAndRateChange"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="加工费(CNY)" prop="processCost">
                    <el-input
                      @input="priceAndRateChange"
                      v-model="deliveryData.processCost"
                      placeholder="请输入加工费金额"
                      @change="getNum"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item
                    label="其他费用(HKD)"
                    prop="stockInOtherExpenses"
                  >
                    <el-input
                      v-model="deliveryData.stockInOtherExpenses"
                      placeholder="请输入其他费用"
                      @change="getNum"
                      @input="priceAndRateChange"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="港币兑人民币汇率" prop="totalHkToCnRate">
                    <el-input
                      @input="priceAndRateChange"
                      v-model="deliveryData.totalHkToCnRate"
                      placeholder="请输入港币兑人民币汇率"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="成本港币金额" prop="totalHkPrice">
                    <el-input
                      v-model="deliveryData.totalHkPrice"
                      placeholder="请输入成本港币金额"
                      @change="getNum"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="成本人民币金额" prop="totalCnPrice">
                    <el-input
                      v-model="deliveryData.totalCnPrice"
                      placeholder="请输入成本人民币金额"
                      @change="getNum"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <div
                style="width: 95%;height: 1px;margin: 5px auto 27px auto;border-bottom: 1px dashed #DCDFE6;"
              ></div>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item
                    label="建议批发价(HKD)"
                    prop="adviceWholesalePrice"
                  >
                    <el-input
                      v-model="deliveryData.adviceWholesalePrice"
                      placeholder="请输入建议批发价"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="建议零售价(HKD)" prop="adviseSellPrice">
                    <el-input
                      v-model="deliveryData.adviseSellPrice"
                      placeholder="请输入建议零售价"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="最低销售价(CNY)" prop="lowestSellPrice">
                    <el-input
                      v-model="deliveryData.lowestSellPrice"
                      placeholder="请输入最低销售金额"
                      @change="getNum"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="代理价(CNY)" prop="agentPrice">
                    <el-input
                      v-model="deliveryData.agentPrice"
                      placeholder="请输入代理价"
                      @change="getNum"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <!-- 建议柜台最低销售价 -->
                  <el-form-item
                    label="销售价(CNY)"
                    prop="counterLowestSellPrice"
                  >
                    <el-input
                      v-model="deliveryData.counterLowestSellPrice"
                      placeholder="请输入销售价"
                      @change="getNum"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="标签价(CNY)" prop="tagPrice">
                    <el-input
                      v-model="deliveryData.tagPrice"
                      placeholder="请输入标签金额"
                      @change="getNum"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="库存信息" name="third">
            <el-form
              :model="deliveryData"
              :rules="deliveryRules"
              ref="deliveryWarehouseForm"
              label-width="96px"
            >
              <el-form-item label="入库类型" prop="type">
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
                label="目的地"
                prop="endStorageId"
                v-if="deliveryData.type == 0"
                required
              >
                <el-select
                  v-model="deliveryData.endStorageId"
                  placeholder="请选择目的地"
                  class="input-style"
                  :popper-append-to-body="false"
                >
                  <el-option
                    v-for="item in warehouseFilterList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="仓库/加工厂"
                prop="storageId"
                v-if="deliveryData.type == 1"
              >
                <el-select
                  v-model="deliveryData.storageId"
                  placeholder="请选择仓库/加工厂"
                  class="input-style"
                  :popper-append-to-body="false"
                >
                  <el-option
                    v-for="item in warehouseFilterList"
                    v-show="item.isOwn == 1"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="入库时间" prop="stockInTime">
                <el-date-picker
                  class="input-style"
                  v-model="deliveryData.stockInTime"
                  type="date"
                  placeholder="请选择出库时间"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                >
                </el-date-picker>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane
            label="销售信息"
            name="fourth"
            v-if="deliveryData.type == 1"
          >
            <el-form
              :model="deliveryData"
              :rules="deliveryRules"
              ref="deliverySaleForm"
              label-width="110px"
            >
              <el-form-item label="销售发票号" prop="sellBillNumber">
                <el-input
                  v-model="deliveryData.sellBillNumber"
                  placeholder="请输入销售员"
                  clearable
                  class="input-style"
                ></el-input>
              </el-form-item>
              <el-form-item label="销售员" prop="solder">
                <el-input
                  v-model="deliveryData.solder"
                  placeholder="请输入销售员"
                  clearable
                  class="input-style"
                ></el-input>
              </el-form-item>

              <el-form-item label="销售组" prop="group">
                <el-autocomplete
                  class="input-style"
                  v-model="deliveryData.group"
                  :fetch-suggestions="groupQuery"
                  placeholder="请选择/输入销售组"
                  @select="handleGroupSelect"
                ></el-autocomplete>
              </el-form-item>

              <el-form-item label="顾客姓名" prop="customer">
                <el-input
                  v-model="deliveryData.customer"
                  placeholder="请输入顾客姓名"
                  clearable
                  class="input-style"
                ></el-input>
              </el-form-item>
              <el-form-item label="顾客类型" prop="customer">
                <el-autocomplete
                  v-model="deliveryData.customerType"
                  :fetch-suggestions="customerTypeQuery"
                  placeholder="请选择/输入类型"
                  @select="handleModelSelect"
                ></el-autocomplete>
              </el-form-item>

              <el-form-item label="出售币种" prop="saleCurrency">
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
              <el-form-item label="出售外币金额" prop="saleMoney">
                <el-input
                  v-model="deliveryData.saleMoney"
                  placeholder="请输入出售金额"
                  clearable
                  class="input-style"
                  @input="totalHkRateChange"
                ></el-input>
              </el-form-item>
              <el-form-item label="外币兑港币汇率" prop="totalToHkRate">
                <el-input
                  v-model="deliveryData.totalToHkRate"
                  placeholder="请输入汇率"
                  clearable
                  class="input-style"
                  @input="totalHkRateChange"
                ></el-input>
              </el-form-item>
              <el-form-item label="出售港币金额" prop="sellTotalHkPrice">
                <el-input
                  v-model="deliveryData.sellTotalHkPrice"
                  placeholder="请输入金额"
                  clearable
                  class="input-style"
                ></el-input>
              </el-form-item>
              <el-form-item label="其他支出费用" prop="otherExpenses">
                <el-input
                  v-model="deliveryData.otherExpenses"
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
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="货物转移记录" name="fifth">
            <div>
              <Note :note="recordList" @noteContent="noteContent"></Note>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div style="margin-top: 50px;text-align: right;">
          <el-button @click="resetFormData">重 置</el-button>
          <el-button
            style="width: 120px;"
            type="primary"
            @click="stockInSubmit"
            v-preventClick
            >提 交</el-button
          >
        </div>
      </div>
      <div class="add-right">
        <div>
          <p class="title-font">加工中原材料库存查询</p>
          <div>
            <el-form label-width="110px">
              <!-- 用户管理仓库 -->
              <el-form-item label="仓库/加工厂：" required>
                <el-select
                  style="width:66%;"
                  v-model="storageIdList"
                  multiple
                  clearable
                  placeholder="可多选"
                  :popper-append-to-body="false"
                >
                  <el-option
                    v-for="item in warehouseFilterList"
                    v-show="item.type == 1 && (item.isOwn == 1 || item.id == 0)"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="关键字：">
                <el-input
                  style="width: 66%;"
                  v-model="warehouseKeyword"
                  @change="keywordChange"
                  placeholder="可输入材料名称、统一编号、备注进行搜索"
                  clearable
                >
                </el-input>
                <el-button
                  style="margin-left: 10px;"
                  type="primary"
                  @click="warehouseCheck"
                  >查 询</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </div>
        <el-table
          ref="singleTable"
          :data="deviceFilterList"
          highlight-current-row
          @row-click="handleDeviceListChange"
          @row-dblclick="dblDeviceListChange"
          style="width: 100%"
          border
        >
          <el-table-column align="center" prop="materialName" label="材料名称">
          </el-table-column>
          <el-table-column align="center" prop="productNumber" label="统一编号">
          </el-table-column>
          <el-table-column align="center" label="库存总量">
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
          <el-table-column align="center" label="操作">
            <template>
              <el-button type="text">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="dialogMaterialMsgUpdateVisible">
          <materialMsgUpdate
            :dialogMaterialMsgUpdateVisible="dialogMaterialMsgUpdateVisible"
            :updateMaterialMsg="inventoryCheckDetail"
            @sureUpdateMaterial="sureUpdateMaterial"
          ></materialMsgUpdate>
        </div>
        <div style="width: 100%;height: 50px;padding-bottom: 20px;">
          <div style="margin:40px 0 0;position:absolute;right:30px;">
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
    <div v-else>
      <designSelectUpdate @designSel="designSel"></designSelectUpdate>
    </div>
  </div>
</template>

<script>
import {
  labelMixins,
  brandJointlyMixins,
  groupMixins,
  customerTypeMixins,
} from "@/mixins";

import { base_request_url } from "_req/http";
import {
  stockMaterialInfoPort,
  productSavePort,
  stockMaterialPort,
  warehouseFactoryPort,
  productRecommendPort,
} from "_req/api/common";

import UploadImg from "@/components/upload-img.vue";
import Note from "@/components/note.vue";
import materialMsgUpdate from "@/components/material-msg-update.vue";
import designSelectUpdate from "@/components/design-select-update.vue";

export default {
  components: {
    UploadImg,
    Note,
    materialMsgUpdate,
    designSelectUpdate,
  },
  mixins: [labelMixins, brandJointlyMixins, groupMixins, customerTypeMixins],
  data() {
    return {
      isShow: false,
      axiosUrl: "",
      activeName: "first",
      materialList: [],
      materialId: "",
      storageIdList: [],

      loading: false,
      productOptionList: [],
      deviceFilterList: [],
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

      deliveryData: {
        collocationIdStr: [],
        type: 0,
        storageId: "",
        endStorageId: null,
        designId: "",
        productNumber: "",
        productName: "",
        params: "",
        certificateNumber: "",
        brandSeries: null,
        coBrandedSeries: null,
        img: [],

        sellBillNumber: "",
        solder: "",
        group: "",
        customer: "",
        customerType: "",
        saleMoney: "",
        saleCurrency: "CNY",
        sellTotalHkPrice: "",
        totalToHkRate: "",
        otherExpenses: "",

        stockInTime: "",
        note: "",
        stockInList: [],
        processCost: "",
        costPrice: "",
        stockInOtherExpenses: "",
        lowestSellPrice: "",
        adviseSellPrice: "",
        tagPrice: "",
        adviceWholesalePrice: "",

        totalCnPrice: "",
        totalHkToCnRate: "",
        totalHkPrice: "",

        currency: "CNY",
        productLabel: [],
        detailImg: [],
        agentPrice: "",
        counterLowestSellPrice: "",
      },
      deliveryRules: {
        productNumber: [
          {
            required: true,
            message: "请填写成品唯一编号",
            trigger: "blur",
          },
        ],
        productName: [
          {
            required: true,
            message: "请填写成品名称",
            trigger: "blur",
          },
        ],
        stockInTime: [
          {
            required: true,
            message: "请选择入库时间",
            trigger: "change",
          },
        ],
        storageId: [
          {
            required: true,
            message: "请选择仓库/加工厂",
            trigger: "change",
          },
        ],
        sellBillNumber: [
          {
            required: true,
            message: "请填写销售发票号",
            trigger: "blur",
          },
        ],
        solder: [
          {
            required: true,
            message: "请填写销售员",
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
        saleMoney: [
          {
            required: true,
            message: "请填写销售价格",
            trigger: "blur",
          },
        ],
        endStorageId: [
          {
            required: true,
            message: "请选择目的地",
            trigger: "change",
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
      producibleDesignList: {},

      warehouseFilterList: [],
      chooseimgshow: false,
      chooseimgshowlist: -1,
      chooselistimg: "",
      chooselistimgtemp: [],

      recordList: [],
    };
  },
  created() {
    this.axiosUrl = base_request_url;
    this.noteTime = this.shellDate(new Date());
    this.getWarehouseFactoryList();
  },
  methods: {
    // 货物转移记录
    noteContent(val) {
      console.log("货物转移记录变化赋值", val);
      this.recordList = val;
    },

    // 搭配推荐
    remoteProductMethod(query) {
      if (query) {
        this.loading = true;

        productRecommendPort({
          keyword: query,
        })
          .then((res) => {
            console.log("条件查找成品库存列表");
            console.log(res);
            this.loading = false;

            this.productOptionList = res.data.data;
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        this.productOptionList = [];
      }
    },

    // 裸石成本价格 换算
    priceAndRateChange() {
      if (
        this.deliveryData.totalHkToCnRate &&
        this.deliveryData.costPrice &&
        this.deliveryData.processCost
      ) {
        this.deliveryData.totalCnPrice = (
          this.deliveryData.costPrice * this.deliveryData.totalHkToCnRate +
          this.deliveryData.stockInOtherExpenses *
            this.deliveryData.totalHkToCnRate +
          Number(this.deliveryData.processCost)
        ).toFixed(0);
        this.deliveryData.totalHkPrice = (
          this.deliveryData.processCost / this.deliveryData.totalHkToCnRate +
          Number(this.deliveryData.stockInOtherExpenses) +
          Number(this.deliveryData.costPrice)
        ).toFixed(0);
      }
    },

    // 价格输入
    getNum() {
      this.deliveryData.saleMoney = this.getPriceNum(
        this.deliveryData.saleMoney
      );
      this.deliveryData.processCost = this.getPriceNum(
        this.deliveryData.processCost
      );
      this.deliveryData.costPrice = this.getPriceNum(
        this.deliveryData.costPrice
      );
      this.deliveryData.stockInOtherExpenses = this.getPriceNum(
        this.deliveryData.stockInOtherExpenses
      );
      this.deliveryData.lowestSellPrice = this.getPriceNum(
        this.deliveryData.lowestSellPrice
      );
      this.deliveryData.tagPrice = this.getPriceNum(this.deliveryData.tagPrice);

      this.deliveryData.totalCnPrice = this.getPriceNum(
        this.deliveryData.totalCnPrice
      );
      this.deliveryData.totalHkPrice = this.getPriceNum(
        this.deliveryData.totalHkPrice
      );
    },

    // 仓库/加工厂是否为必填
    typeChange() {
      if (this.deliveryData.type == 1) {
        this.deliveryRules.solder[0].required = true;
        this.deliveryRules.group[0].required = true;
        this.deliveryRules.saleMoney[0].required = true;

        if (this.deliveryData.stockInList.length == 0) {
          this.deliveryRules.storageId[0].required = true;
        } else {
          this.deliveryRules.storageId[0].required = false;
        }
        this.$nextTick(() => {
          this.$refs.deliverySaleForm.clearValidate();
        });
      } else {
        this.deliveryRules.solder[0].required = false;
        this.deliveryRules.group[0].required = false;
        this.deliveryRules.saleMoney[0].required = false;
        this.deliveryRules.storageId[0].required = false;
      }
    },

    // 设计图选择
    designSel(val) {
      this.chooselistimgtemp = val.val;
      this.chooseimgshow = false;
      if (val.isClose == 0) {
        this.chooseimgshowlist = this.chooselistimgtemp.id;
        this.chooselistimg = this.chooselistimgtemp.img;
      }
    },

    // 成品入库
    stockInSubmit() {
      if (
        this.deliveryData.stockInList.length == 0 ||
        this.chooseimgshowlist == -1
      ) {
        this.$confirm("是否确认没有原材料或设计稿?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$refs.deliveryForm.validate((valid) => {
              if (valid) {
                this.$refs.deliveryWarehouseForm.validate((valid) => {
                  if (valid) {
                    if (this.deliveryData.type == 1) {
                      this.$refs.deliverySaleForm.validate((valid) => {
                        if (valid) {
                          this.submitBillSure();
                        } else {
                          this.$message.error({
                            message: "有销售信息未填写",
                          });
                          return false;
                        }
                      });
                    } else {
                      this.submitBillSure();
                    }
                  } else {
                    this.$message.error({
                      message: "有库存信息未填写",
                    });
                    return false;
                  }
                });
              } else {
                this.$message.error({
                  message: "有成品信息未填写",
                });
                return false;
              }
            });
          })
          .catch(() => {
            console.log("取消");
          });
      } else {
        this.$refs.deliveryForm.validate((valid) => {
          if (valid) {
            this.$refs.deliveryWarehouseForm.validate((valid) => {
              if (valid) {
                if (this.deliveryData.type == 1) {
                  this.$refs.deliverySaleForm.validate((valid) => {
                    if (valid) {
                      this.submitBillSure();
                    } else {
                      this.$message.error({
                        message: "有销售信息未填写",
                      });
                      return false;
                    }
                  });
                } else {
                  this.submitBillSure();
                }
              } else {
                this.$message.error({
                  message: "有库存信息未填写",
                });
                return false;
              }
            });
          } else {
            this.$message.error({
              message: "有成品信息未填写",
            });
            return false;
          }
        });
      }
    },
    submitBillSure() {
      if (this.deliveryData.type == 0) {
        this.deliveryData.storageId = this.deliveryData.endStorageId;
      }

      productSavePort({
        ...this.deliveryData,
        designId: this.chooseimgshowlist,
        img: this.deliveryData.img.join("|"),
        productLabel: this.deliveryData.productLabel.join("|"),
        detailImg: this.deliveryData.detailImg.join("|"),
        collocationIdStr: this.deliveryData.collocationIdStr.join("|"),
        brandSeries: this.deliveryData.brandSeries.join("|"),
        coBrandedSeries: this.deliveryData.coBrandedSeries.join("|"),
        transferRemarks: JSON.stringify(this.recordList),
      })
        .then((res) => {
          console.log("成品提交");
          console.log(res);
          this.$message.success("提交成功");
          this.resetFormData();
          this.activeName = "first";
          this.$refs.deliveryForm.clearValidate();
          this.$refs.deliveryWarehouseForm.clearValidate();

          this.warehouseCheck();
          document.getElementById("warehouse").scrollIntoView();
        })
        .catch(() => {
          this.recordList = JSON.parse(this.recordList);
        });
    },
    // 重置表单
    resetFormData() {
      this.activeName = "first";
      this.recordList = [];
      this.chooseimgshowlist = -1;
      this.chooselistimg = "";
      this.deliveryData.stockInList = [];

      this.$refs.deliveryForm.resetFields();
      this.$refs.priceMsgForm.resetFields();
      this.$refs.deliveryWarehouseForm.resetFields();
      this.$refs.deliverySaleForm.resetFields();
    },
    // 数量变化
    changeNum(index) {
      console.log(index);
      if (this.deliveryData.stockInList[index].totalNum !== 0) {
        if (this.deliveryData.stockInList[index].number < 1) {
          this.$message.error({
            message: "入库数量最少为1",
            showClose: true,
            duration: 1500,
          });
          return;
        } else if (
          this.deliveryData.stockInList[index].number >
          this.deliveryData.stockInList[index].totalNum
        ) {
          this.$message.error({
            message: "入库数量不能大于总数量",
            showClose: true,
            duration: 1500,
          });
          return;
        }
      } else {
        this.$message.error({
          message: "该材料总数量为0，不可入库",
          showClose: true,
          duration: 1500,
        });
        return;
      }

      this.joinData();

      this.getMaterialTotal();
    },
    // 重量变化
    changeWeight(index) {
      if (this.deliveryData.stockInList[index].totalWeight !== 0) {
        if (this.deliveryData.stockInList[index].weight < 0) {
          this.$message.error({
            message: "入库重量不能为负",
            showClose: true,
            duration: 1500,
          });
          return;
        } else if (
          this.deliveryData.stockInList[index].weight >
          this.deliveryData.stockInList[index].totalWeight
        ) {
          this.$message.error({
            message: "入库重量不能大于总重量",
            showClose: true,
            duration: 1500,
          });
          return;
        } else if (this.deliveryData.stockInList[index].weight == 0) {
          this.$message.error({
            message: "入库重量不能为零",
            showClose: true,
            duration: 1500,
          });
          return;
        }
      } else {
        this.$message.error({
          message: "该材料总重量为0，不可入库",
          showClose: true,
          duration: 1500,
        });
        return;
      }

      this.joinData();

      this.getMaterialTotal();
    },
    // 删
    delNum(index) {
      this.deliveryData.stockInList.splice(index, 1); //页面--成品待出库清单
      this.joinData();
      if (this.deliveryData.type == 1) {
        if (this.deliveryData.stockInList.length == 0) {
          this.deliveryRules.storageId[0].required = true;
        } else {
          this.deliveryRules.storageId[0].required = false;
        }
      } else {
        this.deliveryRules.storageId[0].required = false;
      }
    },

    // 选择出库材料
    handleDeviceListChange(row, column) {
      if (column.label == "操作") {
        this.stockOutDetails(row);
      }
    },
    dblDeviceListChange(row) {
      if (this.deliveryData.stockInList.length == 0) {
        let num = "";
        if (row.chargeUnit == "件") {
          num = 1;
        } else {
          num = row.number;
        }
        this.deliveryData.stockInList.push({
          id: row.id,
          materialName: row.materialName,
          productNumber: row.productNumber,
          number: num,
          weight: row.weight,
          totalNum: row.number,
          totalWeight: row.weight,
          chargeUnit: row.chargeUnit,
          currency: row.currency,
          unitPrice: row.unitPrice,
          rate: row.totalHkRate,
        });

        this.joinData();
      } else {
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
            num = row.number;
          }
          this.deliveryData.stockInList.push({
            id: row.id,
            materialName: row.materialName,
            productNumber: row.productNumber,
            number: num,
            weight: row.weight,
            totalNum: row.number,
            totalWeight: row.weight,
            chargeUnit: row.chargeUnit,
            rate: row.totalHkRate,
            unitPrice: row.unitPrice,
          });

          this.joinData();
        }
      }

      if (this.deliveryData.type == 1) {
        if (this.deliveryData.stockInList.length == 0) {
          this.deliveryRules.storageId[0].required = true;
        } else {
          this.deliveryRules.storageId[0].required = false;
        }
      } else {
        this.deliveryRules.storageId[0].required = false;
      }

      this.getMaterialTotal();

      console.log(this.deliveryData);
    },
    // 根据所选裸石计算裸石成本
    getMaterialTotal() {
      this.deliveryData.costPrice = 0;
      for (const item of this.deliveryData.stockInList) {
        console.log(item);
        if (item.currency == "HKD") {
          console.log("1111111111111111");
          if (item.chargeUnit == "粒") {
            this.deliveryData.costPrice += Number(
              Number(item.unitPrice * item.number).toFixed(0)
            );
          } else {
            this.deliveryData.costPrice += Number(
              Number(item.unitPrice * item.weight).toFixed(0)
            );
          }
        } else if (item.currency == "CNY") {
          if (item.rate) {
            if (item.chargeUnit == "粒") {
              if (item.rate >= 1) {
                this.deliveryData.costPrice += Number(
                  Number(item.unitPrice * item.rate * item.number).toFixed(0)
                );
              } else {
                this.deliveryData.costPrice += Number(
                  Number((item.unitPrice / item.rate) * item.number).toFixed(0)
                );
              }
            } else {
              if (item.rate >= 1) {
                this.deliveryData.costPrice += Number(
                  Number(item.unitPrice * item.rate * item.weight).toFixed(0)
                );
              } else {
                this.deliveryData.costPrice += Number(
                  Number((item.unitPrice / item.rate) * item.weight).toFixed(0)
                );
              }
            }
          }
        } else {
          if (item.rate) {
            console.log("22222222222");
            if (item.chargeUnit == "粒") {
              this.deliveryData.costPrice += Number(
                Number(item.unitPrice * item.rate * item.number).toFixed(0)
              );
            } else {
              console.log(typeof this.deliveryData.costPrice);
              this.deliveryData.costPrice += Number(
                Number(item.unitPrice * item.rate * item.weight).toFixed(0)
              );
            }
          }
        }
        console.log(this.deliveryData.costPrice);
      }

      console.log(this.deliveryData.costPrice);
    },
    // 拼接参数
    joinData() {
      this.deliveryData.params = "";
      for (const item of this.deliveryData.stockInList) {
        if (item.chargeUnit == "粒") {
          this.deliveryData.params +=
            item.materialName + ",数量" + item.number + "|";
        } else {
          this.deliveryData.params +=
            item.materialName +
            ",数量" +
            item.number +
            "(" +
            item.weight +
            item.chargeUnit +
            ")|";
        }
      }
      this.deliveryData.params = this.deliveryData.params.substring(
        0,
        this.deliveryData.params.length - 1
      );
      console.log(this.deliveryData.params);
    },
    // 判断是否重复添加
    filterSel(val) {
      for (const item of this.deliveryData.stockInList) {
        if (item.id == val.id) {
          return true;
        }
      }
      return false;
    },

    // 出售金额-汇率变化
    totalHkRateChange() {
      if (this.deliveryData.saleCurrency === "HKD") {
        this.deliveryData.sellTotalHkPrice = this.deliveryData.saleMoney;
      } else {
        if (this.deliveryData.totalToHkRate && this.deliveryData.saleMoney) {
          if (this.deliveryData.saleCurrency === "CNY") {
            if (this.deliveryData.totalToHkRate >= 1) {
              this.deliveryData.sellTotalHkPrice = Number(
                this.deliveryData.saleMoney * this.deliveryData.totalToHkRate
              ).toFixed(0);
            } else {
              this.deliveryData.sellTotalHkPrice = Number(
                this.deliveryData.saleMoney / this.deliveryData.totalToHkRate
              ).toFixed(0);
            }
          } else {
            this.deliveryData.sellTotalHkPrice = Number(
              this.deliveryData.saleMoney * this.deliveryData.totalToHkRate
            ).toFixed(0);
          }
        } else {
          this.deliveryData.sellTotalHkPrice = "";
        }
      }
    },
    // 币种-汇率变化
    currencyChange() {
      if (this.deliveryData.saleCurrency == "HKD") {
        this.deliveryData.totalToHkRate = 1;
        this.deliveryData.sellTotalHkPrice = this.deliveryData.saleMoney;
      } else {
        this.deliveryData.totalToHkRate = "";
        this.deliveryData.sellTotalHkPrice = "";
      }

      this.deliveryData.stockInList = JSON.parse(
        JSON.stringify(this.deliveryData.stockInList)
      );
    },

    // 修改查看材料
    stockOutDetails(row) {
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
    // 原材料库存查询
    warehouseCheck() {
      stockMaterialPort({
        storageIdList: this.storageIdList,
        state: 1,
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
      warehouseFactoryPort()
        .then((res) => {
          console.log("仓库/加工厂");
          console.log(res);
          this.isShow = true;
          this.warehouseFilterList = res.data.data;
          this.warehouseCheck();
        })
        .catch(() => {
          this.isShow = true;
        });
    },
    // 成品图片
    productImgUrlChange(data) {
      console.log("图片", data);
      this.deliveryData.img = data.img;
    },
    // 详情图片
    detailImgUrlChange(data) {
      this.deliveryData.detailImg = data.img;
    },
  },
};
</script>

<style lang="scss" scoped>
.warehouse-management-container {
  display: flex;
  justify-content: space-between;

  .add-left {
    width: 50%;
    padding: 10px;
    margin-right: 10px;
    text-align: left;
    background-color: #fff;
    border-radius: 6px;

    .num {
      text-align: center;
    }
  }

  .add-right {
    width: 50%;
    padding: 10px;
    text-align: left;
    background-color: #fff;
    border-radius: 6px;
  }

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
        color: #606266;
      }

      .one-right {
        width: 373px;
        padding-left: 10px;
      }
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

.el-dialog__body {
  padding: 10px 20px;
  height: 63vh;
  overflow-y: scroll;
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

#leftCon {
  .el-input__inner {
    width: 100%;
    height: 25px !important;
    line-height: 25px;
  }

  .el-input__suffix {
    width: 17px;
    right: 20px;
  }
}
</style>
