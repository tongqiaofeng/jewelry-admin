<template>
  <div>
    <div class="back-img" @click="goBack">
      <img class="back-icon" src="../assets/imgs/goback.png" />
      <span class="font">返回</span>
    </div>

    <el-form ref="billForm" :model="billData" :rules="billRules" label-width="80px">
      <el-form-item label="账单日期" prop="time">
        <el-date-picker size="large" type="date" placeholder="请选择账单日期" v-model="billData.time" style="width: 100%"
          value-format="yyyy-MM-dd" format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="交易类型" prop="tradeType">
        <el-select size="large" style="width: 100%" v-model="billData.tradeType" placeholder="请选择"
          @change="tradeTypeChange">
          <el-option v-for="(item, index) in typeList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="personShow(billData.tradeType)" prop="personId">
        <el-select size="large" style="width: 100%" v-model="billData.personId" placeholder="请选择" clearable>
          <el-option v-for="(item, index) in userList" :key="index" :label="item.nick" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="收款账户" v-show="billData.tradeType == 2" prop="payeeId">
        <el-select size="large" style="width: 100%" v-model="billData.payeeId" placeholder="请选择">
          <el-option v-for="(item, index) in userList" :key="index" :label="item.nick" :value="item.id"
            v-show="item.id != billData.personId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="交易方式" prop="receiveType">
        <el-autocomplete size="large" style="width: 100%" :fit-input-width="true" clearable v-model="billData.receiveType"
          :fetch-suggestions="querySearch" placeholder="请选择/输入内容" @select="handleSelect" />
      </el-form-item>
      <el-form-item label="产品列表">
        <div class="code-table">
          <div class="every1">
            <span style="color: red" v-show="
              billData.tradeType != 2 &&
              billData.tradeType != 5 &&
              billData.tradeType != 6
            ">*</span>发票号
          </div>
          <div class="every2">外币金额</div>
          <div class="every3">外币转港币汇率</div>
          <div class="every4">港币金额</div>
          <div class="every5">操作</div>
        </div>
        <div class="code-table" style="margin-top: 5px">
          <div class="every1">
            <el-input size="large" v-model="productListMsg.productNumber" placeholder="请输入"
              @change="searchCode(productListMsg.productNumber, '')"></el-input>
          </div>
          <div class="every2">
            <el-input size="large" v-model="productListMsg.foreignMoney" placeholder="请输入"
              @change="tablePriceChange(productListMsg, 'add')"></el-input>
            <el-select size="large" v-model="billData.foreignCurrency" placeholder="请选择币种">
              <el-option v-for="(item, index) in currencyList" :key="index" :label="item.enCurrency"
                :value="item.enCurrency">
              </el-option>
            </el-select>
          </div>
          <div class="every3">
            <el-input size="large" v-model="billData.foreignToSettleRate" placeholder="请输入"
              @input="hkRateTableNum"></el-input>
          </div>
          <div class="every4">
            <el-input size="large" v-model="productListMsg.settleMoney" placeholder="请输入"
              @change="tablePriceChange(productListMsg, 'add')"></el-input>
          </div>
          <div class="every5">
            <div class="btn-row" style="cursor: pointer">
              <i class="el-icon-circle-plus-outline" style="font-size: 22px;color: #3d81fd;" @click="addCode"></i>
            </div>
          </div>
        </div>
        <div style="margin-top: 30px">
          <div class="code-table" style="margin-bottom: 5px" v-for="(items, index) in billData.watchList" :key="index">
            <div class="every1">
              <el-input size="large" v-model="items.stockNo" placeholder="请输入"
                @change="searchCode(items.stockNo, index)"></el-input>
            </div>
            <div class="every2">
              <el-input size="large" v-model="items.foreignMoney" placeholder="请输入"
                @change="tablePriceChange(items, 'update')"></el-input>
              <el-select size="large" v-model="billData.foreignCurrency" placeholder="请选择币种">
                <el-option v-for="(item, index) in currencyList" :key="index" :label="item.enCurrency"
                  :value="item.enCurrency">
                </el-option>
              </el-select>
            </div>
            <div class="every3">
              <el-input size="large" v-model="billData.foreignToSettleRate" placeholder="请输入"
                @input="hkRateTableNum"></el-input>
            </div>
            <div class="every4">
              <el-input size="large" v-model="items.settleMoney" placeholder="请输入"
                @change="tablePriceChange(items, 'update')"></el-input>
            </div>
            <div class="every5">
              <div class="btn-row" style="cursor: pointer">
                <i class="el-icon-delete" style="font-size: 22px;color: #3d81fd;" @click="delCode(index)"></i>
              </div>
            </div>
          </div>
        </div>
        <el-dialog title="提示" v-model="dialogCodeVisible" width="520px">
          <div style="text-align: center; font-size: 16px">
            未查找到{{ productCode }}，请检查发票号是否输入正确
          </div>
          <template #footer>
            <div>
              <el-button type="primary" @click="dialogCodeVisible = false" class="sure-button">确 定</el-button>
            </div>
          </template>
        </el-dialog>
      </el-form-item>
      <el-form-item label="产品描述" prop="productDes">
        <el-input size="large" style="width: 100%" type="textarea" v-model="billData.productDes"
          placeholder="产品描述"></el-input>
      </el-form-item>
      <el-form-item label="外币金额" prop="foreignMoney">
        <div style="display: flex">
          <el-input size="large" v-model="billData.foreignMoney" placeholder="请输入外币金额" @change="hkMoneyNum"></el-input>
          <el-select size="large" v-model="billData.foreignCurrency" placeholder="请选择金额币种" :disabled="
            billData.tradeType == 0 ||
              billData.tradeType == 1 ||
              billData.tradeType == 3 ||
              billData.tradeType == 4
              ? true
              : false
          ">
            <el-option v-for="(item, index) in currencyList" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input size="large" style="width: 100%" type="textarea" v-model="billData.remark"
          placeholder="请输入备注信息"></el-input>
      </el-form-item>
      <el-form-item label="账单图片：" prop="pics">
        <UploadImg :imgUrl="billData.pics" :imgType="2" :isUpdate="1" @imgChange="billImgUrlChange"></UploadImg>
      </el-form-item>
    </el-form>
    <div style="display: flex; justify-content: flex-end; text-align: right">
      <el-button size="large" style="width: 120px" type="primary" v-preventClick @click="updateBillSure">
        修改
      </el-button>
    </div>
  </div>
</template>

<script>
import UploadImg from "@/components/upload-img.vue";
export default {
  components: {
    UploadImg,
  },
  props: {
    billUpdateId: {
      type: Number,
    },
    userList: {
      type: Array,
    },
  },
  data() {
    return {
      currencyList: ["HKD", "CNY", "EUR", "USD"],
      billData: {},

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
      ],

      productCode: "",
      productCodeIsKong: false,
      isClick: false,

      personCurrency: null,
      payeeCurrency: null,

      dialogCodeVisible: false,
      meansList: [],
    };
  },
  created() {
    // this.getBillMsg();
    // this.getMeansList();
  },
  methods: {
    // 获取账单详情
    getBillMsg() {
      this.$axios.get(this.baseUrl + "", this.billUpdateId).then((res) => {
        console.log("账单详情", res);
        this.billData = res.data.data;
        if (this.billData.pics) {
          this.billData.pics = this.billData.pics.split("|").filter((el) => {
            return el != "";
          });
        } else {
          this.billData.pics = [];
        }
        console.log("修改账单", this.billData);
      });
    },

    // 支出賬戶/收款賬戶
    personShow(value) {
      if (value == 1 || value == 3 || value == 5) {
        return "收款账户";
      } else if (value == 0 || value == 2 || value == 4 || value == 6) {
        return "支出账户";
      }
    },

    // 账单图片
    billImgUrlChange(data) {
      console.log("账单图片", data);
      this.billData.pics = data.img;
    },

    // 確定修改
    updateBillSure() {
      this.$refs.billForm.validate((valid, fields) => {
        console.log(fields);
        if (valid) {
          if (
            this.isClick == true &&
            this.billData.watchList[0].productNumber
          ) {
            this.$message.error({
              message: "有发票号查询产品描述失败，请检查发票号输入是否正确",
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
              if (this.billData.watchList.length == 0) {
                this.billData.watchList = [
                  {
                    productNumber: "",
                    foreignMoney: this.billData.foreignMoney,
                    sellSettleMoney: 0,
                    buyWatchMoney: 0,
                    sellMoney: 0,
                  },
                ];
              }
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    updateData() {
      let list = JSON.parse(JSON.stringify(this.billData));
      list.pics = list.pics.join("|");
      this.billData.pics = this.imgSrcs.join("|");
      for (const index in this.labelVals) {
        this.labelVals[index] = this.labelVals[index].replace("，", ",");
      }
      this.billData.label = this.labelVals.join(",");

      this.$axios
        .post(this.baseUrl + "", list)
        .then((res) => {
          console.log("修改賬單信息");
          console.log(res);
          this.$message.success({
            message: "账单信息修改成功",
            showClose: true,
            duration: 2000,
          });
          this.$emit("updateBillSuccess", 0);
        })
        .catch(() => {
          this.billData.pics = this.billData.pics.split("|");
        });
    },

    // 驗證數據
    isKong() {
      this.productCodeIsKong = false;

      if (this.billData.watchList[0].productNumber == "") {
        this.billData.watchList = [];
      } else {
        for (const item of this.billData.watchList) {
          if (this.billData.tradeType == 0) {
            if (
              item.buyWatchMoney &&
              item.foreignMoney &&
              item.buyWatchMoney != item.foreignMoney
            ) {
              this.productCodeIsKong = true;
              let msg =
                "发票号" +
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

                  this.updateData();
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
                "发票号" +
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

                  this.updateData();
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

                this.updateData();
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
    searchCode(code, index) {
      console.log(code, index);
      code = code.trim();
      if (code != "") {
        this.$axios
          .get(this.baseUrl + "/productCodeSearch?productCode=" + code)
          .then((res) => {
            console.log("產品描述列表");
            console.log(res);
            let item = res.data.data;
            if (item.stockId) {

              this.isClick = false;

              if (index !== "") {
                console.log("修改333333333");

                this.billData.watchList[index].productCode = code;
                this.billData.watchList[index].stockId = item.stockId;
                this.billData.watchList[index].saleTotalHkMoney =
                  item.saleTotalHkMoney;
                this.billData.watchList[index].treasuryPrices =
                  item.totalHkPrice;
                this.billData.watchList[index].saleTotalHkPrice =
                  item.saleTotalHkPrice;
              } else {
                console.log("新增66666666666");

                this.productListMsg.productCode = code;
                this.productListMsg.stockId = item.stockId;
                this.productListMsg.saleTotalHkMoney = item.saleTotalHkMoney;
                this.productListMsg.treasuryPrices = item.totalHkPrice;
                this.productListMsg.saleTotalHkPrice = item.saleTotalHkPrice;
              }
            } else {
              this.productCode = code;
              this.dialogCodeVisible = true;
              this.isClick = true;
            }
          });
      }
    },
    // 刪除該條貨號記錄
    delCode(index) {
      this.billData.watchList.splice(index, 1);

      this.tableHKPriceChange();
    },
    // 添加貨號
    addCode() {
      if (this.productListMsg.productCode) {
        if (this.isClick == true) {
          this.$message.error({
            message: "发票号查询产品描述失败，请检查发票号是否输入正确",
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
          message: "请输入发票号查询产品",
          showClose: true,
          duration: 2000,
        });
      }
    },

    // 表格內外幣金額與港幣金額變化
    tablePriceChange(item) {
      item.foreignMoney = this.getPriceNum(item.foreignMoney);

      this.tableHKPriceChange();
    },

    // 根據table計算總金額
    tableHKPriceChange() {
      this.billData.foreignMoney = 0;
      for (const item of this.billData.watchList) {
        this.billData.foreignMoney += Number(item.foreignMoney);
      }
    },

    // 根據總金額計算總港幣金額
    hkMoneyNum() {
      this.billData.foreignMoney = this.getPriceNum(this.billData.foreignMoney);
      console.log(this.billData.foreignMoney);
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

    goBack() {
      this.$emit("updateBillSuccess", 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.product-table {
  width: 100%;
  display: flex;
  justify-content: space-between;

  .add-button {
    width: 200px;
    height: 40px;
    margin: 0 auto;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #c3c3c3;
    border-radius: 10px;
    cursor: pointer;

    img {
      width: 32px;
      height: 32px;
      margin-right: 10px;
    }
  }

  .every1,
  .every2,
  .every3,
  .every4,
  .every5 {
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
  }

  .every1 {
    width: 15%;
  }

  .every2 {
    width: 40%;
  }

  .every3 {
    width: 17%;
  }

  .every4 {
    width: 13%;
  }

  .every5 {
    width: 10%;
  }
}
</style>
