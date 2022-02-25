<template>
  <div class="stock-inquiry-container" id="stock-inquiry">
    <!-- 库存查询 -->
    <div class="stock-inquiry-pc">
      <div v-show="siteSel == 0">
        <!-- 头部查询条件 -->
        <div class="stock-inquiry-top" id="stockWarehouseCheck">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="状态：">
              <el-select
                v-model="state"
                placeholder="请选择"
                style="width: 150px;"
                :popper-append-to-body="false"
              >
                <el-option
                  v-for="flag in stateList"
                  :key="flag.id"
                  :label="flag.name"
                  :value="flag.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="仓库/加工厂：">
              <el-select
                v-model="storageIdList"
                multiple
                placeholder="可多选"
                style="width: 150px;"
                @change="storageChange"
                :popper-append-to-body="false"
              >
                <!-- //存在出库记录 -->
                <el-option
                  v-for="item in storageList"
                  v-show="item.isOwn != 0"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="入库时间：">
              <el-date-picker
                v-model="time"
                type="daterange"
                @change="timechange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <div style="display: flex;">
                <el-input
                  style="width: 350px;"
                  v-model="keyword"
                  placeholder="可输入产品名称、设计名称、统一编号、备注进行搜索"
                  clearable
                >
                </el-input>
                <el-button
                  style="margin-left: 10px;"
                  type="primary"
                  @click="warehouseKeywordCheck"
                  >查 询</el-button
                >
              </div>
            </el-form-item>
          </el-form>
          <div class="top-right">
            <el-tooltip
              class="item"
              style="margin-left: 20px;height: 40px;"
              effect="dark"
              content="图表切换"
              placement="bottom-end"
            >
              <img
                :src="stockInquiryParam.sel == 1 ? img1 : img2"
                @click="listOrChart"
                style="cursor:pointer;"
              />
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
              <div
                v-for="(warehouse, index) in stockInList"
                :key="index"
                style="display: flex;margin-top: 20px;"
              >
                <div
                  class="border-style"
                  @click="imgInquiryDetails(warehouse.productList, index)"
                >
                  {{ warehouse.storageName }}
                </div>
                <div
                  class="every-style"
                  v-if="index < stockInList.length - 1"
                ></div>
              </div>
            </div>
          </div>
          <!-- 表格 -->
          <div v-if="stockInquiryParam.sel == 0" style="padding: 20px;">
            <div style="text-align: center;" v-if="stockInList.length == 0">
              <p>{{ stockInMsg }}</p>
            </div>
            <div v-else>
              <div v-for="(every, index) in stockListPage" :key="index">
                <div style="display: flex;text-align: left;">
                  <p style="font-size: 18px;font-weight: bold;">
                    仓库/加工厂： {{ every.storageName }}
                  </p>
                  <p style="margin: 24px 0 0 20px;font-size: 13px;color: #bbb;">
                    数量：
                    {{ every.productList.length }}
                  </p>
                </div>
                <el-table
                  style="width: 100%;"
                  ref="multipleTable"
                  :data="every.productList"
                  :row-key="getRowKeys"
                  tooltip-effect="dark"
                  border
                  highlight-current-row
                  @row-click="checkproductDetails"
                  @row-dblclick="dblProductDetails"
                >
                  <el-table-column label="出库">
                    <template>
                      <div>
                        <span style="cursor: pointer;color: #3d81fd;"
                          >出库</span
                        >
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="materialName" label="成品图">
                    <template slot-scope="scope">
                      <div>
                        <img
                          :src="img + '/file/' + firstimg(scope.row.img)"
                          alt=""
                          style="width: 100%;"
                        />
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="productNumber" label="统一编号">
                  </el-table-column>
                  <el-table-column label="裸石成本" prop="costPrice">
                    <template slot-scope="scope">
                      <div>
                        <span>{{
                          scope.row.costPrice + " " + scope.row.currency
                        }}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="processCost" label="加工费">
                    <template slot-scope="scope">
                      <div>
                        <span>{{ scope.row.processCost + " CNY" }}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="最低销售价" prop="lowestSellPrice">
                    <template slot-scope="scope">
                      <div>
                        <span>{{ scope.row.lowestSellPrice + " CNY" }}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="建议销售价" prop="adviseSellPrice">
                    <template slot-scope="scope">
                      <div>
                        <span>{{ scope.row.adviseSellPrice + " CNY" }}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="建议批发价"
                    prop="adviceWholesalePrice"
                  >
                    <template slot-scope="scope">
                      <div>
                        <span>{{
                          scope.row.adviceWholesalePrice + " CNY"
                        }}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="标签价" prop="tagPrice">
                    <template slot-scope="scope">
                      <div>
                        <span>{{ scope.row.tagPrice + " CNY" }}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="saleCommission" label="销售提成">
                    <template slot-scope="scope">
                      <div>
                        <span>{{ scope.row.saleCommission + " CNY" }}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="出库记录" prop="isOut">
                    <template slot-scope="scope">
                      <div>
                        <span v-if="scope.row.isOut == 0">无出库记录</span>
                        <span v-else>存在出库记录</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="状态">
                    <template slot-scope="scope">
                      <div v-for="(e, index) in stateList" :key="index">
                        <span
                          v-show="scope.row.state == e.id && e.name != '全部'"
                          >{{ e.name }}</span
                        >
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="note" label="备注"> </el-table-column>
                </el-table>
              </div>
              <div style="width: 100%;height: 50px;">
                <div style="margin:15px 0;position:absolute;right:6%;">
                  <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="page"
                    :page-size="1"
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
      <!-- 图形--》表格 -->
      <div v-show="siteSel == 1">
        <div
          style="width: 60px;margin-bottom: 20px;display: flex;justify-content:space-between;cursor: pointer;"
          @click="backToImg"
        >
          <img src="../assets/imgs/home/goback.png" style="height: 21px;" />
          <p style="margin: 0;">返回</p>
        </div>
        <el-table
          style="width: 100%;"
          ref="multipleTableSel"
          :data="imgMaterialList"
          :row-key="getRowKeys"
          tooltip-effect="dark"
          border
          highlight-current-row
          @row-click="checkproductDetails"
          @row-dblclick="dblProductDetails"
        >
          <el-table-column label="出库">
            <template>
              <div>
                <span style="cursor: pointer;color: #3d81fd;">出库</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="materialName" label="成品图">
            <template slot-scope="scope">
              <div>
                <img
                  :src="img + '/file/' + firstimg(scope.row.img)"
                  alt=""
                  style="width: 100%;"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="productNumber" label="统一编号">
          </el-table-column>
          <el-table-column label="裸石成本" prop="costPrice">
            <template slot-scope="scope">
              <div>
                <span>{{
                  scope.row.costPrice + " " + scope.row.currency
                }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="processCost" label="加工费">
            <template slot-scope="scope">
              <div>
                <span>{{ scope.row.processCost + " CNY" }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="最低销售价" prop="lowestSellPrice">
            <template slot-scope="scope">
              <div>
                <span>{{ scope.row.lowestSellPrice + " CNY" }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="建议销售价" prop="adviseSellPrice">
            <template slot-scope="scope">
              <div>
                <span>{{ scope.row.adviseSellPrice + " CNY" }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="建议批发价" prop="adviceWholesalePrice">
            <template slot-scope="scope">
              <div>
                <span>{{ scope.row.adviceWholesalePrice + " CNY" }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="标签价" prop="tagPrice">
            <template slot-scope="scope">
              <div>
                <span>{{ scope.row.tagPrice + " CNY" }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="saleCommission" label="销售提成">
            <template slot-scope="scope">
              <div>
                <span>{{ scope.row.saleCommission + " CNY" }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="出库记录" prop="isOut">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.isOut == 0">无出库记录</span>
                <span v-else>存在出库记录</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <div v-for="(e, index) in stateList" :key="index">
                <span v-show="scope.row.state == e.id && e.name != '全部'">{{
                  e.name
                }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="note" label="备注"> </el-table-column>
        </el-table>
      </div>
      <div v-show="siteSel == 2" style="padding: 20px;background-color: #fff;">
        <div
          style="width: 60px;margin-bottom: 20px;display: flex;justify-content:space-between;cursor: pointer;"
          @click="backToList"
        >
          <img src="../assets/imgs/home/goback.png" style="height: 21px;" />
          <p style="margin: 0;">返回</p>
        </div>
        <div class="add-left">
          <p class="title-font">待出库清单</p>
          <el-table
            :data="deliveryData.stockInIdList"
            style="width: 100%"
            border
            id="left"
          >
            <el-table-column prop="designName" label="成品图片">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.img == '' || scope.row.img == null"
                    >---</span
                  >
                  <img
                    v-else
                    :src="img + '/file/' + scope.row.img"
                    width="50px"
                    height="50px"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="productNumber" label="统一编号">
            </el-table-column>
          </el-table>

          <el-form
            style="margin-top: 20px;"
            :model="deliveryData"
            :rules="deliveryRules"
            ref="deliveryForm"
            label-width="160px"
          >
            <el-form-item label="出库类型：" prop="type">
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
              label="目的地："
              prop="endStorageId"
              v-if="deliveryData.type == 0"
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
              label="销售员："
              prop="solder"
              v-if="deliveryData.type == 1"
            >
              <el-input
                v-model="deliveryData.solder"
                placeholder="请输入销售员"
                clearable
                class="input-style"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="组："
              prop="group"
              v-if="deliveryData.type == 1"
            >
              <el-input
                v-model="deliveryData.group"
                placeholder="请输入"
                clearable
                class="input-style"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="顾客姓名："
              prop="customer"
              v-if="deliveryData.type == 1"
            >
              <el-input
                v-model="deliveryData.customer"
                placeholder="请输入顾客姓名"
                clearable
                class="input-style"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="出售币种："
              v-if="deliveryData.type == 1"
              prop="saleCurrency"
            >
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
            <el-form-item
              label="查找用户："
              prop="user"
              v-if="
                deliveryData.type == 1 && deliveryData.saleCurrency == 'CNY'
              "
            >
              <el-select
                v-model="deliveryData.user"
                filterable
                remote
                reserve-keyword
                placeholder="可输入邮箱/手机号查找客户"
                :remote-method="remoteMethod"
                :loading="loading"
                class="input-style"
              >
                <el-option
                  v-for="item in userList"
                  :key="item.userId"
                  :label="item.username"
                  :value="item.userId"
                  @click.native="userChange(item)"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="总积分："
              v-if="
                deliveryData.type == 1 && deliveryData.saleCurrency == 'CNY'
              "
            >
              <el-input
                v-model="integralTotal"
                readonly
                class="input-style"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="抵扣积分："
              prop="integral"
              v-if="
                deliveryData.type == 1 && deliveryData.saleCurrency == 'CNY'
              "
            >
              <el-input
                @input="integralInput"
                v-model="deliveryData.integral"
                placeholder="请输入"
                clearable
                class="input-style"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="出售金额："
              prop="saleMoney"
              v-if="deliveryData.type == 1"
            >
              <el-input
                @input="currencyChange"
                @change="totalChange"
                v-model="deliveryData.saleMoney"
                placeholder="请输入出售金额"
                clearable
                class="input-style"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="外币兑换人民币汇率："
              prop="total"
              v-if="deliveryData.type == 1"
            >
              <el-input
                @input="totalCnRateChange"
                v-model="deliveryData.totalToCnRate"
                placeholder="请输入"
                clearable
                class="input-style"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="出售人民币金额："
              prop="total"
              v-if="deliveryData.type == 1"
            >
              <el-input
                v-model="deliveryData.sellTotalCnPrice"
                placeholder="请输入"
                clearable
                class="input-style"
                @change="totalChange"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="港币兑换人民币汇率："
              prop="total"
              v-if="deliveryData.type == 1"
            >
              <el-input
                @input="totalHkRateChange"
                v-model="deliveryData.totalToHkRate"
                placeholder="请输入"
                clearable
                class="input-style"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="出售港币金额："
              prop="total"
              v-if="deliveryData.type == 1"
            >
              <el-input
                v-model="deliveryData.sellTotalHkPrice"
                placeholder="请输入"
                clearable
                class="input-style"
                @change="totalChange"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="销售发票号："
              prop="total"
              v-if="deliveryData.type == 1"
            >
              <el-input
                v-model="deliveryData.sellBillNumber"
                placeholder="请输入"
                clearable
                class="input-style"
              ></el-input>
            </el-form-item>
            <el-form-item label="出库时间：" prop="stockOutTime">
              <el-date-picker
                class="input-style"
                v-model="deliveryData.stockOutTime"
                type="date"
                placeholder="请选择出库时间"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="领货人：" prop="receiver">
              <el-input
                class="input-style"
                v-model="deliveryData.receiver"
              ></el-input>
            </el-form-item>
            <el-form-item label="备注：" prop="note" id="noteStyle">
              <el-input
                type="textarea"
                placeholder="请输入备注信息"
                v-model="deliveryData.note"
              ></el-input>
            </el-form-item>
          </el-form>
          <div style="margin-top: 80px;text-align: right;">
            <el-button
              style="width: 120px;"
              type="primary"
              @click="stockInSubmit('deliveryForm')"
              v-preventClick
              >提 交</el-button
            >
          </div>
        </div>
      </div>
      <el-dialog
        title="成品信息"
        v-if="dialogDeviceDetailVisible"
        :visible.sync="dialogDeviceDetailVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :append-to-body="false"
      >
        <div id="invenSome">
          <el-tabs style="margin-top: 20px;" v-model="activeStockName">
            <el-tab-pane label="成品信息" name="first">
              <div style="display: flex;justify-content: space-between;">
                <p class="font-title-style" style="margin-top: 0;">
                  成品信息
                </p>
                <div style="padding-top: 6px;">
                  <img
                    style="cursor: pointer;"
                    title="修改成品信息"
                    src="../assets/imgs/home/update.png"
                    @click="updateDevice"
                  />
                </div>
              </div>
              <div class="font-div">
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    成品名称
                  </div>
                  <div class="one-right">
                    <el-input
                      v-model="deviceDetail.productName"
                      :readonly="isUpdate == 0 ? true : false"
                    >
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    标签
                  </div>
                  <div class="one-right">
                    <el-select
                      style="width: 100%;"
                      v-model="labelSelList"
                      :disabled="isUpdate == 0 ? true : false"
                      placeholder="可多选"
                      multiple
                    >
                      <el-option
                        v-for="item in productLabelList"
                        :key="item"
                        :label="item"
                        :value="item"
                      >
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    设计名称：
                  </div>
                  <div class="one-right">
                    <el-input
                      @focus="chooseimgshow = true"
                      v-model="deviceDetail.designName"
                      :readonly="isUpdate == 0 ? true : false"
                    >
                    </el-input>
                  </div>
                </div>

                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: '#606266',
                      fontWeight: 'normal',
                    }"
                  >
                    设计师：
                  </div>
                  <div class="one-right">
                    <el-input v-model="deviceDetail.designerName" readonly>
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color:
                        isUpdate == 0
                          ? '#606266'
                          : deviceDetail.isUpdate == 0
                          ? '#3d82fe'
                          : '#606266',
                      fontWeight:
                        isUpdate == 0
                          ? 'normal'
                          : deviceDetail.isUpdate == 0
                          ? 'bold'
                          : 'normal',
                    }"
                  >
                    唯一编号
                  </div>
                  <div class="one-right">
                    <el-input
                      v-model="deviceDetail.productNumber"
                      :readonly="
                        isUpdate == 0
                          ? true
                          : deviceDetail.isUpdate == 0
                          ? false
                          : true
                      "
                    >
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    参数
                  </div>
                  <div class="one-right">
                    <el-input
                      type="textarea"
                      v-model="deviceDetail.params"
                      :readonly="isUpdate == 0 ? true : false"
                    >
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    证书编号
                  </div>
                  <div class="one-right">
                    <el-input
                      v-model="deviceDetail.certificateNumber"
                      :readonly="isUpdate == 0 ? true : false"
                    >
                    </el-input>
                  </div>
                </div>
              </div>
              <p class="font-title-style">图片信息</p>
              <div>
                <p
                  :style="{
                    color: isUpdate == 0 ? '#606266' : '#3d82fe',
                    fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    margin: 0,
                    width: '90px',
                  }"
                >
                  成品图片：
                </p>
                <div
                  class="upload-imgs"
                  v-if="deviceDetail.img != '' || isUpdate == 1"
                >
                  <div class="add" v-if="isUpdate == 1">
                    <form enctype="multipart/form-data" style="width: 100px;">
                      <input
                        @change="inputChange($event)"
                        multiple
                        type="file"
                        name="img"
                        accept="image/*"
                        class="inputUpload"
                      />
                      <i class="el-icon-plus addIcon"></i>
                    </form>
                  </div>
                  <div
                    style="display:flex;position:relative;flex-wrap: wrap;"
                    id="delImg"
                    class="delImg"
                  >
                    <div
                      v-for="(imgurl, index) of productimgList"
                      :key="index"
                      style="margin-left:10px;position:relative;"
                      v-dragging="{
                        item: imgurl,
                        list: productimgList,
                        group: 'productimgList',
                      }"
                    >
                      <span
                        v-if="imgurl !== '' && imgurl !== null && isUpdate == 1"
                        class="spanStyle"
                        @click="delImage(index)"
                        >x</span
                      >
                      <img
                        v-if="imgurl !== '' && imgurl !== null"
                        :src="img + '/file/' + imgurl"
                        width="100px"
                        height="100px"
                        style="border-radius:5px;object-fit:cover;"
                      />
                    </div>
                  </div>
                </div>
                <p
                  v-if="deviceDetail.img == '' && isUpdate == 0"
                  style="margin-left: 10px;font-size: 13px;"
                >
                  无成品图片
                </p>
              </div>
              <div>
                <p
                  :style="{
                    color: isUpdate == 0 ? '#606266' : '#3d82fe',
                    fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    margin: 0,
                    width: '90px',
                  }"
                >
                  详情图片：
                </p>
                <div
                  class="upload-imgs"
                  v-if="deviceDetail.detailImg != '' || isUpdate == 1"
                >
                  <div class="add" v-if="isUpdate == 1">
                    <form enctype="multipart/form-data" style="width: 100px;">
                      <input
                        @change="inputChange2($event)"
                        multiple
                        type="file"
                        name="img"
                        accept="image/*"
                        class="inputUpload"
                      />
                      <i class="el-icon-plus addIcon"></i>
                    </form>
                  </div>
                  <div
                    style="display:flex;position:relative;flex-wrap: wrap;"
                    id="delImg"
                    class="delImg"
                  >
                    <div
                      v-for="(imgurl, index) of detailImgList"
                      :key="index"
                      style="margin-left:10px;position:relative;"
                      v-dragging="{
                        item: imgurl,
                        list: detailImgList,
                        group: 'detailImgList',
                      }"
                    >
                      <span
                        v-if="imgurl !== '' && imgurl !== null && isUpdate == 1"
                        class="spanStyle"
                        @click="delImage2(index)"
                        >x</span
                      >
                      <img
                        v-if="imgurl !== '' && imgurl !== null"
                        :src="img + '/file/' + imgurl"
                        width="100px"
                        height="100px"
                        style="border-radius:5px;object-fit:cover;"
                      />
                    </div>
                  </div>
                </div>
                <p
                  v-if="deviceDetail.detailImg == '' && isUpdate == 0"
                  style="margin-left: 10px;font-size: 13px;"
                >
                  无详情图片
                </p>
              </div>
              <div>
                <p
                  :style="{
                    color: '#606266',
                    fontWeight: 'normal',
                    margin: 0,
                    width: '90px',
                  }"
                >
                  设计图片：
                </p>
                <div class="upload-imgs" v-if="deviceDetail.designImg != ''">
                  <div
                    style="display:flex;position:relative;flex-wrap: wrap;"
                    id="delImg"
                    class="delImg"
                  >
                    <div
                      v-for="(imgurl, index) of imgFillter(
                        deviceDetail.designImg
                      )"
                      :key="index"
                      style="margin-left:10px;position:relative;"
                    >
                      <img
                        v-if="imgurl !== '' && imgurl !== null"
                        :src="imgurl"
                        width="100px"
                        height="100px"
                        style="border-radius:5px;object-fit:cover;"
                      />
                    </div>
                  </div>
                </div>
                <p v-else style="margin-left: 10px;font-size: 13px;">
                  无设计图片
                </p>
              </div>
              <p class="font-title-style">原材料信息</p>
              <el-table
                style="width: 100%;"
                :data="deviceDetail.materialList"
                tooltip-effect="dark"
                border
                highlight-current-row
                @row-dblclick="checkDeviceDetails"
              >
                <el-table-column prop="name" label="名称"> </el-table-column>
                <el-table-column prop="number" label="数量"> </el-table-column>
                <el-table-column label="查看详情">
                  <template>
                    <div>
                      <span title="查看材料信息" class="look">查看</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <p class="font-title-style">备注信息</p>
              <div class="font-div">
                <div class="div-one-note">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    产品备注
                  </div>
                  <div class="one-right">
                    <el-input
                      type="textarea"
                      v-model="deviceDetail.note"
                      :readonly="isUpdate == 0 ? true : false"
                    >
                    </el-input>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="价格信息" name="fourth">
              <div style="display: flex;justify-content: space-between;">
                <p class="font-title-style" style="margin-top: 0;">
                  价格信息
                </p>
                <div style="padding-top: 6px;">
                  <img
                    style="cursor: pointer;"
                    title="修改价格信息"
                    src="../assets/imgs/home/update.png"
                    @click="updateDevice"
                  />
                </div>
              </div>
              <div class="font-div">
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    裸石成本币种
                  </div>
                  <div class="one-right">
                    <el-radio-group
                      @change="currencyCostChange"
                      v-model="deviceDetail.currency"
                      :disabled="isUpdate == 0 ? true : false"
                    >
                      <el-radio label="CNY">CNY</el-radio>
                      <el-radio label="EUR">EUR</el-radio>
                      <el-radio label="USD">USD</el-radio>
                      <el-radio label="HKD">HKD</el-radio>
                    </el-radio-group>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    裸石成本
                  </div>
                  <div class="one-right">
                    <el-input
                      @input="currencyCostChange"
                      :readonly="isUpdate == 0 ? true : false"
                      v-model="deviceDetail.costPrice"
                      clearable=""
                    ></el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    加工费(CNY)
                  </div>
                  <div class="one-right">
                    <el-input
                      @input="totalCostCnRateChange"
                      :readonly="isUpdate == 0 ? true : false"
                      v-model="deviceDetail.processCost"
                      clearable
                    >
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    外币兑人民币汇率
                  </div>
                  <div class="one-right">
                    <el-input
                      @input="totalCostCnRateChange"
                      :readonly="isUpdate == 0 ? true : false"
                      v-model="deviceDetail.totalCnRate"
                      clearable
                    >
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    成本人民币金额
                  </div>
                  <div class="one-right">
                    <el-input
                      :readonly="isUpdate == 0 ? true : false"
                      v-model="deviceDetail.totalCnPrice"
                      clearable
                    >
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    港币兑人民币汇率
                  </div>
                  <div class="one-right">
                    <el-input
                      @input="totalCostHkRateChange"
                      :readonly="isUpdate == 0 ? true : false"
                      v-model="deviceDetail.totalHkRate"
                      clearable
                    >
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    成本港币金额
                  </div>
                  <div class="one-right">
                    <el-input
                      :readonly="isUpdate == 0 ? true : false"
                      v-model="deviceDetail.totalHkPrice"
                      clearable
                    >
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    最低销售价(CNY)
                  </div>
                  <div class="one-right">
                    <el-input
                      :readonly="isUpdate == 0 ? true : false"
                      v-model="deviceDetail.lowestSellPrice"
                      clearable
                    >
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    建议销售价(CNY)
                  </div>
                  <div class="one-right">
                    <el-input
                      :readonly="isUpdate == 0 ? true : false"
                      v-model="deviceDetail.adviseSellPrice"
                      clearable
                    >
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    建议批发价(CNY)
                  </div>
                  <div class="one-right">
                    <el-input
                      :readonly="isUpdate == 0 ? true : false"
                      v-model="deviceDetail.adviceWholesalePrice"
                      clearable
                    >
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    标签价(CNY)
                  </div>
                  <div class="one-right">
                    <el-input
                      :readonly="isUpdate == 0 ? true : false"
                      v-model="deviceDetail.tagPrice"
                      clearable
                    >
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    销售提成(CNY)
                  </div>
                  <div class="one-right">
                    <el-input
                      :readonly="isUpdate == 0 ? true : false"
                      v-model="deviceDetail.saleCommission"
                      clearable
                    >
                    </el-input>
                  </div>
                </div>
              </div>
              <p class="font-title-style">备注信息</p>
              <div class="font-div">
                <div class="div-one-note" id="one-note">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    成本备注
                  </div>
                  <div class="one-right">
                    <el-input
                      type="textarea"
                      v-model="deviceDetail.totalPriceNote"
                      :readonly="isUpdate == 0 ? true : false"
                    >
                    </el-input>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane
              label="销售信息"
              name="third"
              v-if="deviceDetail.state == 4"
            >
              <div style="display: flex;justify-content: space-between;">
                <p class="font-title-style" style="margin-top: 0;">
                  销售信息
                </p>
                <div style="padding-top: 6px;">
                  <img
                    style="cursor: pointer;"
                    title="修改销售信息"
                    src="../assets/imgs/home/update.png"
                    @click="updateDevice"
                  />
                </div>
              </div>
              <div class="font-div">
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    销售员
                  </div>
                  <div class="one-right">
                    <el-input
                      :readonly="isUpdate == 0 ? true : false"
                      v-model="deviceDetail.solder"
                      clearable
                    >
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    组
                  </div>
                  <div class="one-right">
                    <el-input
                      :readonly="isUpdate == 0 ? true : false"
                      v-model="deviceDetail.group"
                      clearable
                    >
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    顾客姓名
                  </div>
                  <div class="one-right">
                    <el-input
                      :readonly="isUpdate == 0 ? true : false"
                      v-model="deviceDetail.customer"
                      clearable
                    >
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    出售币种
                  </div>
                  <div class="one-right">
                    <el-radio-group
                      @change="currencyChange2"
                      v-model="deviceDetail.saleCurrency"
                      :disabled="isUpdate == 0 ? true : false"
                    >
                      <el-radio label="CNY">CNY</el-radio>
                      <el-radio label="EUR">EUR</el-radio>
                      <el-radio label="USD">USD</el-radio>
                      <el-radio label="HKD">HKD</el-radio>
                    </el-radio-group>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    出售金额
                  </div>
                  <div class="one-right">
                    <el-input
                      @input="currencyChange2"
                      :readonly="isUpdate == 0 ? true : false"
                      v-model="deviceDetail.saleMoney"
                      clearable
                    >
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    外币兑人民币汇率
                  </div>
                  <div class="one-right">
                    <el-input
                      @input="totalCnRateChange2"
                      :readonly="isUpdate == 0 ? true : false"
                      v-model="deviceDetail.totalToCnRate"
                      clearable
                    >
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    出售人民币金额
                  </div>
                  <div class="one-right">
                    <el-input
                      :readonly="isUpdate == 0 ? true : false"
                      v-model="deviceDetail.sellTotalCnPrice"
                      clearable
                    >
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    港币兑人民币汇率
                  </div>
                  <div class="one-right">
                    <el-input
                      @input="totalHkRateChange2"
                      :readonly="isUpdate == 0 ? true : false"
                      v-model="deviceDetail.totalToHkRate"
                      clearable
                    >
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    出售港币金额
                  </div>
                  <div class="one-right">
                    <el-input
                      :readonly="isUpdate == 0 ? true : false"
                      v-model="deviceDetail.sellTotalHkPrice"
                      clearable
                    >
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    销售发票号
                  </div>
                  <div class="one-right">
                    <el-input
                      :readonly="isUpdate == 0 ? true : false"
                      v-model="deviceDetail.sellBillNumber"
                      clearable
                    >
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: isUpdate == 0 ? '#606266' : '#3d82fe',
                      fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                    }"
                  >
                    领货人
                  </div>
                  <div class="one-right">
                    <el-input
                      :readonly="isUpdate == 0 ? true : false"
                      v-model="deviceDetail.receiver"
                      clearable
                    >
                    </el-input>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="历史记录" name="second">
              <p class="font-title-style" style="margin-top: 0;">
                成品状态：{{
                  deviceDetail.state == 0
                    ? "库存中"
                    : deviceDetail.state == 1
                    ? "运输中"
                    : deviceDetail.state == 3
                    ? "加工完成"
                    : "已出售"
                }}
              </p>
              <el-timeline>
                <el-timeline-item
                  color="#3d82fe"
                  size="large"
                  v-for="(activity, index) in deviceDetail.stockInOutList"
                  :key="index"
                >
                  <div style="display: flex;align-items: center;">
                    <p style="margin:0 20px 14px 0;width: 72px;">
                      {{ activity.time.slice(0, 10) }}
                    </p>
                    <p style="margin-top:0" v-html="activity.describe"></p>
                  </div>
                  <p
                    v-if="activity.note !== ''"
                    style="margin: 0;color:#919090;margin-left:92px;word-break: break-all;word-wrap: break-word"
                  >
                    {{ activity.note }}
                  </p>
                </el-timeline-item>
              </el-timeline>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div slot="footer">
          <el-button @click="dialogDeviceDetailVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="inventoryLookSure">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        v-if="dialogDeviceDetailsVisible"
        title="材料信息"
        :visible.sync="dialogDeviceDetailsVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :append-to-body="false"
        style="margin-top:20px"
      >
        <div id="invenSome">
          <el-tabs style="margin-top: 20px;" v-model="activeName">
            <el-tab-pane label="材料信息" name="ff">
              <p class="font-title-style" style="margin-top: 0;">
                材料信息
              </p>
              <div class="font-div">
                <div class="div-one">
                  <div class="one-left">
                    材料名称
                  </div>
                  <div class="one-right">
                    {{ deviceDetails.materialName }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    仓库/加工厂
                  </div>
                  <div class="one-right">
                    {{ deviceDetails.storageName }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    统一编号
                  </div>
                  <div class="one-right">
                    {{ deviceDetails.productNumber }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    形状
                  </div>
                  <div class="one-right">
                    {{ deviceDetails.shape }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    产品类型
                  </div>
                  <div class="one-right">
                    <el-input v-model="deviceDetails.productType" clearable>
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    产地
                  </div>
                  <div class="one-right">
                    <el-input v-model="deviceDetails.productArea" clearable>
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    尺寸/毫米
                  </div>
                  <div class="one-right">
                    {{ deviceDetails.size }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    颜色
                  </div>
                  <div class="one-right">
                    {{ deviceDetails.color }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    配对
                  </div>
                  <div class="one-right">
                    {{ deviceDetails.paired }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    品质
                  </div>
                  <div class="one-right">
                    {{ deviceDetails.quality }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    品质细分
                  </div>
                  <div class="one-right">
                    {{ deviceDetails.subsection }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    盒子编号
                  </div>
                  <div class="one-right">
                    {{ deviceDetails.boxNumber }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    证书编号
                  </div>
                  <div class="one-right">
                    {{ deviceDetails.certificateNumber }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    发票号
                  </div>
                  <div class="one-right">
                    <el-input v-model="deviceDetails.billNumber" clearable>
                    </el-input>
                  </div>
                </div>
              </div>
              <p class="font-title-style">图片信息</p>
              <div class="upload-imgs">
                <div
                  style="display:flex;position:relative;"
                  id="delImg"
                  class="delImg"
                >
                  <div
                    v-for="(imgurl, index) of imgList"
                    :key="index"
                    style="margin-left:10px;position:relative;"
                  >
                    <img
                      v-if="imgurl !== '' && imgurl !== null"
                      :src="
                        imgurl.length < 42 ? img + '/file/' + imgurl : imgurl
                      "
                      width="100px"
                      height="100px"
                      style="border-radius:5px;object-fit:cover;"
                    />
                  </div>
                </div>
              </div>
              <p class="font-title-style">备注信息</p>
              <div class="font-div">
                <div class="div-one-note">
                  <div class="one-left">
                    产品备注
                  </div>
                  <div class="one-right">
                    <el-input
                      type="textarea"
                      v-model="deviceDetails.note"
                      readonly
                    >
                    </el-input>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="价格信息" name="qq">
              <p class="font-title-style" style="margin-top: 0;">
                价格信息
              </p>
              <div class="font-div">
                <div class="div-one">
                  <div class="one-left">
                    计价单位
                  </div>
                  <div class="one-right">
                    <el-radio-group
                      v-model="deviceDetails.chargeUnit"
                      :disabled="true"
                    >
                      <el-radio label="粒">粒</el-radio>
                      <el-radio label="ct">ct</el-radio>
                      <el-radio label="g">g</el-radio>
                    </el-radio-group>
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    单价
                  </div>
                  <div class="one-right">
                    {{ deviceDetails.unitPrice }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    币种
                  </div>
                  <div class="one-right">
                    <el-radio-group
                      v-model="deviceDetails.currency"
                      :disabled="true"
                    >
                      <el-radio label="CNY">CNY</el-radio>
                      <el-radio label="EUR">EUR</el-radio>
                      <el-radio label="USD">USD</el-radio>
                      <el-radio label="HKD">HKD</el-radio>
                    </el-radio-group>
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    总数量
                  </div>
                  <div class="one-right">
                    {{
                      deviceDetails.chargeUnit == "粒"
                        ? deviceDetails.number + " " + deviceDetails.chargeUnit
                        : deviceDetails.number
                    }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    总重量
                  </div>
                  <div class="one-right">
                    {{
                      deviceDetails.chargeUnit != "粒"
                        ? deviceDetails.weight + " " + deviceDetails.chargeUnit
                        : "--"
                    }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    总价
                  </div>
                  <div class="one-right">
                    {{
                      deviceDetails.totalPrice + " " + deviceDetails.currency
                    }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    零售单价
                  </div>
                  <div class="one-right">
                    {{ deviceDetails.retailPrice }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    批发单价
                  </div>
                  <div class="one-right">
                    {{ deviceDetails.wholesalePrice }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    外币兑人民币汇率
                  </div>
                  <div class="one-right">
                    {{ deviceDetails.totalCnRate }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    总价人民币金额
                  </div>
                  <div class="one-right">
                    {{ deviceDetails.totalCnPrice }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    港币兑人民币汇率
                  </div>
                  <div class="one-right">
                    {{ deviceDetails.totalHkRate }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    总价港币金额
                  </div>
                  <div class="one-right">
                    {{ deviceDetails.totalHkPrice }}
                  </div>
                </div>
              </div>
              <p class="font-title-style">备注信息</p>
              <div class="font-div">
                <div class="div-one-note" id="one-note">
                  <div class="one-left">
                    成本备注
                  </div>
                  <div class="one-right">
                    <el-input
                      type="textarea"
                      v-model="deviceDetails.totalPriceNote"
                      readonly
                    >
                    </el-input>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="历史记录" name="ss">
              <p class="font-title-style" style="margin-top: 0;">
                材料状态：{{
                  deviceDetails.state == 0
                    ? "库存中"
                    : deviceDetails.state == 1
                    ? "运输中"
                    : deviceDetails.state == 2
                    ? "加工中"
                    : deviceDetails.state == 3
                    ? "加工完成"
                    : "已出售"
                }}
              </p>
              <el-timeline>
                <el-timeline-item
                  color="#3d82fe"
                  size="large"
                  v-for="(activity, index) in deviceDetails.stockInOutList"
                  :key="index"
                >
                  <div style="display: flex;align-items: center;">
                    <p style="margin:0 20px 14px 0;width: 72px;">
                      {{ activity.time.slice(0, 10) }}
                    </p>
                    <p style="margin-top:0" v-html="activity.describe"></p>
                  </div>
                  <p
                    v-if="activity.note !== ''"
                    style="margin: 0;color:#919090;margin-left:92px;word-break: break-all;word-wrap: break-word"
                  >
                    {{ activity.note }}
                  </p>
                </el-timeline-item>
              </el-timeline>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div slot="footer">
          <el-button @click="dialogDeviceDetailsVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="dialogDeviceDetailsVisible = false"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <el-dialog
        title="设计稿列表"
        :visible.sync="chooseimgshow"
        :append-to-body="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :before-close="handleClose"
        :modal-append-to-body="false"
        width="40%"
      >
        <div style="display:flex;padding: 30px 20px 0 20px;">
          <el-input
            placeholder="请输入设计师，设计名称"
            v-model="designListKeyword"
          ></el-input
          ><el-button
            style="margin-left: 10px;"
            @click="getproducibleDesignList"
            >搜索</el-button
          >
        </div>
        <div style="padding: 20px;">
          <el-radio-group
            v-model="statusDesign"
            @change="getproducibleDesignList"
          >
            <el-radio label="0">全部</el-radio>
            <el-radio label="1">未生产</el-radio>
          </el-radio-group>
        </div>
        <el-table
          :data="producibleDesignList"
          style="width: 90%;margin:auto;"
          highlight-current-row
          border
          @current-change="chooseimglist"
          ref="multipleTableDesign"
        >
          <el-table-column prop="name" label="设计名称"> </el-table-column>
          <el-table-column prop="designerName" label="设计师名称">
          </el-table-column>
          <el-table-column prop="designId" label="设计图片">
            <template slot-scope="scope">
              <img
                v-image-preview
                :src="img + '/file/' + firstimg(scope.row.img)"
                style="width: 100px;height: 100px;object-fit: cover;"
              />
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer">
          <el-button type="primary" @click="chooseimgshow = false"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    stockInquiryParam: {
      type: Object,
    },
  },
  data() {
    return {
      img: this.$store.state.baseUrl,
      img1: require("../assets/imgs/list.png"),
      img2: require("../assets/imgs/camer.png"),
      cliHeight: 500,

      state: 5,
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
          id: 1,
          name: "运输中",
        },
        {
          id: 5,
          name: "未出售",
        },
        {
          id: 4,
          name: "已出售",
        },
      ],
      storageList: [
        {
          id: 0,
          name: "全部",
          type: 0,
        },
      ],
      storageIdList: [],
      time: "",

      siteSel: 0,

      stockInMsg: "数据加载中...",
      stockInList: [],
      stockListPage: [],
      total: 0,
      page: 1,
      pageNum: 1,
      keyword: "",

      dialogDeviceDetailVisible: false,
      dialogDeviceDetailsVisible: false,
      deviceDetail: {},
      deviceDetails: {},
      isUpdate: 0,
      imgList: [],
      productimgList: [],
      detailImgList: [],
      activeStockName: "first",
      activeName: "ff",
      imgMaterialList: [],
      productLabelList: [],
      labelSelList: [],

      designListKeyword: "",
      statusDesign: "1",
      producibleDesignList: [],
      chooseimgshow: false,

      imgSortList: [],
      count: 0,

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
        receiver: "",
        designId: "",
        productNumber: "",
        img: "",
        storageId: "",
        solder: "",
        group: "",
        customer: "",
        saleMoney: "",
        phoneNumber: "",
        integral: "",
        user: "",
        saleCurrency: "CNY",
        stockOutTime: "",
        note: "",
        stockInIdList: [],
        processCost: "",
        costPrice: "",
        lowestSellPrice: "",
        adviseSellPrice: "",
        tagPrice: "",
        adviceWholesalePrice: "",
        saleCommission: "",
        totalToCnRate: "",
        sellTotalCnPrice: "",
        totalToHkRate: "",
        sellTotalHkPrice: "",
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
            message: "请输入组",
            trigger: "blur",
          },
        ],
        customer: [
          {
            required: true,
            message: "请输入顾客姓名",
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
      multipleSelection: [],
      warehouseFilterList: [],
      params: {},

      integralTotal: "",
      userList: [],
      loading: false,
    };
  },

  created() {
    this.cliHeight = document.body.clientHeight - 185;
    this.warehouseKeywordCheck();
    this.getWarehouseFactoryList();
    this.getLabelList();
    this.getproducibleDesignList();
  },
  methods: {
    // 成本汇率变化
    totalCostCnRateChange() {
      let num =
        this.deviceDetail.costPrice * this.deviceDetail.totalCnRate +
        Number(this.deviceDetail.processCost);
      this.deviceDetail.totalCnPrice = Math.ceil(num);
    },
    totalCostHkRateChange() {
      this.deviceDetail.totalHkPrice = Math.ceil(
        this.deviceDetail.totalCnPrice / this.deviceDetail.totalHkRate
      );
    },
    // 成本币种-汇率变化
    currencyCostChange() {
      this.deviceDetail.totalCnRate = "";
      this.deviceDetail.totalCnPrice = "";
      this.deviceDetail.totalHkRate = "";
      this.deviceDetail.totalHkPrice = "";
      if (this.deviceDetail.currency == "CNY") {
        this.deviceDetail.totalCnRate = 1;
        this.deviceDetail.totalCnPrice = this.deviceDetail.costPrice;
      } else if (this.deviceDetail.currency == "HKD") {
        this.deviceDetail.totalHkPrice = this.deviceDetail.costPrice;
      }
    },
    // 修改成品售价汇率变化
    totalCnRateChange2() {
      let num = this.deviceDetail.saleMoney * this.deviceDetail.totalToCnRate;
      this.deviceDetail.sellTotalCnPrice = Math.ceil(num);
    },
    totalHkRateChange2() {
      this.deviceDetail.sellTotalHkPrice = Math.ceil(
        this.deviceDetail.sellTotalCnPrice / this.deviceDetail.totalToHkRate
      );
    },
    // 修改成品币种-汇率变化
    currencyChange2() {
      this.deviceDetail.totalToCnRate = "";
      this.deviceDetail.sellTotalCnPrice = "";
      this.deviceDetail.totalToHkRate = "";
      this.deviceDetail.sellTotalHkPrice = "";
      if (this.deviceDetail.saleCurrency == "CNY") {
        this.deviceDetail.totalToCnRate = 1;
        this.deviceDetail.sellTotalCnPrice = this.deviceDetail.saleMoney;
      } else if (this.deviceDetail.saleCurrency == "HKD") {
        this.deviceDetail.sellTotalHkPrice = this.deviceDetail.saleMoney;
      }
    },
    // 各种价格输入
    totalChange() {
      this.deliveryData.saleMoney = this.getPriceNum(
        this.deliveryData.saleMoney
      );
      this.deliveryData.sellTotalCnPrice = this.getPriceNum(
        this.deliveryData.sellTotalCnPrice
      );
      this.deliveryData.sellTotalHkPrice = this.getPriceNum(
        this.deliveryData.sellTotalHkPrice
      );
    },
    // 通过邮箱/手机号查找客户
    remoteMethod(e) {
      console.log(e);
      this.loading = true;
      this.$axios
        .get(this.$store.state.baseUrl + "/memberMsgGet?username=" + e)
        .then((res) => {
          console.log("查找客户");
          console.log(res);
          this.userList = res.data;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
    userChange(item) {
      console.log(item);
      console.log(this.deliveryData.user);
      this.integralTotal = item.totalIntegral;
    },
    // 抵扣积分
    integralInput() {
      if (this.deliveryData.integral > this.integralTotal) {
        this.$message.warning({
          message: "抵扣积分不可大于客户总积分",
          showClose: true,
          duration: 2000,
        });
      }
    },
    // 汇率变化
    totalCnRateChange() {
      let num = this.deliveryData.saleMoney * this.deliveryData.totalToCnRate;
      this.deliveryData.sellTotalCnPrice = Math.ceil(num);
    },
    totalHkRateChange() {
      this.deliveryData.sellTotalHkPrice = Math.ceil(
        this.deliveryData.sellTotalCnPrice / this.deliveryData.totalToHkRate
      );
    },
    // 币种-汇率变化
    currencyChange() {
      this.deliveryData.totalToCnRate = "";
      this.deliveryData.sellTotalCnPrice = "";
      this.deliveryData.totalToHkRate = "";
      this.deliveryData.sellTotalHkPrice = "";
      if (this.deliveryData.saleCurrency == "CNY") {
        this.deliveryData.totalToCnRate = 1;
        this.deliveryData.sellTotalCnPrice = this.deliveryData.saleMoney;
      } else if (this.deliveryData.saleCurrency == "HKD") {
        this.deliveryData.sellTotalHkPrice = this.deliveryData.saleMoney;
      }
    },
    getRowKeys(row) {
      return row.id;
    },
    // 出库类型变化
    typeChange() {
      this.$refs.deliveryForm.clearValidate();
    },
    // 材料出库
    stockInSubmit(formName) {
      this.params = {};
      if (this.deliveryData.type == 0) {
        this.params = {
          type: this.deliveryData.type,
          stockInList: this.deliveryData.stockInIdList,
          stockOutTime: this.deliveryData.stockOutTime,
          endStorageId: this.deliveryData.endStorageId,
          receiver: this.deliveryData.receiver,
          note: this.deliveryData.note,
        };
      } else {
        this.params = {
          type: this.deliveryData.type,
          stockInList: this.deliveryData.stockInIdList,
          stockOutTime: this.deliveryData.stockOutTime,
          endStorageId: this.deliveryData.endStorageId,
          solder: this.deliveryData.solder,
          group: this.deliveryData.group,
          customer: this.deliveryData.customer,
          saleMoney: this.deliveryData.saleMoney,
          saleCurrency: this.deliveryData.saleCurrency,
          receiver: this.deliveryData.receiver,
          note: this.deliveryData.note,
          totalToCnRate: this.deliveryData.totalToCnRate,
          sellTotalCnPrice: this.deliveryData.sellTotalCnPrice,
          totalToHkRate: this.deliveryData.totalToHkRate,
          sellTotalHkPrice: this.deliveryData.sellTotalHkPrice,
          sellBillNumber: this.deliveryData.sellBillNumber,
          consumerUserId: this.deliveryData.user,
          deductedPoints: this.deliveryData.integral,
        };
      }

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post(this.$store.state.baseUrl + "/materialOutDo", this.params)
            .then((res) => {
              console.log("成品提交");
              console.log(res);
              this.$message.success({
                message: "提交成功",
                showClose: true,
                duration: 1500,
              });
              this.backList();
              this.warehouseKeywordCheck();
            })
            .catch((err) => {
              console.log(err);
              this.$message.error({
                message: err.data.message,
                showClose: true,
                duration: 1500,
              });
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
        this.deliveryData.type = 1;
        this.deliveryData.endStorageId = "";
        this.deliveryData.solder = "";
        this.deliveryData.group = "";
        this.deliveryData.customer = "";
        this.deliveryData.saleMoney = "";
        this.deliveryData.saleCurrency = "CNY";

        this.deliveryData.stockOutTime = "";
        this.deliveryData.receiver = "";
        this.deliveryData.note = "";
        this.deliveryData.totalToCnRate = "";
        this.deliveryData.sellTotalCnPrice = "";
        this.deliveryData.totalToHkRate = "";
        this.deliveryData.sellTotalHkPrice = "";
        this.deliveryData.sellBillNumber = "";
        this.deliveryData.stockInIdList = [];
        this.deliveryData.phoneNumber = "";
        this.deliveryData.user = "";
        this.userList = [];
        this.integralTotal = "";
        this.deliveryData.integral = "";

        this.$refs.deliveryForm.clearValidate();
        this.siteSel = 2;

        this.deliveryData.stockInIdList.push({
          id: val.id,
          designName: val.designName,
          img:
            val.img == "" || val.img == null
              ? ""
              : val.img.indexOf("|") == -1
              ? val.img
              : val.img.split("|")[0],
          productNumber: val.productNumber,
          number: 1,
        });
      }
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
    firstimg(str) {
      let img = str;
      if (str.indexOf("|") !== -1) {
        let ll = str.substring(0, str.indexOf("|"));
        img = ll;
        return img;
      } else {
        return img;
      }
    },
    imgFillter(img) {
      let list = [];
      if (img !== null && img !== "") {
        if (img.indexOf("|") !== -1) {
          list = img.split("|");
        } else {
          list.push(img);
        }
      } else {
        list = [];
      }

      return list;
    },
    // 设计稿列表
    getproducibleDesignList() {
      console.log(this.designListKeyword);
      this.$axios
        .get(this.$store.state.baseUrl + "/producibleDesignList", {
          params: {
            keyword: this.designListKeyword,
            status: this.statusDesign,
          },
        })
        .then((res) => {
          console.log("设计列表");
          console.log(res);
          this.producibleDesignList = res.data.list;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //选择设计图片
    chooseimglist(row) {
      if (row != null) {
        console.log(row);
        this.deviceDetail.designId = row.id;
        this.deviceDetail.designName = row.name;
        this.deviceDetail.designerName = row.designerName;
        let list = [];
        for (const item of row.img.split("|")) {
          if (item != "") {
            list.push(this.img + "/file/" + item);
          }
        }

        this.deviceDetail.designImg = list.join("|");
      }
    },
    //关闭
    handleClose() {
      this.$refs.multipleTableDesign.clearSelection();
      this.chooseimgshow = false;
    },
    // 上传图片
    inputChange(e) {
      this.imgSortList = [];
      this.count = 0;
      console.log(e);
      let files = e.target.files;
      this.imgSortList.length = files.length;
      console.log(this.imgSortList.length);
      let that = this;
      if (files === undefined) {
        return;
      }

      for (let i = 0; i < files.length; i++) {
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
              that.uploadLice(bl, i); // 请求图片上传接口
            }
          );
        } else {
          // 小于等于1M 原图上传
          this.uploadLice(files[i], i);
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
      let that = this;
      let ready = new FileReader();
      /* 开始读取指定File对象中的内容. 读取操作完成时,返回一个URL格式的字符串. */
      ready.readAsDataURL(file);
      ready.onload = function() {
        let re = this.result;
        that.canvasDataURL(re, obj, callback); // 开始压缩
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
    uploadLice(file, i) {
      console.log(file);
      let formdata = new FormData(); //创建form对象
      formdata.append("file", file); //通过append向form对象添加数据

      this.$axios
        .post(this.$store.state.baseUrl + "/upload", formdata)
        .then((res) => {
          if (res.status == 200) {
            this.$message.success({
              message: "图片上传成功",
              showClose: true,
              duration: 2000,
            });
          }
          console.log(res);
          let imgurl = res.data.fileName;

          if (this.productimgList.indexOf(imgurl) == -1) {
            this.imgSortList.splice(i, 1, imgurl);
            this.count++;
          }

          if (this.count === this.imgSortList.length) {
            this.productimgList = this.productimgList.concat(this.imgSortList);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error({
            message: err.message,
            showClose: true,
            duration: 2000,
          });
        });
    },
    // 删除图片
    delImage(index) {
      this.productimgList.splice(index, 1);
    },
    // 详情图片
    // 上传图片
    inputChange2(e) {
      this.imgSortList = [];
      this.count = 0;
      console.log(e);
      let files = e.target.files;
      this.imgSortList.length = files.length;
      console.log(this.imgSortList.length);
      let that = this;
      if (files === undefined) {
        return;
      }

      for (let i = 0; i < files.length; i++) {
        if (files[i].size / 1024 > 1025) {
          // 文件大于1M（根据需求更改），进行压缩上传
          this.photoCompress2(
            files[i],
            {
              // 调用压缩图片方法
              quality: 0.7,
            },
            (base64Codes) => {
              // console.log("压缩后：" + base.length / 1024 + " " + base);
              let bl = that.base64UrlToBlob2(base64Codes);
              that.uploadLice2(bl, i); // 请求图片上传接口
            }
          );
        } else {
          // 小于等于1M 原图上传
          this.uploadLice2(files[i], i);
        }
      }

      e.target.value = "";
    },
    // base64 转 Blob 格式 和file格式
    base64UrlToBlob2(urlData) {
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
    photoCompress2(file, obj, callback) {
      let that = this;
      let ready = new FileReader();
      /* 开始读取指定File对象中的内容. 读取操作完成时,返回一个URL格式的字符串. */
      ready.readAsDataURL(file);
      ready.onload = function() {
        let re = this.result;
        that.canvasDataURL2(re, obj, callback); // 开始压缩
      };
    },
    /* 利用canvas数据化图片进行压缩 */
    /* 图片转base64 */
    canvasDataURL2(path, obj, callback) {
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
    uploadLice2(file, i) {
      console.log(file);
      let formdata = new FormData(); //创建form对象
      formdata.append("file", file); //通过append向form对象添加数据

      this.$axios
        .post(this.$store.state.baseUrl + "/upload", formdata)
        .then((res) => {
          if (res.status == 200) {
            this.$message.success({
              message: "图片上传成功",
              showClose: true,
              duration: 2000,
            });
          }
          console.log(res);
          let imgurl = res.data.fileName;

          if (this.detailImgList.indexOf(imgurl) == -1) {
            this.imgSortList.splice(i, 1, imgurl);
            this.count++;
          }

          if (this.count === this.imgSortList.length) {
            this.detailImgList = this.detailImgList.concat(this.imgSortList);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error({
            message: err.message,
            showClose: true,
            duration: 2000,
          });
        });
    },
    // 删除图片
    delImage2(index) {
      this.detailImgList.splice(index, 1);
    },
    timechange() {
      console.log(this.time);
    },
    storageChange(e) {
      console.log(e);
      if (
        this.storageIdList.length > 1 &&
        this.storageIdList.indexOf(0) !== -1
      ) {
        if (this.storageIdList[this.storageIdList.length - 1] == 0) {
          this.storageIdList = [0];
        } else {
          this.storageIdList.splice(
            this.storageIdList.findIndex((item) => item === 0),
            1
          );
        }
      }
    },

    // 图形展示仓库/加工厂下的成品列表
    imgInquiryDetails(list, index) {
      sessionStorage.setItem("houseindex", index);
      this.imgMaterialList = [];
      this.imgMaterialList = list;
      this.multipleSelection = [];
      //清空选择
      this.$nextTick(() => {
        console.log(this.$refs.multipleTableSel);
        this.$refs.multipleTableSel.clearSelection();
      });
      this.siteSel = 1;
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
      this.multipleSelection = [];
    },
    // 模糊搜索
    warehouseKeywordCheck() {
      this.multipleSelection = [];
      this.stockInMsg = "数据加载中...";
      this.stockInList = [];
      this.imgMaterialList = [];
      this.$axios
        .post(this.$store.state.baseUrl + "/productList", {
          state: this.state,
          storageIdList:
            this.storageIdList.indexOf(0) == -1 ? this.storageIdList : [],
          startTime: this.time == null ? "" : this.time[0],
          endTime: this.time == null ? "" : this.time[1],
          keyword: this.keyword,
        })
        .then((res) => {
          console.log("成品列表查询");
          console.log(res);
          this.total = res.data.total;
          this.page = 1;
          this.stockInList = res.data.warehouseFactoryList;
          if (this.stockInList.length == 0) {
            this.stockInMsg = "暂无数据";
          } else {
            this.getList();
          }
          if (this.imgMaterialList !== []) {
            this.stockInList.forEach((e, index) => {
              if (index == sessionStorage.getItem("houseindex")) {
                this.imgMaterialList = e.productList;
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 查看成品详情
    checkproductDetails(val, column) {
      if (column.label == "出库") {
        this.handleImgSelectionChange(val);
      }
    },
    dblProductDetails(val, column) {
      if (column.label !== "出库") {
        this.deviceDetail = {};
        this.activeStockName = "first";
        this.isUpdate = 0;
        this.$axios
          .post(this.$store.state.baseUrl + "/productInfo", {
            id: val.id,
          })
          .then((res) => {
            console.log("成品详情");
            console.log(res);
            this.deviceDetail = res.data;
            this.dialogDeviceDetailVisible = true;
            this.productimgList = [];
            if (
              this.deviceDetail.img !== null &&
              this.deviceDetail.img !== ""
            ) {
              if (this.deviceDetail.img.indexOf("|") !== -1) {
                this.productimgList = this.deviceDetail.img.split("|");
              } else {
                this.productimgList.push(this.deviceDetail.img);
              }
            } else {
              this.productimgList = [];
            }

            this.detailImgList = [];
            if (
              this.deviceDetail.detailImg !== null &&
              this.deviceDetail.detailImg !== ""
            ) {
              if (this.deviceDetail.detailImg.indexOf("|") !== -1) {
                this.detailImgList = this.deviceDetail.detailImg.split("|");
              } else {
                this.detailImgList.push(this.deviceDetail.detailImg);
              }
            } else {
              this.detailImgList = [];
            }

            this.labelSelList = [];
            if (
              this.deviceDetail.productLabel !== null &&
              this.deviceDetail.productLabel !== ""
            ) {
              if (this.deviceDetail.productLabel.indexOf("|") !== -1) {
                this.labelSelList = this.deviceDetail.productLabel.split("|");
              } else {
                this.labelSelList.push(this.deviceDetail.productLabel);
              }
            } else {
              this.labelSelList = [];
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    //查看原材料详情
    checkDeviceDetails(row) {
      this.activeName = "ff";
      this.deviceDetails = {};
      this.$axios
        .post(this.$store.state.baseUrl + "/stockMaterialInfo", {
          id: row.id,
        })
        .then((res) => {
          console.log("材料详情");
          console.log(res);
          this.deviceDetails = res.data;
          this.imgList = [];
          if (
            this.deviceDetails.img !== null &&
            this.deviceDetails.img !== ""
          ) {
            if (this.deviceDetails.img.indexOf("|") !== -1) {
              this.imgList = this.deviceDetails.img.split("|");
            } else {
              this.imgList.push(this.deviceDetails.img);
            }
          } else {
            this.imgList = [];
          }
          this.dialogDeviceDetailsVisible = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 修改成品
    updateDevice() {
      this.isUpdate = 1;
    },
    // 获取仓库/加工厂列表
    getWarehouseFactoryList() {
      this.$axios
        .post(this.$store.state.baseUrl + "/warehouseFactoryList")
        .then((res) => {
          console.log("仓库/加工厂");
          console.log(res);
          let list = res.data;
          this.storageList = this.storageList.concat(list);
          this.warehouseFilterList = list;
          console.log(this.storageList);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 确定
    inventoryLookSure() {
      console.log(this.deviceDetail);
      if (this.isUpdate == 0) {
        this.dialogDeviceDetailVisible = false;
      } else {
        this.params = {};
        this.params = {
          id: this.deviceDetail.id,
          productName: this.deviceDetail.productName,
          processCost: this.deviceDetail.processCost,
          designId: this.deviceDetail.designId,
          note: this.deviceDetail.note,
          solder: this.deviceDetail.solder,
          group: this.deviceDetail.group,
          customer: this.deviceDetail.customer,
          saleMoney: this.deviceDetail.saleMoney,
          saleCurrency: this.deviceDetail.saleCurrency,
          receiver: this.deviceDetail.receiver,
          totalToCnRate: this.deviceDetail.totalToCnRate,
          sellTotalCnPrice: this.deviceDetail.sellTotalCnPrice,
          totalToHkRate: this.deviceDetail.totalToHkRate,
          sellTotalHkPrice: this.deviceDetail.sellTotalHkPrice,
          sellBillNumber: this.deviceDetail.sellBillNumber,
          currency: this.deviceDetail.currency,
          productNumber: this.deviceDetail.productNumber,
          costPrice: this.deviceDetail.costPrice,
          lowestSellPrice: this.deviceDetail.lowestSellPrice,
          adviseSellPrice: this.deviceDetail.adviseSellPrice,
          tagPrice: this.deviceDetail.tagPrice,
          adviceWholesalePrice: this.deviceDetail.adviceWholesalePrice,
          saleCommission: this.deviceDetail.saleCommission,
          img: this.productimgList.join("|"),
          params: this.deviceDetail.params,
          certificateNumber: this.deviceDetail.certificateNumber,
          totalPriceNote: this.deviceDetail.totalPriceNote,
          totalCnRate: this.deviceDetail.totalCnRate,
          totalCnPrice: this.deviceDetail.totalCnPrice,
          totalHkRate: this.deviceDetail.totalHkRate,
          totalHkPrice: this.deviceDetail.totalHkPrice,
          productLabel: this.labelSelList.join("|"),
          detailImg: this.detailImgList.join("|"),
        };
        this.$axios
          .post(this.$store.state.baseUrl + "/productSave", this.params)
          .then((res) => {
            console.log("修改成品信息");
            console.log(res);
            this.$message.success({
              message: "修改成功",
              showClose: true,
              duration: 2000,
            });
            this.dialogDeviceDetailVisible = false;
            this.warehouseKeywordCheck();
          })
          .catch((err) => {
            console.log(err);
            this.$message.error({
              message: err.data.message,
              showClose: true,
              duration: 2000,
            });
          });
      }
    },
    // 分页处理数据
    getList() {
      console.log("分页数据", this.pageNum);
      this.stockListPage = [];
      console.log(this.stockInList);
      this.total = this.stockInList.length;
      // es6过滤得到满足搜索条件的展示数据list
      this.stockListPage = this.stockInList.filter(
        (item, index) =>
          index < this.page * this.pageNum &&
          index >= this.pageNum * (this.page - 1)
      );
      console.log(this.stockListPage);
    },
    // 分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.getList();
      document.getElementById("stock-inquiry").scrollIntoView();
      // (function smoothscroll() {
      //   let currentScroll =
      //     document.documentElement.scrollTop || document.body.scrollTop;
      //   if (currentScroll > 0) {
      //     window.requestAnimationFrame(smoothscroll);
      //     window.scrollTo(0, currentScroll - currentScroll / 5);
      //   }
      // })();
    },
    // 获取标签列表
    getLabelList() {
      this.$axios
        .get(this.$store.state.baseUrl + "/tagList")
        .then((res) => {
          console.log("标签列表");
          console.log(res);
          this.productLabelList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped lang="scss">
.add-left {
  width: 80%;
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
          line-height: 40px;
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

  .stock-inquiry-main-phone {
    margin-top: 20px;
    background-color: #fff;
    border-radius: 6px;

    .svg-style-phone {
      width: auto;
      padding: 20px;
      padding-top: 0;
      overflow: hidden;
      position: relative;

      .border-every-style-phone {
        display: flex;
        flex-wrap: wrap;

        .border-style-phone {
          min-width: 40vw;
          height: 20vw;
          padding: 10px;
          line-height: 20vw;
          border: 2px solid #3d81fd;
          background-color: #e3edff;
          border-radius: 8px;
          font-size: 10vw;
          font-weight: 600;
          cursor: pointer;
        }

        .every-style-phone {
          width: 20vw;
          height: 3px;
          margin-top: 12vw;
          background-color: #3d81fd;
        }
      }
    }

    .phone-every {
      width: 98%;
      padding: 20px 10px;
      margin: 0 auto;
      margin-bottom: 20px;
      border: 2px solid #ccc;
      border-radius: 4px;

      .every-thead {
        width: 50%;
        font-size: 12vw;
        color: #666;
      }

      .every-td {
        font-size: 9vw;
        color: #666;
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
  .div-one-note {
    height: 100px;
    display: flex;
    line-height: 100px;
    border-bottom: 1px solid #ccc;
    .one-left {
      width: 140px;
      border-right: 1px solid #ccc;
      text-align: center;
      background-color: #f2f2f2;
    }
    .one-right {
      width: 373px;
      padding-left: 10px;
    }
  }
  .div-one {
    // height: 34px;
    display: flex;
    line-height: 34px;
    border-bottom: 1px solid #ccc;

    .one-left {
      width: 140px;
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
}

.upload-imgs {
  position: relative;
  display: flex;
  .delImg {
    margin: 0 10px 10px 0;
  }
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
.el-table--enable-row-transition .el-table__body td {
  text-align: center;
}
.el-table td,
.el-table th.is-leaf {
  text-align: center;
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
