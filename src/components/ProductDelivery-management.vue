<template>
  <div class="warehouse-management-container" id="warehouse">
    <!-- <h1>成品出库管理</h1> -->
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
            <el-table-column label="名称">
              <template slot-scope="scope">
                <div>
                  <span>{{ scope.row.materialName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="productNumber" label="统一编号">
            </el-table-column>
            <el-table-column label="移除材料">
              <template slot-scope="scope">
                <div class="num">
                  <el-button
                    type="text"
                    style="color: red;width: 100%;"
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
            <!-- <p class="title-font">加工中原材料库存查询</p> -->
            <p class="title-font">成品库存查询</p>
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
                      v-show="item.isOwn == 1"
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
                    placeholder="可输入产品名称、设计名称、统一编号、备注进行搜索"
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
            <el-table-column prop="designName" label="成品图片">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.img == '' || scope.row.img == null"
                    >---</span
                  >
                  <img
                    v-else
                    :src="img + '/file/' + imgFilter(scope.row.img)"
                    width="50px"
                    height="50px"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="名称">
              <template slot-scope="scope">
                <div>
                  <span>{{ scope.row.materialName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="productNumber" label="统一编号">
            </el-table-column>
            <el-table-column prop="designName" label="现存仓库">
              <template slot-scope="scope">
                <div>
                  <span>{{ scope.row.storageName }}</span>
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
                      <div class="one-right" id="one-note">
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
                            v-if="
                              imgurl !== '' && imgurl !== null && isUpdate == 1
                            "
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
                      v-if="
                        inventoryCheckDetail.detailImg != '' || isUpdate == 1
                      "
                    >
                      <div class="add" v-if="isUpdate == 1">
                        <form
                          enctype="multipart/form-data"
                          style="width: 100px;"
                        >
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
                            v-if="
                              imgurl !== '' && imgurl !== null && isUpdate == 1
                            "
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
                      v-if="
                        inventoryCheckDetail.detailImg == '' && isUpdate == 0
                      "
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
                    <el-table-column prop="name" label="名称">
                    </el-table-column>
                    <el-table-column prop="number" label="数量">
                    </el-table-column>
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
              <el-button
                type="primary"
                @click="inventoryLookSure"
                v-preventClick
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
                          v-model="deviceDetail.chargeUnit"
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
              <el-button @click="dialogDeviceDetailVisible = false"
                >取 消</el-button
              >
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
                          :src="
                            imgurl.length < 42
                              ? img + '/file/' + imgurl
                              : imgurl
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
                            ? deviceDetails.number +
                              " " +
                              deviceDetails.chargeUnit
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
                            ? deviceDetails.weight +
                              " " +
                              deviceDetails.chargeUnit
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
                          deviceDetails.totalPrice +
                            " " +
                            deviceDetails.currency
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
              <el-button
                type="primary"
                @click="dialogDeviceDetailsVisible = false"
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
export default {
  data() {
    return {
      img: this.$store.state.baseUrl,
      warehouseList: [
        {
          id: 0,
          name: "全部",
          type: 0,
          isOwn: 1,
        },
      ],
      storageIdList: [0],

      deviceAllList: [],
      deviceFilterList: [],
      dialogDeviceDetailsVisible: false,
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
        newidlist: [],
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
      proudctkeyword: "",
      page: 1,
      pageNum: 10,
      total: 0,
      dialogInventoryCheckVisible: false,
      inventoryCheckDetail: {},
      deviceDetails: {},

      isUpdate: 0,
      imgList: [],
      productimgList: [],
      detailImgList: [],
      activeStockName: "first",
      activeName: "ff",
      params: {},
      warehouseFilterList: [],
      productLabelList: [],
      labelSelList: [],

      imgSortList: [],
      count: 0,
      certificateshow2: false,
      dialogDeviceDetailVisible: false,
      deviceDetail: {},
      designListKeyword: "",
      statusDesign: "1",
      producibleDesignList: [],
      chooseimgshow: false,

      integralTotal: "",
      userList: [],
      loading: false,
    };
  },
  created() {
    this.getWarehouseFactoryList();
    this.getLabelList();
    this.getproducibleDesignList();
  },
  mounted() {
    document.getElementById("warehouse").scrollIntoView();
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
    // 出库类型变化
    typeChange() {
      this.$refs.deliveryForm.clearValidate();
    },
    // 材料出库
    stockInSubmit(formName) {
      if (this.deliveryData.stockInIdList.length == 0) {
        this.$message.warning({
          message: "请选择出库成品",
          showClose: true,
          duration: 2000,
        });
      } else {
        this.params = {};
        if (this.deliveryData.type == 0) {
          this.params = {
            type: this.deliveryData.type,
            stockInList: this.deliveryData.newidlist,
            stockOutTime: this.deliveryData.stockOutTime,
            endStorageId: this.deliveryData.endStorageId,
            receiver: this.deliveryData.receiver,
            note: this.deliveryData.note,
          };
        } else {
          this.params = {
            type: this.deliveryData.type,
            stockInList: this.deliveryData.newidlist,
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
        console.log(this.deliveryData.newidlist);
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
                this.$refs.deliveryForm.resetFields();
                this.deliveryData.stockInIdList = [];
                this.deliveryData.newidlist = [];
                this.deliveryData.totalToCnRate = "";
                this.deliveryData.sellTotalCnPrice = "";
                this.deliveryData.totalToHkRate = "";
                this.deliveryData.sellTotalHkPrice = "";
                this.deliveryData.phoneNumber = "";
                this.deliveryData.user = "";
                this.userList = [];
                this.integralTotal = "";
                this.deliveryData.integral = "";

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
    // 删
    delNum(index) {
      // console.log(index);
      this.deliveryData.stockInIdList.splice(index, 1); //页面--成品待出库清单
      this.deliveryData.newidlist.splice(index, 1); //出库提交的参数
      // console.log(this.deliveryData.newidlist);
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
    // 选择出库材料
    handleDeviceListChange(row, column) {
      console.log(row);
      if (column.label == "操作") {
        this.stockOutDetails(row); //查看成品详情
      }
    },
    dblDeviceListChange(row) {
      this.activeStockName = "first";
      console.log(row);
      if (this.deliveryData.stockInIdList.length == 0) {
        this.deliveryData.stockInIdList.push({
          id: row.id,
          designName: row.designName,
          img:
            row.img == "" || row.img == null
              ? ""
              : row.img.indexOf("|") == -1
              ? row.img
              : row.img.split("|")[0],
          productNumber: row.productNumber,
          materialName: row.materialName,
        });
        this.deliveryData.newidlist.push({
          id: row.id,
          number: 1,
        });
      } else {
        // console.log('000000099999999--------')
        console.log(this.filterSel(row));
        if (this.filterSel(row)) {
          this.$message.error({
            message: "请勿重复添加",
            showClose: true,
            duration: 2000,
          });
        } else {
          this.deliveryData.stockInIdList.push({
            id: row.id,
            designName: row.designName,
            img:
              row.img == "" || row.img == null
                ? ""
                : row.img.indexOf("|") == -1
                ? row.img
                : row.img.split("|")[0],
            productNumber: row.productNumber,
            materialName: row.materialName,
          });
          this.deliveryData.newidlist.push({
            id: row.id,
            number: 1,
          });
        }
      }
      console.log(this.deliveryData.stockInIdList);
    },
    // 成品详情
    stockOutDetails(val) {
      this.inventoryCheckDetail = {};
      this.activeStockName = "first";
      this.isUpdate = 0;
      if (val.isMaterial == 0) {
        this.$axios
          .post(this.$store.state.baseUrl + "/productInfo", {
            id: val.id,
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
      } else if (val.isMaterial == 1) {
        this.$axios
          .post(this.$store.state.baseUrl + "/stockMaterialInfo", {
            id: val.id,
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
    // 修改链条/证书信息
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
    filterSel(val) {
      for (const item of this.deliveryData.stockInIdList) {
        if (item.id == val.id) {
          return true;
        }
      }
      return false;
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
          processCost: this.inventoryCheckDetail.processCost,
          currency: this.inventoryCheckDetail.currency,
          designId: this.inventoryCheckDetail.designId,
          note: this.inventoryCheckDetail.note,
          productNumber: this.inventoryCheckDetail.productNumber,
          productName: this.inventoryCheckDetail.productName,
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
    // 模糊搜索
    keywordChange() {
      this.page = 1;
    },
    warehouseCheck() {
      this.deviceAllList = [];

      this.$axios
        .post(this.$store.state.baseUrl + "/productList", {
          state: 0,
          storageIdList:
            this.storageIdList.indexOf(0) == -1 ? this.storageIdList : [],
          keyword: this.proudctkeyword,
          isBack: 1,
        })
        .then((res) => {
          console.log("条件查找成品库存列表");
          console.log(res);
          this.total = res.data.total;
          this.page = 1;
          for (const ite of res.data.warehouseFactoryList) {
            this.deviceAllList = this.deviceAllList.concat(ite.productList);
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
      // es6过滤得到满足搜索条件的展示数据list
      this.deviceFilterList = this.deviceAllList.filter(
        (item, index) =>
          index < this.page * this.pageNum &&
          index >= this.pageNum * (this.page - 1)
      );
      this.total = this.deviceAllList.length;
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

      .num {
        display: flex;

        span {
          cursor: pointer;
          font-size: 16px;
        }
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
