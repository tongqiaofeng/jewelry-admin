<template>
  <div class="activity-admin-container" id="activityAdmin">
    <!-- 近期活动 -->
    <div v-if="pageSel == 0">
      <div style="display: flex;justify-content: space-between;">
        <el-form inline>
          <el-form-item>
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
              v-model="keyword"
              placeholder="可输入活动名称进行搜索"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getActivityList">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" style="height: 40px;" @click="addActivity"
          >添加</el-button
        >
      </div>

      <el-table
        :data="activityList"
        ref="activityTable"
        highlight-current-row
        style="width: 100%"
        border
      >
        <el-table-column
          align="center"
          prop="name"
          label="活动名称"
        ></el-table-column>
        <el-table-column align="center" label="活动时间">
          <template slot-scope="scope">
            <div>
              {{ scope.row.startTime + " 至 " + scope.row.endTime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="img" label="图片">
          <template slot-scope="scope">
            <div>
              <img
                :src="axiosUrl + '/file/' + scope.row.img"
                style="width: 100px;height: 100px;object-fit: cover;"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="updateActivity(scope.row)"
                >修改</el-button
              >
              <el-button type="text" @click="delActivity(scope.row)"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        id="delActivityDialog"
        v-if="dialogDelActivityVisible"
        title="删除活动"
        :visible.sync="dialogDelActivityVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :append-to-body="false"
      >
        <div style="padding-top: 30px;text-align: center;font-size: 14px;">
          确定删除该活动？删除后不可恢复
        </div>
        <div slot="footer">
          <el-button @click="dialogDelActivityVisible = false">取 消</el-button>
          <el-button type="primary" @click="delActivitySure" v-preventClick
            >确 定</el-button
          >
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
          <el-form
            label-width="110px"
            ref="addActivityForm"
            :model="addActivityData"
            :rules="addActivityRules"
          >
            <el-form-item prop="name" label="活动名称">
              <el-input
                v-model="addActivityData.name"
                placeholder="请输入活动名称"
              ></el-input>
            </el-form-item>
            <el-form-item prop="isDiscount" label="是否为折扣活动">
              <el-switch
                v-model="addActivityData.isDiscount"
                active-value="1"
                inactive-value="0"
                @change="switchDiscountChange"
              ></el-switch>
            </el-form-item>
            <el-form-item prop="discount" label="折扣">
              <el-input
                v-model="addActivityData.discount"
                placeholder="请输入活动折扣,如: 9、85"
              ></el-input>
            </el-form-item>
            <el-form-item prop="time" label="活动时间">
              <el-date-picker
                v-model="addActivityData.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="validType" label="全部商品参与">
              <el-switch
                v-model="addActivityData.validType"
                active-value="1"
                inactive-value="0"
              ></el-switch>
            </el-form-item>
            <el-form-item prop="productIdList" label="活动商品">
              <el-table
                ref="singleTable"
                :data="addActivityData.productIdList"
                highlight-current-row
                style="width: 100%"
                border
              >
                <el-table-column align="center" prop="img" label="成品图片">
                  <template slot-scope="scope">
                    <div>
                      <span v-if="scope.row.img == '' || scope.row.img == null"
                        >---</span
                      >
                      <img
                        v-else
                        :src="axiosUrl + '/file/' + imgFilter(scope.row.img)"
                        width="50px"
                        height="50px"
                      />
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
                <el-table-column
                  align="center"
                  prop="productNumber"
                  label="统一编号"
                >
                </el-table-column>
                <el-table-column align="center" label="移除商品">
                  <template slot-scope="scope">
                    <div>
                      <el-button type="text" @click="delNum(scope.$index)"
                        >移除</el-button
                      >
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item prop="img" label="活动图片">
              <div>
                <UploadImg
                  :imgUrl="addActivityData.img"
                  @imgChange="imgUrlChange"
                ></UploadImg>
              </div>
            </el-form-item>
            <el-form-item prop="note" label="备注">
              <el-input
                type="textarea"
                :rows="4"
                v-model="addActivityData.note"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-form>

          <div style="margin-top: 30px;text-align: right;">
            <el-button
              style="width: 120px;"
              type="primary"
              @click="addActivitySubmit('addActivityForm')"
              v-preventClick
              >提 交</el-button
            >
          </div>
        </div>
        <div class="add-right">
          <div>
            <p class="title-font">成品库存查询</p>
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
                    v-model="proudctkeyword"
                    @change="keywordChange"
                    placeholder="可输入产品名称、设计图名称、统一编号、备注进行搜索"
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
            :row-key="getRowKeys"
            highlight-current-row
            style="width: 100%"
            border
            @row-dblclick="handleSelectionChange"
          >
            <el-table-column align="center" prop="designName" label="成品图片">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.img == '' || scope.row.img == null"
                    >---</span
                  >
                  <img
                    v-else
                    :src="axiosUrl + '/file/' + imgFilter(scope.row.img)"
                    width="50px"
                    height="50px"
                  />
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
            <el-table-column
              align="center"
              prop="productNumber"
              label="统一编号"
            >
            </el-table-column>
            <el-table-column align="center" prop="designName" label="现存仓库">
              <template slot-scope="scope">
                <div>
                  <span>{{ scope.row.storageName }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>

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
    </div>
  </div>
</template>

<script>
import { base_request_url } from "_req/http";
import { warehouseFactoryPort, productListPort } from "_req/api/common";
import {
  activityDelPort,
  activitySavePort,
  activityListPort,
} from "_req/api/program";

import UploadImg from "@/components/upload-one-img.vue";
export default {
  components: { UploadImg },
  data() {
    return {
      pageSel: 0,
      activityList: [],
      checkTime: "",
      keyword: "",

      axiosUrl: "",
      warehouseFilterList: [],
      storageIdList: [],

      deviceFilterList: [],
      proudctkeyword: "",
      page: 1,
      pageNum: 10,
      total: 0,

      addActivityData: {
        id: null,
        name: "",
        isDiscount: 0,
        discount: "",
        validType: "0",
        time: "",
        startTime: "",
        endTime: "",
        productIdList: [],
        img: "",
        note: "",
      },
      addActivityRules: {
        name: [
          {
            required: true,
            message: "请输入活动名称",
            trigger: ["blur"],
          },
        ],
        discount: [
          {
            required: false,
            message: "请输入活动折扣",
            trigger: ["blur"],
          },
        ],
        time: [
          {
            required: true,
            message: "请选择活动时间",
          },
        ],
        img: [
          {
            required: true,
            message: "请上传活动图片",
          },
        ],
      },
      dialogDelActivityVisible: false,
      delId: null,
    };
  },
  created() {
    this.axiosUrl = base_request_url;
    this.getActivityList();
    this.getWarehouseFactoryList();
  },
  methods: {
    // 是否为折扣活动
    switchDiscountChange() {
      console.log(this.addActivityData.isDiscount);
      if (this.addActivityData.isDiscount == 0) {
        this.addActivityRules.discount[0].required = false;
      } else if (this.addActivityData.isDiscount == 1) {
        this.addActivityRules.discount[0].required = true;
      }
    },

    // 修改
    updateActivity(item) {
      console.log(item);
      this.addActivityData.id = item.id;
      this.addActivityData.name = item.name;
      this.addActivityData.isDiscount = item.isDiscount + "";
      this.addActivityData.discount = item.discount;
      this.addActivityData.productIdList = item.productList;
      this.addActivityData.img = item.img;
      this.addActivityData.note = item.note;

      if (item.startTime && item.endTime) {
        this.addActivityData.time = [item.startTime, item.endTime];
      }

      this.addActivityData.validType = item.validType + "";

      this.pageSel = 1;
    },
    // 删除
    delActivity(item) {
      console.log(item);
      this.delId = item.id;

      this.dialogDelActivityVisible = true;
    },
    // 确定删除
    delActivitySure() {
      activityDelPort({
        id: this.delId,
      })
        .then((res) => {
          console.log("删除活动");
          console.log(res);
          this.$message.success({
            message: "删除成功",
            showClose: true,
            duration: 1500,
          });

          this.getActivityList();
          this.dialogDelActivityVisible = false;
        })
        .catch((err) => {
          console.log(err);
          this.dialogDelActivityVisible = false;
        });
    },
    // 添加活动
    addActivity() {
      this.addActivityData.id = null;
      this.addActivityData.name = "";
      this.addActivityData.time = "";
      this.addActivityData.startTime = "";
      this.addActivityData.endTime = "";
      this.addActivityData.productIdList = [];
      this.addActivityData.img = "";
      this.addActivityData.note = "";

      this.pageSel = 1;
    },
    // 确定添加
    addActivitySubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("success");
          if (this.addActivityData.time) {
            this.addActivityData.startTime = this.addActivityData.time[0];
            this.addActivityData.endTime = this.addActivityData.time[1];
          }

          this.addActivityData.productIdList = this.addActivityData.productIdList.map(
            (item) => {
              return item.id;
            }
          );
          console.log(this.addActivityData);

          activitySavePort(this.addActivityData)
            .then((res) => {
              console.log("活动提交");
              console.log(res);
              this.$message.success({
                message: "提交成功",
                showClose: true,
                duration: 1500,
              });

              // this.$refs.addActivityForm.clearValidate();
              // this.addActivityData.startTime = "";
              // this.addActivityData.endTime = "";

              // this.warehouseCheck();
              this.pageSel = 0;
              this.getActivityList();
              document.getElementById("activityAdmin").scrollIntoView();
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
    goBack() {
      this.pageSel = 0;
    },
    getRowKeys(row) {
      return row.id;
    },
    // 选择参与活动商品
    handleSelectionChange(row) {
      if (this.addActivityData.productIdList.length == 0) {
        this.addActivityData.productIdList.push({
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
          this.addActivityData.productIdList.push({
            id: row.id,
            img: row.img,
            productName: row.productName,
            productNumber: row.productNumber,
          });
        }
      }

      console.log(this.addActivityData.productIdList);
    },
    // 删
    delNum(index) {
      this.addActivityData.productIdList.splice(index, 1); //页面--成品待出库清单
    },
    // 判断是否重复添加
    filterSel(val) {
      for (const item of this.addActivityData.productIdList) {
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
      document.getElementById("activityAdmin").scrollIntoView();
    },

    // 获取活动列表
    getActivityList() {
      activityListPort({
        startTime: this.checkTime ? this.checkTime[0] : "",
        endTime: this.checkTime ? this.checkTime[1] : "",
        keyword: this.keyword,
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
    imgFilter(img) {
      let url =
        img == "" || img == null
          ? ""
          : img.indexOf("|") == -1
          ? img
          : img.split("|")[0];
      return url;
    },

    // 图片
    imgUrlChange(val) {
      console.log(val);
      this.addActivityData.img = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.activity-admin-container {
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
#delActivityDialog {
  .el-dialog__body {
    height: 85px;
    overflow: hidden;
  }
}
</style>
