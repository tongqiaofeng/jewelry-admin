<template>
  <div class="img-url-container">
    <!-- 产品分类页面展示图 -->
    <div style="text-align: left;">
      <div class="back-img" @click="goBack">
        <img class="back-icon" src="../assets/imgs/goback.png" />
        <span class="font">返回</span>
      </div>
      <div style="display: flex;justify-content: space-between;">
        <!-- -->
        <div
          class="add-left"
          :style="{ width: imgAndUrlData.relationType === '3' ? '95%' : '50%' }"
        >
          <el-form
            label-width="82px"
            ref="classifyImgForm"
            :model="imgAndUrlData"
            :rules="classifyImgRules"
          >
            <el-form-item label="类别：">
              <el-select
                v-model="imgAndUrlData.viewType"
                placeholder="请选择"
                :popper-append-to-body="false"
                style="width: 100%"
                @change="classifyTypeChange"
              >
                <el-option label="整体图+路径" value="0"> </el-option>
                <el-option label="标题图+背景图+关联路径" value="1">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="排序：" prop="sort">
              <el-input
                v-model="imgAndUrlData.sort"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <div v-if="imgAndUrlData.viewType === '0'">
              <el-form-item label="图片：" prop="backgroundImg">
                <div>
                  <uploadOneImg
                    :imgUrl="imgAndUrlData.backgroundImg"
                    :isUpdate="1"
                    @imgChange="imgBackChange"
                  ></uploadOneImg>
                </div>
              </el-form-item>
              <el-form-item label="跳转路径：" prop="imgUrl">
                <el-input
                  v-model="imgAndUrlData.imgUrl"
                  placeholder="请输入跳转路径"
                ></el-input>
              </el-form-item>
            </div>
            <div v-if="imgAndUrlData.viewType === '1'">
              <el-form-item label="标题图：" prop="titleImg">
                <div>
                  <uploadOneImg
                    :imgUrl="imgAndUrlData.titleImg"
                    :isUpdate="1"
                    @imgChange="imgTitleChange"
                  ></uploadOneImg>
                </div>
              </el-form-item>
              <el-form-item label="背景图：" prop="backgroundImg">
                <div>
                  <uploadOneImg
                    :imgUrl="imgAndUrlData.backgroundImg"
                    :isUpdate="1"
                    @imgChange="imgBackChange"
                  ></uploadOneImg>
                </div>
              </el-form-item>
              <div>
                <el-form-item label="关联类型：" prop="relationType">
                  <el-select v-model="imgAndUrlData.relationType">
                    <el-option label="产品" value="0"> </el-option>
                    <el-option label="设计图" value="1"> </el-option>
                    <el-option label="设计师" value="3"> </el-option>
                    <el-option label="自定义网址" value="2"> </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <el-form-item label="展示图：" prop="imgUrl">
                <div class="img-container-every">
                  <div class="img">图片</div>
                  <div class="url">
                    {{
                      imgAndUrlData.relationType == 0
                        ? "关联产品"
                        : imgAndUrlData.relationType == 1
                        ? "关联设计图"
                        : "跳转路径"
                    }}
                  </div>
                  <div
                    class="designer"
                    v-if="imgAndUrlData.relationType === '3'"
                  >
                    设计师详情图片
                  </div>
                  <div class="do">操作</div>
                </div>
                <div class="img-container-every">
                  <div class="img">
                    <uploadOneImg
                      :imgUrl="showImgData.imgUrl"
                      :isUpdate="1"
                      @imgChange="addShowImgChange"
                    ></uploadOneImg>
                  </div>
                  <div class="url" style="text-align: center;">
                    <div v-if="imgAndUrlData.relationType === '0'">
                      <div v-if="!showImgData.id">
                        右侧选择产品
                      </div>
                      <div v-else>
                        <img
                          :src="axiosUrl + '/file/' + showImgData.img"
                          style="width: 100px;height:100px;"
                        />
                      </div>
                    </div>
                    <div v-if="imgAndUrlData.relationType === '1'">
                      <div v-if="!showImgData.id">
                        右侧选择设计图
                      </div>
                      <div v-else>
                        <img
                          :src="axiosUrl + '/file/' + showImgData.img"
                          style="width: 100px;height:100px;"
                        />
                      </div>
                    </div>
                    <div
                      v-if="
                        imgAndUrlData.relationType === '2' ||
                          imgAndUrlData.relationType === '3'
                      "
                    >
                      <el-input v-model="showImgData.jumpUrl"></el-input>
                    </div>
                  </div>
                  <div
                    class="designer"
                    v-if="imgAndUrlData.relationType === '3'"
                  >
                    <uploadImg
                      :imgUrl="showImgData.designerImg"
                      :isUpdate="1"
                      @imgChange="addShowDesignerImgChange"
                    ></uploadImg>
                  </div>
                  <div class="do">
                    <el-button type="text" @click="addImgAndUrl"
                      >添加</el-button
                    >
                  </div>
                </div>
                <draggable
                  v-model="imgAndUrlData.dataStr"
                  item-key="index"
                  animation="300"
                  @update="datadragEnd"
                >
                  <transition-group>
                    <div
                      v-for="(item, index) of imgAndUrlData.dataStr"
                      :key="index"
                      class="img-container-every"
                    >
                      <div class="img" @click="updateIndex(index)">
                        <uploadOneImg
                          :imgUrl="item.imgUrl"
                          :isUpdate="1"
                          @imgChange="updateShowImgChange"
                        ></uploadOneImg>
                      </div>
                      <div class="url">
                        <div v-if="imgAndUrlData.relationType === '0'">
                          <img
                            v-if="item.id"
                            :src="axiosUrl + '/file/' + item.img"
                            style="width: 100px;height:100px;"
                          />
                          <div v-else>
                            右侧选择产品
                          </div>
                          <el-button
                            type="text"
                            @click="updateRelevanceIndex(index)"
                            >修改关联</el-button
                          >
                        </div>
                        <div v-if="imgAndUrlData.relationType === '1'">
                          <img
                            v-if="item.id"
                            :src="axiosUrl + '/file/' + item.img"
                            style="width: 100px;height:100px;"
                          />
                          <div v-else>
                            右侧选择设计图
                          </div>
                          <el-button
                            type="text"
                            @click="updateRelevanceIndex(index)"
                            >修改关联</el-button
                          >
                        </div>
                        <div
                          v-if="
                            imgAndUrlData.relationType === '2' ||
                              imgAndUrlData.relationType === '3'
                          "
                        >
                          <el-input v-model="item.jumpUrl"></el-input>
                        </div>
                      </div>
                      <div
                        class="designer"
                        v-if="imgAndUrlData.relationType === '3'"
                      >
                        <uploadImg
                          :imgUrl="item.designerImg"
                          :isUpdate="1"
                          @imgChange="updateShowDesignerImgChange"
                        ></uploadImg>
                      </div>
                      <div class="do">
                        <el-button type="text" @click="delImgAndUrl(index)"
                          >删除</el-button
                        >
                      </div>
                    </div>
                  </transition-group>
                </draggable>
              </el-form-item>
            </div>
          </el-form>
          <div style="margin-top: 40px;text-align: right;">
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              style="width: 120px;margin-left: 10px;"
              @click.prevent="addClassify"
              >提交</el-button
            >
          </div>
        </div>

        <div
          class="add-right"
          v-if="
            imgAndUrlData.viewType === '1' && imgAndUrlData.relationType === '0'
          "
        >
          <div>
            <p class="title-font">成品库存查询</p>
            <div>
              <el-form label-width="110px">
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
            :key="1"
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
        <div
          class="add-right"
          v-else-if="
            imgAndUrlData.viewType === '1' && imgAndUrlData.relationType === '1'
          "
        >
          <div>
            <p class="title-font">设计图查询</p>
            <div style="display:flex;padding: 30px 20px 0 20px;">
              <el-input
                placeholder="可输入设计图名称、设计师名称、标签、设计理念等搜索"
                v-model="designListKeyword"
              ></el-input
              ><el-button
                type="primary"
                style="margin-left: 10px;"
                @click="handleDesignCurrentChange(1)"
                >搜索</el-button
              >
            </div>
            <div style="padding: 20px;">
              <el-radio-group
                v-model="statusDesign"
                @change="handleDesignCurrentChange(1)"
              >
                <el-radio label="0">小程序未显示</el-radio>
                <el-radio label="1">小程序已显示</el-radio>
              </el-radio-group>
            </div>
          </div>
          <el-table
            :data="producibleDesignList"
            highlight-current-row
            border
            :row-key="getRowKeys"
            :key="2"
            @row-dblclick="handleDesignSelChange"
            ref="multipleTable"
          >
            <el-table-column align="center" prop="name" label="设计图名称">
            </el-table-column>
            <el-table-column
              align="center"
              prop="designerName"
              label="设计师名称"
            >
            </el-table-column>
            <el-table-column align="center" prop="label" label="标签">
            </el-table-column>
            <el-table-column align="center" prop="designId" label="设计图片">
              <template slot-scope="scope">
                <img
                  :src="axiosUrl + '/file/' + imgFilter(scope.row.img)"
                  style="width: 100px;height: 100px;object-fit: cover;"
                />
              </template>
            </el-table-column>
          </el-table>
          <div style="width: 100%;height: 50px;">
            <div style="margin:15px 0;position:absolute;right:40px;">
              <el-pagination
                @current-change="handleDesignCurrentChange"
                :current-page="designPage"
                :page-size="5"
                layout="total, prev, pager, next, jumper"
                :total="designTotal"
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
import {
  warehouseFactoryPort,
  productListPort,
  designListPort,
  webConfigSavePort,
} from "_req/api/common";

import uploadOneImg from "@/components/upload-one-img.vue";
import uploadImg from "@/components/upload-img";
import draggable from "vuedraggable";

export default {
  components: { uploadOneImg, draggable, uploadImg },
  props: {
    manageType: {},
    updateMsg: {},
  },
  data() {
    return {
      warehouseFilterList: [],
      storageIdList: [],
      deviceFilterList: [],
      proudctkeyword: "",
      page: 1,
      pageNum: 10,
      total: 0,

      designPage: 1,
      designTotal: 0,

      designListKeyword: "",
      statusDesign: "1",
      producibleDesignList: [],

      axiosUrl: "",

      pageSel: 0,

      imgAndUrlData: {
        id: null,
        sort: 100,
        manageType: this.manageType,
        viewType: "1",
        titleImg: "",
        backgroundImg: "",
        imgUrl: "",
        relationType: "0",
        dataStr: [],
      },
      showImgData: {
        imgUrl: "",
        jumpUrl: "",
        id: null,
        img: "",
        name: "",
        designerImg: [],
      },

      classifyImgRules: {},
      updateI: null,
      relevanceMsg: {},
    };
  },
  created() {
    console.log(this.updateMsg);

    if (this.updateMsg.viewType == 0 || this.updateMsg.viewType == 1) {
      this.imgAndUrlData = this.updateMsg;
      this.imgAndUrlData.viewType = this.imgAndUrlData.viewType + "";
      this.imgAndUrlData.relationType = this.imgAndUrlData.relationType + "";
      if (this.imgAndUrlData.dataStr) {
        console.log("--------------");
        this.imgAndUrlData.dataStr = JSON.parse(this.imgAndUrlData.dataStr);
      } else {
        this.imgAndUrlData.dataStr = [];
      }
    }
    this.axiosUrl = base_request_url;
    this.warehouseCheck();
    this.getproducibleDesignList();
  },
  methods: {
    datadragEnd(evt) {
      evt.preventDefault();
      console.log("拖动前的索引 :" + evt.oldIndex);
      console.log("拖动后的索引 :" + evt.newIndex);
      console.log(this.imgAndUrlData.dataStr);
    },

    // 类别变化
    classifyTypeChange() {
      this.imgAndUrlData.relationType = "2";
    },
    // 提交
    addClassify() {
      this.imgAndUrlData.dataStr = JSON.stringify(this.imgAndUrlData.dataStr);
      webConfigSavePort(this.imgAndUrlData)
        .then((res) => {
          console.log("提交网页设置", res);
          this.$message.success("提交成功");
          this.$emit("imgAndUrlSubmit", 1);
        })
        .catch((err) => {
          console.log(err);
          this.imgAndUrlData.dataStr = JSON.parse(this.imgAndUrlData.dataStr);
        });
    },

    goBack() {
      this.$emit("imgAndUrlSubmit", 0);
    },

    // 标题图片
    imgTitleChange(val) {
      console.log(val);
      this.imgAndUrlData.titleImg = val;
    },

    // 背景图
    imgBackChange(val) {
      console.log(val);
      this.imgAndUrlData.backgroundImg = val;
    },

    // 显示图 添加 图片
    addShowImgChange(val) {
      console.log(val);
      this.showImgData.imgUrl = val;
    },

    // 显示图 添加 设计师图片
    addShowDesignerImgChange(val) {
      console.log(val);
      this.showImgData.designerImg = val.img;
    },

    // 显示图 修改 图片
    updateIndex(i) {
      console.log(i);
      this.updateI = i;
    },

    updateShowImgChange(val) {
      this.imgAndUrlData.dataStr[this.updateI].imgUrl = val;
      console.log(this.imgAndUrlData.dataStr);
    },

    // 显示图  修改 设计师图片
    updateShowDesignerImgChange(val) {
      this.imgAndUrlData.dataStr[this.updateI].designerImg = val.img;
      console.log(this.imgAndUrlData.dataStr);
    },

    // 显示图  修改 关联产品/设计图
    updateRelevanceIndex(i) {
      console.log(i);
      this.updateI = i;
      this.imgAndUrlData.dataStr[this.updateI].id = null;
      this.imgAndUrlData.dataStr[this.updateI].img = "";
      this.imgAndUrlData.dataStr[this.updateI].name = "";
    },

    // 添加显示图
    addImgAndUrl() {
      this.imgAndUrlData.dataStr.push(this.showImgData);
      this.showImgData = {
        imgUrl: "",
        jumpUrl: "",
        id: null,
        img: "",
        name: "",
        designerImg: [],
      };
    },

    // 删除
    delImgAndUrl(index) {
      this.imgAndUrlData.dataStr.splice(index, 1);
    },

    // 选择关联产品
    handleSelectionChange(row) {
      if (this.updateI != null) {
        console.log("修改111111111");
        this.imgAndUrlData.dataStr[this.updateI].id = row.id;
        this.imgAndUrlData.dataStr[this.updateI].img = row.img.split("|")[0];
        this.imgAndUrlData.dataStr[this.updateI].name = row.productName;
      } else {
        console.log("添加22222222");
        this.showImgData.id = row.id;
        this.showImgData.img = row.img.split("|")[0];
        this.showImgData.name = row.productName;
      }
      this.updateI = null;
    },

    // 选择关联设计图
    handleDesignSelChange(row) {
      if (this.updateI != null) {
        this.imgAndUrlData.dataStr[this.updateI].id = row.id;
        this.imgAndUrlData.dataStr[this.updateI].img = row.img.split("|")[0];
        this.imgAndUrlData.dataStr[this.updateI].name = row.name;
      } else {
        this.showImgData.id = row.id;
        this.showImgData.img = row.img.split("|")[0];
        this.showImgData.name = row.name;
      }

      this.updateI = null;
    },

    getRowKeys(row) {
      return row.id;
    },

    // 删
    delNum(index) {
      this.imgAndUrlData.productIdList.splice(index, 1); //页面--成品待出库清单
    },

    // 设计稿列表
    getproducibleDesignList() {
      console.log(this.designListKeyword);

      designListPort({
        keyword: this.designListKeyword,
        display: this.statusDesign,
        page: this.designPage,
        pageNum: 5,
      }).then((res) => {
        console.log("设计列表");
        console.log(res);
        this.producibleDesignList = res.data.data.list;
        this.designTotal = res.data.data.total;
        this.designListKeyword = "";
      });
    },

    // 分页
    handleDesignCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.designPage = val;
      this.getproducibleDesignList();
      document.getElementById("mainContainer").scrollTop = 0;
    },

    // 产品列表
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

      document.getElementById("mainContainer").scrollIntoView();
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
  },
};
</script>

<style lang="scss" scoped>
.img-url-container {
  background-color: #fff;
  border-radius: 6px;

  .add-left {
    margin-right: 10px;
    text-align: left;
    background-color: #fff;
    border-radius: 6px;

    .num {
      text-align: center;
    }
  }

  .add-right {
    width: 45%;
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

  .img-container-every {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    .img {
      width: 20%;
      text-align: center;
    }

    .url {
      width: 35%;
      text-align: center;
    }

    .designer {
      width: 40%;
      text-align: center;
    }
    .do {
      // width: 10%;
      text-align: center;
    }
  }
}
</style>
