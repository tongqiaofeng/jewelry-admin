<template>
  <div class="bill-entry-container" id="billEntryContainer" v-if="isShow">
    <!-- <div>账单录入</div> -->
    <div class="container-left">
      <el-form
        ref="billForm"
        :model="billData"
        :rules="billRules"
        label-width="110px"
      >
        <el-form-item label="账单日期" prop="time">
          <el-date-picker
            size="large"
            type="date"
            placeholder="请选择账单日期"
            v-model="billData.time"
            style="width: 100%"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="交易类型" prop="tradeType">
          <el-select
            size="large"
            style="width: 100%"
            v-model="billData.tradeType"
            placeholder="请选择"
            @change="tradeTypeChange"
          >
            <el-option
              v-for="(item, index) in typeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="personShow()" prop="personId">
          <el-select
            size="large"
            style="width: 100%"
            v-model="billData.personId"
            placeholder="请选择"
            clearable
            @change="getBillList"
          >
            <el-option
              v-for="(item, index) in userList"
              :key="index"
              :label="item.nick"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="收款账户"
          v-show="billData.tradeType == 2"
          prop="payeeId"
        >
          <el-select
            size="large"
            style="width: 100%"
            v-model="billData.payeeId"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in userList"
              :key="index"
              :label="item.nick"
              :value="item.id"
              v-show="item.id != billData.personId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易方式" prop="receiveType">
          <el-autocomplete
            size="large"
            style="width: 100%"
            :fit-input-width="true"
            clearable
            v-model="billData.receiveType"
            :fetch-suggestions="querySearch"
            placeholder="请选择/输入内容"
            @select="handleSelect"
          />
        </el-form-item>
        <el-form-item label="标签">
          <el-select
            style="width: 100%"
            placeholder="请选择/输入标签，输入多个用,隔开"
            v-model="labelVals"
            filterable
            multiple
            allow-create
            default-first-option
            clearable
          >
            <el-option
              v-for="item in labelList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="产品列表">
          <div class="code-table">
            <div class="every1">
              <span
                style="color: red"
                v-show="
                  billData.tradeType != 2 &&
                    billData.tradeType != 5 &&
                    billData.tradeType != 6
                "
                >*</span
              >统一编号
            </div>
            <div class="every2">外币金额</div>
            <div class="every3">外币转港币汇率</div>
            <div class="every4">港币金额</div>
            <div class="every5">操作</div>
          </div>
          <div class="code-table" style="margin-top: 5px">
            <div class="every1">
              <el-input
                size="large"
                v-model="productListMsg.productNumber"
                placeholder="请输入"
                @change="searchCode(productListMsg.productNumber, '')"
              ></el-input>
            </div>
            <div class="every2">
              <el-input
                size="large"
                v-model="productListMsg.foreignMoney"
                placeholder="请输入"
                @change="tablePriceChange(productListMsg, 'add')"
              ></el-input>
              <el-select
                size="large"
                v-model="billData.foreignCurrency"
                placeholder="请选择币种"
              >
                <el-option
                  v-for="(item, index) in currencyList"
                  :key="index"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </div>
            <div class="every3">
              <el-input
                size="large"
                v-model="billData.foreignToSettleRate"
                placeholder="请输入"
                @input="rateChange"
              ></el-input>
            </div>
            <div class="every4">
              <el-input
                size="large"
                v-model="productListMsg.settleMoney"
                placeholder="请输入"
                @change="tablePriceChange(productListMsg, 'add')"
              ></el-input>
            </div>
            <div class="every5">
              <div class="btn-row" style="cursor: pointer">
                <i
                  class="el-icon-circle-plus-outline"
                  style="font-size: 22px;color: #3d81fd;"
                  @click="addCode"
                ></i>
              </div>
            </div>
          </div>
          <div style="margin-top: 30px">
            <div
              class="code-table"
              style="margin-bottom: 5px"
              v-for="(items, index) in billData.watchList"
              :key="index"
            >
              <div class="every1">
                <el-input
                  size="large"
                  v-model="items.stockNo"
                  placeholder="请输入"
                  @change="searchCode(items.stockNo, index, 1)"
                ></el-input>
              </div>
              <div class="every2">
                <el-input
                  size="large"
                  v-model="items.foreignMoney"
                  placeholder="请输入"
                  @change="tablePriceChange(items, 'update')"
                ></el-input>
                <el-select
                  size="large"
                  v-model="billData.foreignCurrency"
                  placeholder="请选择币种"
                >
                  <el-option
                    v-for="(item, index) in currencyList"
                    :key="index"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="every3">
                <el-input
                  size="large"
                  v-model="billData.foreignToSettleRate"
                  placeholder="请输入"
                  @input="rateChange"
                ></el-input>
              </div>
              <div class="every4">
                <el-input
                  size="large"
                  v-model="items.settleMoney"
                  placeholder="请输入"
                  @change="tablePriceChange(items, 'update')"
                ></el-input>
              </div>
              <div class="every5">
                <div class="btn-row" style="cursor: pointer">
                  <i
                    class="el-icon-delete"
                    style="font-size: 22px;color: #3d81fd;"
                    @click="delCode(index)"
                  ></i>
                </div>
              </div>
            </div>
          </div>
          <el-dialog title="提示" v-model="dialogCodeVisible" width="520px">
            <div style="text-align: center; font-size: 16px">
              未查找到{{ productCode }}，请检查统一编号是否输入正确
            </div>
            <template #footer>
              <div>
                <el-button
                  type="primary"
                  @click="dialogCodeVisible = false"
                  class="sure-button"
                  >确 定</el-button
                >
              </div>
            </template>
          </el-dialog>
        </el-form-item>

        <el-form-item label="产品描述" prop="productDes">
          <el-input
            size="large"
            style="width: 100%"
            type="textarea"
            v-model="billData.productDes"
            placeholder="产品描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="外币金额" prop="foreignMoney">
          <div style="display: flex">
            <el-input
              size="large"
              v-model="billData.foreignMoney"
              placeholder="请输入外币金额"
              @change="hkMoneyNum"
            ></el-input>
            <el-select
              size="large"
              v-model="billData.foreignCurrency"
              placeholder="请选择金额币种"
              :disabled="
                billData.tradeType == 0 ||
                billData.tradeType == 1 ||
                billData.tradeType == 3 ||
                billData.tradeType == 4
                  ? true
                  : false
              "
            >
              <el-option
                v-for="(item, index) in currencyList"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="外币转港币汇率" prop="foreignToSettleRate">
          <el-input
            size="large"
            v-model="billData.foreignToSettleRate"
            placeholder="请输入"
            @input="hkMoneyNum"
          ></el-input>
        </el-form-item>
        <el-form-item label="港币金额" prop="settleMoney">
          <el-input
            size="large"
            v-model="billData.settleMoney"
            placeholder="请输入"
          ></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            size="large"
            style="width: 100%"
            type="textarea"
            v-model="billData.remark"
            placeholder="请输入备注信息"
          ></el-input>
        </el-form-item>
        <el-form-item label="账单图片" prop="pics">
          <div>
            <UploadImg
              :imgUrl="billData.pics"
              :isUpdate="1"
              @imgChange="billImgUrlChange"
            ></UploadImg>
          </div>
        </el-form-item>
      </el-form>
      <el-dialog
        v-if="dialogProductVisible"
        title="匹配产品"
        :visible.sync="dialogProductVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :append-to-body="false"
      >
        <div id="invenSome">
          <el-table
            :data="matchingList"
            ref="singleTable"
            highlight-current-row
            @current-change="handleCurrentChange"
            style="width: 100%"
          >
            <el-table-column align="center" prop="materialName" label="图片">
              <template slot-scope="scope">
                <div>
                  <img
                    :src="img + '/file/' + imgFilter(scope.row.img)"
                    alt=""
                    style="width: 100px;height: 100px;object-fit: cover;"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="productName" label="产品名称">
            </el-table-column>
            <el-table-column
              align="center"
              prop="productNumber"
              label="统一编号"
            >
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
      <div style="display: flex; justify-content: flex-end; text-align: right">
        <el-button size="large" style="margin-right: 50px" @click="clearData">
          重置
        </el-button>
        <el-button
          style="width: 100px;"
          size="large"
          v-if="billData.id"
          type="primary"
          v-preventClick
          @click="updateBillSure"
          >修改</el-button
        >
        <el-button
          style="width: 100px;"
          size="large"
          v-else
          type="primary"
          v-preventClick
          @click="submitData"
          >提交</el-button
        >
      </div>
    </div>
    <div class="container-right">
      <el-table
        :data="billList"
        style="width: 100%"
        tooltip-effect="dark"
        border
        highlight-current-row
        @row-click="delBill"
        @row-dblclick="updateBill"
      >
        <el-table-column align="center" prop="time" label="账单日期">
        </el-table-column>
        <el-table-column align="center" prop="tradeType" label="交易类型">
          <template #default="scope">
            <div>
              {{ tradeTypeRgx(scope.row.tradeType) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="foreignMoney" label="外币金额">
          <template #default="scope">
            <div>
              {{
                scope.row.foreignMoney == "" || scope.row.foreignMoney == 0
                  ? "/"
                  : formatNumberRgx(scope.row.foreignMoney) +
                    " " +
                    scope.row.foreignCurrency
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default>
            <div>
              <span style="color: #409eff; cursor: pointer">刪除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="删除账单" v-model="dialogDelVisible" width="520px">
        <div style="text-align: center; font-size: 16px">
          确定删除该账单？删除后不可恢复
        </div>
        <template #footer>
          <div>
            <el-button size="large" @click="dialogDelVisible = false"
              >取 消</el-button
            >
            <el-button size="large" type="primary" @click="delBillSure"
              >确 定</el-button
            >
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { updateBillPort } from "_req/api/bill";

import UploadImg from "@/components/upload-img.vue";
export default {
  components: {
    UploadImg,
  },
  data() {
    return {
      isShow: false,
      baseUrl: this.$store.state.baseUrl,
      productCode: "",
      dialogCodeVisible: false,
      // 未查询到产品
      isClick: false,

      labelVals: [],
      billData: {
        personId: "",
        time: this.shellDate(new Date()),
        tradeType: "",
        payeeId: "",
        productDes: "",
        foreignMoney: "",
        foreignCurrency: "",
        foreignToSettleRate: "",
        settleMoney: "",
        settleCurrency: "",
        receiveType: "",
        remark: "",
        pics: [],
        watchList: [],
      },
      productListMsg: {
        productNumber: "",
        foreignMoney: "",
        settleMoney: "",
        sellSettleMoney: 0,
        buyWatchMoney: 0,
        sellMoney: 0,
      },
      billRules: {
        personId: [
          {
            required: true,
            message: "请选择账户",
            trigger: "change",
          },
        ],
        time: [
          {
            required: true,
            message: "请选择账单日期",
            trigger: "change",
          },
        ],
        tradeType: [
          {
            required: true,
            message: "请选择交易类型",
            trigger: "change",
          },
        ],
        payeeId: [
          {
            required: false,
            message: "请选择收款账户",
            trigger: "change",
          },
        ],
        foreignMoney: [
          {
            required: false,
            message: "请输入外币金额",
            trigger: "blur",
          },
        ],
      },
      userList: [],
      typeList: [
        {
          label: "买入",
          value: 0,
        },
        {
          label: "卖出",
          value: 1,
        },
        {
          label: "转账",
          value: 2,
        },
        {
          label: "买入退款",
          value: 3,
        },
        {
          label: "卖出退款",
          value: 4,
        },
        {
          label: "其他收入",
          value: 5,
        },
        {
          label: "其他支出",
          value: 6,
        },
        {
          label: "成本",
          value: 7,
        },
        {
          label: "加工费",
          value: 8,
        },
      ],

      meansList: [],
      billList: [],
      dialogDelVisible: false,
      delId: null,
      productCodeIsKong: false,

      currencyList: ["HKD", "CNY", "EUR", "USD"],
      labelList: [],

      dialogProductVisible: false,
      matchingList: [],
    };
  },
  created() {
    this.getBillUserList();
    // this.getMeansList();
  },
  methods: {
    // 账单图片
    billImgUrlChange(data) {
      console.log("账单图片", data);
      this.billData.pics = data.img;
    },

    // 修改賬單
    updateBill(row) {
      console.log("修改账单", row);
      this.isClick = false;

      this.billData = JSON.parse(JSON.stringify(row));
      if (this.billData.pics) {
        this.billData.pics = this.billData.pics.split("|").filter((el) => {
          return el != "";
        });
      } else {
        this.billData.pics = [];
      }

      this.labelVals = [];
      if (this.billData.label) {
        if (this.billData.label.indexOf(",") == -1) {
          this.labelVals.push(this.billData.label);
        } else {
          this.labelVals = this.billData.label.split(",");
        }
      }
      console.log(this.labelVals);

      console.log("修改账单", this.billData);
    },
    // 確定修改
    updateBillSure() {
      if (this.isClick == true) {
        this.$message.error({
          message: "有编号查询产品描述失败，请检查编号输入是否正确",
          showClose: true,
          duration: 5000,
        });
      } else {
        this.isKong();
        if (this.productCodeIsKong == false) {
          console.log("通過");
          this.updateData();
        } else {
          console.log("不通過");
        }
      }
    },
    // 确定修改数据
    updateData() {
      this.$refs.billForm.validate((valid) => {
        if (!valid) return;
        let list = JSON.parse(JSON.stringify(this.billData));
        list.pics = list.pics.join("|");

        for (const index in this.labelVals) {
          this.labelVals[index] = this.labelVals[index].replace("，", ",");
        }
        this.billData.label = this.labelVals.join(",");

        updateBillPort(list)
          .then((res) => {
            console.log("修改賬單信息");
            console.log(res);
            this.$message.success("账单信息修改成功");
            this.clearData();
            this.getBillList();
            this.labelVals = [];
            document
              .getElementById("billEntryContainer")
              .scrollIntoView({ behavior: "smooth" });
          })
          .catch(() => {
            this.billData.pics = this.billData.pics.split("|");
          });
      });
    },

    // 删除账单
    delBill(row, column) {
      this.isClick = false;
      if (column.label == "操作") {
        this.delId = row.id;
        this.dialogDelVisible = true;
      }
    },
    // 確定刪除
    delBillSure() {
      this.$axios.post(this.baseUrl + "", this.delId).then((res) => {
        console.log("刪除賬單信息");
        console.log(res);

        this.$message.success({
          message: "账单删除成功",
          showClose: true,
          duration: 2000,
        });
        this.dialogDelVisible = false;
        this.getBillList();
        document
          .getElementById("billEntryContainer")
          .scrollIntoView({ behavior: "smooth" });
      });
    },

    // 提交數據
    submitData() {
      console.log("添加账单", this.billData);
      this.$refs.billForm.validate((valid) => {
        if (!valid) return;

        if (this.isClick == true) {
          this.$message.error({
            message: "有编号查询产品描述失败，请检查编号输入是否正确",
            showClose: true,
            duration: 5000,
          });
        } else {
          this.billData.id = null;
          this.isKong();
          if (this.productCodeIsKong == false) {
            console.log("通過");
            this.submitFormData();
          } else {
            console.log("不通過");
          }
        }
      });
    },
    // 确定提交数据
    submitFormData() {
      for (const index in this.labelVals) {
        this.labelVals[index] = this.labelVals[index].replace("，", ",");
      }
      this.billData.label = this.labelVals.join(",");
      let list = JSON.parse(JSON.stringify(this.billData));
      list.pics = list.pics.join("|");

      this.$axios
        .post(this.baseUrl + "", list)
        .then((res) => {
          console.log("提交賬單信息");
          console.log(res);

          this.$message.success({
            message: "账单录入成功",
            showClose: true,
            duration: 2000,
          });
          this.clearData();
          this.getBillList();
          document
            .getElementById("billEntryContainer")
            .scrollIntoView({ behavior: "smooth" });
        })
        .catch(() => {
          this.billData.pics = this.billData.pics.split("|");
        });
    },

    // 验证数据
    isKong() {
      this.productCodeIsKong = false;

      if (this.billData.watchList.length > 0) {
        for (const item of this.billData.watchList) {
          // 交易類型為  買入/賣出相關
          if (this.billData.tradeType == 0) {
            if (
              item.buyWatchMoney &&
              item.foreignMoney &&
              item.buyWatchMoney != item.foreignMoney
            ) {
              this.productCodeIsKong = true;
              let msg =
                "统一编号" +
                item.productNumber +
                "入库金额为：" +
                item.buyWatchMoney +
                this.billData.settleCurrency +
                " ，您录入的买入金额为：" +
                item.foreignMoney +
                this.billData.foreignCurrency +
                " ，两者不相等，是否确定继续提交？";
              this.$messageBox
                .confirm(msg, "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                })
                .then(() => {
                  this.productCodeIsKong = false;
                  if (this.billData.id) {
                    this.updateData();
                  } else {
                    this.submitFormData();
                  }
                })
                .catch(() => {
                  console.log("取消提交");
                });
              return;
            } else {
              this.productCodeIsKong = false;
            }
          } else if (this.billData.tradeType == 1) {
            if (
              item.sellMoney &&
              item.foreignMoney &&
              item.sellMoney != item.foreignMoney
            ) {
              this.productCodeIsKong = true;
              let msg =
                "统一编号" +
                item.productNumber +
                "出售金额为：" +
                item.sellMoney +
                this.billData.settleCurrency +
                " ，您录入的卖出金额为：" +
                item.foreignMoney +
                this.billData.foreignCurrency +
                " ，两者不相等，是否确定继续提交？";

              this.$messageBox
                .confirm(msg, "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                })
                .then(() => {
                  this.productCodeIsKong = false;
                  if (this.billData.id) {
                    this.updateData();
                  } else {
                    this.submitFormData();
                  }
                })
                .catch(() => {
                  console.log("取消提交");
                });
              return;
            } else {
              this.productCodeIsKong = false;
            }
          }
        }

        if (this.billData.tradeType == 2) {
          let saleMoneyTotal = 0;

          // reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。
          // 參數一：必需。用于执行每个数组元素的函数。 c: 必需,初始值/计算结束后的返回值。item	必需,当前元素
          // 參數二：可选。传递给函数的初始值
          saleMoneyTotal = this.billData.watchList.reduce(
            (c, item) => c + item.sellSettleMoney * 1,
            0
          );

          if (
            this.billData.foreignMoney &&
            saleMoneyTotal &&
            this.billData.foreignMoney != saleMoneyTotal
          ) {
            this.productCodeIsKong = true;
            let msg =
              "产品列表出售总金额为：" +
              saleMoneyTotal +
              this.billData.settleCurrency +
              " ，您的转账金额为：" +
              this.billData.foreignMoney +
              this.billData.foreignCurrency +
              " ，两者不相等，是否确定继续提交？";
            this.$messageBox
              .confirm(msg, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
              .then(() => {
                this.productCodeIsKong = false;
                if (this.billData.id) {
                  this.updateData();
                } else {
                  this.submitFormData();
                }
              })
              .catch(() => {
                console.log("取消提交");
              });
            return;
          } else {
            this.productCodeIsKong = false;
          }
        }
      }
    },

    // 根據貨號查找產品描述
    searchCode(productCode, index) {
      console.log(productCode, index);
      productCode = productCode.trim();
      if (productCode != "") {
        this.$axios
          .get(this.baseUrl + "/productCodeSearch?productCode=" + productCode)
          .then((res) => {
            console.log("產品描述列表");
            console.log(res);
            let item = res.data.data;
            if (item.length == 0) {
              if (item.stockId) {
                this.proDes = item.productDes;
                this.isClick = false;

                if (index != "") {
                  console.log("修改333333333");
                  let list = this.billData.productDes
                    .split("\n")
                    .filter((el) => {
                      return el != "";
                    });
                  list.splice(index, 1, this.proDes);
                  this.billData.productDes = list.join("\n");

                  this.billData.watchList[index].productCode = productCode;
                  this.billData.watchList[index].stockId = item.stockId;
                  this.billData.watchList[index].saleTotalHkMoney =
                    item.saleTotalHkMoney;
                  this.billData.watchList[index].treasuryPrices =
                    item.totalHkPrice;
                  this.billData.watchList[index].saleTotalHkPrice =
                    item.saleTotalHkPrice;
                } else {
                  console.log("新增66666666666");

                  this.productListMsg.productCode = productCode;
                  this.productListMsg.stockId = item.stockId;
                  this.productListMsg.saleTotalHkMoney = item.saleTotalHkMoney;
                  this.productListMsg.treasuryPrices = item.totalHkPrice;
                  this.productListMsg.saleTotalHkPrice = item.saleTotalHkPrice;
                }
              }
            } else if (item.length > 0) {
              this.matchingList = item;
              this.dialogProductVisible = true;
            } else {
              this.productCode = productCode;
              this.dialogCodeVisible = true;
              this.isClick = true;
            }
          });
      }
    },
    // 选择产品列表
    handleCurrentChange(val) {
      console.log("选择产品", val);

      this.dialogProductVisible = false;
    },
    // 刪除該條貨號記錄
    delCode(index) {
      this.billData.watchList.splice(index, 1);

      let list = this.billData.productDes.split("\n").filter((el) => {
        return el != "";
      });
      list.splice(index, 1);
      this.billData.productDes = list.join("\n");

      this.tableHKPriceChange();
    },
    // 添加貨號
    addCode() {
      if (this.productListMsg.productCode) {
        if (this.isClick == true) {
          this.$message.error({
            message: "编号查询产品描述失败，请检查编号是否输入正确",
            showClose: true,
            duration: 5000,
          });
        } else {
          if (
            !this.productListMsg.foreignMoney &&
            !this.productListMsg.settleMoney
          ) {
            this.$message.error({
              message: "请输入外币金额/港币金额",
              showClose: true,
              duration: 2000,
            });
            return;
          }

          this.billData.watchList.push({
            productCode: this.productListMsg.productCode,
            stockId: this.productListMsg.stockId,
            foreignMoney: this.productListMsg.foreignMoney,
            settleMoney: this.productListMsg.settleMoney,
            totalHkPrice: this.productListMsg.totalHkPrice,
            saleTotalHkMoney: this.productListMsg.saleTotalHkMoney,
            treasuryPrices: this.productListMsg.treasuryPrices,
            saleTotalHkPrice: this.productListMsg.saleTotalHkPrice,
          });

          if (
            this.billData.productDes &&
            this.billData.productDes.substr(-1, 2) != "\n"
          ) {
            this.billData.productDes += "\n" + this.proDes + "\n";
          } else {
            this.billData.productDes += this.proDes + "\n";
          }

          this.tableHKPriceChange();

          this.productListMsg = {
            productNumber: "",
            foreignMoney: "",
            settleMoney: "",
            sellSettleMoney: 0,
            buyWatchMoney: 0,
            sellMoney: 0,
          };
        }
      } else {
        this.$message.error({
          message: "请输入编号查询产品",
          showClose: true,
          duration: 2000,
        });
      }
    },

    // 表格内外币金额与港币金额变化
    tablePriceChange(item, index) {
      item.foreignMoney = this.getPriceNum(item.foreignMoney);
      item.settleMoney = this.getPriceNum(item.settleMoney);

      if (
        item.foreignMoney != 0 &&
        item.foreignMoney != "" &&
        this.billData.foreignToSettleRate != ""
      ) {
        if (
          this.billData.foreignCurrency == "CNY" &&
          this.billData.foreignToSettleRate < 1
        ) {
          item.settleMoney = Number(
            (item.foreignMoney / this.billData.foreignToSettleRate).toFixed(2)
          );
        } else {
          item.settleMoney = Number(
            (item.foreignMoney * this.billData.foreignToSettleRate).toFixed(2)
          );
        }
      }
      if (index == "update") {
        this.tableHKPriceChange();
      }
    },

    // 汇率变化
    rateChange() {
      if (
        this.billData.foreignCurrency == "CNY" &&
        this.billData.foreignToSettleRate < 1
      ) {
        this.productListMsg.settleMoney = Number(
          (
            this.productListMsg.foreignMoney / this.billData.foreignToSettleRate
          ).toFixed(2)
        );
      } else {
        this.productListMsg.settleMoney = Number(
          (
            this.productListMsg.foreignMoney * this.billData.foreignToSettleRate
          ).toFixed(2)
        );
      }

      for (const item of this.billData.stockList) {
        if (
          this.billData.foreignCurrency == "CNY" &&
          this.billData.foreignToSettleRate < 1
        ) {
          item.settleMoney = Number(
            (item.foreignMoney / this.billData.foreignToSettleRate).toFixed(2)
          );
        } else {
          item.settleMoney = Number(
            (item.foreignMoney * this.billData.foreignToSettleRate).toFixed(2)
          );
        }
      }

      this.hkMoneyNum();
    },

    // 根據table計算總金額
    tableHKPriceChange() {
      this.billData.foreignMoney = 0;
      this.billData.settleMoney = 0;
      for (const item of this.billData.watchList) {
        this.billData.foreignMoney += Number(item.foreignMoney);
        this.billData.settleMoney += Number(item.settleMoney);
      }
    },

    // 根据总外币金额计算总港币金额
    hkMoneyNum() {
      this.billData.foreignMoney = this.getPriceNum(this.billData.foreignMoney);
      console.log(this.billData.foreignMoney);

      if (this.billData.foreignCurrency == "HKD") {
        this.billData.settleMoney = Number(
          Number(this.billData.foreignMoney).toFixed(2)
        );
      } else {
        if (
          this.billData.foreignMoney != "" &&
          this.billData.foreignMoney != 0 &&
          this.billData.foreignToSettleRate != ""
        ) {
          if (
            this.billData.foreignCurrency == "CNY" &&
            this.billData.foreignToSettleRate < 1
          ) {
            this.billData.settleMoney = Number(
              (
                this.billData.foreignMoney / this.billData.foreignToSettleRate
              ).toFixed(2)
            );
          } else {
            this.billData.settleMoney = Number(
              (
                this.billData.foreignMoney * this.billData.foreignToSettleRate
              ).toFixed(2)
            );
          }
        }
      }
    },

    // 交易類型變化
    tradeTypeChange() {
      console.log(this.billData.tradeType);
      if (this.billData.tradeType == 2) {
        this.billRules.payeeId[0].required = true;
      } else {
        this.billRules.payeeId[0].required = false;
      }
    },

    // 支出账户/收款账户
    personShow() {
      console.log(this.billData.tradeType);
      if (
        this.billData.tradeType == 1 ||
        this.billData.tradeType == 3 ||
        this.billData.tradeType == 5
      ) {
        return "收款账户";
      } else if (
        this.billData.tradeType == 0 ||
        this.billData.tradeType == 2 ||
        this.billData.tradeType == 4 ||
        this.billData.tradeType == 6 ||
        this.billData.tradeType == 7 ||
        this.billData.tradeType == 8
      ) {
        return "支出账户";
      }
    },

    // 重置表單
    clearData() {
      let name = this.billData.personId;

      this.billData.id = null;
      this.billData.foreignCurrency = "";
      this.billData.watchList = [];
      this.productListMsg = {
        productNumber: "",
        foreignMoney: "",
        settleMoney: "",
        sellSettleMoney: 0,
        buyWatchMoney: 0,
        sellMoney: 0,
      };
      this.billData.pics.length = 0;
      this.labelVals = [];
      this.$refs.billForm.resetFields();

      this.billData.personId = name;
    },

    // 交易方式輸入/匹配
    querySearch(queryString, cb) {
      console.log(queryString);
      let results = queryString
        ? this.meansList.filter(this.createFilter(queryString))
        : this.meansList;
      console.log(results);
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelect(item) {
      console.log(item);
      this.billData.receiveType = item.value;
    },

    // 獲取賬單列表
    getBillList() {
      this.$axios
        .post(this.baseUrl + "", {
          personId: this.billData.personId,
          sort: 1,
          page: 1,
          pageNum: 10,
        })
        .then((res) => {
          console.log("賬單列表");
          console.log(res);
          this.billList = res.data.data.detailList.list;
        });
    },

    // 獲取用戶列表
    getBillUserList() {
      setInterval(() => {
        this.isShow = true;
      }, 100);

      // this.$axios
      //   .get(this.baseUrl + "")
      //   .then((res) => {
      //     console.log("用户列表");
      //     console.log(res);
      //     this.userList = res.data.data;
      //   })
    },

    // 獲取交易方式列表
    getMeansList() {
      this.$axios.get(this.baseUrl + "").then((res) => {
        console.log("交易方式列表");
        console.log(res);

        this.meansList = [];
        if (res.data.data.length > 0) {
          for (const item of res.data.data) {
            if (item) {
              this.meansList.push({
                value: item,
              });
            }
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.bill-entry-container {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 10px;

  .container-left {
    width: 59%;
    margin-right: 20px;
    background-color: #fff;
    border-radius: 6px;
  }

  .container-right {
    width: 39%;
    margin-right: 20px;
    background-color: #fff;
    border-radius: 6px;
    .right-title {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
    }
  }
}
</style>
