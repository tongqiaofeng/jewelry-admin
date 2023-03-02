<template>
  <div>
    <div class="product-container" v-if="chooseimgshow == false">
      <div class="back-img" @click="closeDialog">
        <img class="back-icon" src="../assets/imgs/goback.png" />
        <span class="font">返回</span>
      </div>
      <el-tabs id="invenSome" v-model="activeStockName">
        <el-tab-pane label="成品信息" name="first">
          <div style="display: flex;justify-content: flex-end;">
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
                  color:
                    isUpdate == 0
                      ? '#606266'
                      : productUpdateMsg.isUpdate == 0
                      ? '#3d82fe'
                      : '#606266',
                  fontWeight:
                    isUpdate == 0
                      ? 'normal'
                      : productUpdateMsg.isUpdate == 0
                      ? 'bold'
                      : 'normal',
                }"
              >
                唯一编号
              </div>
              <div class="one-right">
                <el-input
                  v-model="productUpdateMsg.productNumber"
                  :readonly="
                    isUpdate == 0
                      ? true
                      : productUpdateMsg.isUpdate == 0
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
                成品名称
              </div>
              <div class="one-right">
                <el-input
                  v-model="productUpdateMsg.productName"
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
                  placeholder="可输入创建选择/直接多选"
                  multiple
                  filterable
                  allow-create
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
                品牌系列
              </div>
              <div class="one-right">
                <el-select
                  style="width: 100%;"
                  v-model="productUpdateMsg.brandSeries"
                  :disabled="isUpdate == 0 ? true : false"
                  placeholder="可输入创建选择/直接多选"
                  multiple
                  filterable
                  allow-create
                >
                  <el-option
                    v-for="item in brandSeriesList"
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
                联名系列
              </div>
              <div class="one-right">
                <el-select
                  style="width: 100%;"
                  v-model="productUpdateMsg.coBrandedSeries"
                  :disabled="isUpdate == 0 ? true : false"
                  placeholder="可输入创建选择/直接多选"
                  multiple
                  filterable
                  allow-create
                >
                  <el-option
                    v-for="item in jointlyList"
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
                设计图名称
              </div>
              <div class="one-right">
                <el-input
                  @focus="showDesign"
                  v-model="productUpdateMsg.designName"
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
                设计师名称
              </div>
              <div class="one-right">
                <el-input v-model="productUpdateMsg.designerName" readonly>
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
                  v-model="productUpdateMsg.params"
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
                  v-model="productUpdateMsg.certificateNumber"
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
                搭配推荐
              </div>
              <div class="one-right">
                <el-select
                  style="width: 100%;height: 100px;"
                  v-model="productUpdateMsg.collocationIdStr"
                  multiple
                  filterable
                  remote
                  reserve-keyword
                  placeholder="可输入成品名称选择搭配推荐"
                  :remote-method="remoteProductMethod"
                  :loading="loadingProduct"
                >
                  <el-option
                    v-for="item in productOptionList"
                    :key="item.id"
                    :label="item.productName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
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
              style="margin: 10px 0;"
              v-if="productUpdateMsg.img != '' || isUpdate == 1"
            >
              <UploadImg
                :imgUrl="productimgList"
                :isUpdate="isUpdate"
                @imgChange="productImgUrlChange"
              ></UploadImg>
            </div>
            <p
              v-if="productUpdateMsg.img == '' && isUpdate == 0"
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
              style="margin: 10px 0;"
              v-if="productUpdateMsg.detailImg != '' || isUpdate == 1"
            >
              <UploadImg
                :imgUrl="detailImgList"
                :isUpdate="isUpdate"
                @imgChange="detailImgUrlChange"
              ></UploadImg>
            </div>
            <p
              v-if="productUpdateMsg.detailImg == '' && isUpdate == 0"
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
            <div class="upload-imgs" style="margin: 10px 0;">
              <div
                v-if="productUpdateMsg.designImg != ''"
                style="display:flex;position:relative;flex-wrap: wrap;"
              >
                <div
                  v-for="(imgurl, index) of imgListFilter(
                    productUpdateMsg.designImg
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
              <p v-else style="margin-left: 10px;font-size: 13px;">
                无设计图片
              </p>
            </div>
          </div>
          <p class="font-title-style">原材料信息</p>
          <el-table
            style="width: 100%;"
            :data="productUpdateMsg.materialList"
            tooltip-effect="dark"
            border
            highlight-current-row
            @row-dblclick="checkMaterialDetails"
          >
            <el-table-column align="center" prop="name" label="名称">
            </el-table-column>
            <el-table-column align="center" prop="number" label="数量">
            </el-table-column>
          </el-table>
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
                产品备注
              </div>
              <div class="one-right">
                <el-input
                  type="textarea"
                  v-model="productUpdateMsg.note"
                  :readonly="isUpdate == 0 ? true : false"
                >
                </el-input>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="价格信息" name="fourth">
          <div style="display: flex;justify-content: flex-end;">
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
                裸石成本(HKD)
              </div>
              <div class="one-right">
                <el-input
                  @input="priceAndRateChange"
                  :readonly="isUpdate == 0 ? true : false"
                  v-model="productUpdateMsg.costPrice"
                  clearable
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
                  @input="priceAndRateChange"
                  :readonly="isUpdate == 0 ? true : false"
                  v-model="productUpdateMsg.processCost"
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
                其他费用(HKD)
              </div>
              <div class="one-right">
                <el-input
                  @input="priceAndRateChange"
                  :readonly="isUpdate == 0 ? true : false"
                  v-model="productUpdateMsg.stockInOtherExpenses"
                  clearable
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
                港币兑人民币汇率
              </div>
              <div class="one-right">
                <el-input
                  @input="priceAndRateChange"
                  :readonly="isUpdate == 0 ? true : false"
                  v-model="productUpdateMsg.totalHkToCnRate"
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
                  v-model="productUpdateMsg.totalHkPrice"
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
                  v-model="productUpdateMsg.totalCnPrice"
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
                建议批发价(HKD)
              </div>
              <div class="one-right">
                <el-input
                  :readonly="isUpdate == 0 ? true : false"
                  v-model="productUpdateMsg.adviceWholesalePrice"
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
                建议零售价(HKD)
              </div>
              <div class="one-right">
                <el-input
                  :readonly="isUpdate == 0 ? true : false"
                  v-model="productUpdateMsg.adviseSellPrice"
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
                  v-model="productUpdateMsg.lowestSellPrice"
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
                代理价(CNY)
              </div>
              <div class="one-right">
                <el-input
                  :readonly="isUpdate == 0 ? true : false"
                  v-model="productUpdateMsg.agentPrice"
                  clearable
                >
                </el-input>
              </div>
            </div>
            <div class="div-one">
              <!-- 建议柜台最低 -->
              <div
                class="one-left"
                :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }"
              >
                销售价(CNY)
              </div>
              <div class="one-right">
                <el-input
                  :readonly="isUpdate == 0 ? true : false"
                  v-model="productUpdateMsg.counterLowestSellPrice"
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
                  v-model="productUpdateMsg.tagPrice"
                  clearable
                >
                </el-input>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="销售信息"
          name="third"
          v-if="productUpdateMsg.state == 3"
        >
          <div style="display: flex;justify-content: flex-end;">
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
                销售发票号
              </div>
              <div class="one-right">
                <el-input
                  :readonly="isUpdate == 0 ? true : false"
                  v-model="productUpdateMsg.sellBillNumber"
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
                销售员
              </div>
              <div class="one-right">
                <el-input
                  :readonly="isUpdate == 0 ? true : false"
                  v-model="productUpdateMsg.solder"
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
                销售组
              </div>
              <div class="one-right">
                <el-autocomplete
                  :readonly="isUpdate == 0 ? true : false"
                  v-model="productUpdateMsg.group"
                  :fetch-suggestions="groupQuery"
                  placeholder="请选择/输入销售组"
                  @select="handleGroupSelect"
                ></el-autocomplete>
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
                  v-model="productUpdateMsg.customer"
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
                顾客类型
              </div>
              <div class="one-right">
                <el-autocomplete
                  :readonly="isUpdate == 0 ? true : false"
                  v-model="productUpdateMsg.customerType"
                  :fetch-suggestions="customerTypeQuery"
                  placeholder="请选择/输入类型"
                  @select="handleModelSelect"
                ></el-autocomplete>
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
                  @change="currencyChange"
                  v-model="productUpdateMsg.saleCurrency"
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
                  @input="currencyChange"
                  :readonly="isUpdate == 0 ? true : false"
                  v-model="productUpdateMsg.saleMoney"
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
                外币兑港币汇率
              </div>
              <div class="one-right">
                <el-input
                  @input="totalHkRateChange"
                  :readonly="isUpdate == 0 ? true : false"
                  v-model="productUpdateMsg.totalToHkRate"
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
                  v-model="productUpdateMsg.sellTotalHkPrice"
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
                其他支出费用(HKD)
              </div>
              <div class="one-right">
                <el-input
                  :readonly="isUpdate == 0 ? true : false"
                  v-model="productUpdateMsg.otherExpenses"
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
                  v-model="productUpdateMsg.receiver"
                  clearable
                >
                </el-input>
              </div>
            </div>
            <div class="div-one-note">
              <div
                class="one-left"
                :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }"
              >
                出库备注
              </div>
              <div class="one-right">
                <el-input
                  type="textarea"
                  v-model="productUpdateMsg.outNote"
                  :readonly="isUpdate == 0 ? true : false"
                >
                </el-input>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="货物转移记录" name="second">
          <div style="margin-bottom: 30px;">
            <p class="font-title-style" style="margin-top: 0;">
              成品状态：{{
                productUpdateMsg.state == 0
                  ? "库存中"
                  : productUpdateMsg.state == 1
                  ? "运输中"
                  : productUpdateMsg.state == 2
                  ? "加工完成"
                  : "已出售"
              }}
            </p>
          </div>

          <div>
            <Note :note="recordList" @noteContent="noteContent"></Note>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div
        v-show="isUpdate == 1"
        style="position: fixed;right: 30px;bottom: 50px;"
      >
        <el-button
          style="width: 150px;"
          type="primary"
          @click="inventoryLookSure"
          v-preventClick
          >修 改</el-button
        >
      </div>
    </div>
    <div v-else>
      <designSelectUpdate @designSel="designSel"></designSelectUpdate>
    </div>
    <el-dialog
      v-if="dialogMaterialDetailsVisible"
      title="材料信息"
      :visible.sync="dialogMaterialDetailsVisible"
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
                  {{ materialMsg.materialName }}
                </div>
              </div>
              <div class="div-one">
                <div class="one-left">
                  仓库/加工厂
                </div>
                <div class="one-right">
                  {{ materialMsg.storageName }}
                </div>
              </div>
              <div class="div-one">
                <div class="one-left">
                  统一编号
                </div>
                <div class="one-right">
                  {{ materialMsg.productNumber }}
                </div>
              </div>
              <div class="div-one">
                <div class="one-left">
                  盒子编号
                </div>
                <div class="one-right">
                  {{ materialMsg.boxNumber }}
                </div>
              </div>
              <div class="div-one">
                <div class="one-left">
                  形状
                </div>
                <div class="one-right">
                  {{ materialMsg.shape }}
                </div>
              </div>
              <div class="div-one">
                <div class="one-left">
                  尺寸/毫米
                </div>
                <div class="one-right">
                  {{ materialMsg.size }}
                </div>
              </div>
              <div class="div-one">
                <div class="one-left">
                  产地
                </div>
                <div class="one-right">
                  <el-input v-model="materialMsg.productArea" clearable>
                  </el-input>
                </div>
              </div>
              <div class="div-one">
                <div class="one-left">
                  颜色
                </div>
                <div class="one-right">
                  {{ materialMsg.color }}
                </div>
              </div>
              <div class="div-one">
                <div class="one-left">
                  品质
                </div>
                <div class="one-right">
                  {{ materialMsg.quality }}
                </div>
              </div>
              <div class="div-one">
                <div class="one-left">
                  品质细分
                </div>
                <div class="one-right">
                  {{ materialMsg.subsection }}
                </div>
              </div>
              <div class="div-one">
                <div class="one-left">
                  配对
                </div>
                <div class="one-right">
                  {{ materialMsg.paired }}
                </div>
              </div>
              <div class="div-one">
                <div class="one-left">
                  证书编号
                </div>
                <div class="one-right">
                  {{ materialMsg.certificateNumber }}
                </div>
              </div>
            </div>
            <p class="font-title-style">图片信息</p>
            <div class="upload-imgs" style="margin: 10px 0;">
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
                      imgurl.length < 42 ? axiosUrl + '/file/' + imgurl : imgurl
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
                  <el-input type="textarea" v-model="materialMsg.note" readonly>
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
                  发票号
                </div>
                <div class="one-right">
                  <el-input v-model="materialMsg.billNumber" clearable>
                  </el-input>
                </div>
              </div>
              <div class="div-one">
                <div class="one-left">
                  计价单位
                </div>
                <div class="one-right">
                  <el-radio-group
                    v-model="materialMsg.chargeUnit"
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
                  {{ materialMsg.unitPrice }}
                </div>
              </div>
              <div class="div-one">
                <div class="one-left">
                  币种
                </div>
                <div class="one-right">
                  <el-radio-group
                    v-model="materialMsg.currency"
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
                    materialMsg.chargeUnit == "粒"
                      ? materialMsg.number + " " + materialMsg.chargeUnit
                      : materialMsg.number
                  }}
                </div>
              </div>
              <div class="div-one">
                <div class="one-left">
                  总重量
                </div>
                <div class="one-right">
                  {{
                    materialMsg.chargeUnit != "粒"
                      ? materialMsg.weight + " " + materialMsg.chargeUnit
                      : "--"
                  }}
                </div>
              </div>
              <div class="div-one">
                <div class="one-left">
                  总价
                </div>
                <div class="one-right">
                  {{ materialMsg.totalPrice + " " + materialMsg.currency }}
                </div>
              </div>

              <div class="div-one">
                <div class="one-left">
                  外币兑港币汇率
                </div>
                <div class="one-right">
                  {{ materialMsg.totalHkRate }}
                </div>
              </div>
              <div class="div-one">
                <div class="one-left">
                  总价港币金额
                </div>
                <div class="one-right">
                  {{ materialMsg.totalHkPrice }}
                </div>
              </div>
              <div class="div-one">
                <div class="one-left">
                  建议批发单价({{ materialMsg.currency }})
                </div>
                <div class="one-right">
                  {{ materialMsg.adviceWholesalePrice }}
                </div>
              </div>
              <div class="div-one">
                <div class="one-left">
                  建议零售单价({{ materialMsg.currency }})
                </div>
                <div class="one-right">
                  {{ materialMsg.adviseSellPrice }}
                </div>
              </div>
              <div class="div-one">
                <div class="one-left">
                  最低销售单价(CNY)
                </div>
                <div class="one-right">
                  {{ materialMsg.lowestSellPrice }}
                </div>
              </div>
              <div class="div-one">
                <div class="one-left">
                  代理单价(CNY)
                </div>
                <div class="one-right">
                  {{ materialMsg.agentPrice }}
                </div>
              </div>
              <div class="div-one">
                <div class="one-left">
                  销售单价(CNY)
                </div>
                <div class="one-right">
                  {{ materialMsg.counterLowestSellPrice }}
                </div>
              </div>
              <div class="div-one">
                <div class="one-left">
                  标签单价(CNY)
                </div>
                <div class="one-right">
                  {{ materialMsg.tagPrice }}
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="货物转移记录" name="fifth">
            <p class="font-title-style" style="margin-top: 0;">
              材料状态：{{
                materialMsg.state == 0
                  ? "库存中"
                  : materialMsg.state == 1
                  ? "加工中"
                  : materialMsg.state == 2
                  ? "加工完成"
                  : materialMsg.state == 3
                  ? "已出售"
                  : ""
              }}
            </p>
            <div>
              <Note :note="recordMaterialList" :isUpdate="'yes'"></Note>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { labelMixins, brandJointlyMixins, groupMixins } from "@/mixins";

import UploadImg from "@/components/upload-img.vue";
import Note from "@/components/note.vue";
import designSelectUpdate from "@/components/design-select-update.vue";

import { base_request_url } from "_req/http";
import {
  stockMaterialInfoPort,
  productSavePort,
  productRecommendPort,
} from "_req/api/common";

export default {
  components: {
    UploadImg,
    Note,
    designSelectUpdate,
  },
  props: {
    updateProductMsg: {},
  },
  mixins: [labelMixins, brandJointlyMixins, groupMixins],
  data() {
    return {
      axiosUrl: "",
      productUpdateMsg: {},
      activeStockName: "first",
      dialogMaterialDetailsVisible: false,
      materialMsg: {},
      isUpdate: 0,
      imgList: [],
      productimgList: [],
      detailImgList: [],
      activeName: "ff",
      labelSelList: [],

      chooseimgshow: false,

      loadingProduct: false,
      productOptionList: [],

      recordList: [],
      recordMaterialList: [],
    };
  },
  created() {
    this.axiosUrl = base_request_url;
    this.getBrandAndJointly();
    this.productUpdateMsg = this.updateProductMsg;

    this.productimgList = [];
    if (
      this.productUpdateMsg.img !== null &&
      this.productUpdateMsg.img !== ""
    ) {
      if (this.productUpdateMsg.img.indexOf("|") !== -1) {
        this.productimgList = this.productUpdateMsg.img.split("|");
      } else {
        this.productimgList.push(this.productUpdateMsg.img);
      }
    } else {
      this.productimgList = [];
    }

    this.detailImgList = [];
    if (
      this.productUpdateMsg.detailImg !== null &&
      this.productUpdateMsg.detailImg !== ""
    ) {
      if (this.productUpdateMsg.detailImg.indexOf("|") !== -1) {
        this.detailImgList = this.productUpdateMsg.detailImg.split("|");
      } else {
        this.detailImgList.push(this.productUpdateMsg.detailImg);
      }
    } else {
      this.detailImgList = [];
    }

    this.labelSelList = [];
    if (
      this.productUpdateMsg.productLabel !== null &&
      this.productUpdateMsg.productLabel !== ""
    ) {
      if (this.productUpdateMsg.productLabel.indexOf("|") !== -1) {
        this.labelSelList = this.productUpdateMsg.productLabel.split("|");
      } else {
        this.labelSelList.push(this.productUpdateMsg.productLabel);
      }
    } else {
      this.labelSelList = [];
    }

    let arr = [];
    if (
      this.productUpdateMsg.collocationIdStr !== null &&
      this.productUpdateMsg.collocationIdStr !== ""
    ) {
      if (this.productUpdateMsg.collocationIdStr.indexOf("|") !== -1) {
        arr = this.productUpdateMsg.collocationIdStr.split("|");
      } else {
        arr.push(this.productUpdateMsg.collocationIdStr);
      }
    }

    this.productUpdateMsg.collocationIdStr = arr.map((item) => {
      return Number(item);
    });
    console.log(this.productUpdateMsg.collocationIdStr);

    if (this.productUpdateMsg.brandSeries) {
      this.productUpdateMsg.brandSeries = this.productUpdateMsg.brandSeries.split(
        "|"
      );
    }
    if (this.productUpdateMsg.coBrandedSeries) {
      this.productUpdateMsg.coBrandedSeries = this.productUpdateMsg.coBrandedSeries.split(
        "|"
      );
    }

    if (this.productUpdateMsg.transferRemarks) {
      this.recordList = JSON.parse(this.productUpdateMsg.transferRemarks);
    } else {
      this.recordList = [];
    }
  },
  mounted() {
    document.getElementById("mainContainer").scrollTop = 0;
  },
  methods: {
    // 是否显示设计图选择页面
    showDesign() {
      if (this.isUpdate == 1) {
        this.chooseimgshow = true;
      }
    },
    // 货物转移记录
    noteContent(val) {
      console.log("货物转移记录变化赋值", val);
      this.recordList = val;
    },
    // 搭配推荐
    remoteProductMethod(query) {
      this.loadingProduct = true;

      productRecommendPort({
        keyword: query,
      })
        .then((res) => {
          console.log("条件查找成品库存列表");
          console.log(res);
          this.loadingProduct = false;

          this.productOptionList = res.data.data;
        })
        .catch(() => {
          this.loadingProduct = false;
        });
    },
    // 裸石成本价格 换算
    priceAndRateChange() {
      if (
        this.productUpdateMsg.totalHkToCnRate &&
        this.productUpdateMsg.costPrice &&
        this.productUpdateMsg.processCost
      ) {
        this.productUpdateMsg.totalCnPrice = (
          this.productUpdateMsg.costPrice *
            this.productUpdateMsg.totalHkToCnRate +
          this.productUpdateMsg.stockInOtherExpenses *
            this.productUpdateMsg.totalHkToCnRate +
          Number(this.productUpdateMsg.processCost)
        ).toFixed(0);
        this.productUpdateMsg.totalHkPrice = (
          this.productUpdateMsg.processCost /
            this.productUpdateMsg.totalHkToCnRate +
          Number(this.productUpdateMsg.stockInOtherExpenses) +
          Number(this.productUpdateMsg.costPrice)
        ).toFixed(0);
      }
    },

    // 设计图选择
    designSel(val) {
      let row = val.val;
      this.chooseimgshow = false;
      if (val.isClose == 0) {
        this.productUpdateMsg.designId = row.id;
        this.productUpdateMsg.designName = row.name;
        this.productUpdateMsg.designerName = row.designerName;
        let list = [];
        for (const item of row.img.split("|")) {
          if (item != "") {
            list.push(this.axiosUrl + "/file/" + item);
          }
        }

        this.productUpdateMsg.designImg = list.join("|");
      }
    },

    // 成品图片
    productImgUrlChange(data) {
      console.log("成品图片", data);
      this.productimgList = data.img;
    },
    // 详情图
    detailImgUrlChange(data) {
      console.log("详情图片", data);
      this.detailImgList = data.img;
    },
    // 修改成品
    updateDevice() {
      this.isUpdate = 1;
    },
    // 确定
    inventoryLookSure() {
      console.log(this.productUpdateMsg);
      if (this.isUpdate == 0) {
        this.$emit("sureUpdateProduct", 0);
      } else {
        this.productUpdateMsg.collocationIdStr = this.productUpdateMsg.collocationIdStr.join(
          "|"
        );
        this.productUpdateMsg.brandSeries = this.productUpdateMsg.brandSeries.join(
          "|"
        );
        this.productUpdateMsg.coBrandedSeries = this.productUpdateMsg.coBrandedSeries.join(
          "|"
        );

        productSavePort({
          ...this.productUpdateMsg,
          img: this.productimgList.join("|"),
          productLabel: this.labelSelList.join("|"),
          detailImg: this.detailImgList.join("|"),
          recordList: JSON.stringify(this.recordList),
        })
          .then((res) => {
            console.log("修改成品信息");
            console.log(res);
            this.$message.success({
              message: "修改成功",
              showClose: true,
              duration: 2000,
            });

            this.$emit("sureUpdateProduct", 1);
          })
          .catch((err) => {
            console.log(err);
            this.recordList = JSON.parse(this.recordList);
            this.productUpdateMsg.collocationIdStr = this.productUpdateMsg.collocationIdStr.split(
              "|"
            );
            this.productUpdateMsg.brandSeries = this.productUpdateMsg.brandSeries.split(
              "|"
            );
            this.productUpdateMsg.coBrandedSeries = this.productUpdateMsg.coBrandedSeries.split(
              "|"
            );
          });
      }
    },
    // 取消修改
    closeDialog() {
      this.$emit("sureUpdateProduct", 0);
    },

    //查看原材料详情
    checkMaterialDetails(row) {
      this.activeName = "ff";
      this.materialMsg = {};

      stockMaterialInfoPort({
        id: row.id,
      }).then((res) => {
        console.log("材料详情");
        console.log(res);
        this.materialMsg = res.data.data;
        this.imgList = [];
        if (this.materialMsg.img !== null && this.materialMsg.img !== "") {
          if (this.materialMsg.img.indexOf("|") !== -1) {
            this.imgList = this.materialMsg.img.split("|");
          } else {
            this.imgList.push(this.materialMsg.img);
          }
        } else {
          this.imgList = [];
        }

        if (this.materialMsg.transferRemarks) {
          this.recordMaterialList = JSON.parse(
            this.materialMsg.transferRemarks
          );
        } else {
          this.recordMaterialList = [];
        }

        this.dialogMaterialDetailsVisible = true;
      });
    },

    // 顾客类型
    customerTypeQuery(queryString, cb) {
      let restaurants = this.customerTypeList;

      for (let items of restaurants) {
        items.value = items.name;
      }

      let results = queryString
        ? restaurants.filter(this.createModelFilter(queryString))
        : restaurants;
      console.log("匹配", results);

      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createModelFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleModelSelect(item) {
      console.log("选中结果", item);
      this.productUpdateMsg.customerType = item.name;
    },

    // 汇率变化
    totalHkRateChange() {
      if (
        this.productUpdateMsg.saleMoney &&
        this.productUpdateMsg.totalToHkRate
      ) {
        if (this.productUpdateMsg.saleCurrency == "CNY") {
          if (this.productUpdateMsg.totalToHkRate >= 1) {
            this.productUpdateMsg.sellTotalHkPrice = Number(
              this.productUpdateMsg.saleMoney *
                this.productUpdateMsg.totalToHkRate
            ).toFixed(0);
          } else {
            this.productUpdateMsg.sellTotalHkPrice = Number(
              this.productUpdateMsg.saleMoney /
                this.productUpdateMsg.totalToHkRate
            ).toFixed(0);
          }
        } else {
          this.productUpdateMsg.sellTotalHkPrice = Number(
            this.productUpdateMsg.saleMoney *
              this.productUpdateMsg.totalToHkRate
          ).toFixed(0);
        }
      }
    },
    // 出售币种-金额变化
    currencyChange() {
      if (this.productUpdateMsg.saleCurrency == "HKD") {
        this.productUpdateMsg.totalToHkRate = 1;
        this.productUpdateMsg.sellTotalHkPrice = this.productUpdateMsg.saleMoney;
      } else {
        if (
          this.productUpdateMsg.saleMoney &&
          this.productUpdateMsg.totalToHkRate
        ) {
          this.totalHkRateChange();
        } else {
          this.productUpdateMsg.totalToHkRate = "";
          this.productUpdateMsg.sellTotalHkPrice = "";
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.product-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 6px;
  text-align: left;

  #invenSome {
    width: 55vw;
  }
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
  font-size: 14px;
  .div-one-note {
    height: 100px;
    display: flex;
    line-height: 100px;
    border-bottom: 1px solid #ccc;
    .one-left {
      width: 160px;
      border-right: 1px solid #ccc;
      text-align: center;
      background-color: #f2f2f2;
    }
    .one-right {
      // width: 373px;
      flex: 1;
      padding-left: 10px;
    }
  }
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
      // width: 373px;
      flex: 1;
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
