<template>
  <div class="stock-pending-container">
    <!-- <h1>销售报表</h1> -->
    <div style="display:flex;justify-content: space-between;">
      <el-form :inline="true" label-width="95px">
        <el-form-item label="统计币种：">
          <el-select
            v-model="currencySel"
            placeholder="请选择"
            @change="keywordChange"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="item in currencySelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品类别：">
          <el-select
            v-model="productType"
            placeholder="请选择"
            @change="keywordChange"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="item in productTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售组：">
          <el-select
            v-model="group"
            placeholder="请选择"
            @change="keywordChange"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="item in groupList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售时间：">
          <el-date-picker
            v-model="time"
            type="monthrange"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            format="yyyy-MM"
            value-format="yyyy-MM"
            @change="keywordChange"
            clearable
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            style="margin-left: 10px;"
            type="primary"
            @click="getSalesList"
            >查 询</el-button
          >
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="reportData">导出数据</el-button>
      </div>
    </div>
    <el-tabs v-model="activeTabName" @tab-click="handleClick">
      <el-tab-pane label="可结算" name="first">
        <div>
          <div
            class="total-style"
            v-if="salesList.length > 0 && currencySel == 1"
          >
            <div class="style-every">总数量：{{ total }}</div>
            <div class="style-every">
              人民币销售额：{{ formatNumberRgx(totalSaleMoney) + " CNY" }}
            </div>
            <div class="style-every">
              总利润：{{ formatNumberRgx(totalProfit) + " CNY" }}
            </div>
          </div>
          <div
            class="total-style"
            v-if="salesList.length > 0 && currencySel == 2"
          >
            <div class="style-every">总数量：{{ total }}</div>
            <div class="style-every">
              港币销售额：{{ formatNumberRgx(totalSaleMoney) + " HKD" }}
            </div>
            <div class="style-every">
              总利润：{{ formatNumberRgx(totalProfit) + " HKD" }}
            </div>
          </div>
          <el-table
            style="width: 100%;"
            ref="multipleTable"
            :data="salesList"
            tooltip-effect="dark"
            @row-click="handleDeviceListChange"
            @row-dblclick="dblDeviceListChange"
            border
          >
            <el-table-column prop="productNumber" label="统一编号">
            </el-table-column>
            <el-table-column label="图片" width="120px">
              <template slot-scope="scope">
                <div>
                  <img
                    v-if="scope.row.img != ''"
                    :src="axiosUrl + '/file/' + imgFillter(scope.row.img)[0]"
                    style="width: 100px;height: 100px;object-fit: cover;"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="productName" label="产品名称">
            </el-table-column>
            <el-table-column prop="type" label="产品类别"> </el-table-column>
            <el-table-column prop="params" label="参数"></el-table-column>
            <el-table-column prop="stockInTime" label="入库时间">
            </el-table-column>
            <el-table-column prop="stockOutTime" label="销售时间">
            </el-table-column>
            <el-table-column label="成本">
              <template slot-scope="scope">
                <div :style="{ color: scope.row.cost == 0 ? 'red' : '#666' }">
                  {{ formatNumberRgx(scope.row.cost) + " "
                  }}{{ currencySel == 1 ? "CNY" : "HKD" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="最低售价">
              <template slot-scope="scope">
                <div>
                  {{ formatNumberRgx(scope.row.lowestSellPrice) + " CNY" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="批发价">
              <template slot-scope="scope">
                <div>
                  {{ formatNumberRgx(scope.row.adviceWholesalePrice) + " CNY" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="零售价">
              <template slot-scope="scope">
                <div>
                  {{ formatNumberRgx(scope.row.adviseSellPrice) + " CNY" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="出库价">
              <template slot-scope="scope">
                <div>
                  {{
                    formatNumberRgx(scope.row.saleMoney) +
                      " " +
                      scope.row.saleCurrency
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="人民币出库价" v-if="currencySel == 1">
              <template slot-scope="scope">
                <div>
                  {{ formatNumberRgx(scope.row.saleCnyOrHkdMoney) + " CNY" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="港币出库价" v-if="currencySel == 2">
              <template slot-scope="scope">
                <div>
                  {{ formatNumberRgx(scope.row.saleCnyOrHkdMoney) + " HKD" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="利润">
              <template slot-scope="scope">
                <div :style="{ color: scope.row.profit < 0 ? 'red' : '#666' }">
                  {{
                    scope.row.profit == 0
                      ? "--"
                      : formatNumberRgx(scope.row.profit) +
                        " " +
                        (currencySel == 1 ? "CNY" : "HKD")
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="利润率">
              <template slot-scope="scope">
                <div
                  :style="{ color: scope.row.profitRate < 0 ? 'red' : '#666' }"
                >
                  {{
                    scope.row.profitRate == 0
                      ? "--"
                      : scope.row.profitRate + "%"
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="customer" label="买家"> </el-table-column>
            <el-table-column prop="solder" label="销售员"> </el-table-column>
            <el-table-column prop="group" label="组"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div>
                  <span
                    style="color: #3d81fd;cursor: pointer;"
                    @click="delSale(scope.row.id)"
                    >撤销销售</span
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div style="width: 100%;height: 50px;">
            <div style="margin:15px 0;position:absolute;right:6%;">
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
      </el-tab-pane>
      <el-tab-pane label="不可结算" name="second">
        <div>
          <div class="total-style" v-if="salesList.length > 0">
            <div class="style-every">总数量：{{ total }}</div>
          </div>
          <el-table
            style="width: 100%;"
            ref="multipleTable"
            :data="salesList"
            tooltip-effect="dark"
            @row-click="handleDeviceListChange"
            @row-dblclick="dblDeviceListChange"
            border
          >
            <el-table-column prop="productNumber" label="统一编号">
            </el-table-column>
            <el-table-column label="图片" width="120px">
              <template slot-scope="scope">
                <div>
                  <img
                    v-if="scope.row.img != ''"
                    :src="axiosUrl + '/file/' + imgFillter(scope.row.img)[0]"
                    style="width: 100px;height: 100px;object-fit: cover;"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="productName" label="产品名称">
            </el-table-column>
            <el-table-column prop="type" label="产品类别"> </el-table-column>
            <el-table-column prop="params" label="参数"></el-table-column>
            <el-table-column prop="stockInTime" label="入库时间">
            </el-table-column>
            <el-table-column prop="stockOutTime" label="销售时间">
            </el-table-column>
            <el-table-column label="成本">
              <template slot-scope="scope">
                <div :style="{ color: scope.row.cost == 0 ? 'red' : '#666' }">
                  {{ formatNumberRgx(scope.row.cost) + " "
                  }}{{ currencySel == 1 ? "CNY" : "HKD" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="最低售价">
              <template slot-scope="scope">
                <div>
                  {{ formatNumberRgx(scope.row.lowestSellPrice) + " CNY" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="批发价">
              <template slot-scope="scope">
                <div>
                  {{ formatNumberRgx(scope.row.adviceWholesalePrice) + " CNY" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="零售价">
              <template slot-scope="scope">
                <div>
                  {{ formatNumberRgx(scope.row.adviseSellPrice) + " CNY" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="出库价">
              <template slot-scope="scope">
                <div>
                  {{
                    formatNumberRgx(scope.row.saleMoney) +
                      " " +
                      scope.row.saleCurrency
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="人民币出库价" v-if="currencySel == 1">
              <template slot-scope="scope">
                <div
                  :style="{
                    color: scope.row.saleCnyOrHkdMoney == 0 ? 'red' : '#666',
                  }"
                >
                  {{ formatNumberRgx(scope.row.saleCnyOrHkdMoney) + " CNY" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="港币出库价" v-if="currencySel == 2">
              <template slot-scope="scope">
                <div
                  :style="{
                    color: scope.row.saleCnyOrHkdMoney == 0 ? 'red' : '#666',
                  }"
                >
                  {{ formatNumberRgx(scope.row.saleCnyOrHkdMoney) + " HKD" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="利润">
              <template slot-scope="scope">
                <div>
                  {{
                    scope.row.cost == 0 || scope.row.saleCnyOrHkdMoney == 0
                      ? "--"
                      : formatNumberRgx(scope.row.profit) +
                        " " +
                        (currencySel == 1 ? "CNY" : "HKD")
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="利润率">
              <template slot-scope="scope">
                <div>
                  {{
                    scope.row.cost == 0 || scope.row.saleCnyOrHkdMoney == 0
                      ? "--"
                      : scope.row.profitRate + "%"
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="customer" label="买家"> </el-table-column>
            <el-table-column prop="solder" label="销售员"> </el-table-column>
            <el-table-column prop="group" label="组"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div>
                  <span
                    style="color: #3d81fd;cursor: pointer;"
                    @click="delSale(scope.row.id)"
                    >撤销销售</span
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div style="width: 100%;height: 50px;">
            <div style="margin:15px 0;position:absolute;right:6%;">
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
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      v-if="dialogDelSalesVisible"
      title="撤销销售"
      :visible.sync="dialogDelSalesVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :append-to-body="false"
      style="margin-top:20px"
      id="delSale"
    >
      <div class="del-style">
        确定撤销该销售记录吗？确定后不可修改
      </div>
      <div slot="footer">
        <el-button @click="dialogDelSalesVisible = false">取 消</el-button>
        <el-button type="primary" @click="delSaleSure">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-if="dialogInventoryCheckVisible"
      id="msg"
      title="成品信息"
      :visible.sync="dialogInventoryCheckVisible"
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
                    v-model="inventoryCheckDetail.productName"
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
                    v-model="inventoryCheckDetail.designName"
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
                  <el-input
                    v-model="inventoryCheckDetail.designerName"
                    readonly
                  >
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
                        : inventoryCheckDetail.isUpdate == 0
                        ? '#3d82fe'
                        : '#606266',
                    fontWeight:
                      isUpdate == 0
                        ? 'normal'
                        : inventoryCheckDetail.isUpdate == 0
                        ? 'bold'
                        : 'normal',
                  }"
                >
                  唯一编号
                </div>
                <div class="one-right">
                  <el-input
                    v-model="inventoryCheckDetail.productNumber"
                    :readonly="
                      isUpdate == 0
                        ? true
                        : inventoryCheckDetail.isUpdate == 0
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
                    v-model="inventoryCheckDetail.params"
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
                    v-model="inventoryCheckDetail.certificateNumber"
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
                v-if="inventoryCheckDetail.img != '' || isUpdate == 1"
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
                v-if="inventoryCheckDetail.img == '' && isUpdate == 0"
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
                v-if="inventoryCheckDetail.detailImg != '' || isUpdate == 1"
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
                v-if="inventoryCheckDetail.detailImg == '' && isUpdate == 0"
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
              <div class="upload-imgs">
                <div
                  v-if="inventoryCheckDetail.designImg != ''"
                  style="display:flex;position:relative;flex-wrap: wrap;"
                >
                  <div
                    v-for="(imgurl, index) of imgFillter(
                      inventoryCheckDetail.designImg
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
              :data="inventoryCheckDetail.materialList"
              tooltip-effect="dark"
              border
              highlight-current-row
              @row-dblclick="checkinventoryCheckDetails"
            >
              <el-table-column prop="name" label="名称"> </el-table-column>
              <el-table-column prop="number" label="数量"> </el-table-column>
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
                    v-model="inventoryCheckDetail.note"
                    :readonly="isUpdate == 0 ? true : false"
                  >
                  </el-input>
                </div>
              </div>
            </div>
            <p class="font-title-style">活动信息</p>
            <div class="font-div">
              <div class="div-one-note" id="one-note">
                <div
                  class="one-left"
                  :style="{
                    color: isUpdate == 0 ? '#606266' : '#3d82fe',
                    fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                  }"
                >
                  活动信息
                </div>
                <div class="one-right">
                  <el-input
                    type="textarea"
                    v-model="inventoryCheckDetail.activityInfo"
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
                    v-model="inventoryCheckDetail.currency"
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
                    v-model="inventoryCheckDetail.costPrice"
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
                    v-model="inventoryCheckDetail.processCost"
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
                    v-model="inventoryCheckDetail.totalCnRate"
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
                    v-model="inventoryCheckDetail.totalCnPrice"
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
                    v-model="inventoryCheckDetail.totalHkRate"
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
                    v-model="inventoryCheckDetail.totalHkPrice"
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
                    v-model="inventoryCheckDetail.lowestSellPrice"
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
                    v-model="inventoryCheckDetail.adviceWholesalePrice"
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
                    v-model="inventoryCheckDetail.adviseSellPrice"
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
                    v-model="inventoryCheckDetail.agentPrice"
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
                  建议柜台最低销售价(CNY)
                </div>
                <div class="one-right">
                  <el-input
                    :readonly="isUpdate == 0 ? true : false"
                    v-model="inventoryCheckDetail.counterLowestSellPrice"
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
                    v-model="inventoryCheckDetail.tagPrice"
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
                    v-model="inventoryCheckDetail.saleCommission"
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
                    v-model="inventoryCheckDetail.totalPriceNote"
                    :readonly="isUpdate == 0 ? true : false"
                  >
                  </el-input>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="销售信息" name="third">
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
                    v-model="inventoryCheckDetail.solder"
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
                    v-model="inventoryCheckDetail.group"
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
                  客户姓名
                </div>
                <div class="one-right">
                  <el-input
                    :readonly="isUpdate == 0 ? true : false"
                    v-model="inventoryCheckDetail.customer"
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
                    @change="currencyChange"
                    v-model="inventoryCheckDetail.saleCurrency"
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
                    v-model="inventoryCheckDetail.saleMoney"
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
                    @input="totalCnRateChange"
                    :readonly="isUpdate == 0 ? true : false"
                    v-model="inventoryCheckDetail.totalToCnRate"
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
                    v-model="inventoryCheckDetail.sellTotalCnPrice"
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
                    @input="totalHkRateChange"
                    :readonly="isUpdate == 0 ? true : false"
                    v-model="inventoryCheckDetail.totalToHkRate"
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
                    v-model="inventoryCheckDetail.sellTotalHkPrice"
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
                inventoryCheckDetail.state == 0
                  ? "库存中"
                  : inventoryCheckDetail.state == 1
                  ? "运输中"
                  : inventoryCheckDetail.state == 3
                  ? "加工完成"
                  : "已出售"
              }}
            </p>
            <el-timeline>
              <el-timeline-item
                color="#3d82fe"
                size="large"
                v-for="(activity, index) in inventoryCheckDetail.stockInOutList"
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
        <el-button @click="dialogInventoryCheckVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="inventoryLookSure" v-preventClick
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      v-if="dialogDeviceDetailVisible"
      title="材料信息"
      :visible.sync="dialogDeviceDetailVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :append-to-body="false"
    >
      <div id="invenSome">
        <el-tabs style="margin-top: 20px;" v-model="activeStockName">
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
                  style="color: #606266;font-weight: normal;"
                >
                  材料名称
                </div>
                <div class="one-right">
                  <el-input
                    v-model="deviceDetail.materialName"
                    readonly
                  ></el-input>
                </div>
              </div>
              <div class="div-one">
                <div
                  class="one-left"
                  style="color: #606266;font-weight: normal;"
                >
                  仓库/加工厂
                </div>
                <div class="one-right">
                  <el-input
                    v-model="deviceDetail.storageName"
                    readonly
                  ></el-input>
                </div>
              </div>
              <div class="div-one">
                <div
                  class="one-left"
                  style="color: #606266;font-weight: normal;"
                >
                  统一编号
                </div>
                <div class="one-right">
                  <el-input v-model="deviceDetail.productNumber" readonly>
                  </el-input>
                </div>
              </div>

              <div class="div-one" v-show="certificateshow2 == false">
                <div
                  class="one-left"
                  :style="{
                    color: isUpdate == 0 ? '#606266' : '#3d82fe',
                    fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                  }"
                >
                  形状
                </div>
                <div class="one-right">
                  <el-input
                    :readonly="isUpdate == 0 ? true : false"
                    v-model="deviceDetail.shape"
                    clearable
                  >
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div
                  class="one-left"
                  :style="{
                    color: isUpdate == 0 ? '#606266' : '#3d82fe',
                    fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                  }"
                >
                  产品类型
                </div>
                <div class="one-right">
                  <el-input
                    :readonly="isUpdate == 0 ? true : false"
                    v-model="deviceDetail.productType"
                    clearable
                  >
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div
                  class="one-left"
                  :style="{
                    color: isUpdate == 0 ? '#606266' : '#3d82fe',
                    fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                  }"
                >
                  产地
                </div>
                <div class="one-right">
                  <el-input
                    :readonly="isUpdate == 0 ? true : false"
                    v-model="deviceDetail.productArea"
                    clearable
                  >
                  </el-input>
                </div>
              </div>

              <div class="div-one" v-show="certificateshow2 == false">
                <div
                  class="one-left"
                  :style="{
                    color: isUpdate == 0 ? '#606266' : '#3d82fe',
                    fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                  }"
                >
                  尺寸/毫米
                </div>
                <div class="one-right">
                  <el-input
                    :readonly="isUpdate == 0 ? true : false"
                    v-model="deviceDetail.size"
                    clearable
                  >
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div
                  class="one-left"
                  :style="{
                    color: isUpdate == 0 ? '#606266' : '#3d82fe',
                    fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                  }"
                >
                  颜色
                </div>
                <div class="one-right">
                  <el-input
                    :readonly="isUpdate == 0 ? true : false"
                    v-model="deviceDetail.color"
                    clearable
                  >
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div
                  class="one-left"
                  :style="{
                    color: isUpdate == 0 ? '#606266' : '#3d82fe',
                    fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                  }"
                >
                  配对
                </div>
                <div class="one-right">
                  <el-input
                    :readonly="isUpdate == 0 ? true : false"
                    v-model="deviceDetail.paired"
                    clearable
                  >
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div
                  class="one-left"
                  :style="{
                    color: isUpdate == 0 ? '#606266' : '#3d82fe',
                    fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                  }"
                >
                  品质
                </div>
                <div class="one-right">
                  <el-input
                    :readonly="isUpdate == 0 ? true : false"
                    v-model="deviceDetail.quality"
                    clearable
                  >
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div
                  class="one-left"
                  :style="{
                    color: isUpdate == 0 ? '#606266' : '#3d82fe',
                    fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                  }"
                >
                  品质细分
                </div>
                <div class="one-right">
                  <el-input
                    :readonly="isUpdate == 0 ? true : false"
                    v-model="deviceDetail.subsection"
                    clearable
                  >
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div
                  class="one-left"
                  :style="{
                    color: isUpdate == 0 ? '#606266' : '#3d82fe',
                    fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                  }"
                >
                  盒子编号
                </div>
                <div class="one-right">
                  <el-input
                    :readonly="isUpdate == 0 ? true : false"
                    v-model="deviceDetail.boxNumber"
                    clearable
                  >
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
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
                    :readonly="isUpdate == 0 ? true : false"
                    v-model="deviceDetail.certificateNumber"
                    clearable
                  >
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div
                  class="one-left"
                  :style="{
                    color: isUpdate == 0 ? '#606266' : '#3d82fe',
                    fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                  }"
                >
                  发票号
                </div>
                <div class="one-right">
                  <el-input
                    :readonly="isUpdate == 0 ? true : false"
                    v-model="deviceDetail.billNumber"
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
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                  margin: 0,
                  width: '50px',
                }"
              >
                图片：
              </p>
              <div class="upload-imgs">
                <div class="add" v-show="isUpdate == 1">
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
                    v-for="(imgurl, index) of imgList"
                    :key="index"
                    style="margin-left:10px;position:relative;"
                  >
                    <span
                      v-if="imgurl !== '' && imgurl !== null && isUpdate == 1"
                      class="spanStyle"
                      @click="delImage3(index)"
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
                  <el-radio-group v-model="deviceDetail.chargeUnit" disabled>
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
                    color: isUpdate == 0 ? '#606266' : '#3d82fe',
                    fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                  }"
                >
                  单价
                </div>
                <div class="one-right">
                  <el-input
                    :readonly="isUpdate == 0 ? true : false"
                    v-model="deviceDetail.unitPrice"
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
                    color: isUpdate == 0 ? '#606266' : '#3d82fe',
                    fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                  }"
                >
                  币种
                </div>
                <div class="one-right">
                  <el-radio-group
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
                    color:
                      isUpdate == 0
                        ? '#606266'
                        : deviceDetail.isUpdate == 0
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
                        : deviceDetail.isUpdate == 0
                        ? false
                        : true
                    "
                    v-model="deviceDetail.number"
                    clearable
                    ><i
                      slot="suffix"
                      v-if="deviceDetail.chargeUnit == '粒'"
                      style="color: #606266;font-style:normal;"
                      >{{ deviceDetail.chargeUnit }}</i
                    >
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div
                  class="one-left"
                  :style="{
                    color: isUpdate == 0 ? '#606266' : '#3d82fe',
                    fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                  }"
                >
                  总重量
                </div>
                <div class="one-right">
                  <el-input
                    :readonly="isUpdate == 0 ? true : false"
                    v-model="deviceDetail.weight"
                    @input="priceTotal"
                    clearable
                    ><i
                      slot="suffix"
                      v-if="deviceDetail.chargeUnit != '粒'"
                      style="color: #606266;font-style:normal;"
                      >{{ deviceDetail.chargeUnit }}</i
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
                        : deviceDetail.isUpdate == 0
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
                        : deviceDetail.isUpdate == 0
                        ? false
                        : true
                    "
                    v-model="deviceDetail.totalPrice"
                    clearable
                  >
                    <i
                      slot="suffix"
                      style="color: #606266;font-style:normal;"
                      >{{ deviceDetail.currency }}</i
                    >
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div
                  class="one-left"
                  :style="{
                    color: isUpdate == 0 ? '#606266' : '#3d82fe',
                    fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                  }"
                >
                  零售单价
                </div>
                <div class="one-right">
                  <el-input
                    :readonly="isUpdate == 0 ? true : false"
                    v-model="deviceDetail.retailPrice"
                    clearable
                  >
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div
                  class="one-left"
                  :style="{
                    color: isUpdate == 0 ? '#606266' : '#3d82fe',
                    fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                  }"
                >
                  建议柜台最低销售价
                </div>
                <div class="one-right">
                  <el-input
                    :readonly="isUpdate == 0 ? true : false"
                    v-model="deviceDetail.counterLowestSellPrice"
                    clearable
                  >
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div
                  class="one-left"
                  :style="{
                    color: isUpdate == 0 ? '#606266' : '#3d82fe',
                    fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                  }"
                >
                  代理价
                </div>
                <div class="one-right">
                  <el-input
                    :readonly="isUpdate == 0 ? true : false"
                    v-model="deviceDetail.agentPrice"
                    clearable
                  >
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div
                  class="one-left"
                  :style="{
                    color: isUpdate == 0 ? '#606266' : '#3d82fe',
                    fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                  }"
                >
                  批发单价
                </div>
                <div class="one-right">
                  <el-input
                    :readonly="isUpdate == 0 ? true : false"
                    v-model="deviceDetail.wholesalePrice"
                    clearable
                  >
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
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
                    :readonly="isUpdate == 0 ? true : false"
                    v-model="deviceDetail.totalCnRate"
                    clearable
                  >
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div
                  class="one-left"
                  :style="{
                    color: isUpdate == 0 ? '#606266' : '#3d82fe',
                    fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                  }"
                >
                  总价人民币金额
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
              <div class="div-one" v-show="certificateshow2 == false">
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
                    :readonly="isUpdate == 0 ? true : false"
                    v-model="deviceDetail.totalHkRate"
                    clearable
                  >
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div
                  class="one-left"
                  :style="{
                    color: isUpdate == 0 ? '#606266' : '#3d82fe',
                    fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                  }"
                >
                  总价港币金额
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
          <el-tab-pane label="销售信息" name="third">
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
              材料状态：{{
                deviceDetail.state == 0
                  ? "库存中"
                  : deviceDetail.state == 1
                  ? "运输中"
                  : deviceDetail.state == 2
                  ? "加工中"
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
        <el-button @click="dialogDeviceDetailVisible = false">取 消</el-button>
        <el-button type="primary" @click="materialSure">确 定</el-button>
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
                style="display:flex;position:relative;flex-wrap: wrap;"
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
                    :src="imgurl.length < 42 ? img + '/file/' + imgurl : imgurl"
                    width="100px"
                    height="100px"
                    style="border-radius:5px;object-fit:cover;"
                  />
                </div>
              </div>
            </div>
            <p class="font-title-style">备注信息</p>
            <div class="font-div">
              <div class="div-one-note" id="one-note">
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
                  {{ deviceDetails.totalPrice + " " + deviceDetails.currency }}
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
                  建议柜台最低销售价
                </div>
                <div class="one-right">
                  {{ deviceDetails.counterLowestSellPrice }}
                </div>
              </div>
              <div class="div-one">
                <div class="one-left">
                  代理价
                </div>
                <div class="one-right">
                  {{ deviceDetails.agentPrice }}
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
        <el-button @click="dialogDeviceDetailsVisible = false">取 消</el-button>
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
        ><el-button style="margin-left: 10px;" @click="getproducibleDesignList"
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
</template>

<script>
export default {
  data() {
    return {
      img: this.$store.state.baseUrl,
      axiosUrl: this.$store.state.baseUrl,
      currencySel: 1,
      currencySelList: [
        {
          id: 1,
          name: "人民币",
        },
        {
          id: 2,
          name: "港币",
        },
      ],
      productType: 0,
      productTypeList: [
        {
          id: 0,
          name: "全部",
        },
        {
          id: 1,
          name: "原材料",
        },
        {
          id: 2,
          name: "成品",
        },
      ],
      group: "全部",
      groupList: "",
      salesList: [],
      time: null,
      total: 0,
      page: 1,

      delId: null,
      dialogDelSalesVisible: false,

      dialogInventoryCheckVisible: false,
      inventoryCheckDetail: {},
      deviceDetails: {},

      isUpdate: 0,
      imgList: [],
      productimgList: [],
      detailImgList: [],
      activeStockName: "first",
      activeName: "ff",

      productLabelList: [],
      labelSelList: [],

      imgSortList: [],
      count: 0,
      certificateshow2: false,
      dialogDeviceDetailVisible: false,
      deviceDetail: {},
      dialogDeviceDetailsVisible: false,

      designListKeyword: "",
      statusDesign: "1",
      producibleDesignList: [],
      chooseimgshow: false,

      activeTabName: "first",
      totalSaleMoney: 0,
      totalProfit: 0,
    };
  },
  created() {
    this.getGroupList();
    this.getLabelList();
    this.getproducibleDesignList();
  },
  methods: {
    // 成本汇率变化
    totalCostCnRateChange() {
      let num =
        this.inventoryCheckDetail.costPrice *
          this.inventoryCheckDetail.totalCnRate +
        Number(this.inventoryCheckDetail.processCost);
      this.inventoryCheckDetail.totalCnPrice = Math.ceil(num);
    },
    totalCostHkRateChange() {
      this.inventoryCheckDetail.totalHkPrice = Math.ceil(
        this.inventoryCheckDetail.totalCnPrice /
          this.inventoryCheckDetail.totalHkRate
      );
    },
    // 成本币种-汇率变化
    currencyCostChange() {
      this.inventoryCheckDetail.totalCnRate = "";
      this.inventoryCheckDetail.totalCnPrice = "";
      this.inventoryCheckDetail.totalHkRate = "";
      this.inventoryCheckDetail.totalHkPrice = "";
      if (this.inventoryCheckDetail.currency == "CNY") {
        this.inventoryCheckDetail.totalCnRate = 1;
        this.inventoryCheckDetail.totalCnPrice = this.inventoryCheckDetail.costPrice;
      } else if (this.inventoryCheckDetail.currency == "HKD") {
        this.inventoryCheckDetail.totalHkPrice = this.inventoryCheckDetail.costPrice;
      }
    },
    // 成品售价汇率变化
    totalCnRateChange() {
      let num =
        this.inventoryCheckDetail.saleMoney *
        this.inventoryCheckDetail.totalToCnRate;
      this.inventoryCheckDetail.sellTotalCnPrice = Math.ceil(num);
    },
    totalHkRateChange() {
      this.inventoryCheckDetail.sellTotalHkPrice = Math.ceil(
        this.inventoryCheckDetail.sellTotalCnPrice /
          this.inventoryCheckDetail.totalToHkRate
      );
    },
    // 成品币种-汇率变化
    currencyChange() {
      this.inventoryCheckDetail.totalToCnRate = "";
      this.inventoryCheckDetail.sellTotalCnPrice = "";
      this.inventoryCheckDetail.totalToHkRate = "";
      this.inventoryCheckDetail.sellTotalHkPrice = "";
      if (this.inventoryCheckDetail.saleCurrency == "CNY") {
        this.inventoryCheckDetail.totalToCnRate = 1;
        this.inventoryCheckDetail.sellTotalCnPrice = this.inventoryCheckDetail.saleMoney;
      } else if (this.inventoryCheckDetail.saleCurrency == "HKD") {
        this.inventoryCheckDetail.sellTotalHkPrice = this.inventoryCheckDetail.saleMoney;
      }
    },
    // 材料售价汇率变化
    totalCnRateChange2() {
      let num = this.deviceDetail.saleMoney * this.deviceDetail.totalToCnRate;
      this.deviceDetail.sellTotalCnPrice = Math.ceil(num);
    },
    totalHkRateChange2() {
      this.deviceDetail.sellTotalHkPrice = Math.ceil(
        this.deviceDetail.sellTotalCnPrice / this.deviceDetail.totalToHkRate
      );
    },
    // 材料币种-汇率变化
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
    // tab切换
    handleClick(tab, event) {
      console.log(tab, event);
      console.log(this.activeTabName);
      this.page = 1;
      this.getSalesList();
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
      console.log(row);
      if (row != null) {
        this.inventoryCheckDetail.designId = row.id;
        this.inventoryCheckDetail.designName = row.name;
        this.inventoryCheckDetail.designerName = row.designerName;
        let list = [];
        for (const item of row.img.split("|")) {
          if (item != "") {
            list.push(this.img + "/file/" + item);
          }
        }

        this.inventoryCheckDetail.designImg = list.join("|");
      }
    },
    //关闭
    handleClose() {
      this.$refs.multipleTableDesign.clearSelection();
      this.chooseimgshow = false;
    },
    imgFillter(img) {
      // console.log(img);
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
    // 修改原材料信息
    materialSure() {
      console.log(this.deviceDetail);
      if (this.isUpdate == 0) {
        this.dialogDeviceDetailVisible = false;
      } else {
        this.$axios
          .post(this.$store.state.baseUrl + "/materialSave", {
            id: this.deviceDetail.id,
            materialId: this.deviceDetail.materialId,
            storageId: this.deviceDetail.storageId,
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
            productType: this.deviceDetail.productType,
            productArea: this.deviceDetail.productArea,
            billNumber: this.deviceDetail.billNumber,
            shape: this.deviceDetail.shape,
            unitPrice: this.deviceDetail.unitPrice,
            currency: this.deviceDetail.currency,
            number: this.deviceDetail.number,
            weight: this.deviceDetail.weight,
            totalPrice: this.deviceDetail.totalPrice,
            retailPrice: this.deviceDetail.retailPrice,
            wholesalePrice: this.deviceDetail.wholesalePrice,
            size: this.deviceDetail.size,
            color: this.deviceDetail.color,
            paired: this.deviceDetail.paired,
            quality: this.deviceDetail.quality,
            subsection: this.deviceDetail.subsection,
            boxNumber: this.deviceDetail.boxNumber,
            certificateNumber: this.deviceDetail.certificateNumber,
            productNumber: this.deviceDetail.productNumber,
            note: this.deviceDetail.note,
            img: this.imgList.join("|"),
            totalPriceNote: this.deviceDetail.totalPriceNote,
            totalCnRate: this.deviceDetail.totalCnRate,
            totalCnPrice: this.deviceDetail.totalCnPrice,
            totalHkRate: this.deviceDetail.totalHkRate,
            totalHkPrice: this.deviceDetail.totalHkPrice,
            agentPrice: this.deviceDetail.agentPrice,
            counterLowestSellPrice: this.deviceDetail.counterLowestSellPrice,
          })
          .then((res) => {
            console.log("修改材料信息");
            console.log(res);
            this.$message.success({
              message: "修改成功",
              showClose: true,
              duration: 2000,
            });
            this.dialogDeviceDetailVisible = false;
            this.getSalesList();
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
    // 查看成品中原材料详情
    checkinventoryCheckDetails(val) {
      this.activeName = "ff";
      this.deviceDetails = {};
      this.$axios
        .post(this.$store.state.baseUrl + "/stockMaterialInfo", {
          id: val.id,
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
    // 修改材料单价时总价的变化
    priceTotal() {
      this.deviceDetail.totalPrice = 0;
      if (this.deviceDetail.chargeUnit == "粒") {
        this.deviceDetail.totalPrice = (
          this.deviceDetail.unitPrice * this.deviceDetail.number
        ).toFixed(2);
      } else {
        this.deviceDetail.totalPrice = (
          this.deviceDetail.unitPrice * this.deviceDetail.weight
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
        this.params = {};
        this.params = {
          id: this.inventoryCheckDetail.id,
          productName: this.inventoryCheckDetail.productName,
          processCost: this.inventoryCheckDetail.processCost,
          designId: this.inventoryCheckDetail.designId,
          note: this.inventoryCheckDetail.note,
          activityInfo: this.inventoryCheckDetail.activityInfo,
          solder: this.inventoryCheckDetail.solder,
          group: this.inventoryCheckDetail.group,
          customer: this.inventoryCheckDetail.customer,
          saleMoney: this.inventoryCheckDetail.saleMoney,
          saleCurrency: this.inventoryCheckDetail.saleCurrency,
          receiver: this.inventoryCheckDetail.receiver,
          totalToCnRate: this.inventoryCheckDetail.totalToCnRate,
          sellTotalCnPrice: this.inventoryCheckDetail.sellTotalCnPrice,
          totalToHkRate: this.inventoryCheckDetail.totalToHkRate,
          sellTotalHkPrice: this.inventoryCheckDetail.sellTotalHkPrice,
          sellBillNumber: this.inventoryCheckDetail.sellBillNumber,
          currency: this.inventoryCheckDetail.currency,
          productNumber: this.inventoryCheckDetail.productNumber,
          costPrice: this.inventoryCheckDetail.costPrice,
          lowestSellPrice: this.inventoryCheckDetail.lowestSellPrice,
          adviseSellPrice: this.inventoryCheckDetail.adviseSellPrice,
          tagPrice: this.inventoryCheckDetail.tagPrice,
          adviceWholesalePrice: this.inventoryCheckDetail.adviceWholesalePrice,
          saleCommission: this.inventoryCheckDetail.saleCommission,
          img: this.productimgList.join("|"),
          params: this.inventoryCheckDetail.params,
          certificateNumber: this.inventoryCheckDetail.certificateNumber,
          totalPriceNote: this.inventoryCheckDetail.totalPriceNote,
          totalCnRate: this.inventoryCheckDetail.totalCnRate,
          totalCnPrice: this.inventoryCheckDetail.totalCnPrice,
          totalHkRate: this.inventoryCheckDetail.totalHkRate,
          totalHkPrice: this.inventoryCheckDetail.totalHkPrice,
          productLabel: this.labelSelList.join("|"),
          detailImg: this.detailImgList.join("|"),
          agentPrice: this.inventoryCheckDetail.agentPrice,
          counterLowestSellPrice: this.inventoryCheckDetail
            .counterLowestSellPrice,
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
            this.dialogInventoryCheckVisible = false;
            this.getSalesList();
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

          if (this.dialogDeviceDetailVisible == true) {
            if (this.imgList.indexOf(imgurl) == -1) {
              this.imgSortList.splice(i, 1, imgurl);
              this.count++;
            }

            if (this.count === this.imgSortList.length) {
              this.imgList = this.imgList.concat(this.imgSortList);
            }
          } else {
            if (this.productimgList.indexOf(imgurl) == -1) {
              this.imgSortList.splice(i, 1, imgurl);
              this.count++;
            }

            if (this.count === this.imgSortList.length) {
              this.productimgList = this.productimgList.concat(
                this.imgSortList
              );
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
      this.productimgList.splice(index, 1);
    },
    delImage3(index) {
      this.imgList.splice(index, 1);
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
    // 查看详情
    handleDeviceListChange(row, column) {
      console.log(row);
      if (column.label == "操作") {
        this.delSale(row.id);
      }
    },
    dblDeviceListChange(row) {
      this.inventoryCheckDetail = {};
      this.activeStockName = "first";
      this.isUpdate = 0;
      if (row.isMaterial == 0) {
        this.$axios
          .post(this.$store.state.baseUrl + "/productInfo", {
            id: row.id,
          })
          .then((res) => {
            console.log("成品详情");
            console.log(res);
            this.inventoryCheckDetail = res.data;
            this.dialogInventoryCheckVisible = true;
            this.productimgList = [];

            if (
              this.inventoryCheckDetail.img !== null &&
              this.inventoryCheckDetail.img !== ""
            ) {
              if (this.inventoryCheckDetail.img.indexOf("|") !== -1) {
                this.productimgList = this.inventoryCheckDetail.img.split("|");
              } else {
                this.productimgList.push(this.inventoryCheckDetail.img);
              }
            } else {
              this.productimgList = [];
            }

            this.detailImgList = [];
            if (
              this.inventoryCheckDetail.detailImg !== null &&
              this.inventoryCheckDetail.detailImg !== ""
            ) {
              if (this.inventoryCheckDetail.detailImg.indexOf("|") !== -1) {
                this.detailImgList = this.inventoryCheckDetail.detailImg.split(
                  "|"
                );
              } else {
                this.detailImgList.push(this.inventoryCheckDetail.detailImg);
              }
            } else {
              this.detailImgList = [];
            }

            this.labelSelList = [];
            if (
              this.inventoryCheckDetail.productLabel !== null &&
              this.inventoryCheckDetail.productLabel !== ""
            ) {
              if (this.inventoryCheckDetail.productLabel.indexOf("|") !== -1) {
                this.labelSelList = this.inventoryCheckDetail.productLabel.split(
                  "|"
                );
              } else {
                this.labelSelList.push(this.inventoryCheckDetail.productLabel);
              }
            } else {
              this.labelSelList = [];
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (row.isMaterial == 1) {
        this.$axios
          .post(this.$store.state.baseUrl + "/stockMaterialInfo", {
            id: row.id,
          })
          .then((res) => {
            console.log("原材料详情");
            console.log(res);
            this.deviceDetail = res.data;
            this.dialogDeviceDetailVisible = true;
            this.imgList = [];

            if (this.deviceDetail.materialId == 11) {
              this.certificateshow2 = true;
            } else {
              this.certificateshow2 = false;
            }

            if (
              this.deviceDetail.img !== null &&
              this.deviceDetail.img !== ""
            ) {
              if (this.deviceDetail.img.indexOf("|") !== -1) {
                this.imgList = this.deviceDetail.img.split("|");
              } else {
                this.imgList.push(this.deviceDetail.img);
              }
            } else {
              this.imgList = [];
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // 撤销销售
    delSale(id) {
      this.delId = id;
      this.dialogDelSalesVisible = true;
    },
    // 确定撤销
    delSaleSure() {
      this.dialogDelSalesVisible = false;
      this.$axios
        .get(this.$store.state.baseUrl + "/revokeSale?id=" + this.delId)
        .then((res) => {
          console.log("撤销销售");
          console.log(res);

          this.$message.success({
            message: "撤销成功",
            showClose: true,
            duration: 2000,
          });
          this.getSalesList();
        })
        .catch((err) => {
          console.log(err);
          this.$message.success({
            message: err.data.message,
            showClose: true,
            duration: 2000,
          });
        });
    },
    // 导出数据
    reportData() {
      this.$axios
        .post(this.$store.state.baseUrl + "/salesReportExport", {
          type: this.productType,
          group: this.group,
          startTime: this.time == null ? "" : this.time[0],
          endTime: this.time == null ? "" : this.time[1],
          page: 1,
          currency: this.currencySel == 1 ? "CNY" : "HKD",
        })
        .then((res) => {
          console.log("导出销售报表");
          console.log(res);
          location.href = this.axiosUrl + res.data.url;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取销售报表列表
    getSalesList() {
      this.salesList = [];
      this.$axios
        .post(this.$store.state.baseUrl + "/salesReport", {
          type: this.productType,
          group: this.group,
          startTime: this.time == null ? "" : this.time[0],
          endTime: this.time == null ? "" : this.time[1],
          page: this.page,
          pageNum: 10,
          state: this.activeTabName == "first" ? 1 : -1,
          currency: this.currencySel == 1 ? "CNY" : "HKD",
        })
        .then((res) => {
          console.log("销售报表列表");
          console.log(res);
          this.total = res.data.total;
          this.totalSaleMoney = res.data.allSaleMoney;
          this.totalProfit = res.data.allProfit;
          this.salesList = res.data.list;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取销售员列表
    getGroupList() {
      this.$axios
        .get(this.$store.state.baseUrl + "/groupList")
        .then((res) => {
          console.log("销售员列表");
          console.log(res);
          this.groupList = res.data;
          this.getSalesList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    keywordChange() {
      this.page = 1;
      this.activeTabName = "first";
    },
    // 分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.getSalesList();
      (function smoothscroll() {
        let currentScroll =
          document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
          window.requestAnimationFrame(smoothscroll);
          window.scrollTo(0, currentScroll - currentScroll / 5);
        }
      })();
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

<style lang="scss" scoped>
.del-style {
  padding: 20px;
  font-size: 16px;
}

.total-style {
  display: flex;
  align-items: center;

  .style-every {
    margin-right: 30px;
    margin-bottom: 20px;
    font-size: 16px;
  }
}
.upload-imgs {
  display: flex;
  margin-bottom: 10px;
  position: relative;
  .delImg {
    margin-left: 10px;
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
      width: 160px;
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

#delSale {
  .el-dialog__body {
    height: 80px;
    overflow: auto;
    padding: 0 20px;
  }
}
.stock-pending-container {
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
</style>
