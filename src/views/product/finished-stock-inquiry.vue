<template>
  <div class="stock-inquiry-container" id="stock-inquiry">
    <!-- 库存查询 -->
    <div class="stock-inquiry-pc" v-show="pageSel == 0">
      <div v-show="siteSel == 0">
        <!-- 头部查询条件 -->
        <div class="stock-inquiry-top" id="stockWarehouseCheck">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="状态：">
              <el-select v-model="state" placeholder="请选择" style="width: 150px;" :popper-append-to-body="false">
                <el-option v-for="flag in stateList" :key="flag.id" :label="flag.name" :value="flag.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="仓库/加工厂：">
              <el-select v-model="storageIdList" multiple clearable placeholder="可多选" style="width: 150px;"
                :popper-append-to-body="false">
                <el-option v-for="item in warehouseFilterList" v-show="item.isOwn != 0" :key="item.id" :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="活动：">
              <el-select v-model="activityId" placeholder="选择活动" style="width: 150px;" clearable>
                <el-option v-for="item in activityList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="入库时间：">
              <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <div style="display: flex;">
                <el-input style="width: 350px;" v-model="keyword" placeholder="可输入产品名称、设计图名称、统一编号、备注进行搜索" clearable>
                </el-input>
                <el-button style="margin-left: 10px;" type="primary" @click="checkStockInquiry">查 询</el-button>
              </div>
            </el-form-item>
          </el-form>
          <div class="top-right">
            <el-tooltip class="item" style="margin-left: 20px;height: 40px;" effect="dark" content="图表切换"
              placement="bottom-end">
              <img :src="stockInquiryParam.sel == 1 ? img1 : img2" @click="listOrChart" style="cursor:pointer;" />
            </el-tooltip>
          </div>
        </div>
        <div class="stock-inquiry-main">
          <!-- 图形 -->
          <div v-if="stockInquiryParam.sel == 1" class="svg-style">
            <div style="text-align: center;" v-if="stockInList.length == 0">
              <p>{{ stockInMsg }}</p>
            </div>
            <div v-else class="border-every-style">
              <div v-for="(warehouse, index) in stockInList" :key="index" style="display: flex;margin-top: 20px;">
                <div class="border-style" @click="imgInquiryDetails(warehouse.id)">
                  <p style="margin: 0">{{ warehouse.name }}</p>
                  <p style="margin: 0;font-size: 13px;font-weight: 600;">
                    总数：{{ warehouse.total }}
                  </p>
                </div>
                <div class="every-style" v-if="index < stockInList.length - 1"></div>
              </div>
            </div>
          </div>
          <!-- 表格 -->
          <div v-if="stockInquiryParam.sel == 0" style="padding: 20px;">
            <el-table style="width: 100%;" ref="multipleTable" :data="stockListPage" :row-key="getRowKeys"
              tooltip-effect="dark" border highlight-current-row @row-click="checkproductDetails"
              @row-dblclick="dblProductDetails">
              <el-table-column align="center" width="70px" label="出库">
                <template>
                  <div>
                    <span style="cursor: pointer;color: #3d81fd;">出库</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" width="80px" label="打印标签">
                <template>
                  <div>
                    <span style="cursor: pointer;color: #3d81fd;">打印</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="materialName" label="图片">
                <template slot-scope="scope">
                  <div>
                    <img :src="axiosUrl + '/file/jewelry/' + imgFilter(scope.row.img)"
                      style="width: 100px;height: 100px;object-fit: cover;" />
                  </div>
                </template>
              </el-table-column>

              <el-table-column align="center" prop="productName" label="名称">
              </el-table-column>
              <el-table-column align="center" prop="productNumber" label="统一编号">
              </el-table-column>

              <el-table-column align="center" prop="processCost" label="加工费">
                <template slot-scope="scope">
                  <div>
                    <span>{{ formatNumberRgx(scope.row.processCost) + " CNY" }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="成本港币" prop="totalHkPrice">
                <template slot-scope="scope">
                  <div>
                    <span>{{ formatNumberRgx(scope.row.totalHkPrice) + " HKD" }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="成本人民币" prop="totalCnPrice">
                <template slot-scope="scope">
                  <div>
                    <span>{{ formatNumberRgx(scope.row.totalCnPrice) + " CNY" }}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column align="center" label="代理价(CNY)" prop="agentPrice">
                <template slot-scope="scope">
                  <div>
                    <span>{{ formatNumberRgx(scope.row.agentPrice) + " CNY" }}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column align="center" label="销售价(CNY)" prop="counterLowestSellPrice">
                <template slot-scope="scope">
                  <div>
                    <span>{{ formatNumberRgx(scope.row.counterLowestSellPrice) + " CNY" }}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column align="center" label="标签价(CNY)" prop="tagPrice">
                <template slot-scope="scope">
                  <div>
                    <span>{{ formatNumberRgx(scope.row.tagPrice) + " CNY" }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="designName" label="库存地">
                <template slot-scope="scope">
                  <div>
                    <span>{{ scope.row.storageName }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                  <div v-for="(e, index) in stateList" :key="index">
                    <span v-show="scope.row.state == e.id && e.name != '全部'">{{ e.name }}</span>
                  </div>
                </template>
              </el-table-column>

              <!-- <el-table-column align="center" prop="note" label="产品备注">
                <template slot-scope="scope">
                  <div>
                    <el-tooltip class="item" effect="light" :content="scope.row.note" placement="bottom">
                      <div class="tooltipFlow">{{ scope.row.note }}</div>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column> -->
            </el-table>

            <div style="width: 100%;height: 50px;">
              <div style="margin:15px 0;position:absolute;right:6%;">
                <el-pagination @current-change="handleCurrentChange" :current-page="page" :page-size="10"
                  layout="total, prev, pager, next, jumper" :total="total">
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 图形--》表格 -->
      <div v-show="siteSel == 1" class="stock-inquiry-main" style="padding: 20px;margin: 0;">
        <div style="width: 60px;margin-bottom: 20px;display: flex;justify-content:space-between;cursor: pointer;"
          @click="backToImg">
          <img src="../../assets/imgs/home/goback.png" style="height: 21px;" />
          <p style="margin: 0;">返回</p>
        </div>
        <el-table style="width: 100%;" ref="multipleTableSel" :data="imgMaterialList" :row-key="getRowKeys"
          tooltip-effect="dark" border highlight-current-row @row-click="checkproductDetails"
          @row-dblclick="dblProductDetails">
          <el-table-column align="center" width="70px" label="出库">
            <template>
              <div>
                <span style="cursor: pointer;color: #3d81fd;">出库</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" width="80px" label="打印标签">
            <template>
              <div>
                <span style="cursor: pointer;color: #3d81fd;">打印</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="materialName" label="图片">
            <template slot-scope="scope">
              <div>
                <img :src="axiosUrl + '/file/jewelry/' + imgFilter(scope.row.img)" alt=""
                  style="width: 100px;height: 100px;object-fit: cover;" />
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="productName" label="名称">
          </el-table-column>
          <el-table-column align="center" prop="productNumber" label="统一编号">
          </el-table-column>

          <el-table-column align="center" prop="processCost" label="加工费">
            <template slot-scope="scope">
              <div>
                <span>{{ formatNumberRgx(scope.row.processCost) + " CNY" }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="成本港币" prop="totalHkPrice">
            <template slot-scope="scope">
              <div>
                <span>{{ formatNumberRgx(scope.row.totalHkPrice) + " HKD" }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="成本人民币" prop="totalCnPrice">
            <template slot-scope="scope">
              <div>
                <span>{{ formatNumberRgx(scope.row.totalCnPrice) + " CNY" }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column align="center" label="代理价(CNY)" prop="agentPrice">
            <template slot-scope="scope">
              <div>
                <span>{{ formatNumberRgx(scope.row.agentPrice) + " CNY" }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column align="center" label="销售价(CNY)" prop="counterLowestSellPrice">
            <template slot-scope="scope">
              <div>
                <span>{{ formatNumberRgx(scope.row.counterLowestSellPrice) + " CNY" }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column align="center" label="标签价(CNY)" prop="tagPrice">
            <template slot-scope="scope">
              <div>
                <span>{{ formatNumberRgx(scope.row.tagPrice) + " CNY" }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="designName" label="库存地">
            <template slot-scope="scope">
              <div>
                <span>{{ scope.row.storageName }}</span>
              </div>
            </template>
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

          <!-- <el-table-column align="center" prop="note" label="产品备注">
            <template slot-scope="scope">
              <div>
                <el-tooltip class="item" effect="light" :content="scope.row.note" placement="bottom">
                  <div class="tooltipFlow">{{ scope.row.note }}</div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <!-- 出库 -->
      <div v-show="siteSel == 2" style="padding: 20px;background-color: #fff;border-radius: 6px;">
        <div style="width: 60px;margin-bottom: 20px;display: flex;justify-content:space-between;cursor: pointer;"
          @click="backToList">
          <img src="../../assets/imgs/home/goback.png" style="height: 21px;" />
          <p style="margin: 0;">返回</p>
        </div>
        <div class="add-left">
          <el-form :model="deliveryData" :rules="deliveryRules" ref="topDataRef" label-width="125px">
            <el-form-item label="出库类型：" prop="type">
              <el-select v-model="deliveryData.type" class="input-style" @change="typeChange"
                :popper-append-to-body="false">
                <el-option v-for="item in deliveryType" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="目的地：" prop="endStorageId" v-if="deliveryData.type == 0">
              <el-select v-model="deliveryData.endStorageId" placeholder="请选择目的地" class="input-style"
                :popper-append-to-body="false">
                <el-option v-for="item in warehouseFilterList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="销售发票号：" prop="sellBillNumber" v-if="deliveryData.type == 1">
              <el-input v-model="deliveryData.sellBillNumber" placeholder="请输入" clearable class="input-style"></el-input>
            </el-form-item>

            <el-form-item label="销售员：" prop="solder" v-if="deliveryData.type == 1">
              <el-input v-model="deliveryData.solder" placeholder="请输入销售员" clearable class="input-style"></el-input>
            </el-form-item>

            <el-form-item label="销售组：" prop="group" v-if="deliveryData.type == 1">
              <el-autocomplete class="input-style" v-model="deliveryData.group" :fetch-suggestions="groupQuery"
                placeholder="请选择/输入销售组" @select="handleGroupSelect"></el-autocomplete>
            </el-form-item>

            <el-form-item label="顾客姓名：" prop="customer" v-if="deliveryData.type == 1">
              <el-input v-model="deliveryData.customer" placeholder="请输入顾客姓名" clearable class="input-style"></el-input>
            </el-form-item>

            <el-form-item label="顾客类型：" prop="customerType" v-if="deliveryData.type == 1">
              <el-autocomplete class="input-style" v-model="deliveryData.customerType"
                :fetch-suggestions="customerTypeQuery" placeholder="请选择/输入类型"
                @select="handleModelSelect"></el-autocomplete>
            </el-form-item>

            <el-form-item label="出售币种：" prop="saleCurrency" v-if="deliveryData.type == 1">
              <el-radio-group v-model="deliveryData.saleCurrency" @change="currencyChange">
                <el-radio label="CNY">CNY</el-radio>
                <el-radio label="EUR">EUR</el-radio>
                <el-radio label="USD">USD</el-radio>
                <el-radio label="HKD">HKD</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="外币兑港币汇率：" prop="totalToHkRate" v-if="deliveryData.type == 1">
              <el-input @input="totalHkRateChange" v-model="deliveryData.totalToHkRate" placeholder="请输入" clearable
                class="input-style"></el-input>
            </el-form-item>
          </el-form>

          <el-table :data="deliveryData.stockOutList" v-if="deliveryData.stockOutList.length > 0" :key="9">
            <el-table-column align="center" prop="productName" label="产品名称">
            </el-table-column>
            <el-table-column align="center" prop="productNumber" label="统一编号">
            </el-table-column>
            <el-table-column align="center" label="出售外币金额" v-if="deliveryData.type == 1">
              <template slot-scope="scope">
                <div>
                  <el-input @input="moneyChange" @change="totalChange(scope.row)" v-model="scope.row.saleMoney"
                    placeholder="请输入" clearable>
                    <i slot="suffix" class="el-input__icon" style="color: #606266;font-style:normal;">{{
                      deliveryData.saleCurrency
                    }}</i>
                  </el-input>
                </div>
              </template>
            </el-table-column>

            <el-table-column align="center" label="出售港币金额" v-if="deliveryData.type == 1">
              <template slot-scope="scope">
                <div>
                  <el-input v-model="scope.row.sellTotalHkPrice" placeholder="请输入" clearable></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="其他支出费用" v-if="deliveryData.type == 1">
              <template slot-scope="scope">
                <div>
                  <el-input v-model="scope.row.otherExpenses" placeholder="请输入" clearable>
                    <i slot="suffix" class="el-input__icon" style="color: #606266;font-style:normal;">HKD</i>
                  </el-input>
                </div>
              </template>
            </el-table-column>

            <el-table-column align="center" width="120px" label="操作">
              <template slot-scope="scope">
                <div style="display: flex;justify-content: center;">
                  <el-button type="text" @click="recordDetail(scope.row)">转移详情</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <el-form style="margin-top: 40px;" :model="deliveryData" :rules="deliveryRules" ref="deliveryForm"
            label-width="124px">
            <el-form-item label="出库时间：" prop="stockOutTime" v-if="deliveryData.type == 1">
              <el-date-picker class="input-style" v-model="deliveryData.stockOutTime" type="date" placeholder="请选择出库时间"
                value-format="yyyy-MM-dd" format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="领货人：" prop="receiver">
              <el-input class="input-style" v-model="deliveryData.receiver"></el-input>
            </el-form-item>
            <el-form-item label="备注：" prop="outNote">
              <el-input type="textarea" class="input-style" placeholder="请输入备注信息"
                v-model="deliveryData.outNote"></el-input>
            </el-form-item>
          </el-form>
          <div style="margin-top: 30px;text-align: right;">
            <el-button style="width: 120px;" type="primary" @click="stockInSubmit('deliveryForm')" v-preventClick>提
              交</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 修改成品信息 -->
    <div v-if="pageSel == 1">
      <ProductUpdate :updateProductMsg="deviceDetail" @sureUpdateProduct="sureUpdateProduct"></ProductUpdate>
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
</template>

<script>
import { customerTypeMixins, groupMixins } from "@/mixins";

import { base_img_url } from "_req/http";
import {
  productInfoPort,
  warehouseFactoryPort,
  productListPort,
} from "_req/api/common";

import {
  productOutDoPort,
  validActivityPort,
  warehouseProductTotalGetPort,
} from "_req/api/product";

import Note from "@/components/note.vue";
import ProductUpdate from "@/components/product-msg-update.vue";
export default {
  mixins: [customerTypeMixins, groupMixins],
  components: {
    Note,
    ProductUpdate,
  },
  props: {
    stockInquiryParam: {
      type: Object,
    },
  },

  data() {
    return {
      axiosUrl: "",
      img1: require("../../assets/imgs/list.png"),
      img2: require("../../assets/imgs/camer.png"),
      cliHeight: 500,

      state: 0,
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
          id: 3,
          name: "已出售",
        },
      ],
      storageIdList: [],
      storageId: null,
      activityId: null,
      time: "",

      siteSel: 0,

      stockInMsg: "数据加载中...",
      stockInList: [],
      stockListPage: [],
      total: 0,
      page: 1,
      pageNum: 1,
      keyword: "",

      imgMaterialList: [],

      deviceDetail: {},

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
        type: 1,
        endStorageId: "",
        solder: "",
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
        saleMoney: [
          {
            required: true,
            message: "请输入出售金额",
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

      warehouseFilterList: [],
      params: {},

      activityList: [],

      pagePro: 1,
      totalPro: 0,
      pageSel: 0,

      recordMsg: '',
      dialogRecordVisible: false,
      recordNewMsg: [],
    };
  },

  created() {
    this.axiosUrl = base_img_url;
    this.cliHeight = document.body.clientHeight - 185;
    this.warehouseKeywordCheck();
    this.warehouseStockCheck();
    this.getWarehouseFactoryList();
    this.getActivity();
  },
  methods: {
    // 修改成品信息
    sureUpdateProduct(val) {
      this.pageSel = 0;
      if (val == 1) {
        this.warehouseKeywordCheck();

        this.getWarehouseProduct();
      }
    },

    // 货物转移
    recordDetail(item) {
      console.log(item);
      this.recordMsg = item.transferRemarks;
      this.dialogRecordVisible = true;
    },
    recordMsgSure() {
      console.log(this.recordNewMsg);
      this.deliveryData.stockOutList[0].transferRemarks = this.recordNewMsg;
      console.log(this.deliveryData.stockOutList);

      this.dialogRecordVisible = false;
    },
    // 待出库清单  货物转移记录
    noteProListContent(val) {
      console.log("货物转移记录变化赋值", val);
      this.recordNewMsg = val;
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
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if (this.deliveryData.type == 1) {
                for (const pro of this.deliveryData.stockOutList) {
                  console.log(pro);
                  if (!pro.saleMoney) {
                    this.$message.error({
                      message:
                        pro.productName +
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
              productOutDoPort(this.deliveryData)
                .then((res) => {
                  console.log("成品提交");
                  console.log(res);
                  this.$message.success({
                    message: "提交成功",
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
    // 选择出库材料
    handleImgSelectionChange(val) {
      console.log(val);
      if (val.state !== 0) {
        this.$message.error({
          message: "该产品未在库存中，不能出库",
          showClose: true,
          duration: 2000,
        });
      } else {
        this.deliveryData.totalToHkRate = "";
        this.deliveryData.saleCurrency = "CNY";
        this.deliveryData.stockOutList = [];

        this.$refs.deliveryForm.resetFields();
        this.$refs.topDataRef.resetFields();

        this.deliveryData.stockOutList.push({
          id: val.id,
          productName: val.productName,
          productNumber: val.productNumber,
          transferRemarks: val.transferRemarks
            ? JSON.parse(val.transferRemarks)
            : [],
          saleMoney: "",
          sellTotalHkPrice: "",
          otherExpenses: "",
        });

        this.siteSel = 2;
      }
    },

    // 各种价格输入
    totalChange(item) {
      console.log(item);
      item.saleMoney = this.getPriceNum(item.saleMoney);
    },
    // 汇率变化
    totalHkRateChange() {
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
        this.deliveryData.totalToHkRate = 1;

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

    getRowKeys(row) {
      return row.id;
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

    // 获取活动列表
    getActivity() {
      validActivityPort().then((res) => {
        console.log("有效活动列表");
        console.log(res);
        this.activityList = res.data.data;
      });
    },

    // 图形展示仓库/加工厂下的成品列表
    imgInquiryDetails(id) {
      this.storageId = id;
      this.pagePro = 1;
      this.getWarehouseProduct();

      this.siteSel = 1;
    },
    // 获取该仓库下成品列表
    getWarehouseProduct() {
      productListPort({
        state: this.state,
        storageIdList: [this.storageId],
        startTime: this.time == null ? "" : this.time[0],
        endTime: this.time == null ? "" : this.time[1],
        keyword: this.keyword,
        page: this.pagePro,
        pageNum: 10,
        activityId: this.activityId,
      }).then((res) => {
        console.log("成品库存列表查询");
        console.log(res);
        this.totalPro = res.data.data.total;
        this.imgMaterialList = res.data.data.list;
      });
    },
    backToImg() {
      this.siteSel = 0;
      this.imgMaterialList = [];
    },
    // 图表切换
    listOrChart() {
      if (this.stockInquiryParam.sel == 0) {
        this.stockInquiryParam.sel = 1;
      } else if (this.stockInquiryParam.sel == 1) {
        this.stockInquiryParam.sel = 0;
      }
    },
    // 模糊搜索
    warehouseKeywordCheck() {
      productListPort({
        state: this.state,
        storageIdList: this.storageIdList,
        startTime: this.time == null ? "" : this.time[0],
        endTime: this.time == null ? "" : this.time[1],
        keyword: this.keyword,
        activityId: this.activityId,
        page: this.page,
        pageNum: 10,
      }).then((res) => {
        console.log("成品列表查询");
        console.log(res);

        this.total = res.data.data.total;
        this.stockListPage = res.data.data.list;
      });
    },
    // 查找有成品的仓库
    warehouseStockCheck() {
      this.stockInMsg = "数据加载中";
      warehouseProductTotalGetPort({
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
    // 查看成品详情
    checkproductDetails(val, column) {
      if (column.label == "出库") {
        document.getElementById("mainContainer").scrollTop = 0;

        this.handleImgSelectionChange(val);
      } else if (column.label == "打印标签") {
        console.log("打印标签");

        this.printLabel(val);
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
    dblProductDetails(val, column) {
      if (column.label !== "出库") {
        this.deviceDetail = {};

        productInfoPort({
          id: val.id,
        }).then((res) => {
          console.log("成品详情");
          console.log(res);

          this.deviceDetail = res.data.data;

          this.pageSel = 1;
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
      document.getElementById("mainContainer").scrollTop = 0;
    },
  },
};
</script>
<style scoped lang="scss">
.add-left {
  width: 900px;
  text-align: left;
  background-color: #fff;

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
.vue-directive-image-previewer {
  z-index: 10000;
}

.el-table .cell .look {
  cursor: pointer;
}

.el-table .cell .look:hover {
  color: #3d82fe;
}

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

#invenSome .rr .el-input__inner {
  cursor: pointer;
}

.el-dialog__header {
  text-align: left;
}
</style>
