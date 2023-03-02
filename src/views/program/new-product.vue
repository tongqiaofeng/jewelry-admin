<template>
  <div class="activity-admin-container" id="activityAdmin">
    <!-- 上新产品 -->
    <div class="add-container">
      <div class="add-left">
        <el-form
          label-width="80px"
          ref="addActivityForm"
          :model="addActivityData"
          :rules="addActivityRules"
        >
          <el-form-item prop="newStyleName" label="上新名称">
            <el-input
              v-model="addActivityData.newStyleName"
              placeholder="请输入上新名称"
            ></el-input>
          </el-form-item>
          <el-form-item prop="productIdList" label="上新产品">
            <el-table
              ref="singleTable"
              :data="addActivityData.productIdList"
              highlight-current-row
              style="width: 100%"
              border
            >
              <el-table-column align="center" prop="img" label="成品图片">
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
              <el-table-column align="center" label="移除商品">
                <template slot-scope="scope">
                  <div>
                    <el-button type="text" @click="delNum(scope.$index)"
                      >移除</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>

        <div style="margin-top: 30px;text-align: right;">
          <el-button
            style="width: 120px;"
            type="primary"
            @click="addActivitySubmit('addActivityForm')"
            v-preventClick
            >提 交</el-button
          >
        </div>
      </div>
      <div class="add-right">
        <div>
          <p class="title-font">成品库存查询</p>
          <div>
            <el-form label-width="110px">
              <!-- 用户管理仓库 -->
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
                    v-for="item in warehouseList"
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
          <el-table-column align="center" prop="productNumber" label="统一编号">
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
    </div>
  </div>
</template>

<script>
import { base_request_url } from "_req/http";
import { warehouseFactoryPort, productListPort } from "_req/api/common";
import { newStylePort, newStyleProductListPort } from "_req/api/program";

export default {
  data() {
    return {
      axiosUrl: "",
      warehouseList: [],
      storageIdList: [],

      deviceAllList: [],
      deviceFilterList: [],
      proudctkeyword: "",
      page: 1,
      pageNum: 10,
      total: 0,

      addActivityData: {
        newStyleName: "",
        productIdList: [],
      },

      addActivityRules: {
        newStyleName: [
          {
            required: true,
            message: "请输入上新名称",
          },
        ],
        productIdList: [
          {
            required: true,
            message: "请选择主推产品",
          },
        ],
      },
    };
  },
  created() {
    this.axiosUrl = base_request_url;
    this.getActivityList();
    this.getWarehouseFactoryList();
  },
  methods: {
    // 确定添加
    addActivitySubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("success");

          this.addActivityData.productIdList = this.addActivityData.productIdList.map(
            (item) => {
              return item.id;
            }
          );
          console.log(this.addActivityData);

          newStylePort(this.addActivityData)
            .then((res) => {
              console.log("活动提交");
              console.log(res);
              this.$message.success({
                message: "提交成功",
                showClose: true,
                duration: 1500,
              });

              this.getActivityList();
              document.getElementById("activityAdmin").scrollIntoView();
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    getRowKeys(row) {
      return row.id;
    },
    // 选择参与活动商品
    handleSelectionChange(row) {
      if (this.addActivityData.productIdList.length == 0) {
        this.addActivityData.productIdList.push({
          id: row.id,
          img: row.img,
          productName: row.productName,
          productNumber: row.productNumber,
        });
      } else {
        if (this.filterSel(row)) {
          this.$message.error({
            message: "请勿重复添加",
            showClose: true,
            duration: 2000,
          });
        } else {
          this.addActivityData.productIdList.push({
            id: row.id,
            img: row.img,
            productName: row.productName,
            productNumber: row.productNumber,
          });
        }
      }

      console.log(this.addActivityData.productIdList);
    },
    // 删
    delNum(index) {
      this.addActivityData.productIdList.splice(index, 1); //页面--成品待出库清单
    },
    // 判断是否重复添加
    filterSel(val) {
      for (const item of this.addActivityData.productIdList) {
        if (item.id == val.id) {
          return true;
        }
      }
      return false;
    },

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

      document.getElementById("activityAdmin").scrollIntoView();
    },

    // 获取主推产品列表
    getActivityList() {
      newStyleProductListPort()
        .then((res) => {
          console.log("主推产品列表");
          console.log(res);

          this.addActivityData.newStyleName = res.data.data.newStyleName;
          this.addActivityData.productIdList =
            res.data.data.newStyleProductList;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取仓库/加工厂列表
    getWarehouseFactoryList() {
      warehouseFactoryPort()
        .then((res) => {
          console.log("仓库/加工厂");
          console.log(res);
          this.warehouseList = res.data.data;
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
.activity-admin-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 6px;
}

.goBack {
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 6px;

  .back-main {
    width: fit-content;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    img {
      width: 26px;
      height: 25px;
      margin-right: 5px;
    }

    span {
      color: #6a6a6a;
      font-size: 16px;
    }
  }
}

.add-container {
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

    .title-font {
      height: 48px;
      margin: 0;
      text-align: left;
      color: #6a6a6a;
      font-size: 18px;
      font-weight: bold;
    }
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
  }
}
</style>
