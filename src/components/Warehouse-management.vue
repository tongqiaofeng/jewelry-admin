<template>
  <div class="warehouse-management-container" id="warehouse">
    <!-- <h1>原材料出库管理</h1> -->
    <div style="margin-top: 20px;">
      <div class="materials-apply-add">
        <div class="add-left">
          <p class="title-font">待出库清单</p>
          <el-table
            :data="deliveryData.stockInIdList"
            style="width: 100%"
            border
            id="left"
          >
            <el-table-column prop="materialName" label="材料名称">
            </el-table-column>
            <el-table-column prop="productNumber" label="统一编号">
            </el-table-column>
            <el-table-column label="库存总数量">
              <template slot-scope="scope">
                <div>
                  <span>{{
                    scope.row.chargeUnit == "粒"
                      ? scope.row.totalNum + " " + scope.row.chargeUnit
                      : scope.row.totalNum
                  }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="库存总重量">
              <template slot-scope="scope">
                <div>
                  <span>{{
                    scope.row.totalWeight == 0
                      ? scope.row.totalWeight
                      : scope.row.totalWeight + " " + scope.row.chargeUnit
                  }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="出库数量" width="130">
              <template slot-scope="scope">
                <div class="num">
                  <!-- :disabled="scope.row.chargeUnit !== '粒' ? scope.row.chargeUnit!=='件'?true:false : false" -->
                  <el-input
                    v-model="scope.row.number"
                    @input="changeNum(scope.$index)"
                    ><i
                      slot="suffix"
                      style="color: #606266;margin-right:10%;font-style:normal;"
                      >{{
                        scope.row.chargeUnit == "粒"
                          ? scope.row.chargeUnit
                          : scope.row.chargeUnit == "件"
                          ? scope.row.chargeUnit
                          : ""
                      }}</i
                    >
                  </el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="出库重量" width="130">
              <template slot-scope="scope">
                <div class="num">
                  <!-- :readonly="true" -->
                  <el-input
                    v-model="scope.row.weight"
                    @input="changeWeight(scope.$index)"
                    ><i
                      slot="suffix"
                      style="color: #606266;margin-right:10%;font-style:normal;"
                      >{{
                        scope.row.chargeUnit !== "粒"
                          ? scope.row.chargeUnit != "件"
                            ? scope.row.chargeUnit
                            : ""
                          : ""
                      }}</i
                    >
                  </el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="移除材料" width="120">
              <template slot-scope="scope">
                <div class="num">
                  <el-button
                    type="text"
                    style="color: red;"
                    @click="delNum(scope.$index)"
                    >移除</el-button
                  >
                </div>
              </template>
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
                placeholder="请选择"
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
                placeholder="请输入"
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
                placeholder="请输入"
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
                placeholder="请选择"
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
            <el-form-item label="备注：" prop="note">
              <el-input
                type="textarea"
                class="input-style"
                v-model="deliveryData.note"
              ></el-input>
            </el-form-item>
          </el-form>
          <div style="margin-top: 30px;text-align: right;">
            <el-button
              style="width: 120px;"
              type="primary"
              @click="stockInSubmit('deliveryForm')"
              v-preventClick
              >提 交</el-button
            >
          </div>
        </div>
        <div class="add-right">
          <div>
            <p class="title-font">库存查询</p>
            <div>
              <el-form label-width="110px">
                <el-form-item label="仓库/加工厂：" required>
                  <el-select
                    style="width:66%;"
                    v-model="storageIdList"
                    multiple
                    placeholder="可多选"
                    @change="storageIdChangeList"
                    :popper-append-to-body="false"
                  >
                    <el-option
                      v-for="item in warehouseList"
                      v-show="item.isOwn == 1 || item.id == 0"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="关键字：">
                  <el-input
                    style="width:66%;"
                    v-model="warehouseKeyword"
                    @change="keywordChange"
                    placeholder="可输入材料名称、统一编号、备注进行搜索"
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
            highlight-current-row
            @row-click="handleDeviceListChange"
            @row-dblclick="dblDeviceListChange"
            style="width: 100%"
            border
          >
            <el-table-column prop="materialName" label="材料名称">
            </el-table-column>
            <el-table-column prop="productNumber" label="统一编号">
            </el-table-column>
            <el-table-column label="现存仓库">
              <template slot-scope="scope">
                <div>
                  <span>{{ scope.row.storageName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="库存总数量">
              <template slot-scope="scope">
                <div>
                  <span>{{
                    scope.row.weight !== 0
                      ? scope.row.number
                      : scope.row.number + " " + scope.row.chargeUnit
                  }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="库存总重量">
              <template slot-scope="scope">
                <div>
                  <span>{{
                    scope.row.weight == 0
                      ? "--"
                      : scope.row.weight + " " + scope.row.chargeUnit
                  }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="text">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog
            v-if="dialogInventoryCheckVisible"
            id="msg"
            title="材料信息"
            :visible.sync="dialogInventoryCheckVisible"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            :append-to-body="false"
          >
            <div id="invenSome">
              <el-tabs style="margin-top: -10px;" v-model="activeStockName">
                <el-tab-pane label="材料信息" name="first">
                  <div style="display: flex;justify-content: space-between;">
                    <p class="font-title-style" style="margin-top: 0;">
                      材料信息
                    </p>
                    <div style="padding-top: 6px;">
                      <img
                        style="cursor: pointer;"
                        title="修改材料信息"
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
                          color: '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        材料名称
                      </div>
                      <div class="one-right">
                        <el-input
                          v-model="inventoryCheckDetail.materialName"
                          readonly
                        ></el-input>
                      </div>
                    </div>
                    <div class="div-one">
                      <div
                        class="one-left"
                        :style="{
                          color: '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        仓库/加工厂
                      </div>
                      <div class="one-right">
                        <el-input
                          v-model="inventoryCheckDetail.storageName"
                          readonly
                        ></el-input>
                      </div>
                    </div>
                    <div class="div-one">
                      <div
                        class="one-left"
                        :style="{
                          color: '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        统一编号
                      </div>
                      <div class="one-right">
                        <el-input
                          v-model="inventoryCheckDetail.productNumber"
                          readonly=""
                        >
                        </el-input>
                      </div>
                    </div>
                    <div class="div-one" v-show="certificateshow2 == false">
                      <div
                        class="one-left"
                        :style="{
                          color:
                            isUpdate == 0
                              ? '#606266'
                              : inventoryCheckDetail.isUpdate !== 2
                              ? '#3d82fe'
                              : '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        形状
                      </div>
                      <div class="one-right">
                        <el-input
                          :readonly="
                            isUpdate == 0
                              ? true
                              : inventoryCheckDetail.isUpdate !== 2
                              ? false
                              : true
                          "
                          v-model="inventoryCheckDetail.shape"
                          clearable
                        >
                        </el-input>
                      </div>
                    </div>
                    <div class="div-one" v-show="certificateshow2 == false">
                      <div
                        class="one-left"
                        :style="{
                          color:
                            isUpdate == 0
                              ? '#606266'
                              : inventoryCheckDetail.isUpdate !== 2
                              ? '#3d82fe'
                              : '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        产品类型
                      </div>
                      <div class="one-right">
                        <el-input
                          :readonly="
                            isUpdate == 0
                              ? true
                              : inventoryCheckDetail.isUpdate !== 2
                              ? false
                              : true
                          "
                          v-model="inventoryCheckDetail.productType"
                          clearable
                        >
                        </el-input>
                      </div>
                    </div>
                    <div class="div-one" v-show="certificateshow2 == false">
                      <div
                        class="one-left"
                        :style="{
                          color:
                            isUpdate == 0
                              ? '#606266'
                              : inventoryCheckDetail.isUpdate !== 2
                              ? '#3d82fe'
                              : '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        产地
                      </div>
                      <div class="one-right">
                        <el-input
                          :readonly="
                            isUpdate == 0
                              ? true
                              : inventoryCheckDetail.isUpdate !== 2
                              ? false
                              : true
                          "
                          v-model="inventoryCheckDetail.productArea"
                          clearable
                        >
                        </el-input>
                      </div>
                    </div>
                    <div class="div-one" v-show="certificateshow2 == false">
                      <div
                        class="one-left"
                        :style="{
                          color:
                            isUpdate == 0
                              ? '#606266'
                              : inventoryCheckDetail.isUpdate !== 2
                              ? '#3d82fe'
                              : '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        尺寸/毫米
                      </div>
                      <div class="one-right">
                        <el-input
                          :readonly="
                            isUpdate == 0
                              ? true
                              : inventoryCheckDetail.isUpdate !== 2
                              ? false
                              : true
                          "
                          v-model="inventoryCheckDetail.size"
                          clearable
                        >
                        </el-input>
                      </div>
                    </div>
                    <div class="div-one" v-show="certificateshow2 == false">
                      <div
                        class="one-left"
                        :style="{
                          color:
                            isUpdate == 0
                              ? '#606266'
                              : inventoryCheckDetail.isUpdate !== 2
                              ? '#3d82fe'
                              : '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        颜色
                      </div>
                      <div class="one-right">
                        <el-input
                          :readonly="
                            isUpdate == 0
                              ? true
                              : inventoryCheckDetail.isUpdate !== 2
                              ? false
                              : true
                          "
                          v-model="inventoryCheckDetail.color"
                          clearable
                        >
                        </el-input>
                      </div>
                    </div>
                    <div class="div-one" v-show="certificateshow2 == false">
                      <div
                        class="one-left"
                        :style="{
                          color:
                            isUpdate == 0
                              ? '#606266'
                              : inventoryCheckDetail.isUpdate !== 2
                              ? '#3d82fe'
                              : '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        配对
                      </div>
                      <div class="one-right">
                        <el-input
                          :readonly="
                            isUpdate == 0
                              ? true
                              : inventoryCheckDetail.isUpdate !== 2
                              ? false
                              : true
                          "
                          v-model="inventoryCheckDetail.paired"
                          clearable
                        >
                        </el-input>
                      </div>
                    </div>
                    <div class="div-one" v-show="certificateshow2 == false">
                      <div
                        class="one-left"
                        :style="{
                          color:
                            isUpdate == 0
                              ? '#606266'
                              : inventoryCheckDetail.isUpdate !== 2
                              ? '#3d82fe'
                              : '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        品质
                      </div>
                      <div class="one-right">
                        <el-input
                          :readonly="
                            isUpdate == 0
                              ? true
                              : inventoryCheckDetail.isUpdate !== 2
                              ? false
                              : true
                          "
                          v-model="inventoryCheckDetail.quality"
                          clearable
                        >
                        </el-input>
                      </div>
                    </div>
                    <div class="div-one" v-show="certificateshow2 == false">
                      <div
                        class="one-left"
                        :style="{
                          color:
                            isUpdate == 0
                              ? '#606266'
                              : inventoryCheckDetail.isUpdate !== 2
                              ? '#3d82fe'
                              : '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        品质细分
                      </div>
                      <div class="one-right">
                        <el-input
                          :readonly="
                            isUpdate == 0
                              ? true
                              : inventoryCheckDetail.isUpdate !== 2
                              ? false
                              : true
                          "
                          v-model="inventoryCheckDetail.subsection"
                          clearable
                        >
                        </el-input>
                      </div>
                    </div>
                    <div class="div-one" v-show="certificateshow2 == false">
                      <div
                        class="one-left"
                        :style="{
                          color:
                            isUpdate == 0
                              ? '#606266'
                              : inventoryCheckDetail.isUpdate !== 2
                              ? '#3d82fe'
                              : '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        盒子编号
                      </div>
                      <div class="one-right">
                        <el-input
                          :readonly="
                            isUpdate == 0
                              ? true
                              : inventoryCheckDetail.isUpdate !== 2
                              ? false
                              : true
                          "
                          v-model="inventoryCheckDetail.boxNumber"
                          clearable
                        >
                        </el-input>
                      </div>
                    </div>
                    <div class="div-one" v-show="certificateshow2 == false">
                      <div
                        class="one-left"
                        :style="{
                          color:
                            isUpdate == 0
                              ? '#606266'
                              : inventoryCheckDetail.isUpdate !== 2
                              ? '#3d82fe'
                              : '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        证书编号
                      </div>
                      <div class="one-right">
                        <el-input
                          :readonly="
                            isUpdate == 0
                              ? true
                              : inventoryCheckDetail.isUpdate !== 2
                              ? false
                              : true
                          "
                          v-model="inventoryCheckDetail.certificateNumber"
                          clearable
                        >
                        </el-input>
                      </div>
                    </div>
                    <div class="div-one" v-show="certificateshow2 == false">
                      <div
                        class="one-left"
                        :style="{
                          color:
                            isUpdate == 0
                              ? '#606266'
                              : inventoryCheckDetail.isUpdate !== 2
                              ? '#3d82fe'
                              : '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        发票号
                      </div>
                      <div class="one-right">
                        <el-input
                          :readonly="
                            isUpdate == 0
                              ? true
                              : inventoryCheckDetail.isUpdate !== 2
                              ? false
                              : true
                          "
                          v-model="inventoryCheckDetail.billNumber"
                          clearable
                        >
                        </el-input>
                      </div>
                    </div>
                  </div>
                  <p class="font-title-style">图片信息</p>
                  <div style="display:flex;">
                    <p
                      :style="{
                        color:
                          isUpdate == 0
                            ? '#606266'
                            : inventoryCheckDetail.isUpdate !== 2
                            ? '#3d82fe'
                            : '#606266',
                        fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        margin: 0,
                        width: '50px',
                      }"
                    >
                      图片：
                    </p>
                    <div class="upload-imgs">
                      <div
                        class="add"
                        v-show="
                          isUpdate == 1 && inventoryCheckDetail.isUpdate !== 2
                        "
                      >
                        <form
                          enctype="multipart/form-data"
                          style="width: 100px;"
                        >
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
                          v-for="(imgurl, index) of imgList"
                          :key="index"
                          style="margin-left:10px;position:relative;"
                        >
                          <span
                            v-if="imgurl !== '' && imgurl !== null"
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
                  </div>
                  <p class="font-title-style">备注信息</p>
                  <div class="font-div">
                    <div class="div-one-note" id="one-note">
                      <div
                        class="one-left"
                        :style="{
                          color:
                            isUpdate == 0
                              ? '#606266'
                              : inventoryCheckDetail.isUpdate !== 2
                              ? '#3d82fe'
                              : '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        产品备注
                      </div>
                      <div class="one-right">
                        <el-input
                          type="textarea"
                          v-model="inventoryCheckDetail.note"
                          :readonly="
                            isUpdate == 0
                              ? true
                              : inventoryCheckDetail.isUpdate !== 2
                              ? false
                              : true
                          "
                        >
                        </el-input>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="价格信息" name="third">
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
                    <div class="div-one" v-show="certificateshow2 == false">
                      <div
                        class="one-left"
                        :style="{
                          color: '#606266',
                          fontWeight: 'normal',
                        }"
                      >
                        计价单位
                      </div>
                      <div class="one-right">
                        <el-radio-group
                          v-model="inventoryCheckDetail.chargeUnit"
                          disabled
                        >
                          <el-radio label="粒">粒</el-radio>
                          <el-radio label="ct">ct</el-radio>
                          <el-radio label="g">g</el-radio>
                        </el-radio-group>
                      </div>
                    </div>
                    <div class="div-one" v-show="certificateshow2 == false">
                      <div
                        class="one-left"
                        :style="{
                          color:
                            isUpdate == 0
                              ? '#606266'
                              : inventoryCheckDetail.isUpdate !== 2
                              ? '#3d82fe'
                              : '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        单价
                      </div>
                      <div class="one-right">
                        <el-input
                          :readonly="
                            isUpdate == 0
                              ? true
                              : inventoryCheckDetail.isUpdate !== 2
                              ? false
                              : true
                          "
                          v-model="inventoryCheckDetail.unitPrice"
                          @input="priceTotal"
                          clearable
                        >
                        </el-input>
                      </div>
                    </div>
                    <div class="div-one" v-show="certificateshow2 == false">
                      <div
                        class="one-left"
                        :style="{
                          color:
                            isUpdate == 0
                              ? '#606266'
                              : inventoryCheckDetail.isUpdate !== 2
                              ? '#3d82fe'
                              : '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        币种
                      </div>
                      <div class="one-right">
                        <el-radio-group
                          v-model="inventoryCheckDetail.currency"
                          :disabled="
                            isUpdate == 0
                              ? true
                              : inventoryCheckDetail.isUpdate !== 2
                              ? false
                              : true
                          "
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
                          color:
                            isUpdate == 0
                              ? '#606266'
                              : inventoryCheckDetail.isUpdate == 0
                              ? '#3d82fe'
                              : '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        总数量
                      </div>
                      <div class="one-right">
                        <el-input
                          :readonly="
                            isUpdate == 0
                              ? true
                              : inventoryCheckDetail.isUpdate == 0
                              ? false
                              : true
                          "
                          v-model="inventoryCheckDetail.number"
                          clearable
                          ><i
                            slot="suffix"
                            v-if="inventoryCheckDetail.chargeUnit == '粒'"
                            style="color: #606266;font-style:normal;"
                            >{{ inventoryCheckDetail.chargeUnit }}</i
                          >
                        </el-input>
                      </div>
                    </div>
                    <div class="div-one" v-show="certificateshow2 == false">
                      <div
                        class="one-left"
                        :style="{
                          color:
                            isUpdate == 0
                              ? '#606266'
                              : inventoryCheckDetail.isUpdate !== 2
                              ? '#3d82fe'
                              : '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        总重量
                      </div>
                      <div class="one-right">
                        <el-input
                          :readonly="
                            isUpdate == 0
                              ? true
                              : inventoryCheckDetail.isUpdate !== 2
                              ? false
                              : true
                          "
                          v-model="inventoryCheckDetail.weight"
                          @input="priceTotal"
                          clearable
                          ><i
                            slot="suffix"
                            v-if="inventoryCheckDetail.chargeUnit != '粒'"
                            style="color: #606266;font-style:normal;"
                            >{{ inventoryCheckDetail.chargeUnit }}</i
                          >
                        </el-input>
                      </div>
                    </div>
                    <div class="div-one" v-show="certificateshow2 == false">
                      <div
                        class="one-left"
                        :style="{
                          color:
                            isUpdate == 0
                              ? '#606266'
                              : inventoryCheckDetail.isUpdate == 0
                              ? '#3d82fe'
                              : '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        总价
                      </div>
                      <div class="one-right">
                        <el-input
                          :readonly="
                            isUpdate == 0
                              ? true
                              : inventoryCheckDetail.isUpdate == 0
                              ? false
                              : true
                          "
                          v-model="inventoryCheckDetail.totalPrice"
                          clearable
                        >
                          <i
                            slot="suffix"
                            style="color: #606266;font-style:normal;"
                            >{{ inventoryCheckDetail.currency }}</i
                          >
                        </el-input>
                      </div>
                    </div>
                    <div class="div-one" v-show="certificateshow2 == false">
                      <div
                        class="one-left"
                        :style="{
                          color:
                            isUpdate == 0
                              ? '#606266'
                              : inventoryCheckDetail.isUpdate !== 2
                              ? '#3d82fe'
                              : '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        零售单价
                      </div>
                      <div class="one-right">
                        <el-input
                          :readonly="
                            isUpdate == 0
                              ? true
                              : inventoryCheckDetail.isUpdate !== 2
                              ? false
                              : true
                          "
                          v-model="inventoryCheckDetail.retailPrice"
                          clearable
                        >
                        </el-input>
                      </div>
                    </div>
                    <div class="div-one" v-show="certificateshow2 == false">
                      <div
                        class="one-left"
                        :style="{
                          color:
                            isUpdate == 0
                              ? '#606266'
                              : inventoryCheckDetail.isUpdate !== 2
                              ? '#3d82fe'
                              : '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        批发单价
                      </div>
                      <div class="one-right">
                        <el-input
                          :readonly="
                            isUpdate == 0
                              ? true
                              : inventoryCheckDetail.isUpdate !== 2
                              ? false
                              : true
                          "
                          v-model="inventoryCheckDetail.wholesalePrice"
                          clearable
                        >
                        </el-input>
                      </div>
                    </div>
                    <div class="div-one" v-show="certificateshow2 == false">
                      <div
                        class="one-left"
                        :style="{
                          color:
                            isUpdate == 0
                              ? '#606266'
                              : inventoryCheckDetail.isUpdate !== 2
                              ? '#3d82fe'
                              : '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        外币兑人民币汇率
                      </div>
                      <div class="one-right">
                        <el-input
                          :readonly="
                            isUpdate == 0
                              ? true
                              : inventoryCheckDetail.isUpdate !== 2
                              ? false
                              : true
                          "
                          v-model="inventoryCheckDetail.totalCnRate"
                          clearable
                        >
                        </el-input>
                      </div>
                    </div>
                    <div class="div-one" v-show="certificateshow2 == false">
                      <div
                        class="one-left"
                        :style="{
                          color:
                            isUpdate == 0
                              ? '#606266'
                              : inventoryCheckDetail.isUpdate !== 2
                              ? '#3d82fe'
                              : '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        总价人民币金额
                      </div>
                      <div class="one-right">
                        <el-input
                          :readonly="
                            isUpdate == 0
                              ? true
                              : inventoryCheckDetail.isUpdate !== 2
                              ? false
                              : true
                          "
                          v-model="inventoryCheckDetail.totalCnPrice"
                          clearable
                        >
                        </el-input>
                      </div>
                    </div>
                    <div class="div-one" v-show="certificateshow2 == false">
                      <div
                        class="one-left"
                        :style="{
                          color:
                            isUpdate == 0
                              ? '#606266'
                              : inventoryCheckDetail.isUpdate !== 2
                              ? '#3d82fe'
                              : '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        港币兑人民币汇率
                      </div>
                      <div class="one-right">
                        <el-input
                          :readonly="
                            isUpdate == 0
                              ? true
                              : inventoryCheckDetail.isUpdate !== 2
                              ? false
                              : true
                          "
                          v-model="inventoryCheckDetail.totalHkRate"
                          clearable
                        >
                        </el-input>
                      </div>
                    </div>
                    <div class="div-one" v-show="certificateshow2 == false">
                      <div
                        class="one-left"
                        :style="{
                          color:
                            isUpdate == 0
                              ? '#606266'
                              : inventoryCheckDetail.isUpdate !== 2
                              ? '#3d82fe'
                              : '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        总价港币金额
                      </div>
                      <div class="one-right">
                        <el-input
                          :readonly="
                            isUpdate == 0
                              ? true
                              : inventoryCheckDetail.isUpdate !== 2
                              ? false
                              : true
                          "
                          v-model="inventoryCheckDetail.totalHkPrice"
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
                          color:
                            isUpdate == 0
                              ? '#606266'
                              : inventoryCheckDetail.isUpdate !== 2
                              ? '#3d82fe'
                              : '#606266',
                          fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                        }"
                      >
                        成本备注
                      </div>
                      <div class="one-right">
                        <el-input
                          type="textarea"
                          v-model="inventoryCheckDetail.totalPriceNote"
                          :readonly="
                            isUpdate == 0
                              ? true
                              : inventoryCheckDetail.isUpdate !== 2
                              ? false
                              : true
                          "
                        >
                        </el-input>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="历史记录" name="second">
                  <p class="font-title-style" style="margin-top: 0;">
                    材料状态：{{
                      inventoryCheckDetail.state == 0
                        ? "库存中"
                        : inventoryCheckDetail.state == 1
                        ? "运输中"
                        : inventoryCheckDetail.state == 2
                        ? "加工中"
                        : inventoryCheckDetail.state == 3
                        ? "加工完成"
                        : "已出售"
                    }}
                  </p>
                  <el-timeline>
                    <el-timeline-item
                      color="#3d82fe"
                      size="large"
                      v-for="(activity,
                      index) in inventoryCheckDetail.stockInOutList"
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
                        <!-- <el-popover v-if="activity.note !== ''"
                                      placement="bottom-start"
                                      title="出库备注信息"
                                      width="200"
                                      trigger="hover"
                                      :content="activity.note">
                            <el-button slot="reference">备注</el-button>
                          </el-popover> -->
                      </p>
                    </el-timeline-item>
                  </el-timeline>
                </el-tab-pane>
              </el-tabs>
            </div>
            <div slot="footer">
              <el-button @click="dialogInventoryCheckVisible = false"
                >取 消</el-button
              >
              <el-button
                type="primary"
                @click="inventoryLookSure"
                v-preventClick
                >确 定</el-button
              >
            </div>
          </el-dialog>
          <div style="width: 100%;height: 50px;padding-bottom: 20px;">
            <div style="margin:40px 0 0;position:absolute;right:30px;">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-size="10"
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
export default {
  data() {
    return {
      img: this.$store.state.baseUrl,
      materialId: "",
      warehouseList: [
        {
          id: 0,
          name: "全部",
          type: 0,
        },
      ],
      storageIdList: [0],
      time: "",

      dialogDeviceCheckVisible: false,

      multipleSelection: [],
      deviceAllList: [],
      deviceFilterList: [],
      dialogDeliveryVisible: false,
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
        type: 0,
        endStorageId: "",
        solder: "", // 销售员
        group: "",
        customer: "",
        saleMoney: "",
        saleCurrency: "CNY",
        stockOutTime: "",
        receiver: "",
        note: "",
        stockInIdList: [],
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
      warehouseKeyword: "",
      page: 1,
      pageNum: 10,
      total: 0,
      certificateshow2: false,
      dialogInventoryCheckVisible: false,
      inventoryCheckDetail: {},

      isUpdate: 0,
      imgList: [],
      activeStockName: "first",

      params: {},
      warehouseFilterList: [],

      dialogFilterVisible: false,

      imgSortList: [],
      count: 0,
    };
  },
  created() {
    this.getWarehouseFactoryList();
  },
  mounted() {
    document.getElementById("warehouse").scrollIntoView();
  },
  methods: {
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
    // 出库类型变化
    typeChange() {
      this.$refs.deliveryForm.clearValidate();
    },
    // 材料出库
    stockInSubmit(formName) {
      if (this.deliveryData.stockInIdList.length == 0) {
        this.$message.warning({
          message: "请选择出库材料",
          showClose: true,
          duration: 2000,
        });
      } else {
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
          };
        }
        console.log(this.params);
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios
              .post(this.$store.state.baseUrl + "/materialOutDo", this.params)
              .then((res) => {
                console.log("材料出库");
                console.log(res);
                this.$message.success({
                  message: "出库成功",
                  showClose: true,
                  duration: 1500,
                });
                this.$refs.deliveryForm.resetFields();
                this.deliveryData.stockInIdList = [];
                this.warehouseCheck();
                document.getElementById("warehouse").scrollIntoView();
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
      }
    },
    // 数量变化
    changeNum(index) {
      console.log(index);
      if (this.deliveryData.stockInIdList[index].totalNum !== 0) {
        if (this.deliveryData.stockInIdList[index].number < 1) {
          this.$message.error({
            message: "出库数量最少为1",
            showClose: true,
            duration: 1500,
          });
        } else if (
          this.deliveryData.stockInIdList[index].number >
          this.deliveryData.stockInIdList[index].totalNum
        ) {
          this.$message.error({
            message: "出库数量不能大于库存总数量",
            showClose: true,
            duration: 1500,
          });
        }
      } else {
        this.$message.error({
          message: "该材料库存数量为0，不可出库",
          showClose: true,
          duration: 1500,
        });
      }
    },
    // 重量变化
    changeWeight(index) {
      if (this.deliveryData.stockInIdList[index].totalWeight !== 0) {
        if (this.deliveryData.stockInIdList[index].weight < 0) {
          this.$message.error({
            message: "出库重量不能为负",
            showClose: true,
            duration: 1500,
          });
        } else if (
          this.deliveryData.stockInIdList[index].weight >
          this.deliveryData.stockInIdList[index].totalWeight
        ) {
          this.$message.error({
            message: "出库重量不能大于库存总重量",
            showClose: true,
            duration: 1500,
          });
        } else if (this.deliveryData.stockInIdList[index].weight == 0) {
          this.$message.error({
            message: "出库重量不能为零",
            showClose: true,
            duration: 1500,
          });
        }
      } else {
        this.$message.error({
          message: "该材料库存重量为0，不可出库",
          showClose: true,
          duration: 1500,
        });
      }
    },
    // 删
    delNum(index) {
      this.deliveryData.stockInIdList.splice(index, 1);
    },
    // 选择出库材料
    handleDeviceListChange(row, column) {
      this.activeStockName = "first";
      if (column.label == "操作") {
        this.stockOutDetails(row);
      }
    },
    dblDeviceListChange(row) {
      if (this.deliveryData.stockInIdList.length == 0) {
        let num = "";
        if (row.chargeUnit == "件") {
          num = 1;
        } else {
          num = row.number;
        }
        this.deliveryData.stockInIdList.push({
          id: row.id,
          materialName: row.materialName,
          productNumber: row.productNumber,
          number: num,
          weight: row.weight,
          totalNum: row.number,
          totalWeight: row.weight,
          chargeUnit: row.chargeUnit,
        });
      } else {
        console.log(this.filterSel(row));
        if (this.filterSel(row)) {
          this.$message.error({
            message: "请勿重复添加",
            showClose: true,
            duration: 2000,
          });
        } else {
          let num = "";
          if (row.chargeUnit == "件") {
            num = 1;
          } else {
            num = row.number;
          }
          this.deliveryData.stockInIdList.push({
            id: row.id,
            materialName: row.materialName,
            productNumber: row.productNumber,
            number: num,
            weight: row.weight,
            totalNum: row.number,
            totalWeight: row.weight,
            chargeUnit: row.chargeUnit,
          });
        }
      }
    },
    filterSel(val) {
      console.log("222222222222222");
      console.log(val.id);
      console.log(this.deliveryData.stockInIdList);
      for (const item of this.deliveryData.stockInIdList) {
        console.log("-------------");
        console.log(item.id);
        if (item.id == val.id) {
          console.log("==================");
          return true;
        }
      }
      return false;
    },
    // 修改查看材料
    stockOutDetails(row) {
      console.log(row);
      this.inventoryCheckDetail = {};

      this.isUpdate = 0;
      this.$axios
        .post(this.$store.state.baseUrl + "/stockMaterialInfo", {
          id: row.id,
        })
        .then((res) => {
          console.log("材料详情");
          console.log(res);
          this.inventoryCheckDetail = res.data;
          if (this.inventoryCheckDetail.materialId == 11) {
            this.certificateshow2 = true;
          } else {
            this.certificateshow2 = false;
          }
          this.imgList = [];
          if (
            this.inventoryCheckDetail.img !== null &&
            this.inventoryCheckDetail.img !== ""
          ) {
            if (this.inventoryCheckDetail.img.indexOf("|") !== -1) {
              this.imgList = this.inventoryCheckDetail.img.split("|");
            } else {
              this.imgList.push(this.inventoryCheckDetail.img);
            }
          } else {
            this.imgList = [];
          }
          this.dialogInventoryCheckVisible = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 修改时材料名称变化
    materialUpdateChange(item) {
      this.inventoryCheckDetail.chargeUnit = item.chargeUnit;
    },
    priceTotal() {
      this.inventoryCheckDetail.totalPrice = 0;
      if (this.inventoryCheckDetail.chargeUnit == "粒") {
        this.inventoryCheckDetail.totalPrice = (
          this.inventoryCheckDetail.unitPrice * this.inventoryCheckDetail.number
        ).toFixed(2);
      } else {
        this.inventoryCheckDetail.totalPrice = (
          this.inventoryCheckDetail.unitPrice * this.inventoryCheckDetail.weight
        ).toFixed(2);
      }
    },
    updateDevice() {
      this.isUpdate = 1;
    },
    // 确定
    inventoryLookSure() {
      if (this.isUpdate == 0) {
        this.dialogInventoryCheckVisible = false;
      } else {
        this.$axios
          .post(this.$store.state.baseUrl + "/materialSave", {
            id: this.inventoryCheckDetail.id,
            materialId: this.inventoryCheckDetail.materialId,
            storageId: this.inventoryCheckDetail.storageId,
            productType: this.inventoryCheckDetail.productType,
            productArea: this.inventoryCheckDetail.productArea,
            billNumber: this.inventoryCheckDetail.billNumber,
            shape: this.inventoryCheckDetail.shape,
            unitPrice: this.inventoryCheckDetail.unitPrice,
            currency: this.inventoryCheckDetail.currency,
            number: this.inventoryCheckDetail.number,
            weight: this.inventoryCheckDetail.weight,
            totalPrice: this.inventoryCheckDetail.totalPrice,
            retailPrice: this.inventoryCheckDetail.retailPrice,
            wholesalePrice: this.inventoryCheckDetail.wholesalePrice,
            size: this.inventoryCheckDetail.size,
            color: this.inventoryCheckDetail.color,
            paired: this.inventoryCheckDetail.paired,
            quality: this.inventoryCheckDetail.quality,
            subsection: this.inventoryCheckDetail.subsection,
            boxNumber: this.inventoryCheckDetail.boxNumber,
            certificateNumber: this.inventoryCheckDetail.certificateNumber,
            productNumber: this.inventoryCheckDetail.productNumber,
            totalPriceNote: this.inventoryCheckDetail.totalPriceNote,
            totalCnRate: this.inventoryCheckDetail.totalCnRate,
            totalCnPrice: this.inventoryCheckDetail.totalCnPrice,
            totalHkRate: this.inventoryCheckDetail.totalHkRate,
            totalHkPrice: this.inventoryCheckDetail.totalHkPrice,
            note: this.inventoryCheckDetail.note,
            img: this.imgList.join("|"),
          })
          .then((res) => {
            console.log("修改材料信息");
            console.log(res);
            this.$message.success({
              message: "修改成功",
              showClose: true,
              duration: 2000,
            });
            this.dialogInventoryCheckVisible = false;
            this.warehouseCheck();
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
    // 模糊搜索
    keywordChange() {
      this.page = 1;
    },
    warehouseCheck() {
      this.deviceAllList = [];
      this.$axios
        .post(this.$store.state.baseUrl + "/stockMaterialList", {
          storageIdList:
            this.storageIdList.indexOf(0) == -1 ? this.storageIdList : [],
          state: 0,
          keyword: this.warehouseKeyword,
          page: this.page,
          pageNum: this.pageNum,
        })
        .then((res) => {
          console.log("条件查找库存列表");
          console.log(res);
          this.total = res.data.total;
          this.page = 1;
          for (const ite of res.data.warehouseFactoryList) {
            this.deviceAllList = this.deviceAllList.concat(ite.materialList);
          }
          console.log(this.deviceAllList);
          this.dialogFilterVisible = false;
          this.handleCurrentChange(1);
        })
        .catch((err) => {
          console.log(err);
          this.$message.error({
            message: err.data.message,
            showClose: true,
            duration: 2000,
          });
          this.dialogFilterVisible = false;
        });
    },
    storageIdChangeList() {
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
    // 分页处理数据
    getList() {
      console.log("分页数据");
      this.deviceFilterList = [];
      console.log(this.deviceAllList);
      this.total = this.deviceAllList.length;
      // es6过滤得到满足搜索条件的展示数据list
      this.deviceFilterList = this.deviceAllList.filter(
        (item, index) =>
          index < this.page * this.pageNum &&
          index >= this.pageNum * (this.page - 1)
      );
      console.log(this.deviceFilterList);
    },
    // 分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.getList();
      // (function smoothscroll() {
      //   let currentScroll =
      //     document.documentElement.scrollTop || document.body.scrollTop;
      //   if (currentScroll > 0) {
      //     window.requestAnimationFrame(smoothscroll);
      //     window.scrollTo(0, currentScroll - currentScroll / 5);
      //   }
      // })();
      document.getElementById("warehouse").scrollIntoView();
    },
    // 获取仓库/加工厂列表
    getWarehouseFactoryList() {
      this.$axios
        .post(this.$store.state.baseUrl + "/warehouseFactoryList")
        .then((res) => {
          console.log("仓库/加工厂");
          console.log(res);
          let list = res.data;
          this.warehouseFilterList = list;
          this.warehouseList = this.warehouseList.concat(list);
          console.log(this.warehouseList);
          this.warehouseCheck();
          this.storageIdChangeList();
        })
        .catch((err) => {
          console.log(err);
        });
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

          if (this.dialogInventoryCheckVisible == true) {
            if (this.imgList.indexOf(imgurl) == -1) {
              this.imgSortList.splice(i, 1, imgurl);
              this.count++;
            }
          }

          if (this.count === this.imgSortList.length) {
            if (this.dialogInventoryCheckVisible == true) {
              this.imgList = this.imgList.concat(this.imgSortList);
            }
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
      if (this.dialogInventoryCheckVisible == true && this.isUpdate == 1) {
        this.imgList.splice(index, 1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.warehouse-management-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 6px;
  text-align: left;

  .input-style {
    width: 100%;
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

  .materials-apply-add {
    display: flex;
    justify-content: space-between;

    .add-left {
      width: 55%;
      text-align: left;

      .num span {
        cursor: pointer;
        font-size: 16px;
      }
    }

    .add-right {
      width: 44%;
      text-align: left;
    }
  }

  .title-font {
    height: 48px;
    margin: 0;
    text-align: left;
    color: #6a6a6a;
    font-size: 18px;
    font-weight: bold;
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
}
</style>
<style lang="scss">
#msg {
  .el-dialog__body {
    height: 500px;
    overflow: auto;
  }
}

#invenSome {
  .el-button {
    border: none;
    padding: 0;
  }

  .el-input__inner {
    width: 100%;
    height: 34px !important;
    padding-left: 0;
    line-height: 34px !important;
    border: none;
    border-radius: 0;
  }

  .el-input__icon {
    height: 100%;
    width: 25px;
    text-align: center;
    transition: all 0.3s;
    line-height: 34px;
  }

  .el-input--prefix .el-input__inner {
    padding-left: 30px;
  }

  .el-input__prefix {
    left: 0;
    transition: all 0.3s;
  }

  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
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

  .el-textarea__inner {
    height: 100px;
    display: block;
    resize: vertical;
    padding: 5px 15px;
    padding-left: 0;
    line-height: 1.5;
    box-sizing: border-box;
    width: 100%;
    font-size: inherit;
    color: #606266;
    background-color: #fff;
    background-image: none;
    border: none;
    border-radius: 0;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
}

#left {
  .el-input__inner {
    width: 100%;
    height: 25px !important;
    line-height: 25px;
  }

  .el-input__suffix {
    width: 17px;
    right: 20px;
  }
}
</style>
