<template>
  <div class="warehouse-management-container" id="warehouse">
    <!-- <h1>成品入库管理</h1> -->
    <div class="add-left">
      <p class="title-font">原材料清单</p>
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
        <el-table-column label="总数量">
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
        <el-table-column label="总重量">
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
        <el-table-column label="入库数量" width="130">
          <template slot-scope="scope">
            <div class="num">
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
        <el-table-column label="入库重量" width="130">
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
        label-width="180px"
      >
        <el-form-item label="设计图片：" prop="designId">
          <el-button
            type="text"
            v-if="chooseimgshow == false"
            @click="chooseimgshow = true"
            >点击选择设计图</el-button
          >
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
              :data="producibleDesignList.list"
              style="width: 90%;margin:auto;"
              highlight-current-row
              border
              @current-change="chooseimglist"
              ref="multipleTable"
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
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="imglistout">取 消</el-button>
                <el-button type="primary" @click="imglistbutton"
                  >确 定</el-button
                >
              </span>
            </template>
          </el-dialog>
          <div
            v-show="chooseimgshow == false && chooselistimg"
            style="display:flex;position:relative;flex-wrap: wrap;"
          >
            <div
              v-for="(imgurl, index) of imgFillter(chooselistimgtemp.img)"
              :key="index"
              style="margin-left:10px;position:relative;"
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
        </el-form-item>
        <el-form-item label="成品图片：" prop="img">
          <div style="display:flex;">
            <div class="upload-imgs">
              <div class="add">
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
                  v-for="(imgurl, index) of deliveryData.img"
                  :key="index"
                  style="margin-left:10px;position:relative;"
                  v-dragging="{
                    item: imgurl,
                    list: deliveryData.img,
                    group: 'deliveryData.img',
                  }"
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
        </el-form-item>
        <el-form-item label="详情图片：" prop="detailImg">
          <div style="display:flex;">
            <div class="upload-imgs">
              <div class="add">
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
                class="delImg"
              >
                <div
                  v-for="(imgurl, index) of deliveryData.detailImg"
                  :key="index"
                  style="margin-left:10px;position:relative;"
                  v-dragging="{
                    item: imgurl,
                    list: deliveryData.detailImg,
                    group: 'deliveryData.detailImg',
                  }"
                >
                  <span
                    v-if="imgurl !== '' && imgurl !== null"
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
          </div>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="成品唯一编号" prop="productNumber">
              <el-input
                v-model="deliveryData.productNumber"
                placeholder="请输入唯一编号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成品名称" prop="productName">
              <el-input
                v-model="deliveryData.productName"
                placeholder="请输入成品名称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="标签" prop="productLabel">
          <el-select
            v-model="deliveryData.productLabel"
            placeholder="可多选"
            multiple
            @change="labelChange"
            style="width: 100%;"
          >
            <el-option
              v-for="item in productLabelList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数" prop="materialParams">
          <el-input
            type="textarea"
            v-model="deliveryData.materialParams"
            placeholder="请输入产品参数"
          ></el-input>
        </el-form-item>
        <el-form-item label="证书编号：" prop="certificateNumber">
          <el-input
            v-model="deliveryData.certificateNumber"
            placeholder="多个证书编号，用逗号隔开"
          ></el-input>
        </el-form-item>
        <el-form-item label="入库类型：" prop="type">
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
          required
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
        <el-row :gutter="10" v-if="deliveryData.type == 1">
          <el-col :span="12">
            <el-form-item label="仓库/加工厂：" prop="warehouseId">
              <el-select
                v-model="deliveryData.warehouseId"
                placeholder="请选择仓库/加工厂"
                class="input-style"
                :popper-append-to-body="false"
              >
                <el-option
                  v-for="item in warehouseFilterList"
                  v-show="item.isOwn == 1"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售员：" prop="solder">
              <el-input
                v-model="deliveryData.solder"
                placeholder="请输入销售员"
                clearable
                class="input-style"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-if="deliveryData.type == 1">
          <el-col :span="12">
            <el-form-item label="组：" prop="group">
              <el-input
                v-model="deliveryData.group"
                placeholder="请输入"
                clearable
                class="input-style"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="顾客姓名：" prop="customer">
              <el-input
                v-model="deliveryData.customer"
                placeholder="请输入顾客姓名"
                clearable
                class="input-style"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="出售币种："
          v-if="deliveryData.type == 1"
          prop="saleCurrency"
        >
          <el-radio-group v-model="deliveryData.saleCurrency">
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
            v-model="deliveryData.saleMoney"
            placeholder="请输入出售金额"
            clearable
            class="input-style"
            @change="getNum"
          ></el-input>
        </el-form-item>
        <el-form-item label="裸石成本币种：" prop="currency">
          <el-radio-group
            v-model="deliveryData.currency"
            @change="currencyChange"
          >
            <el-radio label="CNY">CNY</el-radio>
            <el-radio label="EUR">EUR</el-radio>
            <el-radio label="USD">USD</el-radio>
            <el-radio label="HKD">HKD</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="裸石成本" prop="costPrice">
              <el-input
                v-model="deliveryData.costPrice"
                placeholder="请输入成本金额"
                @change="getNum"
                @input="currencyChange"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="加工费(CNY)" prop="processCost">
              <el-input
                @input="totalCnRateChange"
                v-model="deliveryData.processCost"
                placeholder="请输入加工费金额"
                @change="getNum"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="外币兑换人民币汇率" prop="totalCnRate">
              <el-input
                @input="totalCnRateChange"
                v-model="deliveryData.totalCnRate"
                placeholder="请输入外币兑换人民币汇率"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成本人民币金额" prop="totalCnPrice">
              <el-input
                v-model="deliveryData.totalCnPrice"
                placeholder="请输入成本人民币金额"
                @change="getNum"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="港币兑换人民币汇率" prop="totalHkRate">
              <el-input
                @input="totalHkRateChange"
                v-model="deliveryData.totalHkRate"
                placeholder="请输入港币兑换人民币汇率"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成本港币金额" prop="totalHkPrice">
              <el-input
                v-model="deliveryData.totalHkPrice"
                placeholder="请输入成本港币金额"
                @change="getNum"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="最低销售价(CNY)" prop="lowestSellPrice">
              <el-input
                v-model="deliveryData.lowestSellPrice"
                placeholder="请输入最低销售金额"
                @change="getNum"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="建议批发价(CNY)" prop="adviceWholesalePrice">
              <el-input
                v-model="deliveryData.adviceWholesalePrice"
                placeholder="请输入建议批发金额"
                @change="getNum"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="建议销售价(CNY)" prop="adviseSellPrice">
              <el-input
                v-model="deliveryData.adviseSellPrice"
                placeholder="请输入建议销售金额"
                @change="getNum"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代理价(CNY)" prop="agentPrice">
              <el-input
                v-model="deliveryData.agentPrice"
                placeholder="请输入代理价"
                @change="getNum"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item
              label="建议柜台最低销售价(CNY)"
              prop="counterLowestSellPrice"
            >
              <el-input
                v-model="deliveryData.counterLowestSellPrice"
                placeholder="请输入"
                @change="getNum"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标签价(CNY)" prop="tagPrice">
              <el-input
                v-model="deliveryData.tagPrice"
                placeholder="请输入标签金额"
                @change="getNum"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="销售提成(CNY)" prop="saleCommission">
              <el-input
                v-model="deliveryData.saleCommission"
                placeholder="请输入提成金额"
                @change="getNum"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="入库时间：" prop="stockInTime">
          <el-date-picker
            class="input-style"
            v-model="deliveryData.stockInTime"
            type="date"
            placeholder="请选择出库时间"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="成本备注" prop="totalPriceNote">
          <el-input
            type="textarea"
            v-model="deliveryData.totalPriceNote"
            placeholder="请输入成本备注内容"
          ></el-input>
        </el-form-item>
        <el-form-item label-width="0" prop="activityInfo">
          <div
            style="display: flex;justify-content: space-between;color:#606266;font-size:14px;"
          >
            <div>
              <div
                style="margin: 0;margin-right: 12px;line-height: 20px;text-align:right;"
              >
                活动信息
              </div>
              <div
                style="width: 168px;margin: 0;margin-right: 12px;line-height: 20px;text-align:right;"
              >
                (多个信息用,隔开)
              </div>
            </div>
            <el-input
              type="textarea"
              v-model="deliveryData.activityInfo"
              placeholder="请输入活动信息内容"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="备注：" prop="note">
          <el-input
            type="textarea"
            class="input-style"
            placeholder="请输入备注信息"
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
        <p class="title-font">加工中原材料库存查询</p>
        <div>
          <el-form label-width="110px">
            <!-- 用户管理仓库 -->
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
                style="width: 66%;"
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
        <el-table-column label="库存总量">
          <template slot-scope="scope">
            <div
              v-if="
                scope.row.chargeUnit == '粒' ||
                  scope.row.chargeUnit == '件' ||
                  scope.row.chargeUnit == '条'
              "
            >
              <span>{{ scope.row.number + " " + scope.row.chargeUnit }}</span>
            </div>
            <div v-else>
              <span>{{
                scope.row.currency == ""
                  ? scope.row.weight >= 0
                    ? scope.row.weight + scope.row.chargeUnit
                    : "--"
                  : scope.row.weight + " " + scope.row.chargeUnit
              }}</span
              ><span>{{
                scope.row.number > 1
                  ? " " + "/" + " " + scope.row.number + "件"
                  : ""
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
                  <div class="one-left">
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
                  <div class="one-left">
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
                  <div class="one-left">
                    统一编号
                  </div>
                  <div class="one-right">
                    <el-input
                      v-model="inventoryCheckDetail.productNumber"
                      readonly
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
                    建议柜台最低销售价
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
                      v-model="inventoryCheckDetail.counterLowestSellPrice"
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
                    代理价
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
                      v-model="inventoryCheckDetail.agentPrice"
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
</template>

<script>
export default {
  data() {
    return {
      img: this.$store.state.baseUrl,
      materialList: [],
      materialId: "",
      warehouseList: [
        {
          id: 0,
          name: "全部",
          type: 0,
        },
      ],
      storageIdList: [0],

      deviceAllList: [],
      deviceFilterList: [],
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
        warehouseId: "",
        endStorageId: "",
        designId: "",
        productNumber: "",
        productName: "",
        materialParams: "",
        certificateNumber: "",
        img: [],
        storageId: "",
        solder: "",
        group: "",
        customer: "",
        saleMoney: "",
        saleCurrency: "CNY",
        stockInTime: "",
        note: "",
        stockInIdList: [],
        processCost: "",
        costPrice: "",
        lowestSellPrice: "",
        adviseSellPrice: "",
        tagPrice: "",
        adviceWholesalePrice: "",
        totalPriceNote: "",
        activityInfo: "",
        totalCnRate: "",
        totalCnPrice: "",
        totalHkRate: "",
        totalHkPrice: "",
        saleCommission: "",
        currency: "CNY",
        productLabel: [],
        detailImg: [],
        agentPrice: "",
        counterLowestSellPrice: "",
      },
      deliveryRules: {
        warehouseId: [
          {
            required: true,
            message: "请选择仓库/加工厂",
            trigger: "change",
          },
        ],
        solder: [
          {
            required: true,
            message: "请填写销售员",
            trigger: "change",
          },
        ],
        group: [
          {
            required: true,
            message: "请填写组",
            trigger: "change",
          },
        ],
        saleMoney: [
          {
            required: true,
            message: "请填写销售价格",
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
        productName: [
          {
            required: true,
            message: "请填写成品名称",
            trigger: "blur",
          },
        ],
        productNumber: [
          {
            required: true,
            message: "请填写成品唯一编号",
            trigger: "blur",
          },
        ],
        stockInTime: [
          {
            required: true,
            message: "请选择入库时间",
            trigger: "change",
          },
        ],
      },
      productLabelList: [],
      warehouseKeyword: "",
      designListKeyword: "",
      page: 1,
      pageNum: 10,
      total: 0,
      certificateshow2: false,
      dialogInventoryCheckVisible: false,
      inventoryCheckDetail: {},
      producibleDesignList: {},

      isUpdate: 0,
      imgList: [],
      activeStockName: "first",

      params: {},
      warehouseFilterList: [],
      chooseimgshow: false,
      chooseimgshowlist: -1,
      chooselistimg: "",
      chooselistimgtemp: [],

      imgSortList: [],
      count: 0,
      statusDesign: "1",
    };
  },
  created() {
    this.getWarehouseFactoryList();
    this.getproducibleDesignList();
    this.getLabelList();
  },
  mounted() {
    document.getElementById("warehouse").scrollIntoView();
  },
  methods: {
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
      if (img != null && img != "" && img != undefined) {
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
    // 汇率变化
    totalCnRateChange() {
      let num =
        this.deliveryData.costPrice * this.deliveryData.totalCnRate +
        Number(this.deliveryData.processCost);
      this.deliveryData.totalCnPrice = Math.ceil(num);
    },
    totalHkRateChange() {
      this.deliveryData.totalHkPrice = Math.ceil(
        this.deliveryData.totalCnPrice / this.deliveryData.totalHkRate
      );
    },
    // 币种-汇率变化
    currencyChange() {
      this.deliveryData.totalCnRate = "";
      this.deliveryData.totalCnPrice = "";
      this.deliveryData.totalHkRate = "";
      this.deliveryData.totalHkPrice = "";
      if (this.deliveryData.currency == "CNY") {
        this.deliveryData.totalCnRate = 1;
        this.deliveryData.totalCnPrice = this.deliveryData.costPrice;
      } else if (this.deliveryData.currency == "HKD") {
        this.deliveryData.totalHkPrice = this.deliveryData.costPrice;
      }
    },
    // 价格输入
    getNum() {
      this.deliveryData.saleMoney = this.getPriceNum(
        this.deliveryData.saleMoney
      );
      this.deliveryData.processCost = this.getPriceNum(
        this.deliveryData.processCost
      );
      this.deliveryData.costPrice = this.getPriceNum(
        this.deliveryData.costPrice
      );
      this.deliveryData.lowestSellPrice = this.getPriceNum(
        this.deliveryData.lowestSellPrice
      );
      this.deliveryData.adviseSellPrice = this.getPriceNum(
        this.deliveryData.adviseSellPrice
      );
      this.deliveryData.tagPrice = this.getPriceNum(this.deliveryData.tagPrice);
      this.deliveryData.adviceWholesalePrice = this.getPriceNum(
        this.deliveryData.adviceWholesalePrice
      );
      this.deliveryData.saleCommission = this.getPriceNum(
        this.deliveryData.saleCommission
      );
      this.deliveryData.totalCnPrice = this.getPriceNum(
        this.deliveryData.totalCnPrice
      );
      this.deliveryData.totalHkPrice = this.getPriceNum(
        this.deliveryData.totalHkPrice
      );
    },
    // 仓库/加工厂是否为必填
    typeChange() {
      this.$refs.deliveryForm.clearValidate();
      if (this.deliveryData.type == 1) {
        this.deliveryRules.solder[0].required = true;
        this.deliveryRules.group[0].required = true;
        this.deliveryRules.saleMoney[0].required = true;

        if (this.deliveryData.stockInIdList.length == 0) {
          this.deliveryRules.warehouseId[0].required = true;
        } else {
          this.deliveryRules.warehouseId[0].required = false;
        }
      } else {
        this.deliveryRules.solder[0].required = false;
        this.deliveryRules.group[0].required = false;
        this.deliveryRules.saleMoney[0].required = false;
        this.deliveryRules.warehouseId[0].required = false;
      }
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
          this.producibleDesignList = res.data;
          console.log(this.producibleDesignList);
          this.designListKeyword = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //选择设计图片
    chooseimglist(row) {
      if (row != null) {
        this.chooseimgshowlist = -1;
        this.chooselistimg = "";
        this.chooselistimgtemp = row;
        console.log(row);
      }
    },
    // 确定选择设计稿
    imglistbutton() {
      this.chooseimgshowlist = this.chooselistimgtemp.id;
      this.chooselistimg = this.chooselistimgtemp.img;
      console.log(this.chooselistimgtemp.img);
      this.chooseimgshow = false;
      this.designListKeyword = "";
    },
    //取消
    imglistout() {
      this.chooseimgshow = false;
      this.designListKeyword = "";
      if (this.chooselistimg.length == 0) {
        this.$refs.multipleTable.clearSelection();
      }
    },
    //关闭
    handleClose() {
      this.chooseimgshow = false;
      this.designListKeyword = "";
      if (this.chooselistimg.length == 0) {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 成品入库
    stockInSubmit(formName) {
      this.params = {};
      console.log(this.deliveryData.productLabel);

      if (this.deliveryData.type == 0) {
        this.params = {
          storageId: this.deliveryData.endStorageId,
          type: this.deliveryData.type,
          stockInList: this.deliveryData.stockInIdList,
          stockInTime: this.deliveryData.stockInTime,
          note: this.deliveryData.note,
          designId: this.chooseimgshowlist,
          img: this.deliveryData.img.join("|"),
          productNumber: this.deliveryData.productNumber,
          productName: this.deliveryData.productName,
          processCost: this.deliveryData.processCost,
          costPrice: this.deliveryData.costPrice,
          lowestSellPrice: this.deliveryData.lowestSellPrice,
          adviseSellPrice: this.deliveryData.adviseSellPrice,
          tagPrice: this.deliveryData.tagPrice,
          adviceWholesalePrice: this.deliveryData.adviceWholesalePrice,
          saleCommission: this.deliveryData.saleCommission,
          currency: this.deliveryData.currency,
          params: this.deliveryData.materialParams,
          certificateNumber: this.deliveryData.certificateNumber,
          totalPriceNote: this.deliveryData.totalPriceNote,
          activityInfo: this.deliveryData.activityInfo,
          totalCnRate: this.deliveryData.totalCnRate,
          totalCnPrice: this.deliveryData.totalCnPrice,
          totalHkRate: this.deliveryData.totalHkRate,
          totalHkPrice: this.deliveryData.totalHkPrice,
          productLabel: this.deliveryData.productLabel.join("|"),
          detailImg: this.deliveryData.detailImg.join("|"),
          agentPrice: this.deliveryData.agentPrice,
          counterLowestSellPrice: this.deliveryData.counterLowestSellPrice,
        };
      } else {
        this.params = {
          storageId: this.deliveryData.warehouseId,
          solder: this.deliveryData.solder,
          group: this.deliveryData.group,
          customer: this.deliveryData.customer,
          saleMoney: this.deliveryData.saleMoney,
          saleCurrency: this.deliveryData.saleCurrency,
          type: this.deliveryData.type,
          stockInList: this.deliveryData.stockInIdList,
          stockInTime: this.deliveryData.stockInTime,
          note: this.deliveryData.note,
          designId: this.chooseimgshowlist,
          img: this.deliveryData.img.join("|"),
          productNumber: this.deliveryData.productNumber,
          productName: this.deliveryData.productName,
          processCost: this.deliveryData.processCost,
          costPrice: this.deliveryData.costPrice,

          lowestSellPrice: this.deliveryData.lowestSellPrice,
          adviseSellPrice: this.deliveryData.adviseSellPrice,
          tagPrice: this.deliveryData.tagPrice,
          adviceWholesalePrice: this.deliveryData.adviceWholesalePrice,

          saleCommission: this.deliveryData.saleCommission,
          currency: this.deliveryData.currency,
          params: this.deliveryData.materialParams,
          certificateNumber: this.deliveryData.certificateNumber,
          totalPriceNote: this.deliveryData.totalPriceNote,
          activityInfo: this.deliveryData.activityInfo,
          totalCnRate: this.deliveryData.totalCnRate,
          totalCnPrice: this.deliveryData.totalCnPrice,
          totalHkRate: this.deliveryData.totalHkRate,
          totalHkPrice: this.deliveryData.totalHkPrice,
          productLabel: this.deliveryData.productLabel.join("|"),
          detailImg: this.deliveryData.detailImg.join("|"),
          agentPrice: this.deliveryData.agentPrice,
          counterLowestSellPrice: this.deliveryData.counterLowestSellPrice,
        };
      }

      if (
        this.deliveryData.stockInIdList.length == 0 ||
        this.chooseimgshowlist == -1
      ) {
        this.$confirm("是否确认没有原材料或设计稿?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.$axios
                  .post(this.$store.state.baseUrl + "/productSave", this.params)
                  .then((res) => {
                    console.log("成品提交");
                    console.log(res);
                    this.$message.success({
                      message: "提交成功",
                      showClose: true,
                      duration: 1500,
                    });
                    // this.$refs.deliveryForm.resetFields();
                    this.$refs.deliveryForm.clearValidate();
                    this.delData();
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
          })
          .catch(() => {
            console.log("取消");
          });
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios
              .post(this.$store.state.baseUrl + "/productSave", this.params)
              .then((res) => {
                console.log("成品提交");
                console.log(res);
                this.$message.success({
                  message: "提交成功",
                  showClose: true,
                  duration: 1500,
                });
                // this.$refs.deliveryForm.resetFields();
                this.$refs.deliveryForm.clearValidate();
                this.delData();
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
    delData() {
      this.deliveryData.stockInIdList = [];
      this.chooseimgshowlist = -1;
      this.chooselistimg = "";
      this.deliveryData.img = [];
      this.deliveryData.solder = "";
      this.deliveryData.group = "";
      this.deliveryData.customer = "";
      this.deliveryData.saleMoney = "";
      this.deliveryData.saleCurrency = "CNY";
      this.deliveryData.type = 0;
      this.deliveryData.note = "";
      this.deliveryData.productNumber = "";

      this.deliveryData.productName = "";
      this.deliveryData.productLabel = "";
      this.deliveryData.materialParams = "";
      this.deliveryData.endStorageId = "";
      this.deliveryData.warehouseId = "";
      this.deliveryData.certificateNumber = "";

      this.deliveryData.processCost = "";
      this.deliveryData.costPrice = "";
      this.deliveryData.lowestSellPrice = "";
      this.deliveryData.adviseSellPrice = "";
      this.deliveryData.tagPrice = "";
      this.deliveryData.adviceWholesalePrice = "";
      this.deliveryData.totalPriceNote = "";
      this.deliveryData.activityInfo = "";
      this.deliveryData.totalCnRate = "";
      this.deliveryData.totalCnPrice = "";
      this.deliveryData.totalHkRate = "";
      this.deliveryData.totalHkPrice = "";
      this.deliveryData.saleCommission = "";
      this.deliveryData.currency = "CNY";
      this.deliveryData.detailImg = [];
      this.deliveryData.agentPrice = "";
      this.deliveryData.counterLowestSellPrice = "";
    },
    // 数量变化
    changeNum(index) {
      console.log(index);
      if (this.deliveryData.stockInIdList[index].totalNum !== 0) {
        if (this.deliveryData.stockInIdList[index].number < 1) {
          this.$message.error({
            message: "入库数量最少为1",
            showClose: true,
            duration: 1500,
          });
        } else if (
          this.deliveryData.stockInIdList[index].number >
          this.deliveryData.stockInIdList[index].totalNum
        ) {
          this.$message.error({
            message: "入库数量不能大于总数量",
            showClose: true,
            duration: 1500,
          });
        }
      } else {
        this.$message.error({
          message: "该材料总数量为0，不可入库",
          showClose: true,
          duration: 1500,
        });
      }

      this.joinData();
    },
    // 重量变化
    changeWeight(index) {
      if (this.deliveryData.stockInIdList[index].totalWeight !== 0) {
        if (this.deliveryData.stockInIdList[index].weight < 0) {
          this.$message.error({
            message: "入库重量不能为负",
            showClose: true,
            duration: 1500,
          });
        } else if (
          this.deliveryData.stockInIdList[index].weight >
          this.deliveryData.stockInIdList[index].totalWeight
        ) {
          this.$message.error({
            message: "入库重量不能大于总重量",
            showClose: true,
            duration: 1500,
          });
        } else if (this.deliveryData.stockInIdList[index].weight == 0) {
          this.$message.error({
            message: "入库重量不能为零",
            showClose: true,
            duration: 1500,
          });
        }
      } else {
        this.$message.error({
          message: "该材料总重量为0，不可入库",
          showClose: true,
          duration: 1500,
        });
      }

      this.joinData();
    },
    // 删
    delNum(index) {
      this.deliveryData.stockInIdList.splice(index, 1); //页面--成品待出库清单
      this.joinData();
      if (this.deliveryData.type == 1) {
        if (this.deliveryData.stockInIdList.length == 0) {
          this.deliveryRules.warehouseId[0].required = true;
        } else {
          this.deliveryRules.warehouseId[0].required = false;
        }
      } else {
        this.deliveryRules.warehouseId[0].required = false;
      }
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

        this.joinData();
      } else {
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

          this.joinData();
        }
      }

      if (this.deliveryData.type == 1) {
        if (this.deliveryData.stockInIdList.length == 0) {
          this.deliveryRules.warehouseId[0].required = true;
        } else {
          this.deliveryRules.warehouseId[0].required = false;
        }
      } else {
        this.deliveryRules.warehouseId[0].required = false;
      }
    },
    // 拼接参数
    joinData() {
      this.deliveryData.materialParams = "";
      for (const item of this.deliveryData.stockInIdList) {
        if (item.chargeUnit == "粒") {
          this.deliveryData.materialParams +=
            item.materialName + ",数量" + item.number + "|";
        } else {
          this.deliveryData.materialParams +=
            item.materialName +
            ",数量" +
            item.number +
            "(" +
            item.weight +
            item.chargeUnit +
            ")|";
        }
      }
      this.deliveryData.materialParams = this.deliveryData.materialParams.substring(
        0,
        this.deliveryData.materialParams.length - 1
      );
      console.log(this.deliveryData.materialParams);
    },
    // 判断是否重复添加
    filterSel(val) {
      for (const item of this.deliveryData.stockInIdList) {
        if (item.id == val.id) {
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
    // 修改时材料名称变化
    materialUpdateChange(item) {
      this.inventoryCheckDetail.chargeUnit = item.chargeUnit;
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
            note: this.inventoryCheckDetail.note,
            img: this.imgList.join("|"),
            activityInfo: this.inventoryCheckDetail.activityInfo,
            totalCnRate: this.inventoryCheckDetail.totalCnRate,
            totalCnPrice: this.inventoryCheckDetail.totalCnPrice,
            totalHkRate: this.inventoryCheckDetail.totalHkRate,
            totalHkPrice: this.inventoryCheckDetail.totalHkPrice,
            agentPrice: this.inventoryCheckDetail.agentPrice,
            counterLowestSellPrice: this.inventoryCheckDetail
              .counterLowestSellPrice,
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
    // 原材料库存查询
    warehouseCheck() {
      this.deviceAllList = [];

      this.$axios
        .post(this.$store.state.baseUrl + "/stockMaterialList", {
          storageIdList:
            this.storageIdList.indexOf(0) == -1 ? this.storageIdList : [],
          state: 2,
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
          this.handleCurrentChange(1);
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
          this.warehouseFilterList = res.data;
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
      let that = this;
      if (files === undefined) {
        return;
      }

      for (let i = 0; i < files.length; i++) {
        console.log(files[i]);
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
          } else {
            if (this.deliveryData.img.indexOf(imgurl) == -1) {
              this.imgSortList.splice(i, 1, imgurl);
              this.count++;
            }
          }

          if (this.count === this.imgSortList.length) {
            if (this.dialogInventoryCheckVisible == true) {
              this.imgList = this.imgList.concat(this.imgSortList);
            } else {
              this.deliveryData.img = this.deliveryData.img.concat(
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
      if (this.dialogInventoryCheckVisible == true && this.isUpdate == 1) {
        this.imgList.splice(index, 1);
      } else {
        this.deliveryData.img.splice(index, 1);
      }
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

          if (this.deliveryData.detailImg.indexOf(imgurl) == -1) {
            this.imgSortList.splice(i, 1, imgurl);
            this.count++;
          }

          if (this.count === this.imgSortList.length) {
            this.deliveryData.detailImg = this.deliveryData.detailImg.concat(
              this.imgSortList
            );
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
      this.deliveryData.detailImg.splice(index, 1);
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
    labelChange() {
      console.log(this.deliveryData.productLabel);
    },
  },
};
</script>

<style lang="scss" scoped>
.warehouse-management-container {
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
  }

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
        width: 160px;
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
        color: #606266;
      }

      .one-right {
        width: 373px;
        padding-left: 10px;
      }
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
.el-dialog__body {
  padding: 10px 20px;
  height: 63vh;
  overflow-y: scroll;
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
