<template>
  <div class="stock-pending-container">
    <!-- <h1>待入库</h1> -->
    <div style="display:flex;justify-content: space-between;">
      <el-form :inline="true" label-width="130px">
        <el-form-item label="收货仓库/加工厂：">
          <el-select
            v-model="storageIdList"
            placeholder="可多选"
            multiple
            @change="keywordChange"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="item in materialFilterList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出库时间：">
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            clearable
            @change="keywordChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <div style="display: flex;">
            <el-input
              style="width: 330px;"
              v-model="keyword"
              @change="keywordChange"
              placeholder="可输入材料名称、统一编号、备注进行搜索"
              clearable
            >
            </el-input>
            <el-button
              style="margin-left: 10px;"
              type="primary"
              @click="getStockMaterialList"
              >查 询</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        style="width: 70%;"
        ref="multipleTable"
        :data="listPage"
        :row-key="getRowKeys"
        tooltip-effect="dark"
        border
        @selection-change="handleSelectionChange"
        @row-dblclick="heckDeviceDetailsTwo"
      >
        <el-table-column
          type="selection"
          :reserve-selection="true"
          width="55"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="storageName" label="发货仓库/加工厂">
        </el-table-column>
        <el-table-column prop="endStorageName" label="收货仓库/加工厂">
        </el-table-column>
        <el-table-column prop="materialName" label="材料名称">
        </el-table-column>
        <el-table-column prop="productNumber" label="统一编号">
        </el-table-column>
        <el-table-column label="单价">
          <template slot-scope="scope">
            <div>
              <span>{{
                scope.row.currency != ""
                  ? scope.row.unitPrice + " " + scope.row.currency
                  : "--"
              }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发货总数量">
          <template slot-scope="scope">
            <div>
              <span>{{
                scope.row.chargeUnit !== "粒"
                  ? scope.row.number
                  : scope.row.number + " " + scope.row.chargeUnit
              }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发货总重量">
          <template slot-scope="scope">
            <div>
              <span>{{
                scope.row.chargeUnit == "粒"
                  ? scope.row.weight == 0
                    ? "---"
                    : scope.row.weight
                  : scope.row.chargeUnit == "件"
                  ? "--"
                  : scope.row.weight + " " + scope.row.chargeUnit
              }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        v-if="dialogDeviceStockDetailVisible"
        title="材料信息"
        :visible.sync="dialogDeviceStockDetailVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :append-to-body="false"
        id="stockDialog"
      >
        <div id="invenSome">
          <el-tabs style="margin-top: 20px;" v-model="activeStockName">
            <el-tab-pane label="材料信息" name="first">
              <p class="font-title-style" style="margin-top: 0;">
                材料信息
              </p>
              <div class="font-div">
                <div class="div-one">
                  <div class="one-left">
                    材料名称
                  </div>
                  <div class="one-right">
                    {{ deviceStockDetail.materialName }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    仓库/加工厂
                  </div>
                  <div class="one-right">
                    {{ deviceStockDetail.storageName }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    统一编号
                  </div>
                  <div class="one-right">
                    {{ deviceStockDetail.productNumber }}
                  </div>
                </div>
                <div class="div-one" v-show="certificateshow2 == false">
                  <div class="one-left">
                    形状
                  </div>
                  <div class="one-right">
                    {{ deviceStockDetail.shape }}
                  </div>
                </div>
                <div class="div-one" v-show="certificateshow2 == false">
                  <div class="one-left">
                    产品类型
                  </div>
                  <div class="one-right">
                    <el-input v-model="deviceStockDetail.productType" clearable>
                    </el-input>
                  </div>
                </div>
                <div class="div-one" v-show="certificateshow2 == false">
                  <div class="one-left">
                    产地
                  </div>
                  <div class="one-right">
                    <el-input v-model="deviceStockDetail.productArea" clearable>
                    </el-input>
                  </div>
                </div>

                <div class="div-one" v-show="certificateshow2 == false">
                  <div class="one-left">
                    尺寸/毫米
                  </div>
                  <div class="one-right">
                    {{ deviceStockDetail.size }}
                  </div>
                </div>
                <div class="div-one" v-show="certificateshow2 == false">
                  <div class="one-left">
                    颜色
                  </div>
                  <div class="one-right">
                    {{ deviceStockDetail.color }}
                  </div>
                </div>
                <div class="div-one" v-show="certificateshow2 == false">
                  <div class="one-left">
                    配对
                  </div>
                  <div class="one-right">
                    {{ deviceStockDetail.paired }}
                  </div>
                </div>
                <div class="div-one" v-show="certificateshow2 == false">
                  <div class="one-left">
                    品质
                  </div>
                  <div class="one-right">
                    {{ deviceStockDetail.quality }}
                  </div>
                </div>
                <div class="div-one" v-show="certificateshow2 == false">
                  <div class="one-left">
                    品质细分
                  </div>
                  <div class="one-right">
                    {{ deviceStockDetail.subsection }}
                  </div>
                </div>
                <div class="div-one" v-show="certificateshow2 == false">
                  <div class="one-left">
                    盒子编号
                  </div>
                  <div class="one-right">
                    {{ deviceStockDetail.boxNumber }}
                  </div>
                </div>
                <div class="div-one" v-show="certificateshow2 == false">
                  <div class="one-left">
                    证书编号
                  </div>
                  <div class="one-right">
                    {{ deviceStockDetail.certificateNumber }}
                  </div>
                </div>
                <div class="div-one" v-show="certificateshow2 == false">
                  <div class="one-left">
                    发票号
                  </div>
                  <div class="one-right">
                    <el-input v-model="deviceStockDetail.billNumber" clearable>
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
                      v-model="deviceStockDetail.note"
                      readonly
                    >
                    </el-input>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="价格信息" name="third">
              <p class="font-title-style" style="margin-top: 0;">
                价格信息
              </p>
              <div class="font-div">
                <div class="div-one" v-show="certificateshow2 == false">
                  <div class="one-left">
                    计价单位
                  </div>
                  <div class="one-right">
                    <el-radio-group
                      v-model="deviceStockDetail.chargeUnit"
                      :disabled="true"
                    >
                      <el-radio label="粒">粒</el-radio>
                      <el-radio label="ct">ct</el-radio>
                      <el-radio label="g">g</el-radio>
                    </el-radio-group>
                  </div>
                </div>
                <div class="div-one" v-show="certificateshow2 == false">
                  <div class="one-left">
                    单价
                  </div>
                  <div class="one-right">
                    {{ deviceStockDetail.unitPrice }}
                  </div>
                </div>
                <div class="div-one" v-show="certificateshow2 == false">
                  <div class="one-left">
                    币种
                  </div>
                  <div class="one-right">
                    <el-radio-group
                      v-model="deviceStockDetail.currency"
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
                      deviceStockDetail.chargeUnit == "粒"
                        ? deviceStockDetail.number +
                          " " +
                          deviceStockDetail.chargeUnit
                        : deviceStockDetail.number
                    }}
                  </div>
                </div>
                <div class="div-one" v-show="certificateshow2 == false">
                  <div class="one-left">
                    总重量
                  </div>
                  <div class="one-right">
                    {{
                      deviceStockDetail.chargeUnit != "粒"
                        ? deviceStockDetail.weight +
                          " " +
                          deviceStockDetail.chargeUnit
                        : "--"
                    }}
                  </div>
                </div>
                <div class="div-one" v-show="certificateshow2 == false">
                  <div class="one-left">
                    总价
                  </div>
                  <div class="one-right">
                    {{
                      deviceStockDetail.totalPrice +
                        " " +
                        deviceStockDetail.currency
                    }}
                  </div>
                </div>
                <div class="div-one" v-show="certificateshow2 == false">
                  <div class="one-left">
                    零售单价
                  </div>
                  <div class="one-right">
                    {{ deviceStockDetail.retailPrice }}
                  </div>
                </div>
                <div class="div-one" v-show="certificateshow2 == false">
                  <div class="one-left">
                    批发单价
                  </div>
                  <div class="one-right">
                    {{ deviceStockDetail.wholesalePrice }}
                  </div>
                </div>
                <div class="div-one" v-show="certificateshow2 == false">
                  <div class="one-left">
                    外币兑人民币汇率
                  </div>
                  <div class="one-right">
                    {{ deviceStockDetail.totalCnRate }}
                  </div>
                </div>
                <div class="div-one" v-show="certificateshow2 == false">
                  <div class="one-left">
                    总价人民币金额
                  </div>
                  <div class="one-right">
                    {{ deviceStockDetail.totalCnPrice }}
                  </div>
                </div>
                <div class="div-one" v-show="certificateshow2 == false">
                  <div class="one-left">
                    港币兑人民币汇率
                  </div>
                  <div class="one-right">
                    {{ deviceStockDetail.totalHkRate }}
                  </div>
                </div>
                <div class="div-one" v-show="certificateshow2 == false">
                  <div class="one-left">
                    总价港币金额
                  </div>
                  <div class="one-right">
                    {{ deviceStockDetail.totalHkPrice }}
                  </div>
                </div>
              </div>
              <p class="font-title-style">备注信息</p>
              <div class="font-div">
                <div class="div-one-note" id="one-note">
                  <div
                    class="one-left"
                    style="color: #606266; font-weight: normal;"
                  >
                    成本备注
                  </div>
                  <div class="one-right">
                    <el-input
                      type="textarea"
                      v-model="deviceStockDetail.totalPriceNote"
                      readonly
                    >
                    </el-input>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="历史记录" name="second">
              <p class="font-title-style" style="margin-top: 0;">
                材料状态：{{
                  deviceStockDetail.state == 0
                    ? "库存中"
                    : deviceStockDetail.state == 1
                    ? "运输中"
                    : deviceStockDetail.state == 2
                    ? "加工中"
                    : deviceStockDetail.state == 3
                    ? "加工完成"
                    : "已出售"
                }}
              </p>
              <el-timeline>
                <el-timeline-item
                  color="#3d82fe"
                  size="large"
                  v-for="(activity, index) in deviceStockDetail.stockInOutList"
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
          <el-button @click="dialogDeviceStockDetailVisible = false"
            >取 消</el-button
          >
          <el-button
            type="primary"
            @click="dialogDeviceStockDetailVisible = false"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <el-dialog
        v-if="dialogDeviceDetailVisible"
        title="成品信息"
        :visible.sync="dialogDeviceDetailVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :append-to-body="false"
      >
        <div id="invenSome">
          <el-tabs style="margin-top: 20px;" v-model="activeName">
            <el-tab-pane label="成品信息" name="first">
              <div style="display: flex;justify-content: space-between;">
                <p class="font-title-style" style="margin-top: 0;">
                  成品信息
                </p>
              </div>
              <div class="font-div">
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: '#606266',
                      fontWeight: 'normal',
                    }"
                  >
                    设计名称：
                  </div>
                  <div class="one-right">
                    <el-input v-model="deviceDetail.designName" readonly>
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
                    标签：
                  </div>
                  <div class="one-right">
                    <el-input v-model="deviceDetail.productLabel" readonly>
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
                      color: '#606266',
                      fontWeight: 'normal',
                    }"
                  >
                    唯一编号
                  </div>
                  <div class="one-right">
                    <el-input v-model="deviceDetail.productNumber" readonly>
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
                    参数
                  </div>
                  <div class="one-right" id="one-note">
                    <el-input
                      type="textarea"
                      v-model="deviceDetail.params"
                      readonly
                    >
                    </el-input>
                  </div>
                </div>
              </div>
              <p class="font-title-style">图片信息</p>
              <div style="display:flex;">
                <p style="margin: 0;color: '#606266';font-weight:'normal';">
                  成品图片：
                </p>
                <div class="upload-imgs" v-if="deviceDetail.img != ''">
                  <div
                    style="position:relative;"
                    id="delImg"
                    v-for="(item, index) in productimgList"
                    :key="index"
                    class="delImg"
                  >
                    <img
                      :src="img + '/file/' + item"
                      width="100px"
                      height="100px"
                      style="border-radius:5px;object-fit:cover;"
                    />
                  </div>
                </div>
                <div v-else>无成品图片</div>
              </div>
              <div style="display:flex;">
                <p style="margin: 0;color: '#606266';font-weight:'normal';">
                  详情图片：
                </p>
                <div class="upload-imgs" v-if="deviceDetail.detailImg != ''">
                  <div
                    style="position:relative;"
                    id="delImg"
                    v-for="(item, index) in detailImgList"
                    :key="index"
                    class="delImg"
                  >
                    <img
                      :src="img + '/file/' + item"
                      width="100px"
                      height="100px"
                      style="border-radius:5px;object-fit:cover;"
                    />
                  </div>
                </div>
                <div v-else>无详情图片</div>
              </div>
              <div style="display:flex;">
                <p style="margin: 0;color: '#606266';font-weight:'normal';">
                  设计图片：
                </p>
                <div class="upload-imgs" v-if="deviceDetail.designImg != ''">
                  <div style="display:flex;position:relative;flex-wrap: wrap;">
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
                <div v-else>无设计图片</div>
              </div>
              <p class="font-title-style">原材料信息</p>
              <el-table
                style="width: 100%;"
                :data="deviceDetail.materialList"
                tooltip-effect="dark"
                border
                highlight-current-row
                @row-dblclick="checkinventoryCheckDetails"
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
                    style="color: #606266;font-weight: normal;"
                  >
                    产品备注
                  </div>
                  <div class="one-right">
                    <el-input
                      type="textarea"
                      v-model="deviceDetail.note"
                      readonly
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
              </div>
              <div class="font-div">
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{
                      color: '#606266',
                      fontWeight: 'normal',
                    }"
                  >
                    裸石成本币种
                  </div>
                  <div class="one-right">
                    <el-radio-group v-model="deviceDetail.currency" disabled>
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
                      color: '#606266',
                      fontWeight: 'normal',
                    }"
                  >
                    裸石成本
                  </div>
                  <div class="one-right">
                    <el-input
                      readonly
                      v-model="deviceDetail.costPrice"
                      clearable
                    ></el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div
                    class="one-left"
                    :style="{ color: '#606266', fontWeight: 'normal' }"
                  >
                    加工费(CNY)
                  </div>
                  <div class="one-right">
                    <el-input
                      readonly
                      v-model="deviceDetail.processCost"
                      clearable
                    >
                    </el-input>
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    外币兑人民币汇率
                  </div>
                  <div class="one-right">
                    {{ deviceDetail.totalCnRate }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    成本人民币金额
                  </div>
                  <div class="one-right">
                    {{ deviceDetail.totalCnPrice }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    港币兑人民币汇率
                  </div>
                  <div class="one-right">
                    {{ deviceDetail.totalHkRate }}
                  </div>
                </div>
                <div class="div-one">
                  <div class="one-left">
                    成本港币金额
                  </div>
                  <div class="one-right">
                    {{ deviceDetail.totalHkPrice }}
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
                    最低销售价(CNY)
                  </div>
                  <div class="one-right">
                    <el-input
                      readonly
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
                      color: '#606266',
                      fontWeight: 'normal',
                    }"
                  >
                    建议销售价(CNY)
                  </div>
                  <div class="one-right">
                    <el-input
                      readonly
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
                      color: '#606266',
                      fontWeight: 'normal',
                    }"
                  >
                    建议批发价(CNY)
                  </div>
                  <div class="one-right">
                    <el-input
                      readonly
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
                      color: '#606266',
                      fontWeight: 'normal',
                    }"
                  >
                    标签价(CNY)
                  </div>
                  <div class="one-right">
                    <el-input
                      readonly
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
                      color: '#606266',
                      fontWeight: 'normal',
                    }"
                  >
                    销售提成(CNY)
                  </div>
                  <div class="one-right">
                    <el-input
                      readonly
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
                    style="color: #606266;font-weight: normal;"
                  >
                    成本备注
                  </div>
                  <div class="one-right">
                    <el-input
                      type="textarea"
                      v-model="deviceDetail.totalPriceNote"
                      readonly
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
          <el-button type="primary" @click="dialogDeviceDetailVisible = false"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <div style="width:70%;text-align:right;margin-top:20px;">
        <el-button type="primary" @click="stockOut">入 库</el-button>
        <el-dialog
          title="产品批量入库"
          :visible.sync="dialogStockPendingVisible"
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          :modal-append-to-body="false"
          :append-to-body="false"
          id="pending"
        >
          <el-form :model="pendingForm" :rules="pendingRules">
            <el-form-item label="入库时间" required>
              <el-date-picker
                v-model="pendingForm.stockInTime"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :clearable="false"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button @click="dialogStockPendingVisible = false"
              >取 消</el-button
            >
            <el-button type="primary" @click="stockOutSure">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div style="width: 100%;height: 50px;">
        <div style="margin:15px 0;position:absolute;right:32%;">
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
</template>

<script>
export default {
  data() {
    return {
      img: this.$store.state.baseUrl,
      img1: require("../assets/imgs/list.png"),
      img2: require("../assets/imgs/camer.png"),
      storageIdList: [],
      materialList: [],
      materialFilterList: [],
      warehouseFactoryList: [],
      time: null,
      keyword: "",
      total: 0,
      page: 1,
      pageNum: 10,
      stockPendingList: [],
      listPage: [],
      deviceDetail: {},
      deviceStockDetail: {},
      certificateshow2: false,
      multipleSelection: [],
      dialogDeviceDetailVisible: false,
      dialogDeviceStockDetailVisible: false,
      activeName: "first",
      activeStockName: "first",
      imgList: [],
      productimgList: [],
      detailImgList: [],

      dialogStockPendingVisible: false,
      pendingForm: {
        stockInTime: new Date(),
      },
      pendingRules: {
        stockInTime: [
          {
            required: true,
            message: "请选择入库时间",
            trigger: ["change"],
          },
        ],
      },
    };
  },
  created() {
    this.getStockMaterialList();
  },
  methods: {
    imgFillter(img) {
      console.log(img);
      let list = [];
      if (img !== null && img !== "" && img !== undefined) {
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
    // 入库
    stockOut() {
      if (this.multipleSelection.length == 0) {
        this.$message.warning({
          message: "请选择入库材料",
          showClose: true,
          duration: 2000,
        });
      } else {
        this.pendingForm.stockInTime = new Date();
        this.dialogStockPendingVisible = true;
      }
    },
    // 确定入库
    stockOutSure() {
      let list = [];
      for (const iterator of this.multipleSelection) {
        list.push(iterator.id);
      }
      this.$axios
        .post(this.$store.state.baseUrl + "/checkMaterial", {
          idList: list,
          stockInTime: this.shellDate(this.pendingForm.stockInTime),
        })
        .then((res) => {
          console.log("入库");
          console.log(res);
          this.$message.success({
            message: "入库成功",
            showClose: true,
            duration: 2000,
          });
          this.dialogStockPendingVisible = false;
          this.page = 1;
          this.multipleSelection.length = 0;
          this.$refs.multipleTable.clearSelection();
          console.log(this.multipleSelection);
          this.getStockMaterialList();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error({
            message: err.data.message,
            showClose: true,
            duration: 2000,
          });
        });
    },
    getRowKeys(row) {
      return row.id;
    },
    // 选择入库材料
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    // 获取待入库列表
    getStockMaterialList() {
      this.stockPendingList = [];
      this.warehouseFactoryList = [];
      console.log(this.storageIdList);
      this.$axios
        .post(this.$store.state.baseUrl + "/materialTransportList", {
          endStorageIdList: this.storageIdList,
          startTime: this.time == null ? "" : this.time[0],
          endTime: this.time == null ? "" : this.time[1],
          keyword: this.keyword,
          page: this.page,
          pageNum: this.pageNum,
        })
        .then((res) => {
          console.log("待入库列表");
          console.log(res);
          this.total = res.data.total;
          this.warehouseFactoryList = res.data.warehouseFactoryList;
          for (const item of res.data.warehouseFactoryList) {
            this.stockPendingList = this.stockPendingList.concat(
              item.materialList
            );
          }
          console.log(this.stockPendingList);
          this.getWarehouseList();
          this.getList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 提取仓库/加工厂列表
    getWarehouseList() {
      console.log("仓库/加工厂列表", this.warehouseFactoryList);
      this.materialFilterList = [];
      const temp = [];
      const hash = [];
      for (let i = 0; i < this.warehouseFactoryList.length; i++) {
        for (
          let j = 0;
          j < this.warehouseFactoryList[i].materialList.length;
          j++
        ) {
          temp.push({
            id: this.warehouseFactoryList[i].materialList[j].endStorageId,
            name: this.warehouseFactoryList[i].materialList[j].endStorageName,
          });
        }
      }
      this.materialFilterList = temp.reduce(function(item, next) {
        //数组对象去重
        hash[next.name] ? "" : (hash[next.name] = true && item.push(next));
        return item;
      }, []);

      console.log(this.materialFilterList);
    },
    //查看详情
    heckDeviceDetailsTwo(row) {
      this.deviceDetail = {};
      this.activeName = "first";
      if (row.materialName == "成品") {
        this.$axios
          .post(this.$store.state.baseUrl + "/productInfo", {
            id: row.id,
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
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.checkinventoryCheckDetails(row);
      }
    },
    // 查看成品中原材料详情
    checkinventoryCheckDetails(val) {
      this.activeStockName = "first";
      this.deviceStockDetail = {};
      this.$axios
        .post(this.$store.state.baseUrl + "/stockMaterialInfo", {
          id: val.id,
        })
        .then((res) => {
          console.log("材料详情");
          console.log(res);
          this.deviceStockDetail = res.data;
          this.imgList = [];
          if (
            this.deviceStockDetail.img !== null &&
            this.deviceStockDetail.img !== ""
          ) {
            if (this.deviceStockDetail.img.indexOf("|") !== -1) {
              this.imgList = this.deviceStockDetail.img.split("|");
            } else {
              this.imgList.push(this.deviceStockDetail.img);
            }
          } else {
            this.imgList = [];
          }
          this.dialogDeviceStockDetailVisible = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    keywordChange() {
      this.page = 1;
      console.log(this.storageIdList);
    },

    // 分页处理数据
    getList() {
      console.log("分页数据");
      this.listPage = [];
      console.log(this.stockPendingList);
      this.total = this.stockPendingList.length;
      // es6过滤得到满足搜索条件的展示数据list
      this.listPage = this.stockPendingList.filter(
        (item, index) =>
          index < this.page * this.pageNum &&
          index >= this.pageNum * (this.page - 1)
      );
      console.log(this.listPage);
    },
    // 分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.getList();
      (function smoothscroll() {
        let currentScroll =
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
.upload-imgs {
  // width: 80%;
  display: flex;
}
.delImg {
  margin-left: 10px;
}
.stock-pending-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 6px;
  text-align: left;
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
</style>
<style lang="scss">
.el-table--enable-row-transition .el-table__body td {
  text-align: center;
}
.el-table td,
.el-table th.is-leaf {
  text-align: center;
}
.stock-pending-container {
  #stockDialog {
    .el-dialog__body {
      height: 500px;
      overflow: auto;
      padding: 0 20px;
    }
  }

  .el-dialog__body {
    height: 600px;
    overflow: auto;
    padding: 0 20px;
  }

  .el-textarea__inner {
    height: 100px;
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
    border: none;
    border-radius: 0;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
}

.el-dialog__header {
  text-align: left;
}

#pending {
  .el-dialog__body {
    height: 100px;
    overflow: auto;
    padding: 40px 20px 20px 20px;
  }
}
</style>
