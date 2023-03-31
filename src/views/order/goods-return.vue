<template>
  <div class="refund-container">
    <!-- 退货确认 -->
    <div v-if="unAuditReturnList.length == 0" class="no-data" style="margin: 0;">
      {{ returnMsg }}
    </div>
    <div v-else class="refund-list">
      <div v-for="(item, index) in unAuditReturnList" :key="index" class="list-every">
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
                商品价格：
              </div>
              <div class="one-right">
                {{ "CNY " + formatNumberRgx(item.productAmountTotal) }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">
                付款金额：
              </div>
              <div class="one-right">
                {{ "CNY " + formatNumberRgx(item.actualAmountTotal) }}
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
        </div>
        <el-table stripe :data="item.detailList" style="width: 100%">
          <el-table-column align="center" prop="returnMsg.createTime" label="退款申请时间">
          </el-table-column>
          <el-table-column align="center" prop="pic" label="图片">
            <template slot-scope="scope">
              <div>
                <img :src="axiosUrl + '/file/jewelry/' + imgFilter(scope.row.img)" style="width: 100px; height: 100px" />
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="productName" label="商品信息">
          </el-table-column>
          <el-table-column align="center" prop="returnMsg.phone" label="联系电话">
          </el-table-column>
          <el-table-column align="center" prop="returnMsg.productStatus" label="收货状态">
            <template slot-scope="scope">
              <div>
                {{
                  scope.row.returnMsg.productStatus == 0
                  ? "买家已收到货"
                  : "买家未收到货"
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="returnMsg.productStatus" label="申请类型">
            <template slot-scope="scope">
              <div>
                {{ scope.row.returnMsg.type == 0 ? "仅退款" : "退货退款" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="returnMsg.refundAmount" label="申请退款金额">
            <template slot-scope="scope">
              <div>
                {{ "CNY " + formatNumberRgx(scope.row.returnMsg.refundAmount) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="returnMsg.reason" label="退货退款原因">
          </el-table-column>
          <el-table-column align="center" prop="returnMsg.note" label="详细说明">
          </el-table-column>
          <el-table-column align="center" prop="returnMsg.status" label="审核状态">
            <template slot-scope="scope">
              <div>
                {{
                  editState(
                    scope.row.returnMsg.status,
                    scope.row.returnMsg.payStatus
                  )
                }}
              </div>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <div>
                <el-button v-show="scope.row.returnMsg.status == 0" type="text" class="handle-button"
                  @click="auditMoney(scope.row.returnMsg)">审核</el-button>
                <el-button v-show="scope.row.returnMsg.payStatus == 0" type="text" class="handle-button"
                  @click="returnMoney(scope.row.returnMsg)">退款</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top:15px;text-align: right;">
        <el-pagination @current-change="handleCurrentChange" :current-page="page"
          layout="total, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <el-dialog title="退款审核" :visible.sync="dialogRefundVisible" width="500px" id="productLog">
        <el-form label-width="125px">
          <el-form-item label="是否通过退款申请">
            <el-switch v-model="status" active-value="1" inactive-value="-1"></el-switch>
          </el-form-item>
          <el-form-item label="是否同时发起退款">
            <el-switch v-model="isRefund" active-value="1" inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" :rows="4" v-model="auditReason" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="dialogRefundVisible = false">取 消</el-button>
          <el-button type="primary" @click="auditMoneySure">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="确定退款" :visible.sync="dialogReturnVisible" width="500px" id="returnMoney">
        <div>
          <div style="font-size: 16px;">
            确定退款给顾客？
          </div>
          <div style="margin-top: 10px; font-size: 12px;">
            顾客若已收到货，请确认收到退货商品，再给予用户退款
          </div>
        </div>
        <div slot="footer">
          <el-button @click="dialogReturnVisible = false">取 消</el-button>
          <el-button type="primary" @click="returnMoneySure">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { base_img_url } from "_req/http";
import { refundPort, auditReturnPort, unAuditReturnPort } from "_req/api/order";

export default {
  data() {
    return {
      axiosUrl: "",
      page: 1,
      total: 0,
      returnMsg: "数据加载中...",
      unAuditReturnList: [],

      returnId: null,
      auditReason: "",
      status: -1,
      dialogRefundVisible: false,
      isRefund: 0,
      dialogReturnVisible: false,
    };
  },
  created() {
    this.axiosUrl = base_img_url;
    this.getUnAuditReturnList();
  },
  methods: {
    // 退款
    returnMoney(item) {
      console.log(item);
      this.returnId = item.id;

      this.dialogReturnVisible = true;
    },
    // 确定退款
    returnMoneySure() {
      refundPort({
        id: this.returnId,
      })
        .then((res) => {
          console.log("确定退款");
          console.log(res);
          this.dialogReturnVisible = false;
          this.$message.success({
            message: "请求成功，等待微信官方退款给顾客",
            showClose: true,
            duration: 2000,
          });
          this.getUnAuditReturnList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 退款审核
    auditMoney(item) {
      console.log(item);
      this.returnId = item.id;
      this.auditReason = "";
      this.status = -1;
      this.isRefund = 0;
      this.dialogRefundVisible = true;
    },
    // 确定审核
    auditMoneySure() {
      auditReturnPort({
        id: this.returnId,
        auditReason: this.auditReason,
        status: this.status,
        isRefund: this.isRefund,
      })
        .then((res) => {
          console.log("审核退款");
          console.log(res);
          this.dialogRefundVisible = false;
          this.$message.success({
            message: "审核成功",
            showClose: true,
            duration: 2000,
          });
          this.getUnAuditReturnList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取退款申请列表
    getUnAuditReturnList() {
      this.returnMsg = "数据加载中...";

      unAuditReturnPort({
        page: this.page,
        pageNum: 10,
        keyword: "",
        startTime: "",
        endTime: "",
      })
        .then((res) => {
          console.log("退款申请");
          console.log(res);
          this.unAuditReturnList = res.data.data.list;
          this.total = res.data.data.total;
          if (this.unAuditReturnList.length == 0) {
            this.returnMsg = "暂无数据~";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 审核状态
    editState(status, payStatus) {
      let font = "";
      switch (status) {
        case -2:
          font = "取消申请";
          break;
        case -1:
          font = "已拒绝";
          break;
        case 0:
          font = "待审核";
          break;
        case 1:
          font = "审核通过";
          break;
      }

      switch (payStatus) {
        case -1:
          font = "拒绝退款";
          break;
        case 0:
          font = "待退款";
          break;
        case 1:
          font = "微信退款中";
          break;
        case 2:
          font = "退款成功";
          break;
      }

      return font;
    },

    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      console.log(this.page);
      this.getUnAuditReturnList();

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
.refund-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 6px;

  .refund-list {
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
    height: 250px;
    overflow: auto;
    padding: 20px 20px 0;
  }
}

#returnMoney {
  .el-dialog__body {
    height: 60px;
    overflow: auto;
    padding: 20px;
  }
}
</style>
