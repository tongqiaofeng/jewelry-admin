<template>
  <div class="discount-admin-container" id="discountAdmin">
    <!-- 优惠券 -->
    <div v-if="pageSel == 0">
      <div style="display: flex;justify-content: space-between;">
        <el-form inline>
          <el-form-item label="优惠券类型">
            <el-select v-model="discountType" placeholder="请选择">
              <el-option v-for="item in discountTypeList" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="checkTime" type="daterange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-input v-model="keyword" placeholder="可输入优惠券名称进行搜索"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getDiscountList">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" style="height: 40px;" @click="addDiscount">添加</el-button>
      </div>

      <el-table :data="discountList" ref="discountTable" highlight-current-row style="width: 100%" border>
        <el-table-column align="center" prop="couponName" label="优惠券名称"></el-table-column>
        <el-table-column align="center" prop="type" label="类型">
          <template slot-scope="scope">
            <div>
              {{ typeFilter(scope.row.type) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
            <div>
              {{ statusFilter(scope.row.status) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="updateDiscount(scope.row)">修改</el-button>
              <el-button type="text" @click="delDiscount(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog id="delDiscountDialog" v-if="dialogDelDiscountVisible" title="删除优惠券"
        :visible.sync="dialogDelDiscountVisible" :close-on-press-escape="false" :close-on-click-modal="false"
        :modal-append-to-body="false" :append-to-body="false">
        <div style="padding-top: 30px;text-align: center;font-size: 14px;">
          确定删除该优惠券？删除后不可恢复
        </div>
        <div slot="footer">
          <el-button @click="dialogDelDiscountVisible = false">取 消</el-button>
          <el-button type="primary" @click="delDiscountSure" v-preventClick>确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div v-if="pageSel == 1">
      <div class="goBack">
        <div class="back-main" @click="goBack">
          <img src="../../assets/imgs/back.png" />
          <span>返回</span>
        </div>
      </div>
      <div class="add-container">
        <div class="add-left">
          <el-form label-width="120px" ref="addDiscountForm" :model="addDiscountData" :rules="addDiscountRules">
            <el-form-item prop="couponName" label="优惠券名称">
              <el-input v-model="addDiscountData.couponName" placeholder="请输入优惠券名称"></el-input>
            </el-form-item>
            <el-form-item prop="type" label="优惠券类型">
              <el-radio-group v-model="addDiscountData.type" @change="discountTypeChange">
                <el-radio v-for="item in typeList" :key="item.value" :label="item.value"
                  :disabled="item.value == 4 ? true : false">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="addDiscountData.type == 2" prop="discount" label="优惠折扣">
              <el-input v-model="addDiscountData.discount" placeholder="请输入优惠折扣,如: 9、85"></el-input>
            </el-form-item>
            <el-form-item v-if="addDiscountData.type == 1 || addDiscountData.type == 2" prop="reachAmount" :label="
              addDiscountData.type == 1 ? '满减标准金额' : '折扣标准金额'
            ">
              <el-input v-model="addDiscountData.reachAmount" placeholder="请输入金额"></el-input>
            </el-form-item>
            <el-form-item prop="subtractAmount" :label="
              addDiscountData.type == 1 || addDiscountData.type == 3
                ? '减去金额'
                : '最多减去金额'
            ">
              <el-input v-model="addDiscountData.subtractAmount" placeholder="请输入金额"></el-input>
            </el-form-item>

            <el-form-item prop="countLimitType" label="发放数量类型">
              <el-radio-group v-model="addDiscountData.countLimitType" @change="radioCountChange">
                <el-radio v-for="item in countLimitTypeList" :key="item.value" :label="item.value">{{ item.label
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="count" label="发放数量">
              <el-input v-model="addDiscountData.count" placeholder="请输入发放数量"></el-input>
            </el-form-item>
            <el-form-item prop="timeLimitType" label="时间限制类型">
              <el-radio-group v-model="addDiscountData.timeLimitType" @change="radioTimeChange">
                <el-radio v-for="item in timeLimitTypeList" :key="item.value" :label="item.value">{{ item.label
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="addDiscountData.timeLimitType == 0" prop="time" label="有效日期">
              <el-date-picker v-model="addDiscountData.time" type="daterange" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item v-if="addDiscountData.timeLimitType == 1" prop="dayLimit" label="领取后有效天数">
              <el-input v-model="addDiscountData.dayLimit" placeholder="请输入领取后有效天数"></el-input>
            </el-form-item>

            <el-form-item prop="mutexActivity" label="互斥活动">
              <el-select v-model="addDiscountData.mutexActivity" multiple placeholder="可多选">
                <el-option v-for="item in activityList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="mutexCoupon" label="互斥优惠券">
              <el-select v-model="addDiscountData.mutexCoupon" multiple placeholder="可多选">
                <el-option v-for="item in discountMutualList" :key="item.id" :label="item.couponName"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="perLimit" label="每人限领张数">
              <el-input v-model="addDiscountData.perLimit" placeholder="请输入限领张数"></el-input>
            </el-form-item>
            <el-form-item prop="isRegister" label="是否为注册赠券">
              <el-switch v-model="addDiscountData.isRegister" active-value="1" inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item prop="provideType" label="发放类型">
              <el-radio-group v-model="addDiscountData.provideType">
                <el-radio v-for="item in provideTypeList" :key="item.value" :label="item.value">{{ item.label
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="status" label="优惠券状态">
              <el-radio-group v-model="addDiscountData.status">
                <el-radio v-for="item in statusList" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item prop="useType" label="是否全场通用">
              <el-switch v-model="addDiscountData.useType" @change="switchChange" active-value="0"
                inactive-value="1"></el-switch>
            </el-form-item>
            <el-form-item prop="productIdList" label="优惠商品">
              <el-table ref="singleTable" :data="addDiscountData.productIdList" highlight-current-row style="width: 100%"
                border>
                <el-table-column align="center" prop="img" label="图片">
                  <template slot-scope="scope">
                    <div>
                      <span v-if="scope.row.img == '' || scope.row.img == null">---</span>
                      <img v-else :src="axiosUrl + '/file/jewelry/' + imgFilter(scope.row.img)" width="50px"
                        height="50px" />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="名称">
                  <template slot-scope="scope">
                    <div>
                      <span>{{ scope.row.productName }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="productNumber" label="统一编号">
                </el-table-column>
                <el-table-column align="center" label="移除商品">
                  <template slot-scope="scope">
                    <div>
                      <el-button type="text" @click="delNum(scope.$index)">移除</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>

            <el-form-item prop="remarks" label="描述">
              <el-input type="textarea" :rows="4" v-model="addDiscountData.remarks" placeholder="请输入"></el-input>
            </el-form-item>
          </el-form>

          <div style="margin-top: 30px;text-align: right;">
            <el-button style="width: 120px;" type="primary" @click="addDiscountSubmit('addDiscountForm')" v-preventClick>提
              交</el-button>
          </div>
        </div>
        <div class="add-right">
          <div>
            <p class="title-font">成品库存查询</p>
            <div>
              <el-form label-width="110px">
                <!-- 用户管理仓库 -->
                <el-form-item label="仓库/加工厂：" required>
                  <el-select style="width:66%;" v-model="storageIdList" multiple clearable placeholder="可多选"
                    :popper-append-to-body="false">
                    <el-option v-for="item in warehouseFilterList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="关键字：">
                  <el-input style="width: 66%;" v-model="proudctkeyword" @change="keywordChange"
                    placeholder="可输入产品名称、设计图名称、统一编号、备注进行搜索" clearable>
                  </el-input>
                  <el-button style="margin-left: 10px;" type="primary" @click="warehouseCheck">查 询</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <el-table ref="singleTable" :data="deviceFilterList" :row-key="getRowKeys" highlight-current-row
            style="width: 100%" border @row-dblclick="handleSelectionChange">
            <el-table-column align="center" prop="designName" label="图片">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.img == '' || scope.row.img == null">---</span>
                  <img v-else :src="axiosUrl + '/file/jewelry/' + imgFilter(scope.row.img)" width="50px" height="50px" />
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="名称">
              <template slot-scope="scope">
                <div>
                  <span>{{ scope.row.productName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="productNumber" label="统一编号">
            </el-table-column>
            <el-table-column align="center" prop="designName" label="库存地">
              <template slot-scope="scope">
                <div>
                  <span>{{ scope.row.storageName }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <div style="width: 100%;height: 50px;padding-bottom: 20px;">
            <div style="margin:40px 0 0;position:absolute;right:30px;">
              <el-pagination @current-change="handleCurrentChange" :current-page="page"
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
import { base_img_url } from "_req/http";
import { warehouseFactoryPort, productListPort } from "_req/api/common";
import {
  activityListPort,
  couponDelPort,
  couponSavePort,
  couponListPort,
} from "_req/api/program";

export default {
  data() {
    return {
      pageSel: 0,
      activityList: [],
      checkTime: "",
      keyword: "",
      discountList: [],
      discountMutualList: [],

      axiosUrl: "",
      warehouseFilterList: [],
      storageIdList: [],

      deviceFilterList: [],
      proudctkeyword: "",
      page: 1,
      pageNum: 10,
      total: 0,

      countLimitTypeList: [
        {
          label: "无限制发放",
          value: 0,
        },
        {
          label: "有数量限制发放",
          value: 1,
        },
      ],
      timeLimitTypeList: [
        {
          label: "固定可用时间",
          value: 0,
        },
        {
          label: "相对可用时间",
          value: 1,
        },
      ],
      typeList: [
        {
          label: "满减券",
          value: 1,
        },
        {
          label: "折扣券",
          value: 2,
        },
        {
          label: "立减券",
          value: 3,
        },
        {
          label: "满赠券(暂不支持)",
          value: 4,
        },
      ],
      provideTypeList: [
        {
          label: "自动发放",
          value: 0,
        },
        {
          label: "手动领取",
          value: 1,
        },
      ],
      statusList: [
        {
          label: "激活(正常使用)",
          value: 0,
        },
        {
          label: "过期",
          value: 1,
        },
        {
          label: "冻结",
          value: 2,
        },
      ],

      addDiscountData: {
        id: null,
        couponName: "",
        type: 1,
        countLimitType: 0,
        count: "",
        timeLimitType: 0,
        dayLimit: "",
        isRegister: 0,
        mutexActivity: [],
        mutexCoupon: [],
        perLimit: "",
        provideType: 0,
        discount: "",
        reachAmount: "",
        subtractAmount: "",
        useType: "1",
        time: "",
        startTime: "",
        endTime: "",
        productIdList: [],
        status: 0,
        remarks: "",
      },
      addDiscountRules: {
        couponName: [
          {
            required: true,
            message: "请输入优惠券名称",
            trigger: ["blur"],
          },
        ],
        discount: [
          {
            required: false,
            message: "请输入优惠折扣",
            trigger: ["blur"],
          },
        ],
        reachAmount: [
          {
            required: false,
            message: "请输入金额",
            trigger: ["blur"],
          },
        ],
        subtractAmount: [
          {
            required: true,
            message: "请输入金额",
            trigger: ["blur"],
          },
        ],
        count: [
          {
            required: false,
            message: "请输入发放数量",
            trigger: ["blur"],
          },
        ],
        time: [
          {
            required: false,
            message: "请选择有效日期",
            trigger: ["blur"],
          },
        ],
        dayLimit: [
          {
            required: false,
            message: "请输入有效天数",
            trigger: ["blur"],
          },
        ],
        perLimit: [
          {
            required: true,
            message: "请输入限领张数",
            trigger: ["blur"],
          },
        ],
        productIdList: [
          {
            required: true,
            message: "请选择优惠商品",
          },
        ],
      },
      dialogDelDiscountVisible: false,
      delId: null,

      discountType: -1,
      discountTypeList: [
        {
          label: "全部",
          value: -1,
        },
        {
          label: "满减券",
          value: 1,
        },
        {
          label: "折扣券",
          value: 2,
        },
        {
          label: "立减券",
          value: 3,
        },
        {
          label: "满赠券",
          value: 4,
        },
      ],
    };
  },
  created() {
    this.axiosUrl = base_img_url;
    this.getDiscountList();
    this.getActivityList();
    this.getWarehouseFactoryList();
  },
  methods: {
    // 优惠券类型
    discountTypeChange() {
      if (this.addDiscountData.type == 1) {
        this.addDiscountRules.discount[0].required = false;
        this.addDiscountRules.reachAmount[0].required = true;
      } else if (this.addDiscountData.type == 2) {
        this.addDiscountRules.discount[0].required = true;
        this.addDiscountRules.reachAmount[0].required = true;
      } else if (this.addDiscountData.type == 3) {
        this.addDiscountRules.discount[0].required = false;
        this.addDiscountRules.reachAmount[0].required = false;
      }
    },
    // 时间限制类型
    radioTimeChange() {
      if (this.addDiscountData.timeLimitType == 0) {
        this.addDiscountRules.time[0].required = true;
        this.addDiscountRules.dayLimit[0].required = false;
      } else if (this.addDiscountData.timeLimitType == 1) {
        this.addDiscountRules.time[0].required = false;
        this.addDiscountRules.dayLimit[0].required = true;
      }
    },
    // 发放数量类型
    radioCountChange() {
      if (this.addDiscountData.countLimitType == 0) {
        this.addDiscountRules.count[0].required = false;
      } else if (this.addDiscountData.countLimitType == 1) {
        this.addDiscountRules.count[0].required = true;
      }
    },
    // 是否商品全部参与
    switchChange() {
      console.log(this.addDiscountData.useType);

      if (this.addDiscountData.useType == 0) {
        this.addDiscountRules.productIdList[0].required = false;
      } else {
        this.addDiscountRules.productIdList[0].required = true;
      }
    },

    // 修改
    updateDiscount(item) {
      console.log(item);
      this.discountMutualList = JSON.parse(JSON.stringify(this.discountList));
      for (const i in this.discountList) {
        if (this.discountList[i].id == item.id) {
          this.discountMutualList.splice(i, 1);
        }
      }

      this.addDiscountData.id = item.id;
      this.addDiscountData.type = item.type;
      this.addDiscountData.couponName = item.couponName;
      this.addDiscountData.remarks = item.remarks;

      this.addDiscountData.isRegister = item.isRegister + "";
      this.addDiscountData.discount = item.discount;

      this.addDiscountData.countLimitType = item.countLimitType;
      this.addDiscountData.count = item.count;
      this.addDiscountData.timeLimitType = item.timeLimitType;
      this.addDiscountData.dayLimit = item.dayLimit;

      this.addDiscountData.perLimit = item.perLimit;
      this.addDiscountData.provideType = item.provideType;
      this.addDiscountData.reachAmount = item.reachAmount;
      this.addDiscountData.subtractAmount = item.subtractAmount;

      this.addDiscountData.status = item.status;

      this.addDiscountData.mutexActivity = [];
      if (item.mutexActivity != "" && item.mutexActivity != null) {
        if (item.mutexActivity.indexOf("-") != -1) {
          this.addDiscountData.mutexActivity = item.mutexActivity.split("-");
        } else {
          this.addDiscountData.mutexActivity.push(item.mutexActivity);
        }
      }
      this.addDiscountData.mutexActivity = this.addDiscountData.mutexActivity.map(
        Number
      );

      this.addDiscountData.mutexCoupon = [];
      if (item.mutexCoupon != "" && item.mutexCoupon != null) {
        if (item.mutexCoupon.indexOf("-") != -1) {
          this.addDiscountData.mutexCoupon = item.mutexCoupon.split("-");
        } else {
          this.addDiscountData.mutexCoupon.push(item.mutexCoupon);
        }
      }
      this.addDiscountData.mutexCoupon = this.addDiscountData.mutexCoupon.map(
        Number
      );

      if (item.startTime && item.endTime) {
        this.addDiscountData.time = [item.startTime, item.endTime];
      }

      this.addDiscountData.useType = item.useType + "";
      this.addDiscountData.productIdList = item.productList;

      this.discountTypeChange();
      this.switchChange();
      this.radioTimeChange();
      this.radioCountChange();

      this.pageSel = 1;
    },
    // 删除
    delDiscount(item) {
      console.log(item);
      this.delId = item.id;

      this.dialogDelDiscountVisible = true;
    },
    // 确定删除
    delDiscountSure() {
      couponDelPort({
        id: this.delId,
      })
        .then((res) => {
          console.log("删除优惠券");
          console.log(res);
          this.$message.success({
            message: "删除成功",
            showClose: true,
            duration: 1500,
          });

          this.getDiscountList();
          this.dialogDelDiscountVisible = false;
        })
        .catch((err) => {
          console.log(err);
          this.dialogDelDiscountVisible = false;
        });
    },
    // 添加优惠券
    addDiscount() {
      this.addDiscountData.id = null;
      this.addDiscountData.couponName = "";
      this.addDiscountData.time = "";
      this.addDiscountData.startTime = "";
      this.addDiscountData.endTime = "";
      this.addDiscountData.productIdList = [];
      this.addDiscountData.remarks = "";

      this.addDiscountData.isRegister = 0;
      this.addDiscountData.discount = "";

      this.addDiscountData.type = 1;
      this.addDiscountData.countLimitType = 0;
      this.addDiscountData.count = "";
      this.addDiscountData.timeLimitType = 0;
      this.addDiscountData.dayLimit = "";

      this.addDiscountData.perLimit = "";
      this.addDiscountData.provideType = 0;
      this.addDiscountData.reachAmount = "";
      this.addDiscountData.subtractAmount = "";
      this.addDiscountData.useType = "1";
      this.addDiscountData.status = 0;
      this.addDiscountData.mutexActivity = [];
      this.addDiscountData.mutexCoupon = [];

      this.discountTypeChange();
      this.switchChange();
      this.radioTimeChange();
      this.radioCountChange();

      this.pageSel = 1;
    },
    // 确定添加
    addDiscountSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("success");
          if (this.addDiscountData.time) {
            this.addDiscountData.startTime = this.addDiscountData.time[0];
            this.addDiscountData.endTime = this.addDiscountData.time[1];
          }

          if (Array.isArray(this.addDiscountData.mutexActivity)) {
            if (this.addDiscountData.mutexActivity.length > 0) {
              this.addDiscountData.mutexActivity = this.addDiscountData.mutexActivity.join(
                "-"
              );
            } else {
              this.addDiscountData.mutexActivity = "";
            }
          }

          if (Array.isArray(this.addDiscountData.mutexCoupon)) {
            if (this.addDiscountData.mutexCoupon.length > 0) {
              let str = this.addDiscountData.mutexCoupon.join("-");

              this.addDiscountData.mutexCoupon = str;
            } else {
              this.addDiscountData.mutexCoupon = "";
            }
          }

          if (this.addDiscountData.productIdList.length > 0) {
            this.addDiscountData.productIdList = this.addDiscountData.productIdList.map(
              (item) => {
                return item.id;
              }
            );
          }

          console.log(this.addDiscountData);

          couponSavePort(this.addDiscountData)
            .then((res) => {
              console.log("优惠券提交");
              console.log(res);
              this.$message.success({
                message: "提交成功",
                showClose: true,
                duration: 1500,
              });

              this.pageSel = 0;
              this.getDiscountList();
              document.getElementById("discountAdmin").scrollIntoView();
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

    // 优惠券类型匹配
    typeFilter(val) {
      for (const item of this.typeList) {
        if (val == item.value) {
          return item.label;
        }
      }

      return "";
    },

    // 优惠券状态匹配
    statusFilter(val) {
      for (const item of this.statusList) {
        if (val == item.value) {
          return item.label;
        }
      }

      return "";
    },

    goBack() {
      this.pageSel = 0;
    },
    getRowKeys(row) {
      return row.id;
    },
    // 选择参与优惠券商品
    handleSelectionChange(row) {
      if (this.addDiscountData.productIdList.length == 0) {
        this.addDiscountData.productIdList.push({
          id: row.id,
          img: row.img,
          productName: row.productName,
          productNumber: row.productNumber,
        });
      } else {
        if (this.filterSel(row)) {
          this.$message.error({
            message: "请勿重复添加",
            showClose: true,
            duration: 2000,
          });
        } else {
          this.addDiscountData.productIdList.push({
            id: row.id,
            img: row.img,
            productName: row.productName,
            productNumber: row.productNumber,
          });
        }
      }

      console.log(this.addDiscountData.productIdList);
    },
    // 删
    delNum(index) {
      this.addDiscountData.productIdList.splice(index, 1); //页面--成品待出库清单
    },
    // 判断是否重复添加
    filterSel(val) {
      for (const item of this.addDiscountData.productIdList) {
        if (item.id == val.id) {
          return true;
        }
      }
      return false;
    },

    // 模糊搜索
    keywordChange() {
      this.page = 1;
    },
    warehouseCheck() {
      productListPort({
        state: 0,
        storageIdList: this.storageIdList,
        keyword: this.proudctkeyword,
        isBack: 1,
        page: this.page,
        pageNum: 10,
      }).then((res) => {
        console.log("条件查找成品库存列表");
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

      document.getElementById("discountAdmin").scrollIntoView();
    },

    // 获取活动列表
    getActivityList() {
      activityListPort({
        startTime: "",
        endTime: "",
        keyword: "",
      })
        .then((res) => {
          console.log("活动列表");
          console.log(res);
          this.activityList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取优惠券列表
    getDiscountList() {
      couponListPort({
        keyword: this.keyword,
        startTime: this.checkTime ? this.checkTime[0] : "",
        endTime: this.checkTime ? this.checkTime[1] : "",
        type: this.discountType,
      })
        .then((res) => {
          console.log("优惠券列表");
          console.log(res);
          this.discountList = res.data.data;
          this.discountMutualList = this.discountList;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 获取仓库/加工厂列表
    getWarehouseFactoryList() {
      warehouseFactoryPort()
        .then((res) => {
          console.log("仓库/加工厂");
          console.log(res);

          this.warehouseFilterList = res.data.data;
          this.warehouseCheck();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.discount-admin-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 6px;
}

.goBack {
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 6px;

  .back-main {
    width: fit-content;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    img {
      width: 26px;
      height: 25px;
      margin-right: 5px;
    }

    span {
      color: #6a6a6a;
      font-size: 16px;
    }
  }
}

.add-container {
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

    .title-font {
      height: 48px;
      margin: 0;
      text-align: left;
      color: #6a6a6a;
      font-size: 18px;
      font-weight: bold;
    }
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
  }
}
</style>
<style lang="scss">
#delDiscountDialog {
  .el-dialog__body {
    height: 85px;
    overflow: hidden;
  }
}
</style>
