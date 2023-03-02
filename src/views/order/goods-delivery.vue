<template>
  <div class="shipments-container">
    <!-- 商品发货 -->
    <div style="text-align: left;">
      <el-form inline>
        <el-form-item label="下单时间">
          <el-date-picker
            v-model="checkTime"
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
          <el-input
            style="width: 350px;"
            v-model="keyword"
            placeholder="可输入订单编号、收货人、联系电话进行搜索"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchClick">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="orderList.length == 0" class="no-data">
      {{ orderMsg }}
    </div>
    <div v-else class="shipments-list">
      <div v-for="(item, index) in orderList" :key="index" class="list-every">
        <div class="every-top">
          <div class="top-left">
            <div class="div-one">
              <div class="one-left">
                订单编号：
              </div>
              <div class="one-right">
                {{ item.outTradeNo }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">
                商品总价：
              </div>
              <div class="one-right">
                {{ "CNY " + formatNumberRgx(item.productAmountTotal) }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">
                实际付款：
              </div>
              <div class="one-right">
                {{ "CNY " + formatNumberRgx(item.actualAmountTotal) }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">
                收 货 人：
              </div>
              <div class="one-right">
                {{ item.logMsg.consigneeName }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">
                收货地址：
              </div>
              <div class="one-right">
                {{ item.logMsg.consigneeAddress }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">
                联系电话：
              </div>
              <div class="one-right">
                {{ item.logMsg.consigneePhone }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">
                下单时间：
              </div>
              <div class="one-right">
                {{ item.createTime }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">
                付款时间：
              </div>
              <div class="one-right">
                {{ item.payTime }}
              </div>
            </div>
          </div>
          <div>
            <el-button
              type="default"
              size="mini"
              @click="shipmentsClick(item)"
              class="handle-button"
              >发货</el-button
            >
          </div>
        </div>
        <el-table stripe :data="item.detailList" style="width: 100%">
          <el-table-column align="center" prop="img" label="图片">
            <template slot-scope="scope">
              <div>
                <img
                  :src="axiosUrl + '/file/' + imgFilter(scope.row.img)"
                  style="width: 100px; height: 100px"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="productName" label="商品信息">
          </el-table-column>
          <el-table-column align="center" prop="productPrice" label="商品价格">
            <template slot-scope="scope">
              <div>
                {{ "CNY " + formatNumberRgx(scope.row.productAmount) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="status" label="商品状态">
            <template slot-scope="scope">
              <div>
                {{ scope.row.status === null ? "待发货" : "已申请退款" }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top:15px;text-align: right;">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page"
          layout="total, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <el-dialog
        title="商品发货"
        :visible.sync="dialogShipmentsVisible"
        v-if="dialogShipmentsVisible"
        width="500px"
        id="productLog"
      >
        <el-form
          ref="logisticsRef"
          label-width="80px"
          :model="logisticsData"
          :rules="logisticsRules"
        >
          <el-form-item label="快递公司" prop="logisticsCompanyId">
            <el-select
              v-model="logisticsData.logisticsCompanyId"
              placeholder="请选择快递公司"
              style="width: 100%"
            >
              <el-option
                v-for="item in logisticsCompanyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="快递单号" prop="logOrderNo">
            <el-input
              v-model="logisticsData.logOrderNo"
              placeholder="请输入快递单号"
            ></el-input>
          </el-form-item>
          <el-form-item label="物流运费" prop="deliveryCost">
            <el-input
              v-model="logisticsData.deliveryCost"
              placeholder="请输入物流运费"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="dialogShipmentsVisible = false">取 消</el-button>
          <el-button type="primary" @click="shipmentsSure('logisticsRef')"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { base_request_url } from "_req/http";
import {
  deliverGoodsPort,
  orderListPort,
  shipperCompanyPort,
} from "_req/api/order";

export default {
  data() {
    return {
      axiosUrl: "",
      page: 1,
      total: 0,
      checkTime: "",
      keyword: "",
      orderMsg: "数据加载中...",
      orderList: [],
      dialogShipmentsVisible: false,
      logisticsCompanyList: [],
      logisticsData: {
        orderId: null,
        logisticsCompanyId: null,
        logOrderNo: "",
        deliveryCost: "",
      },
      logisticsRules: {
        logisticsCompanyId: [
          {
            required: true,
            message: "请选择快递公司",
            trigger: ["change"],
          },
        ],
        logOrderNo: [
          {
            required: true,
            message: "请输入快递单号",
            trigger: ["change"],
          },
        ],
        deliveryCost: [
          {
            required: true,
            message: "请输入物流运费",
            trigger: ["change"],
          },
        ],
      },
    };
  },
  created() {
    this.axiosUrl = base_request_url;
    this.getOrderList();
    this.getLogisticsCompanyList();
  },
  methods: {
    // 发货
    shipmentsClick(item) {
      console.log(item);
      this.logisticsData.orderId = item.id;

      this.logisticsData.logOrderNo = "";
      this.logisticsData.deliveryCost = "";
      this.dialogShipmentsVisible = true;
    },
    // 确定发货
    shipmentsSure(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          deliverGoodsPort(this.logisticsData)
            .then((res) => {
              console.log("发货");
              console.log(res);
              this.$message.success({
                message: "发货信息录入成功",
                showClose: true,
                duration: 2000,
              });
              this.dialogShipmentsVisible = false;
              this.getOrderList();
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 查询
    searchClick() {
      this.page = 1;
      this.getOrderList();
    },
    // 获取订单列表
    getOrderList() {
      this.orderMsg = "数据加载中...";

      orderListPort({
        page: this.page,
        pageNum: 10,
        orderStatus: 1,
        startTime: this.checkTime ? this.checkTime[0] : "",
        endTime: this.checkTime ? this.checkTime[1] : "",
        keyword: this.keyword,
      })
        .then((res) => {
          console.log("订单列表");
          console.log(res);
          this.orderList = res.data.data.list;
          this.total = res.data.data.total;
          if (this.orderList.length == 0) {
            this.orderMsg = "暂无数据~";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取快递公司列表
    getLogisticsCompanyList() {
      shipperCompanyPort()
        .then((res) => {
          console.log("快递公司");
          console.log(res);
          this.logisticsCompanyList = res.data.data;
          this.logisticsData.logisticsCompanyId = this.logisticsCompanyList[0].id;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      console.log(this.page);
      this.getOrderList();

      (function smoothscroll() {
        var currentScroll =
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
.shipments-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 6px;

  .shipments-list {
    .list-every {
      width: 100%;
      padding-bottom: 2px;
      margin-bottom: 40px;
      background-color: #fff;
      border: 1px solid #ced2d9;
      border-bottom: none;

      .every-top {
        padding: 10px 20px;
        display: flex;
        justify-content: space-between;
        align-content: center;

        .top-left {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          align-items: center;

          .div-one {
            width: 216px;
            margin-right: 40px;
            margin-bottom: 28px;

            .one-left {
              width: 85px;
              text-align: center;
              font-size: 15px;
              color: #797c80;
              text-align: left;
            }

            .one-right {
              margin-top: 10px;
              font-size: 15px;
              color: #131b26;
              text-align: left;
            }
          }
        }

        .handle-button {
          background-color: #409eff;
          color: #fff;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
#productLog {
  .el-dialog__body {
    height: 200px;
    overflow: auto;
    padding: 20px;
  }
}
</style>
