<template>
  <div class="user-admin-container" id="user-admin">
    <!-- <h1>入库管理</h1> -->
    <div class="user-edit">
      <el-form
        :model="stockInFormData"
        :rules="stockInRules"
        ref="stockInForm"
        label-width="160px"
        class="demo-ruleForm"
      >
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="材料名称：" prop="materialId">
              <el-select
                v-model="stockInFormData.materialId"
                placeholder="请选择"
                class="input-style"
                :popper-append-to-body="false"
              >
                <el-option
                  v-for="item in materialList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  @click.native="materialChange(item)"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓库/加工厂：" prop="storageId">
              <el-select
                v-model="stockInFormData.storageId"
                placeholder="请选择"
                class="input-style"
                @change="storageChange"
                :popper-append-to-body="false"
              >
                <el-option
                  v-for="item in warehouseFactoryList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item
              :label="
                stockInFormData.materialId == 11 ? '证书编号：' : '统一编号：'
              "
              prop="productNumber"
            >
              <el-input
                v-model="stockInFormData.productNumber"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="certificateshow == false">
            <el-form-item label="形状：" prop="shape">
              <el-input
                v-model="stockInFormData.shape"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="产品类型：" prop="productType">
              <el-input
                v-model="stockInFormData.productType"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="certificateshow == false">
            <el-form-item label="产地：" prop="productArea">
              <el-input
                v-model="stockInFormData.productArea"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-show="certificateshow == false">
          <el-col :span="24">
            <el-form-item label="计价单位：" prop="chargeUnit">
              <el-radio-group
                v-model="stockInFormData.chargeUnit"
                @change="chargeUnitfun"
              >
                <el-radio label="粒"></el-radio>
                <el-radio label="ct"></el-radio>
                <el-radio label="g"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-show="certificateshow == false">
          <el-col :span="10">
            <el-form-item label="单价：" prop="unitPrice">
              <el-input
                style="width: 100%;"
                v-model="stockInFormData.unitPrice"
                placeholder="请输入"
                @input="priceTotal"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="" prop="currency" label-width="0">
              <el-radio-group
                style="margin-left: 10px;"
                v-model="stockInFormData.currency"
                @change="currencyChange"
              >
                <el-radio label="CNY">CNY</el-radio>
                <el-radio label="EUR">EUR</el-radio>
                <el-radio label="USD">USD</el-radio>
                <el-radio label="HKD">HKD</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="20" v-show="numberorweight == true">
            <el-form-item label="总数量：" prop="number">
              <el-input-number
                style="width: 100%;"
                :controls="false"
                v-model="stockInFormData.number"
                placeholder="请输入"
                @input="priceTotal"
              >
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="20" v-show="numberorweight == false">
            <el-form-item label="总数量：" prop="number">
              <el-input-number
                style="width: 100%;"
                :controls="false"
                v-model="stockInFormData.number"
                placeholder="请输入"
                @input="priceTotal"
              >
              </el-input-number>
            </el-form-item>
            <el-form-item label="总重量：" prop="weight">
              <div style="display: flex;">
                <el-input-number
                  style="width: 100%;"
                  :controls="false"
                  v-model="stockInFormData.weight"
                  placeholder="请输入"
                  @input="priceTotal"
                >
                </el-input-number>
                <!-- <i
                slot="suffix"
                style="color: #606266;margin-right:5%;font-style:normal;"
                >{{ stockInFormData.chargeUnit }}</i
              > -->
                <div style="font-size: 16px;margin-left: 5px;">
                  {{ stockInFormData.chargeUnit }}
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-show="certificateshow == false">
          <el-col :span="12">
            <el-form-item label="总价：" prop="totalPrice">
              <el-input
                v-model="stockInFormData.totalPrice"
                placeholder="请输入"
                @input="priceTotal2"
                @focus="focustotal"
                @change="totalChange"
                ><i
                  slot="suffix"
                  style="color: #606266;margin-right:5%;font-style:normal;"
                  >{{ stockInFormData.currency }}</i
                ></el-input
              >
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批发单价：" prop="wholesalePrice">
              <el-input
                v-model="stockInFormData.wholesalePrice"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-show="certificateshow == false">
          <el-col :span="12">
            <el-form-item
              label="建议柜台最低销售价："
              prop="counterLowestSellPrice"
            >
              <el-input
                v-model="stockInFormData.counterLowestSellPrice"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代理价：" prop="agentPrice">
              <el-input
                v-model="stockInFormData.agentPrice"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-show="certificateshow == false">
          <el-col :span="12">
            <el-form-item label="零售单价：" prop="retailPrice">
              <el-input
                v-model="stockInFormData.retailPrice"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外币兑换人民币汇率" prop="totalCnRate">
              <el-input
                @input="totalCnRateChange"
                v-model="stockInFormData.totalCnRate"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-show="certificateshow == false">
          <el-col :span="12">
            <el-form-item label="总价人民币金额" prop="totalCnPrice">
              <el-input
                v-model="stockInFormData.totalCnPrice"
                placeholder="请输入"
                @change="totalChange"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="港币兑换人民币汇率" prop="totalHkRate">
              <el-input
                @input="totalHkRateChange"
                v-model="stockInFormData.totalHkRate"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-show="certificateshow == false">
          <el-col :span="12">
            <el-form-item label="总价港币金额" prop="totalHkPrice">
              <el-input
                v-model="stockInFormData.totalHkPrice"
                placeholder="请输入"
                @change="totalChange"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="尺寸/毫米：" prop="size">
              <el-input
                v-model="stockInFormData.size"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-show="certificateshow == false">
          <el-col :span="12">
            <el-form-item label="颜色：" prop="color">
              <el-input
                v-model="stockInFormData.color"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="配对：" prop="paired">
              <el-input
                v-model="stockInFormData.paired"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-show="certificateshow == false">
          <el-col :span="12">
            <el-form-item label="品质：" prop="quality">
              <el-input
                v-model="stockInFormData.quality"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品质细分：" prop="subsection">
              <el-input
                v-model="stockInFormData.subsection"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-show="certificateshow == false">
          <el-col :span="12">
            <el-form-item label="盒子编号：" prop="boxNumber">
              <el-input
                v-model="stockInFormData.boxNumber"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证书编号：" prop="certificateNumber">
              <el-input
                v-model="stockInFormData.certificateNumber"
                placeholder="多个证书编号，用逗号隔开"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="发票号："
          prop="billNumber "
          v-show="certificateshow == false"
        >
          <el-input
            v-model="stockInFormData.billNumber"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片：" prop="imgurls">
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
                  v-for="(imgurl, index) of stockInFormData.imgurls"
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
        </el-form-item>
        <el-form-item label="入库时间：" prop="stockInTime">
          <el-date-picker
            class="input-style"
            v-model="stockInFormData.stockInTime"
            type="date"
            placeholder="请选择"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="成本备注"
          prop="totalPriceNote"
          v-show="certificateshow == false"
        >
          <el-input
            type="textarea"
            v-model="stockInFormData.totalPriceNote"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="note">
          <el-input
            type="textarea"
            v-model="stockInFormData.note"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="margin-top: 30px;text-align: right;">
        <el-button @click="resetForm('stockInForm')">重 置</el-button>
        <el-button
          style="width: 120px;"
          type="primary"
          @click="stockInAdd('stockInForm')"
          v-preventClick
          >提 交
        </el-button>
      </div>
    </div>
    <div class="user-table">
      <p class="title-font">原材料库存</p>
      <el-table
        :data="productList"
        tooltip-effect="dark"
        border
        @row-click="inventoryLook"
        @row-dblclick="dblLookInventory"
      >
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
        <el-table-column label="总价">
          <template slot-scope="scope">
            <div>
              <span>{{
                scope.row.currency != ""
                  ? formatNumberRgx(scope.row.totalPrice) +
                    " " +
                    scope.row.currency
                  : "--"
              }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90px">
          <template>
            <el-button type="text" style="color: red;">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        v-if="dialogInventoryCheckVisible"
        title="材料信息"
        :visible.sync="dialogInventoryCheckVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :append-to-body="false"
      >
        <div id="invenSome">
          <el-tabs style="margin-top: 20px;" v-model="activeStockName">
            <el-tab-pane label="材料信息" name="first">
              <div style="display: flex;justify-content: space-between;">
                <p class="font-title-style" style="margin-top: 0;">材料信息</p>
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
                      readonly
                      v-model="inventoryCheckDetail.storageName"
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
                <p class="font-title-style" style="margin-top: 0;">价格信息</p>
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
                      @input="priceTotal3"
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
                      @input="priceTotal3"
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
          <el-button type="primary" @click="inventoryLookSure" v-preventClick
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <el-dialog
        title="删除材料"
        :visible.sync="dialogInventoryDeleteVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :append-to-body="false"
        id="delInven"
      >
        <div style="text-align: center;">
          <p style="margin: 30px 0 0 0;font-size: 16px;color: #4e4e4e;">
            确定删除该材料？删除后不可修改
          </p>
        </div>
        <div slot="footer">
          <el-button @click="dialogInventoryDeleteVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="inventoryDeleteSure" v-preventClick
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      img: this.$store.state.baseUrl,
      warehouseFactoryList: [],
      materialList: [],
      stockInFormData: {
        materialId: "",
        storageId: "",
        unifiedNumber: "",
        shape: "",
        chargeUnit: "",
        unitPrice: "",
        currency: "CNY",
        number: undefined,
        weight: undefined,
        totalPrice: "",
        retailPrice: "",
        wholesalePrice: "",
        size: "",
        color: "",
        paired: "",
        quality: "",
        subsection: "",
        boxNumber: "",
        certificateNumber: "",
        productNumber: "",
        totalPriceNote: "",
        totalCnRate: "",
        totalCnPrice: "",
        totalHkRate: "",
        totalHkPrice: "",
        imgurls: [],
        stockInTime: "",
        note: "",
        agentPrice: "",
        counterLowestSellPrice: "",
      },
      stockInRules: {
        materialId: [
          {
            required: true,
            message: "请选择材料名称",
            trigger: ["change"],
          },
        ],
        storageId: [
          {
            required: true,
            message: "请选择仓库/加工厂",
            trigger: ["change"],
          },
        ],
        productNumber: [
          {
            required: true,
            message: "请输入产品编号",
            trigger: "blur",
          },
        ],
        weight: [
          {
            required: true,
            message: "请输入总重量",
            trigger: "blur",
          },
        ],
        number: [
          {
            required: true,
            message: "请输入总数量",
            trigger: "blur",
          },
        ],
        imgurls: [
          {
            required: true,
            message: "请上传图片",
            trigger: "blur",
          },
        ],
        stockInTime: [
          {
            required: true,
            message: "请选择入库时间",
            trigger: "blur",
          },
        ],
      },
      dialogInventoryCheckVisible: false,
      inventoryCheckDetail: {},
      dialogInventoryDeleteVisible: false,
      certificateshow: false,
      numberorweight: false,
      certificateshow2: false,
      inventoryDeleteDetail: {},
      isUpdate: 0,
      productList: [],

      imgList: [],
      totalpricetemp: 0,
      activeStockName: "first",

      imgSortList: [],
      count: 0,
    };
  },
  created() {
    this.getMaterialList();
    this.getWarehouseFactoryList();
  },
  mounted() {
    document.getElementById("user-admin").scrollIntoView();
  },
  methods: {
    // 汇率变化
    totalCnRateChange() {
      let num =
        this.stockInFormData.totalPrice * this.stockInFormData.totalCnRate;
      this.stockInFormData.totalCnPrice = Math.ceil(num);
    },
    totalHkRateChange() {
      this.stockInFormData.totalHkPrice = Math.ceil(
        this.stockInFormData.totalPrice / this.stockInFormData.totalHkRate
      );
    },
    // 币种-汇率变化
    currencyChange() {
      this.stockInFormData.totalCnRate = "";
      this.stockInFormData.totalCnPrice = "";
      this.stockInFormData.totalHkRate = "";
      this.stockInFormData.totalHkPrice = "";
      if (this.stockInFormData.currency == "CNY") {
        this.stockInFormData.totalCnRate = 1;
        this.stockInFormData.totalCnPrice = this.stockInFormData.totalPrice;
      } else if (this.stockInFormData.currency == "HKD") {
        this.stockInFormData.totalHkPrice = this.stockInFormData.totalPrice;
      }
    },
    // 各种价格输入
    totalChange() {
      this.stockInFormData.totalPrice = this.getPriceNum(
        this.stockInFormData.totalPrice
      );
      this.stockInFormData.totalCnPrice = this.getPriceNum(
        this.stockInFormData.totalCnPrice
      );
      this.stockInFormData.totalHkPrice = this.getPriceNum(
        this.stockInFormData.totalHkPrice
      );
    },
    // 查看修改材料详情
    inventoryLook(row, column) {
      if (column.label == "操作") {
        this.inventoryDelete(row);
      }
    },
    dblLookInventory(row) {
      this.inventoryCheckDetail = {};
      this.activeStockName = "first";
      this.isUpdate = 0;
      this.$axios
        .post(this.$store.state.baseUrl + "/stockMaterialInfo", {
          id: row.id,
        })
        .then((res) => {
          console.log("材料详情");
          console.log(res);
          this.inventoryCheckDetail = res.data;
          this.imgList = [];
          if (this.inventoryCheckDetail.materialId == 11) {
            this.certificateshow2 = true;
          } else {
            this.certificateshow2 = false;
          }
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
    // materialUpdateChange(item) {
    //   this.inventoryCheckDetail.chargeUnit = item.chargeUnit
    // },
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
            this.storageChange();
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
    // 删除材料
    inventoryDelete(val) {
      console.log(val);
      this.inventoryDeleteDetail = val;
      if (this.inventoryDeleteDetail.isOut !== 1) {
        this.dialogInventoryDeleteVisible = true;
      } else {
        this.$message.warning({
          message: "该材料已有出库记录，不可删除",
          showClose: true,
          duration: 2000,
        });
      }
    },
    // 确定
    inventoryDeleteSure() {
      this.$axios
        .post(this.$store.state.baseUrl + "/stockMaterialDelete", {
          id: this.inventoryDeleteDetail.id,
        })
        .then((res) => {
          console.log("删除材料信息");
          console.log(res);
          this.$message.success({
            message: "删除成功",
            showClose: true,
            duration: 2000,
          });
          this.dialogInventoryDeleteVisible = false;
          this.storageChange();
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
    // 获取该仓库下所有的产品
    storageChange() {
      let wareList = [];
      wareList.push(this.stockInFormData.storageId);
      this.productList = [];
      this.$axios
        .post(this.$store.state.baseUrl + "/stockMaterialList", {
          storageIdList: wareList,
          state: 0,
          pageNum: 10,
        })
        .then((res) => {
          console.log("仓库下的材料列表");
          console.log(res);
          if (res.data.warehouseFactoryList.length !== 0) {
            this.productList = res.data.warehouseFactoryList[0].materialList;
          }
          this.productList.splice(10, this.productList.length);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 材料入库
    stockInAdd(formName) {
      console.log(this.stockInFormData.type);
      if (
        this.stockInFormData.chargeUnit == "ct" ||
        this.stockInFormData.chargeUnit == "g"
      ) {
        if (this.stockInFormData.weight == 0) {
          this.$message.error({
            message: "该原料重量不能为零",
            showClose: true,
            duration: 2000,
          });
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post(this.$store.state.baseUrl + "/materialSave", {
              materialId: this.stockInFormData.materialId,
              storageId: this.stockInFormData.storageId,
              productType: this.stockInFormData.productType,
              productArea: this.stockInFormData.productArea,
              billNumber: this.stockInFormData.billNumber,
              shape: this.stockInFormData.shape,
              unitPrice: this.stockInFormData.unitPrice,
              currency: this.stockInFormData.currency,
              number: this.stockInFormData.number,
              weight: this.stockInFormData.weight,
              totalPrice: this.stockInFormData.totalPrice,
              retailPrice: this.stockInFormData.retailPrice,
              wholesalePrice: this.stockInFormData.wholesalePrice,
              size: this.stockInFormData.size,
              color: this.stockInFormData.color,
              paired: this.stockInFormData.paired,
              quality: this.stockInFormData.quality,
              subsection: this.stockInFormData.subsection,
              boxNumber: this.stockInFormData.boxNumber,
              certificateNumber: this.stockInFormData.certificateNumber,
              productNumber: this.stockInFormData.productNumber,
              totalPriceNote: this.stockInFormData.totalPriceNote,
              totalCnRate: this.stockInFormData.totalCnRate,
              totalCnPrice: this.stockInFormData.totalCnPrice,
              totalHkRate: this.stockInFormData.totalHkRate,
              totalHkPrice: this.stockInFormData.totalHkPrice,
              note: this.stockInFormData.note,
              img: this.stockInFormData.imgurls.join("|"),
              stockInTime: this.stockInFormData.stockInTime,
              agentPrice: this.stockInFormData.agentPrice,
              counterLowestSellPrice: this.stockInFormData
                .counterLowestSellPrice,
            })
            .then((res) => {
              console.log("材料入库");
              console.log(res);
              this.$message.success({
                message: "入库成功",
                showClose: true,
                duration: 2000,
              });
              // this.stockInFormData.unifiedNumber = '';
              if (this.stockInFormData.materialId == 11) {
                this.stockInFormData.note = "";
                this.stockInFormData.imgurls = [];
              }
              this.stockInFormData.productNumber = "";
              this.storageChange();
              document.getElementById("user-admin").scrollIntoView();
            })
            .catch((err) => {
              console.log(err);
              this.$message.error({
                message: err.data.message,
                showClose: true,
                duration: 2000,
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 材料名称变化
    materialChange(item) {
      console.log(item);
      if (item.id == 11) {
        this.certificateshow = true;
        this.numberorweight = true;
        this.stockInRules.weight[0].required = false;
        this.stockInFormData.currency = "";
        this.stockInFormData.weight = 0;
        this.stockInFormData.totalPrice = "";
        this.stockInFormData.unitPrice = "";
        this.stockInFormData.shape = "";
        this.stockInFormData.color = "";
        this.stockInFormData.boxNumber = "";
        this.stockInFormData.wholesalePrice = "";
        this.stockInFormData.retailPrice = "";
        this.stockInFormData.size = "";
        this.stockInFormData.paired = "";
        this.stockInFormData.certificateNumber = "";
        this.stockInFormData.quality = "";
        this.stockInFormData.subsection = "";
      } else {
        this.certificateshow = false;
        this.stockInFormData.currency = "CNY";
        if (item.chargeUnit == "粒") {
          this.stockInRules.weight[0].required = false;
          this.numberorweight = true;
          this.stockInFormData.weight = 0;
          if (this.stockInFormData.unitPrice && this.stockInFormData.number) {
            this.stockInFormData.totalPrice = (
              this.stockInFormData.unitPrice * this.stockInFormData.number
            ).toFixed(2);
          }
        } else {
          this.stockInRules.weight[0].required = true;
          this.numberorweight = false;
          if (this.stockInFormData.unitPrice && this.stockInFormData.weight) {
            this.stockInFormData.totalPrice = (
              this.stockInFormData.unitPrice * this.stockInFormData.weight
            ).toFixed(2);
          }
        }
      }
      this.stockInFormData.number = 1;
      this.stockInFormData.imgurls = [];
      console.log(this.stockInFormData);
      this.stockInFormData.chargeUnit = item.chargeUnit;
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      document.getElementById("user-admin").scrollIntoView();
    },
    priceTotal() {
      this.stockInFormData.totalPrice = 0;
      if (this.stockInFormData.chargeUnit == "粒") {
        if (this.stockInFormData.unitPrice && this.stockInFormData.number) {
          this.stockInFormData.totalPrice = (
            this.stockInFormData.unitPrice * this.stockInFormData.number
          ).toFixed(2);
        }
      } else {
        if (this.stockInFormData.unitPrice && this.stockInFormData.weight) {
          this.stockInFormData.totalPrice = (
            this.stockInFormData.unitPrice * this.stockInFormData.weight
          ).toFixed(2);
        }
      }
      this.currencyChange();
    },
    focustotal() {
      this.totalpricetemp = this.stockInFormData.totalPrice;
    },
    priceTotal2() {
      if (this.totalpricetemp != this.stockInFormData.totalPrice) {
        if (this.stockInFormData.chargeUnit == "粒") {
          this.stockInFormData.unitPrice = (
            this.stockInFormData.totalPrice / this.stockInFormData.number
          ).toFixed(2);
        } else {
          this.stockInFormData.unitPrice = (
            this.stockInFormData.totalPrice / this.stockInFormData.weight
          ).toFixed(2);
        }
      }
    },

    // 修改材料单价时总价的变化
    priceTotal3() {
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
    chargeUnitfun() {
      if (this.stockInFormData.chargeUnit == "粒") {
        this.numberorweight = true;
        this.stockInFormData.totalPrice = (
          this.stockInFormData.unitPrice * this.stockInFormData.number
        ).toFixed(2);
      } else {
        this.numberorweight = false;
        this.stockInRules.weight[0].required = true;
        this.stockInFormData.totalPrice = (
          this.stockInFormData.unitPrice * this.stockInFormData.weight
        ).toFixed(2);
      }
      console.log(this.stockInFormData.totalPrice);
      this.currencyChange();
    },
    // 上传图片
    inputChange(e) {
      this.imgSortList = [];
      this.count = 0;

      let files = e.target.files;

      this.imgSortList.length = files.length;
      console.log(this.imgSortList.length);
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
          } else {
            if (this.stockInFormData.imgurls.indexOf(imgurl) == -1) {
              this.imgSortList.splice(i, 1, imgurl);
              this.count++;
            }
          }

          if (this.count === this.imgSortList.length) {
            if (this.dialogInventoryCheckVisible == true) {
              this.imgList = this.imgList.concat(this.imgSortList);
            } else {
              this.stockInFormData.imgurls = this.stockInFormData.imgurls.concat(
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
        this.stockInFormData.imgurls.splice(index, 1);
      }
    },
    // 获取原材料名称列表
    getMaterialList() {
      this.$axios
        .post(this.$store.state.baseUrl + "/materialList")
        .then((res) => {
          console.log("原材料");
          console.log(res);
          this.materialList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取仓库/加工厂列表
    getWarehouseFactoryList() {
      this.$axios
        .post(this.$store.state.baseUrl + "/warehouseFactoryList", {
          isOwn: 1,
        })
        .then((res) => {
          console.log("仓库/加工厂");
          console.log(res);
          this.warehouseFactoryList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.user-admin-container {
  display: flex;
  justify-content: space-between;

  .user-edit {
    width: 50%;
    padding: 10px;
    margin-right: 15px;
    background-color: #fff;
    border-radius: 6px;
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

  .user-table {
    width: 50%;
    padding: 10px;
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

  .input-style {
    width: 100%;
  }

  .stockButton {
    height: 34px !important;
    line-height: 9px;
    font-size: 12px;
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
}
</style>
<style lang="scss">
#user-admin {
  .el-input-number .el-input__inner {
    text-align: left;
  }

  .el-dialog__body {
    height: 500px;
    overflow: auto;
  }

  .el-form-item__content {
    text-align: left;
  }

  #delInven {
    .el-dialog__body {
      height: 80px;
    }
  }

  #stock {
    width: 100%;

    .stockInput {
      width: 431px;
      float: right;

      .el-input__inner {
        height: 34px;
        line-height: 9px;
        font-size: 12px;
      }

      .el-input__suffix {
        padding-top: -10px;
      }
    }
  }

  .el-textarea__inner {
    height: 100%;
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
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  .el-dialog__body {
    padding: 0 20px;
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
</style>
