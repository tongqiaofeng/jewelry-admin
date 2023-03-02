<template>
  <div class="user-admin-container" id="user-admin" v-if="isShow">
    <!-- <h1>入库管理</h1> -->
    <div class="user-edit">
      <el-tabs v-model="activeName">
        <el-tab-pane label="材料信息" name="first">
          <el-form
            :model="stockInFormData"
            :rules="stockInRules"
            ref="stockInForm"
            label-width="134px"
            class="demo-ruleForm"
          >
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="材料名称：" prop="materialId">
                  <el-select
                    v-model="stockInFormData.materialId"
                    placeholder="请选择"
                    class="input-style"
                    :popper-append-to-body="false"
                  >
                    <el-option
                      v-for="item in materialList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      @click.native="materialChange(item)"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="仓库/加工厂：" prop="storageId">
                  <el-select
                    v-model="storageMsg"
                    placeholder="请选择"
                    class="input-style"
                    @change="storageChange"
                    :popper-append-to-body="false"
                    value-key="id"
                  >
                    <el-option
                      v-for="item in warehouseFactoryList"
                      :key="item.id"
                      :label="item.name"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item
                  :label="
                    stockInFormData.materialId == 11
                      ? '证书编号：'
                      : '统一编号：'
                  "
                  prop="productNumber"
                >
                  <el-input
                    v-model="stockInFormData.productNumber"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="盒子编号：" prop="boxNumber">
                  <el-input
                    v-model="stockInFormData.boxNumber"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <div
              style="width: 95%;height: 1px;margin: 5px auto 27px auto;border-bottom: 1px dashed #DCDFE6;"
            ></div>
            <el-row :gutter="10" v-show="certificateshow == false">
              <el-col :span="12">
                <el-form-item label="形状：" prop="shape">
                  <el-input
                    v-model="stockInFormData.shape"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="尺寸/毫米：" prop="size">
                  <el-input
                    v-model="stockInFormData.size"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-show="certificateshow == false">
              <el-col :span="12">
                <el-form-item label="产地：" prop="productArea">
                  <el-input
                    v-model="stockInFormData.productArea"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="颜色：" prop="color">
                  <el-input
                    v-model="stockInFormData.color"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10" v-show="certificateshow == false">
              <el-col :span="12">
                <el-form-item label="品质：" prop="quality">
                  <el-input
                    v-model="stockInFormData.quality"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="品质细分：" prop="subsection">
                  <el-input
                    v-model="stockInFormData.subsection"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10" v-show="certificateshow == false">
              <el-col :span="12">
                <el-form-item label="配对：" prop="paired">
                  <el-input
                    v-model="stockInFormData.paired"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="证书编号：" prop="certificateNumber">
                  <el-input
                    v-model="stockInFormData.certificateNumber"
                    placeholder="多个证书编号，用逗号隔开"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <div
              style="width: 95%;height: 1px;margin: 5px auto 27px auto;border-bottom: 1px dashed #DCDFE6;"
            ></div>
            <el-form-item label="图片：" prop="imgurls">
              <div>
                <UploadImg
                  :imgUrl="stockInFormData.imgurls"
                  :isUpdate="1"
                  @imgChange="materialImgUrlChange"
                ></UploadImg>
              </div>
            </el-form-item>
            <el-form-item
              label="加工厂库存状态："
              required
              v-if="storageMsg.type == 1"
            >
              <el-select
                v-model="stockInFormData.isProcessing"
                placeholder="请选择"
                :popper-append-to-body="false"
              >
                <el-option label="库存中" value="0"> </el-option>
                <el-option label="加工中" value="1"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="入库时间：" prop="stockInTime">
              <el-date-picker
                class="input-style"
                v-model="stockInFormData.stockInTime"
                type="date"
                placeholder="请选择"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="产品备注：" prop="note">
              <el-input
                type="textarea"
                v-model="stockInFormData.note"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="价格信息" name="second">
          <el-form
            :model="stockInFormData"
            :rules="stockInRules"
            ref="stockPriceForm"
            label-width="135px"
            class="demo-ruleForm"
          >
            <el-form-item
              label="发票号："
              prop="billNumber"
              v-if="certificateshow == false"
            >
              <el-input
                v-model="stockInFormData.billNumber"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="计价单位："
              prop="chargeUnit"
              v-show="certificateshow == false"
            >
              <el-radio-group
                v-model="stockInFormData.chargeUnit"
                @change="chargeUnitfun"
              >
                <el-radio label="粒"></el-radio>
                <el-radio label="ct"></el-radio>
                <el-radio label="g"></el-radio>
              </el-radio-group>
            </el-form-item>

            <el-row :gutter="10" v-show="certificateshow == false">
              <el-col :span="10">
                <el-form-item label="单价：" prop="unitPrice">
                  <el-input
                    style="width: 100%;"
                    v-model="stockInFormData.unitPrice"
                    placeholder="请输入"
                    @input="priceTotal"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item label="" prop="currency" label-width="0">
                  <el-radio-group
                    style="margin-left: 10px;"
                    v-model="stockInFormData.currency"
                    @change="currencyChange"
                  >
                    <el-radio label="CNY">CNY</el-radio>
                    <el-radio label="EUR">EUR</el-radio>
                    <el-radio label="USD">USD</el-radio>
                    <el-radio label="HKD">HKD</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="20" v-show="numberorweight == true">
                <el-form-item label="总数量：" prop="number">
                  <el-input-number
                    style="width: 100%;"
                    :controls="false"
                    v-model="stockInFormData.number"
                    placeholder="请输入"
                    @input="priceTotal"
                  >
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="20" v-show="numberorweight == false">
                <el-form-item label="总数量：" prop="number">
                  <el-input-number
                    style="width: 100%;"
                    :controls="false"
                    v-model="stockInFormData.number"
                    placeholder="请输入"
                    @input="priceTotal"
                  >
                  </el-input-number>
                </el-form-item>
                <el-form-item label="总重量：" prop="weight">
                  <div style="display: flex;">
                    <el-input-number
                      style="width: 100%;"
                      :controls="false"
                      v-model="stockInFormData.weight"
                      placeholder="请输入"
                      @input="priceTotal"
                    >
                    </el-input-number>
                    <div style="font-size: 16px;margin-left: 5px;">
                      {{ stockInFormData.chargeUnit }}
                    </div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item
              label="总价："
              prop="totalPrice"
              v-show="certificateshow == false"
            >
              <el-input
                v-model="stockInFormData.totalPrice"
                placeholder="请输入"
                @input="totalPriceChange"
                @focus="focustotal"
                @change="totalChange"
                ><i
                  slot="suffix"
                  style="color: #606266;margin-right:5%;font-style:normal;"
                  >{{ stockInFormData.currency }}</i
                ></el-input
              >
            </el-form-item>
            <el-row :gutter="10" v-show="certificateshow == false">
              <el-col :span="12">
                <el-form-item label="外币兑港币汇率" prop="totalHkRate">
                  <el-input
                    @input="totalHkRateChange"
                    v-model="stockInFormData.totalHkRate"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="总价港币金额" prop="totalHkPrice">
                  <el-input
                    v-model="stockInFormData.totalHkPrice"
                    placeholder="请输入"
                    @change="totalChange"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <div
              style="width: 95%;height: 1px;margin: 5px auto 27px auto;border-bottom: 1px dashed #DCDFE6;"
            ></div>

            <el-row :gutter="10" v-show="certificateshow == false">
              <el-col :span="12">
                <el-form-item
                  :label="'建议批发单价' + '(' + stockInFormData.currency + ')'"
                  prop="adviceWholesalePrice"
                >
                  <el-input
                    v-model="stockInFormData.adviceWholesalePrice"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  :label="'建议零售单价' + '(' + stockInFormData.currency + ')'"
                  prop="adviseSellPrice"
                >
                  <el-input
                    v-model="stockInFormData.adviseSellPrice"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-show="certificateshow == false">
              <el-col :span="12">
                <el-form-item label="最低销售单价(CNY)" prop="lowestSellPrice">
                  <el-input
                    v-model="stockInFormData.lowestSellPrice"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="代理单价(CNY)" prop="agentPrice">
                  <el-input
                    v-model="stockInFormData.agentPrice"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-show="certificateshow == false">
              <el-col :span="12">
                <!-- 建议柜台最低销售价 -->
                <el-form-item
                  label="销售单价(CNY)"
                  prop="counterLowestSellPrice"
                >
                  <el-input
                    v-model="stockInFormData.counterLowestSellPrice"
                    placeholder="请输入销售单价"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="标签单价(CNY)" prop="tagPrice">
                  <el-input
                    v-model="stockInFormData.tagPrice"
                    placeholder="请输入标签金额"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="货物转移记录" name="fifth">
          <Note :note="recordList" @noteContent="noteContent"></Note>
        </el-tab-pane>
      </el-tabs>
      <div style="margin-top: 30px;text-align: right;">
        <el-button @click="resetForm">重 置</el-button>
        <el-button
          style="width: 120px;"
          type="primary"
          @click="stockInAdd"
          v-preventClick
          >提 交
        </el-button>
      </div>
    </div>
    <div class="user-table">
      <p class="title-font">原材料库存</p>
      <el-table
        :data="productList"
        tooltip-effect="dark"
        border
        @row-click="inventoryLook"
        @row-dblclick="dblLookInventory"
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
        <el-table-column align="center" label="操作" width="90px">
          <template>
            <el-button type="text" style="color: red;">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        title="删除材料"
        :visible.sync="dialogInventoryDeleteVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :append-to-body="false"
        id="delInven"
      >
        <div style="text-align: center;">
          <p style="margin: 30px 0 0 0;font-size: 16px;color: #4e4e4e;">
            确定删除该材料？删除后不可修改
          </p>
        </div>
        <div slot="footer">
          <el-button @click="dialogInventoryDeleteVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="inventoryDeleteSure" v-preventClick
            >确 定</el-button
          >
        </div>
      </el-dialog>

      <div v-if="dialogMaterialMsgUpdateVisible">
        <materialMsgUpdate
          :dialogMaterialMsgUpdateVisible="dialogMaterialMsgUpdateVisible"
          :updateMaterialMsg="inventoryCheckDetail"
          @sureUpdateMaterial="sureUpdateMaterial"
        ></materialMsgUpdate>
      </div>
    </div>
  </div>
</template>

<script>
import { base_request_url } from "_req/http";
import {
  stockMaterialInfoPort,
  materialSavePort,
  materialListPort,
  stockMaterialPort,
  warehouseFactoryPort,
  uploadPort,
} from "_req/api/common";

import { materialDeletePort } from "_req/api/material";

import UploadImg from "@/components/upload-img.vue";
import Note from "@/components/note.vue";
import materialMsgUpdate from "@/components/material-msg-update.vue";

export default {
  components: {
    UploadImg,
    Note,
    materialMsgUpdate,
  },
  data() {
    return {
      isShow: false,
      axiosUrl: "",
      warehouseFactoryList: [],
      materialList: [],
      storageMsg: {},
      stockInFormData: {
        materialId: "",
        storageId: "",
        isProcessing: "0",
        shape: "",
        chargeUnit: "",
        unitPrice: "",
        currency: "CNY",
        number: undefined,
        weight: undefined,
        totalPrice: "",
        adviseSellPrice: "",
        adviceWholesalePrice: "",
        size: "",
        color: "",
        paired: "",
        quality: "",
        subsection: "",
        boxNumber: "",
        certificateNumber: "",
        productNumber: "",

        billNumber: "",
        totalHkRate: "",
        totalHkPrice: "",
        imgurls: [],
        stockInTime: "",
        note: "",
        agentPrice: "",
        lowestSellPrice: "",
        counterLowestSellPrice: "",
        tagPrice: "",
      },
      stockInRules: {
        materialId: [
          {
            required: true,
            message: "请选择材料名称",
            trigger: ["change"],
          },
        ],
        storageId: [
          {
            required: true,
            message: "请选择仓库/加工厂",
            trigger: ["change"],
          },
        ],
        productNumber: [
          {
            required: true,
            message: "请输入产品编号",
            trigger: "blur",
          },
        ],
        weight: [
          {
            required: true,
            message: "请输入总重量",
            trigger: "blur",
          },
        ],
        number: [
          {
            required: true,
            message: "请输入总数量",
            trigger: "blur",
          },
        ],
        billNumber: [
          {
            required: true,
            message: "请输入发票号",
            trigger: "blur",
          },
        ],
        stockInTime: [
          {
            required: true,
            message: "请选择入库时间",
            trigger: "blur",
          },
        ],
      },
      dialogMaterialMsgUpdateVisible: false,
      inventoryCheckDetail: {},
      dialogInventoryDeleteVisible: false,
      certificateshow: false,
      numberorweight: false,
      certificateshow2: false,
      inventoryDeleteDetail: {},
      isUpdate: 0,
      productList: [],

      imgList: [],
      totalpricetemp: 0,
      activeStockName: "first",

      imgSortList: [],
      count: 0,

      activeName: "first",
      recordList: [],
      recordUpdateList: [],
    };
  },
  created() {
    this.axiosUrl = base_request_url;
    this.getMaterialList();
    this.getWarehouseFactoryList();
  },
  methods: {
    // 货物转移记录
    noteContent(val) {
      console.log("货物转移记录变化赋值", val);
      this.recordList = val;
    },

    // 修改材料信息  货物转移记录
    noteUpdateContent(val) {
      console.log("货物转移记录变化赋值", val);
      this.recordUpdateList = val;
    },

    // 汇率变化
    totalHkRateChange() {
      if (this.stockInFormData.currency == "HKD") {
        this.stockInFormData.totalHkPrice = this.stockInFormData.totalPrice;
      } else {
        if (
          this.stockInFormData.totalPrice &&
          this.stockInFormData.totalHkRate
        ) {
          if (this.stockInFormData.currency == "CNY") {
            if (this.stockInFormData.totalHkRate >= 1) {
              this.stockInFormData.totalHkPrice = (
                this.stockInFormData.totalPrice *
                this.stockInFormData.totalHkRate
              ).toFixed(2);
            } else {
              this.stockInFormData.totalHkPrice = (
                this.stockInFormData.totalPrice /
                this.stockInFormData.totalHkRate
              ).toFixed(2);
            }
          } else {
            this.stockInFormData.totalHkPrice = (
              this.stockInFormData.totalPrice * this.stockInFormData.totalHkRate
            ).toFixed(2);
          }
        }
      }
    },
    // 币种变化
    currencyChange() {
      if (this.stockInFormData.currency == "HKD") {
        this.stockInFormData.totalHkPrice = this.stockInFormData.totalPrice;
      } else {
        this.stockInFormData.totalHkRate = "";
        this.stockInFormData.totalHkPrice = "";
      }
    },
    // 各种价格输入
    totalChange() {
      this.stockInFormData.totalPrice = this.getPriceNum(
        this.stockInFormData.totalPrice
      );

      this.stockInFormData.totalHkPrice = this.getPriceNum(
        this.stockInFormData.totalHkPrice
      );
    },

    priceTotal() {
      this.stockInFormData.totalPrice = 0;
      if (this.stockInFormData.chargeUnit == "粒") {
        if (this.stockInFormData.unitPrice && this.stockInFormData.number) {
          this.stockInFormData.totalPrice = (
            this.stockInFormData.unitPrice * this.stockInFormData.number
          ).toFixed(2);
        }
      } else {
        if (this.stockInFormData.unitPrice && this.stockInFormData.weight) {
          this.stockInFormData.totalPrice = (
            this.stockInFormData.unitPrice * this.stockInFormData.weight
          ).toFixed(2);
        }
      }
      this.totalHkRateChange();
    },
    focustotal() {
      this.totalpricetemp = this.stockInFormData.totalPrice;
    },
    totalPriceChange() {
      if (this.totalpricetemp != this.stockInFormData.totalPrice) {
        if (this.stockInFormData.chargeUnit == "粒") {
          this.stockInFormData.unitPrice = (
            this.stockInFormData.totalPrice / this.stockInFormData.number
          ).toFixed(2);
        } else {
          this.stockInFormData.unitPrice = (
            this.stockInFormData.totalPrice / this.stockInFormData.weight
          ).toFixed(2);
        }
      }
    },

    // 修改材料单价时总价的变化
    chargeUnitfun() {
      if (this.stockInFormData.chargeUnit == "粒") {
        this.numberorweight = true;
        this.stockInFormData.totalPrice =
          this.stockInFormData.unitPrice * this.stockInFormData.number;
      } else {
        this.numberorweight = false;
        this.stockInRules.weight[0].required = true;
        this.stockInFormData.totalPrice =
          this.stockInFormData.unitPrice * this.stockInFormData.weight;
      }
      console.log(this.stockInFormData.totalPrice);
      this.totalHkRateChange();
    },

    // 查看修改材料详情
    inventoryLook(row, column) {
      if (column.label == "操作") {
        this.inventoryDelete(row);
      }
    },
    dblLookInventory(row) {
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
        this.storageChange();
      }
    },

    // 删除材料
    inventoryDelete(val) {
      console.log(val);
      this.inventoryDeleteDetail = val;
      if (this.inventoryDeleteDetail.isOut !== 1) {
        this.dialogInventoryDeleteVisible = true;
      } else {
        this.$message.warning({
          message: "该材料已有出库记录，不可删除",
          showClose: true,
          duration: 2000,
        });
      }
    },
    // 确定
    inventoryDeleteSure() {
      materialDeletePort({
        id: this.inventoryDeleteDetail.id,
      })
        .then((res) => {
          console.log("删除材料信息");
          console.log(res);
          this.$message.success({
            message: "删除成功",
            showClose: true,
            duration: 2000,
          });
          this.dialogInventoryDeleteVisible = false;
          this.storageChange();
        })
        .catch((err) => {
          console.log(err);
          this.dialogInventoryDeleteVisible = false;
        });
    },
    // 获取该仓库下所有的产品
    storageChange() {
      this.stockInFormData.storageId = this.storageMsg.id;
      let wareList = [];
      wareList.push(this.stockInFormData.storageId);
      this.productList = [];

      stockMaterialPort({
        storageIdList: wareList,
        state: 0,
        page: 1,
        pageNum: 10,
      }).then((res) => {
        console.log("仓库下的材料列表");
        console.log(res);

        this.productList = res.data.data.list;
      });
    },
    // 材料入库
    stockInAdd() {
      console.log(this.stockInFormData.type);
      if (
        this.stockInFormData.chargeUnit == "ct" ||
        this.stockInFormData.chargeUnit == "g"
      ) {
        if (this.stockInFormData.weight == 0) {
          this.$message.error({
            message: "该原料重量不能为零",
            showClose: true,
            duration: 2000,
          });
        }
      }
      this.$refs.stockInForm.validate((valid) => {
        if (valid) {
          this.$refs.stockPriceForm.validate((valid) => {
            if (valid) {
              materialSavePort({
                ...this.stockInFormData,
                transferRemarks: JSON.stringify(this.recordList),
                img: this.stockInFormData.imgurls.join("|"),
              })
                .then((res) => {
                  console.log("材料入库");
                  console.log(res);
                  this.$message.success({
                    message: "入库成功",
                    showClose: true,
                    duration: 2000,
                  });
                  this.activeName = "first";

                  if (this.stockInFormData.materialId == 11) {
                    this.stockInFormData.note = "";
                    this.stockInFormData.imgurls = [];
                  }
                  this.stockInFormData.productNumber = "";
                  this.recordList = [];
                  this.storageChange();
                  document.getElementById("user-admin").scrollIntoView();
                })
                .catch((err) => {
                  console.log(err);

                  this.recordList = JSON.parse(this.recordList);
                });
            } else {
              this.$message.error({
                message: "有价格信息未填写",
              });
              return false;
            }
          });
        } else {
          this.$message.error({
            message: "有材料信息未填写",
          });
          return false;
        }
      });
    },
    // 材料名称变化
    materialChange(item) {
      console.log(item);
      if (item.id == 11) {
        this.certificateshow = true;
        this.numberorweight = true;
        this.stockInRules.weight[0].required = false;
        this.stockInFormData.currency = "";
        this.stockInFormData.weight = 0;
        this.stockInFormData.totalPrice = "";
        this.stockInFormData.unitPrice = "";
        this.stockInFormData.shape = "";
        this.stockInFormData.color = "";
        this.stockInFormData.boxNumber = "";
        this.stockInFormData.adviceWholesalePrice = "";
        this.stockInFormData.adviseSellPrice = "";
        this.stockInFormData.size = "";
        this.stockInFormData.paired = "";
        this.stockInFormData.certificateNumber = "";
        this.stockInFormData.quality = "";
        this.stockInFormData.subsection = "";
      } else {
        this.certificateshow = false;
        this.stockInFormData.currency = "CNY";
        if (item.chargeUnit == "粒") {
          this.stockInRules.weight[0].required = false;
          this.numberorweight = true;
          this.stockInFormData.weight = 0;
          if (this.stockInFormData.unitPrice && this.stockInFormData.number) {
            this.stockInFormData.totalPrice =
              this.stockInFormData.unitPrice * this.stockInFormData.number;
          }
        } else {
          this.stockInRules.weight[0].required = true;
          this.numberorweight = false;
          if (this.stockInFormData.unitPrice && this.stockInFormData.weight) {
            this.stockInFormData.totalPrice =
              this.stockInFormData.unitPrice * this.stockInFormData.weight;
          }
        }
      }
      this.stockInFormData.number = 1;
      this.stockInFormData.imgurls = [];
      console.log(this.stockInFormData);
      this.stockInFormData.chargeUnit = item.chargeUnit;
    },
    // 重置表单
    resetForm() {
      this.activeName = "first";
      this.recordList = [];
      this.$refs.stockInForm.resetFields();
      this.$refs.stockPriceForm.resetFields();
      document.getElementById("user-admin").scrollIntoView();
    },

    // 原材料图
    materialImgUrlChange(data) {
      console.log("原材料图片", data);
      this.stockInFormData.imgurls = data.img;
    },

    // 上传图片
    inputChange(e) {
      console.log(e);
      let files = e.target.files;
      let that = this;
      if (files === undefined) {
        return;
      }

      for (let i = 0; i < files.length; i++) {
        console.log(files[i]);
        if (files[i].size / 1024 > 1025) {
          // 文件大于1M（根据需求更改），进行压缩上传
          this.photoCompress(
            files[i],
            {
              // 调用压缩图片方法
              quality: 0.7,
            },
            (base64Codes) => {
              // console.log("压缩后：" + base.length / 1024 + " " + base);
              let bl = that.base64UrlToBlob(base64Codes);
              that.uploadLice(bl); // 请求图片上传接口
            }
          );
        } else {
          // 小于等于1M 原图上传
          this.uploadLice(files[i]);
        }
      }

      e.target.value = "";
    },
    // base64 转 Blob 格式 和file格式
    base64UrlToBlob(urlData) {
      let arr = urlData.split(","),
        mime = arr[0].match(/:(.*?);/)[1], // 去掉url的头，并转化为byte
        bstr = atob(arr[1]), // 处理异常,将ascii码小于0的转换为大于0
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      // 转blob
      // return new Blob([u8arr], {type: mime})
      let filename = Date.parse(new Date()) + ".jpg";
      // 转file
      return new File([u8arr], filename, {
        type: mime,
      });
    },
    /*压缩图片*/
    photoCompress(file, obj, callback) {
      let ready = new FileReader();
      /* 开始读取指定File对象中的内容. 读取操作完成时,返回一个URL格式的字符串. */
      ready.readAsDataURL(file);
      ready.onload = (event) => {
        // 文件读取成功
        let res = event.target.result;
        this.canvasDataURL(res, obj, callback); // 开始压缩
      };
    },
    /* 利用canvas数据化图片进行压缩 */
    /* 图片转base64 */
    canvasDataURL(path, obj, callback) {
      let img = new Image();
      img.src = path;
      img.onload = function() {
        let that = this; // 指到img
        // 默认按比例压缩
        let w = that.width,
          h = that.height,
          scale = w / h;
        w = obj.width || w;
        h = obj.height || w / scale;
        let quality = 0.7; // 默认图片质量为0.7
        // 生成canvas
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        // 创建属性节点
        let anw = document.createAttribute("width");
        anw.nodeValue = w;
        let anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        // 铺底色
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(that, 0, 0, w, h);

        // 图像质量
        if (obj.quality && obj.quality >= 1 && obj.quality < 0) {
          quality = obj.quality;
        }
        // quality值越小，所绘制出的图像越模糊
        let base64 = canvas.toDataURL("image/jpeg", quality);
        // 回调函数返回base64的值
        callback(base64);
      };
    },
    //  返回file文件，调用接口执行上传
    uploadLice(file) {
      uploadPort({
        file,
      }).then((res) => {
        if (res.status == 200) {
          this.$message.success({
            message: "图片上传成功",
            showClose: true,
            duration: 2000,
          });
        }
        console.log(res);
        let imgurl = res.data.data.fileName;

        if (this.imgList.indexOf(imgurl) == -1) {
          this.imgList.push(imgurl);
        }
      });
    },
    // 删除图片
    delImage(index) {
      if (this.isUpdate == 1) {
        this.imgList.splice(index, 1);
      }
    },

    // 获取原材料名称列表
    getMaterialList() {
      materialListPort()
        .then((res) => {
          console.log("原材料");
          console.log(res);
          this.isShow = true;
          this.materialList = res.data.data;
        })
        .catch(() => {
          this.isShow = true;
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
.user-admin-container {
  display: flex;
  justify-content: space-between;

  .user-edit {
    width: 50%;
    padding: 10px;
    margin-right: 15px;
    background-color: #fff;
    border-radius: 6px;
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

  .user-table {
    width: 50%;
    padding: 10px;
    background-color: #fff;
    border-radius: 6px;

    .title-font {
      height: 48px;
      margin: 0;
      text-align: left;
      color: #6a6a6a;
      font-size: 18px;
      font-weight: bold;
    }
  }

  .input-style {
    width: 100%;
  }

  .stockButton {
    height: 34px !important;
    line-height: 9px;
    font-size: 12px;
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
}
</style>
<style lang="scss">
#user-admin {
  .el-input-number .el-input__inner {
    text-align: left;
  }

  .el-dialog__body {
    height: 500px;
    overflow: auto;
  }

  .el-form-item__content {
    text-align: left;
  }

  #stock {
    width: 100%;

    .stockInput {
      width: 431px;
      float: right;

      .el-input__inner {
        height: 34px;
        line-height: 9px;
        font-size: 12px;
      }

      .el-input__suffix {
        padding-top: -10px;
      }
    }
  }

  .el-textarea__inner {
    height: 100%;
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
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  .el-dialog__body {
    padding: 0 20px;
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
</style>
