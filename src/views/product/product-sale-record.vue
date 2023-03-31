<template>
  <div id="sellRecord">
    <!-- <h1>出售记录</h1> -->
    <div v-if="pageSel === 0" class="sell-record">
      <el-form :inline="true" style="text-align: left;">
        <el-form-item label="仓库/加工厂：">
          <el-select v-model="storageId" clearable placeholder="可多选" style="width: 150px;" :popper-append-to-body="false">
            <el-option v-for="item in warehouseFilterList" v-show="item.isOwn == 1" :key="item.id" :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售组：">
          <el-select v-model="group" placeholder="请选择" :popper-append-to-body="false">
            <el-option label="全部" value="全部"> </el-option>
            <el-option v-for="item in groupList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售时间：">
          <el-date-picker v-model="sellTime" type="monthrange" range-separator="至" start-placeholder="开始月份"
            end-placeholder="结束月份" format="yyyy-MM" value-format="yyyy-MM" clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <div style="display: flex;">
            <el-input style="width: 400px;" v-model="keyword" placeholder="可输入销售发票号、材料名称、统一编号、备注进行搜索" clearable>
            </el-input>
            <el-button style="margin-left: 10px;" type="primary" @click="handleCurrentChange(1)">查 询</el-button>
          </div>
        </el-form-item>
      </el-form>

      <div
        style="width: 100%;padding: 20px 0;margin-top: 20px;text-align: center;background-color: #fff;border-radius: 6px;"
        v-if="sellDataList.length == 0">
        暂无数据
      </div>
      <div v-else style="margin-top: 20px">
        <div v-for="(item, index) in sellDataList" :key="index"
          style="margin-bottom: 40px;background-color: #fff;border-radius: 6px;">
          <div class="bill-container">
            <div class="container-top-left">
              <div style="font-size: 16px; color: #000">
                销售发票号：<span style="font-size: 14px; color: #666">{{
                  item.sellBillNumber
                }}</span>
              </div>
              <div style="margin-left: 30px; font-size: 16px; color: #000">
                销售员：<span style="font-size: 14px; color: #666">{{
                  item.solder
                }}</span>
              </div>
              <div style="margin-left: 30px; font-size: 16px; color: #000">
                客户名称：<span style="font-size: 14px; color: #666">
                  {{ item.customer }}{{ item.customerType ? " - " + item.customerType : "" }}</span>
              </div>
            </div>
            <div>
              <el-button size="small" @click.prevent="updateRecord(item)">修改记录</el-button>
              <el-button type="danger" size="small" @click.prevent="delBillNumber(item)">撤销记录</el-button>
            </div>
          </div>
          <el-table ref="multipleTableSel" :data="item.productList" :row-key="getRowKeys" tooltip-effect="dark" border
            highlight-current-row @row-click="delsell" @row-dblclick="updateProductInfo">
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
            <el-table-column align="center" label="裸石成本" prop="costPrice">
              <template slot-scope="scope">
                <div>
                  <span>{{ formatNumberRgx(scope.row.costPrice) + " HKD" }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="processCost" label="加工费">
              <template slot-scope="scope">
                <div>
                  <span>{{ formatNumberRgx(scope.row.processCost) + " CNY" }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="其他费用" prop="stockInOtherExpenses">
              <template slot-scope="scope">
                <div>
                  <span>{{ formatNumberRgx(scope.row.stockInOtherExpenses) + " HKD" }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="出售外币金额">
              <template slot-scope="scope">
                <div>
                  <span>{{
                    scope.row.saleCurrency != ""
                    ? formatNumberRgx(scope.row.saleMoney) +
                    " " +
                    scope.row.saleCurrency
                    : "--"
                  }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="出售港币金额">
              <template slot-scope="scope">
                <div>
                  <span>{{
                    scope.row.sellTotalHkPrice
                    ? formatNumberRgx(scope.row.sellTotalHkPrice) + " HKD"
                    : "--"
                  }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="其他支出费用">
              <template slot-scope="scope">
                <div>
                  <span>{{
                    scope.row.otherExpenses
                    ? formatNumberRgx(scope.row.otherExpenses) + " HKD"
                    : "--"
                  }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="90px">
              <template>
                <el-button type="text" style="color: red;">
                  撤销销售
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div style="width: 100%;height: 50px;">
          <div style="margin:15px 0;position:absolute;right:6%;">
            <el-pagination @current-change="handleCurrentChange" :current-page="page"
              layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
      <el-dialog v-if="dialogDeleteSellVisible" title="撤销销售" :visible.sync="dialogDeleteSellVisible"
        :close-on-press-escape="false" :close-on-click-modal="false" :modal-append-to-body="false" :append-to-body="false"
        id="delSale">
        <div class="del-style">
          确定撤销该销售记录吗？撤销后不可修改
        </div>
        <template #footer>
          <div>
            <el-button size="large" @click="dialogDeleteSellVisible = false">取 消</el-button>
            <el-button type="primary" size="large" v-preventClick @click="delSuresell">确 定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
    <div v-else-if="pageSel === 1" class="sell-record">
      <saleProductRecordUpdate :updateSaleRecordMsg="updateSaleRecordMsg" @updateSaleSure="updateSaleSure">
      </saleProductRecordUpdate>
    </div>
    <!-- 修改成品信息 -->
    <div v-else-if="pageSel === 2">
      <productMsgUpdate :updateProductMsg="deviceDetail" @sureUpdateProduct="sureUpdateProduct"></productMsgUpdate>
    </div>
  </div>
</template>

<script>
import { base_img_url } from "_req/http";
import {
  productSellOrderPort,
  productSellDetailRevokePort,
  productSellOrderRevokePort,
} from "_req/api/product";
import { warehouseFactoryPort, productInfoPort } from "_req/api/common";
import { groupListPort } from "_req/api/admin";

import saleProductRecordUpdate from "@/components/sale-product-record-update.vue";
import productMsgUpdate from "@/components/product-msg-update.vue";
export default {
  components: {
    saleProductRecordUpdate,
    productMsgUpdate,
  },
  data() {
    return {
      pageSel: 0,
      axiosUrl: "",
      groupList: [],
      warehouseFilterList: [],
      group: "",
      sellTime: "",
      keyword: "",
      page: 1,
      total: 0,
      storageId: null,
      sellDataList: [],

      delSellId: null,
      dialogDeleteSellVisible: false,

      deviceDetail: {},
      delNum: 0,
    };
  },
  created() {
    this.axiosUrl = base_img_url;
    this.getWarehouseFactoryList();
    this.getSellOrderList();
  },
  methods: {
    updateRecord(item) {
      console.log(item);
      this.updateSaleRecordMsg = item;
      this.pageSel = 1;
    },
    updateSaleSure() {
      this.pageSel = 0;
    },

    // 修改成品信息
    updateProductInfo(item) {
      console.log(item);
      productInfoPort({
        id: item.id,
      }).then((res) => {
        console.log("成品详情");
        console.log(res);

        this.deviceDetail = res.data.data;

        this.pageSel = 2;
      });
    },

    // 确定修改出售记录
    sureUpdateProduct(val) {
      this.pageSel = 0;
      if (val == 1) {
        this.getSellOrderList();
      }
    },

    delBillNumber(row) {
      this.delNum = 0;
      this.delSellId = row.sellBillNumber;

      this.dialogDeleteSellVisible = true;
    },

    // 删除出售记录
    delsell(row, column) {
      if (column.label == "操作") {
        console.log("删除出售记录", row);
        this.delSellId = row.id;
        this.delNum = 1;

        this.dialogDeleteSellVisible = true;
      }
    },
    // 确定删除
    delSuresell() {
      this.dialogDeleteSellVisible = false;
      if (this.delNum == 1) {
        productSellDetailRevokePort({
          id: this.delSellId,
        }).then((res) => {
          console.log("撤销销售");
          console.log(res);

          this.$message.success({
            message: "撤销成功",
            showClose: true,
            duration: 2000,
          });
          this.getSellOrderList();
        });
      } else {
        productSellOrderRevokePort({
          sellBillNumber: this.delSellId,
        }).then((res) => {
          console.log("撤销销售");
          console.log(res);

          this.$message.success({
            message: "撤销成功",
            showClose: true,
            duration: 2000,
          });
          this.getSellOrderList();
        });
      }
    },

    getRowKeys(row) {
      return row.id;
    },

    // 获取出售记录列表
    getSellOrderList() {
      productSellOrderPort({
        keyword: this.keyword,
        page: this.page,
        pageNum: 10,
        storageId: this.storageId,
      })
        .then((res) => {
          console.log("成品出售记录", res);
          this.sellDataList = res.data.data.list;
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
      this.getSellOrderList();

      document.getElementById("sellRecord").scrollIntoView();
    },

    // 获取仓库/加工厂列表
    getWarehouseFactoryList() {
      warehouseFactoryPort().then((res) => {
        console.log("仓库/加工厂");
        console.log(res);

        this.warehouseFilterList = res.data.data;
        this.getGroupList();
      });
    },
    // 获取销售员列表
    getGroupList() {
      groupListPort().then((res) => {
        console.log("销售员列表");
        console.log(res);
        this.groupList = res.data.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.sell-record {
  padding: 20px;
  background-color: #fff;
  border-radius: 6px;

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
}
</style>
