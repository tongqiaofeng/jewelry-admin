<template>
  <div>
    <el-dialog v-if="dialogMaterialMsgVisible" title="材料信息" :visible.sync="dialogMaterialMsgVisible"
      :close-on-press-escape="false" :close-on-click-modal="false" :modal-append-to-body="false" :append-to-body="false"
      @close="closeDialog">
      <div id="invenSome">
        <el-tabs style="margin-top: 20px;" v-model="activeStockName">
          <el-tab-pane label="材料信息" name="first">
            <div style="display: flex;justify-content: flex-end;">
              <div style="padding-top: 6px;">
                <img style="cursor: pointer;" title="修改材料信息" src="../assets/imgs/home/update.png" @click="updateDevice" />
              </div>
            </div>
            <div class="font-div">
              <div class="div-one">
                <div class="one-left" style="color: #606266;font-weight: normal;">
                  材料名称
                </div>
                <div class="one-right">
                  <el-input v-model="materialUpdateMsg.materialName" readonly></el-input>
                </div>
              </div>
              <div class="div-one">
                <div class="one-left" style="color: #606266;font-weight: normal;">
                  仓库/加工厂
                </div>
                <div class="one-right">
                  <el-input v-model="materialUpdateMsg.storageName" readonly></el-input>
                </div>
              </div>
              <div class="div-one">
                <div class="one-left" style="color: #606266;font-weight: normal;">
                  统一编号
                </div>
                <div class="one-right">
                  <el-input v-model="materialUpdateMsg.productNumber" readonly>
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  盒子编号
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.boxNumber" clearable>
                  </el-input>
                </div>
              </div>

              <div class="div-one" v-show="certificateshow2 == false">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  形状
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.shape" clearable>
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  尺寸/毫米
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.size" clearable>
                  </el-input>
                </div>
              </div>

              <div class="div-one" v-show="certificateshow2 == false">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  产地
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.productArea" clearable>
                  </el-input>
                </div>
              </div>

              <div class="div-one" v-show="certificateshow2 == false">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  颜色
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.color" clearable>
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  品质
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.quality" clearable>
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  品质细分
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.subsection" clearable>
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  配对
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.paired" clearable>
                  </el-input>
                </div>
              </div>

              <div class="div-one" v-show="certificateshow2 == false">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  证书编号
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.certificateNumber"
                    clearable>
                  </el-input>
                </div>
              </div>
            </div>
            <p class="font-title-style">图片信息</p>
            <div style="display:flex;">
              <p :style="{
                color: isUpdate == 0 ? '#606266' : '#3d82fe',
                fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                margin: 0,
                width: '50px',
              }">
                图片：
              </p>
              <div class="upload-imgs">
                <UploadImg :imgUrl="imgList" :isUpdate="isUpdate" @imgChange="materialImgUrlChange"></UploadImg>
              </div>
            </div>
            <p class="font-title-style">备注信息</p>
            <div class="font-div">
              <div class="div-one-note">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  产品备注
                </div>
                <div class="one-right">
                  <el-input type="textarea" v-model="materialUpdateMsg.note" :readonly="isUpdate == 0 ? true : false">
                  </el-input>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="价格信息" name="fourth">
            <div style="display: flex;justify-content: flex-end;">
              <div style="padding-top: 6px;">
                <img style="cursor: pointer;" title="修改价格信息" src="../assets/imgs/home/update.png" @click="updateDevice" />
              </div>
            </div>
            <div class="font-div">
              <div class="div-one" v-show="certificateshow2 == false">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  发票号
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.billNumber" clearable>
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div class="one-left" :style="{
                  color: '#606266',
                  fontWeight: 'normal',
                }">
                  计价单位
                </div>
                <div class="one-right">
                  <el-radio-group v-model="materialUpdateMsg.chargeUnit" disabled>
                    <el-radio label="粒">粒</el-radio>
                    <el-radio label="ct">ct</el-radio>
                    <el-radio label="g">g</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  单价
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.unitPrice"
                    @input="priceTotal" clearable>
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  币种
                </div>
                <div class="one-right">
                  <el-radio-group v-model="materialUpdateMsg.currency" :disabled="isUpdate == 0 ? true : false">
                    <el-radio label="CNY">CNY</el-radio>
                    <el-radio label="EUR">EUR</el-radio>
                    <el-radio label="USD">USD</el-radio>
                    <el-radio label="HKD">HKD</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div class="div-one">
                <div class="one-left" :style="{
                  color:
                    isUpdate == 0
                      ? '#606266'
                      : materialUpdateMsg.isUpdate == 0
                        ? '#3d82fe'
                        : '#606266',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  总数量
                </div>
                <div class="one-right">
                  <el-input :readonly="
                    isUpdate == 0
                      ? true
                      : materialUpdateMsg.isUpdate == 0
                        ? false
                        : true
                  " v-model="materialUpdateMsg.number" clearable><i slot="suffix"
                      v-if="materialUpdateMsg.chargeUnit == '粒'" class="el-input__icon"
                      style="color: #606266;font-style:normal;">{{ materialUpdateMsg.chargeUnit }}</i>
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  总重量
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.weight"
                    @input="priceTotal" clearable><i slot="suffix" v-if="materialUpdateMsg.chargeUnit != '粒'"
                      class="el-input__icon" style="color: #606266;font-style:normal;">{{ materialUpdateMsg.chargeUnit
                      }}</i>
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div class="one-left" :style="{
                  color:
                    isUpdate == 0
                      ? '#606266'
                      : materialUpdateMsg.isUpdate == 0
                        ? '#3d82fe'
                        : '#606266',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  总价
                </div>
                <div class="one-right">
                  <el-input :readonly="
                    isUpdate == 0
                      ? true
                      : materialUpdateMsg.isUpdate == 0
                        ? false
                        : true
                  " v-model="materialUpdateMsg.totalPrice" clearable>
                    <i slot="suffix" class="el-input__icon" style="color: #606266;font-style:normal;">{{
                      materialUpdateMsg.currency }}</i>
                  </el-input>
                </div>
              </div>

              <div class="div-one" v-show="certificateshow2 == false">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  外币兑港币汇率
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" @input="totalPriceHkRateChange"
                    v-model="materialUpdateMsg.totalHkRate" clearable>
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  总价港币金额
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.totalHkPrice" clearable>
                  </el-input>
                </div>
              </div>

              <div class="div-one" v-show="certificateshow2 == false">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  建议批发单价({{ materialUpdateMsg.currency }})
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.adviceWholesalePrice"
                    clearable>
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  建议零售单价({{ materialUpdateMsg.currency }})
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.adviseSellPrice"
                    clearable>
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  最低销售单价(CNY)
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.lowestSellPrice"
                    clearable>
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  代理单价(CNY)
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.agentPrice" clearable>
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  销售单价(CNY)
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.counterLowestSellPrice"
                    clearable>
                  </el-input>
                </div>
              </div>
              <div class="div-one" v-show="certificateshow2 == false">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  标签单价(CNY)
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.tagPrice" clearable>
                  </el-input>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="销售信息" name="third" v-if="materialUpdateMsg.state == 3">
            <div style="display: flex;justify-content: flex-end;">
              <!-- <p class="font-title-style" style="margin-top: 0;">
                销售信息
              </p> -->
              <div style="padding-top: 6px;">
                <img style="cursor: pointer;" title="修改销售信息" src="../assets/imgs/home/update.png" @click="updateDevice" />
              </div>
            </div>
            <div class="font-div">
              <div class="div-one">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  销售发票号
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.sellBillNumber" clearable>
                  </el-input>
                </div>
              </div>
              <div class="div-one">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  销售员
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.solder" clearable>
                  </el-input>
                </div>
              </div>
              <div class="div-one">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  销售组
                </div>
                <div class="one-right">
                  <el-autocomplete :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.group"
                    :fetch-suggestions="groupQuery" placeholder="请选择/输入销售组" @select="handleGroupSelect"></el-autocomplete>
                </div>
              </div>
              <div class="div-one">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  顾客姓名
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.customer" clearable>
                  </el-input>
                </div>
              </div>
              <div class="div-one">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  顾客类型
                </div>
                <div class="one-right">
                  <el-autocomplete :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.customerType"
                    :fetch-suggestions="customerTypeQuery" placeholder="请选择/输入类型"
                    @select="handleModelSelect"></el-autocomplete>
                </div>
              </div>

              <div class="div-one">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  出售币种
                </div>
                <div class="one-right">
                  <el-radio-group @change="currencyChange" v-model="materialUpdateMsg.saleCurrency"
                    :disabled="isUpdate == 0 ? true : false">
                    <el-radio label="CNY">CNY</el-radio>
                    <el-radio label="EUR">EUR</el-radio>
                    <el-radio label="USD">USD</el-radio>
                    <el-radio label="HKD">HKD</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div class="div-one">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  出售金额
                </div>
                <div class="one-right">
                  <el-input @input="moneyChange" :readonly="isUpdate == 0 ? true : false"
                    v-model="materialUpdateMsg.saleMoney" clearable>
                  </el-input>
                </div>
              </div>
              <div class="div-one">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  外币兑港币汇率
                </div>
                <div class="one-right">
                  <el-input @input="totalToHkRateChange" :readonly="isUpdate == 0 ? true : false"
                    v-model="materialUpdateMsg.totalToHkRate" clearable>
                  </el-input>
                </div>
              </div>
              <div class="div-one">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  出售港币金额
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.sellTotalHkPrice"
                    clearable>
                  </el-input>
                </div>
              </div>
              <div class="div-one">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  其他支出费用(HKD)
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.otherExpenses" clearable>
                  </el-input>
                </div>
              </div>

              <div class="div-one">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  领货人
                </div>
                <div class="one-right">
                  <el-input :readonly="isUpdate == 0 ? true : false" v-model="materialUpdateMsg.receiver" clearable>
                  </el-input>
                </div>
              </div>

              <div class="div-one-note">
                <div class="one-left" :style="{
                  color: isUpdate == 0 ? '#606266' : '#3d82fe',
                  fontWeight: isUpdate == 0 ? 'normal' : 'bold',
                }">
                  出库备注
                </div>
                <div class="one-right">
                  <el-input type="textarea" v-model="materialUpdateMsg.outNote" :readonly="isUpdate == 0 ? true : false">
                  </el-input>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="货物转移记录" name="second">
            <p class="font-title-style" style="margin-top: 0;">
              材料状态：{{
                materialUpdateMsg.state == 0
                ? "库存中"
                : materialUpdateMsg.state == 1
                  ? "加工中"
                  : materialUpdateMsg.state == 2
                    ? "加工完成"
                    : materialUpdateMsg.state == 3
                      ? "已出售"
                      : ""
              }}
            </p>
            <div>
              <Note :note="recordList" @noteContent="noteContent"></Note>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="inventoryLookSure" v-preventClick>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { groupMixins } from "@/mixins";

import { materialSavePort } from "_req/api/common";

import UploadImg from "@/components/upload-img.vue";
import Note from "@/components/note.vue";

export default {
  mixins: [groupMixins],
  components: {
    UploadImg,
    Note,
  },
  props: {
    dialogMaterialMsgUpdateVisible: {
      type: Boolean,
    },
    updateMaterialMsg: {},
  },
  data() {
    return {
      dialogMaterialMsgVisible: false,
      materialUpdateMsg: {},
      certificateshow2: false,
      isUpdate: 0,
      imgList: [],
      activeStockName: "first",
      recordList: [],
    };
  },
  created() {
    this.dialogMaterialMsgVisible = this.dialogMaterialMsgUpdateVisible;
    this.materialUpdateMsg = this.updateMaterialMsg;
    if (this.materialUpdateMsg.materialId == 11) {
      this.certificateshow2 = true;
    } else {
      this.certificateshow2 = false;
    }
    this.imgList = [];
    if (
      this.materialUpdateMsg.img !== null &&
      this.materialUpdateMsg.img !== ""
    ) {
      if (this.materialUpdateMsg.img.indexOf("|") !== -1) {
        this.imgList = this.materialUpdateMsg.img.split("|");
      } else {
        this.imgList.push(this.materialUpdateMsg.img);
      }
    } else {
      this.imgList = [];
    }

    if (this.materialUpdateMsg.transferRemarks) {
      this.recordList = JSON.parse(this.materialUpdateMsg.transferRemarks);
    } else {
      this.recordList = [];
    }
  },
  methods: {
    // 货物转移记录
    noteContent(val) {
      console.log("货物转移记录变化赋值", val);
      this.recordList = val;
    },

    // 修改材料
    updateDevice() {
      this.isUpdate = 1;
      if (
        this.materialUpdateMsg.isUpdate == 1 &&
        this.materialUpdateMsg.materialId == 11
      ) {
        this.$message.warning({
          message: "只能修改图片和备注",
          showClose: true,
          duration: 2000,
        });
      }
    },

    // 修改材料单价时总价的变化
    priceTotal() {
      this.materialUpdateMsg.totalPrice = 0;
      if (this.materialUpdateMsg.chargeUnit == "粒") {
        this.materialUpdateMsg.totalPrice = Number(
          this.materialUpdateMsg.unitPrice * this.materialUpdateMsg.number
        );
      } else {
        this.materialUpdateMsg.totalPrice = Number(
          this.materialUpdateMsg.unitPrice * this.materialUpdateMsg.weight
        );
      }

      this.totalPriceHkRateChange();
    },

    // 价格信息-汇率变化
    totalPriceHkRateChange() {
      if (this.materialUpdateMsg.totalHkRate) {
        if (this.materialUpdateMsg.currency == "CNY") {
          if (this.materialUpdateMsg.totalHkRate >= 1) {
            this.materialUpdateMsg.totalHkPrice = Number(
              this.materialUpdateMsg.totalPrice *
              this.materialUpdateMsg.totalHkRate
            ).toFixed(0);
          } else {
            this.materialUpdateMsg.totalHkPrice = Number(
              this.materialUpdateMsg.totalPrice /
              this.materialUpdateMsg.totalHkRate
            ).toFixed(0);
          }
        } else {
          this.materialUpdateMsg.totalHkPrice = Number(
            this.materialUpdateMsg.totalPrice *
            this.materialUpdateMsg.totalHkRate
          ).toFixed(0);
        }
      }
    },

    // 确定
    inventoryLookSure() {
      console.log(this.materialUpdateMsg);
      if (this.isUpdate == 0) {
        this.$emit("sureUpdateMaterial", 0);
      } else {
        materialSavePort({
          ...this.materialUpdateMsg,
          img: this.imgList.join("|"),
          transferRemarks: JSON.stringify(this.recordList),
        })
          .then((res) => {
            console.log("修改材料信息");
            console.log(res);
            this.$message.success("修改成功");
            this.$emit("sureUpdateMaterial", 1);
          })
          .catch((err) => {
            console.log(err);
            this.recordList = JSON.parse(this.recordList);
          });
      }
    },

    // 修改时材料名称变化
    materialUpdateChange(item) {
      this.materialUpdateMsg.chargeUnit = item.chargeUnit;
    },

    // 原材料图片
    materialImgUrlChange(data) {
      console.log("原材料图片", data);
      this.imgList = data.img;
    },

    // 汇率变化
    totalToHkRateChange() {
      if (this.materialUpdateMsg.saleCurrency == "CNY") {
        if (this.materialUpdateMsg.totalToHkRate >= 1) {
          this.materialUpdateMsg.sellTotalHkPrice = Number(
            this.materialUpdateMsg.saleMoney *
            this.materialUpdateMsg.totalToHkRate
          ).toFixed(0);
        } else {
          this.materialUpdateMsg.sellTotalHkPrice = Number(
            this.materialUpdateMsg.saleMoney /
            this.materialUpdateMsg.totalToHkRate
          ).toFixed(0);
        }
      } else {
        this.materialUpdateMsg.sellTotalHkPrice = Number(
          this.materialUpdateMsg.saleMoney *
          this.materialUpdateMsg.totalToHkRate
        ).toFixed(0);
      }
    },
    // 币种变化
    currencyChange() {
      if (this.materialUpdateMsg.saleCurrency == "HKD") {
        this.materialUpdateMsg.totalToHkRate = 1;
        this.materialUpdateMsg.sellTotalHkPrice = this.materialUpdateMsg.saleMoney;
      } else {
        this.materialUpdateMsg.totalToHkRate = "";
        this.materialUpdateMsg.sellTotalHkPrice = "";
      }
    },
    // 外币金额变化
    moneyChange() {
      if (this.materialUpdateMsg.saleCurrency == "HKD") {
        this.materialUpdateMsg.sellTotalHkPrice = this.materialUpdateMsg.saleMoney;
      } else {
        this.totalToHkRateChange();
      }
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
      this.materialUpdateMsg.customerType = item.name;
    },

    closeDialog() {
      this.$emit("sureUpdateMaterial", 0);
    },
  },
};
</script>

<style lang="scss" scoped>
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
