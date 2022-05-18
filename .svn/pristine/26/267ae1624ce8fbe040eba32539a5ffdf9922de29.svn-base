<template>
  <div class="home-container" id="home-container" @click="otherClick">
    <el-container ref="homePage">
      <el-header height="78px">
        <div class="main-top-right">
          <div class="left-con">
            <p class="left-font-one">珠宝后台管理系统</p>
          </div>
          <div style="display: flex;">
            <div class="right-div" @click="updateUserClick">
              <span class="span1">{{ userNick }}</span>
              <div class="span-img">
                <img src="../assets/imgs/home/down.png" class="img-self" />
              </div>
            </div>
          </div>
          <div class="downbtn" v-if="updateUser == 1">
            <ul class="updateUl">
              <li class="updateLi1">
                <div class="updateP" @click="pswUpdate">
                  <div class="nick-img">
                    <div class="update-nick-img" style="display: flex;">
                      <div style="margin-top: 3px;">
                        <img
                          src="../assets/imgs/update-psw.png"
                          style="width: 17px;height: 20px;"
                        />
                      </div>
                      <span class="span-psw">修改密码</span>
                    </div>
                  </div>
                </div>
                <el-dialog
                  class="uuupdate"
                  title="修改密码"
                  :visible.sync="pswDialogVisible"
                  :append-to-body="true"
                  :close-on-press-escape="false"
                  :close-on-click-modal="false"
                >
                  <div style="width:100%;display:flex;">
                    <p class="font">旧密码：</p>
                    <input
                      class="update-nick"
                      type="text"
                      v-model="oldPsw"
                      placeholder="请输入旧密码"
                    />
                  </div>
                  <div style="width:100%;margin-top:15px;display:flex;">
                    <p class="font">新密码：</p>
                    <input
                      class="update-nick"
                      type="text"
                      v-model="newPsw"
                      placeholder="请输入新密码"
                    />
                  </div>
                  <span slot="footer" class="dialog-footer">
                    <el-button
                      @click="pswDialogVisible = false"
                      style="margin-left: 35%;"
                      >取 消</el-button
                    >
                    <el-button type="primary" @click="updatePsw" v-preventClick
                      >确 定</el-button
                    >
                  </span>
                </el-dialog>
              </li>
              <li class="updateLi1">
                <div class="updateP" @click="logOut">
                  <div class="psw-img">
                    <div class="update-nick-img" style="display: flex;">
                      <div style="margin-top: 3px;">
                        <img
                          src="../assets/imgs/logOut.png"
                          style="width: 17px;height: 18px;"
                        />
                      </div>
                      <span>退出登录</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="218px">
          <ul class="aside-ul-dad">
            <li class="dad-li">
              <div style="width: 100%;">
                <p class="dad-li-font">统一管理</p>
              </div>
              <ul class="aside-ul-son">
                <li
                  class="son-li"
                  @click="checkedPage02"
                  :style="{
                    backgroundColor:
                      pageSelect == 2 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 2"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 2 ? '-52px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/pending.png"
                      />
                    </div>
                    <p class="center-font">待入库</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../assets/imgs/home/right.png"
                    />
                  </div>
                </li>
                <li
                  class="son-li"
                  v-if="systemAdmin == 1"
                  @click="checkedPage09"
                  :style="{
                    backgroundColor:
                      pageSelect == 9 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 9"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 9 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/12.png"
                      />
                    </div>
                    <p class="center-font">销售报表</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../assets/imgs/home/right.png"
                    />
                  </div>
                </li>
              </ul>
            </li>
            <li class="dad-li">
              <div style="width: 100%;">
                <p class="dad-li-font">原材料管理</p>
              </div>
              <ul class="aside-ul-son">
                <li
                  class="son-li"
                  @click="checkedPage01"
                  :style="{
                    backgroundColor:
                      pageSelect == 1 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 1"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 1 ? '-66px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/01.png"
                      />
                    </div>
                    <p class="center-font">查询</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../assets/imgs/home/right.png"
                    />
                  </div>
                </li>
                <li
                  class="son-li"
                  @click="checkedPage03"
                  :style="{
                    backgroundColor:
                      pageSelect == 3 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 3"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 3 ? '-66px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/04.png"
                      />
                    </div>
                    <p class="center-font">入库</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../assets/imgs/home/right.png"
                    />
                  </div>
                </li>
                <li
                  class="son-li"
                  @click="checkedPage04"
                  :style="{
                    backgroundColor:
                      pageSelect == 4 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 4"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 4 ? '-66px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/05.png"
                      />
                    </div>
                    <p class="center-font">出库</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../assets/imgs/home/right.png"
                    />
                  </div>
                </li>
              </ul>
            </li>
            <li class="dad-li">
              <div style="width: 100%;">
                <p class="dad-li-font">成品管理</p>
              </div>
              <ul class="aside-ul-son">
                <li
                  class="son-li"
                  @click="checkedPage07"
                  :style="{
                    backgroundColor:
                      pageSelect == 7 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 7"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 7 ? '-66px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/01.png"
                      />
                    </div>
                    <p class="center-font">查询</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../assets/imgs/home/right.png"
                    />
                  </div>
                </li>

                <li
                  class="son-li"
                  @click="checkedPage06"
                  :style="{
                    backgroundColor:
                      pageSelect == 6 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 6"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 6 ? '-66px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/04.png"
                      />
                    </div>
                    <p class="center-font">入库</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../assets/imgs/home/right.png"
                    />
                  </div>
                </li>
                <li
                  class="son-li"
                  @click="checkedPage08"
                  :style="{
                    backgroundColor:
                      pageSelect == 8 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 8"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 8 ? '-66px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/05.png"
                      />
                    </div>
                    <p class="center-font">出库</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../assets/imgs/home/right.png"
                    />
                  </div>
                </li>
              </ul>
            </li>
            <li
              v-if="systemAdmin == 1"
              style="width: 100%;height: 1px;margin-top: 20px;background-color: #262e3d;"
            ></li>
            <li
              v-if="systemAdmin == 1"
              class="dad-li"
              style="margin-top: 20px;"
            >
              <div style="width: 100%;">
                <p class="dad-li-font">系统设置</p>
              </div>
              <ul class="aside-ul-son">
                <li
                  class="son-li"
                  v-if="systemAdmin == 1"
                  @click="checkedPage05"
                  :style="{
                    backgroundColor:
                      pageSelect == 5 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 5"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 5 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/08.png"
                      />
                    </div>
                    <p class="center-font">用户管理</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../assets/imgs/home/right.png"
                    />
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </el-aside>
        <el-main
          class="home-container-main"
          id="mainContainer"
          @scroll.native="containerScrollTop"
        >
          <!-- 原材料库存查询 -->
          <StockInquiry
            v-if="pageSelect == 1"
            :stockInquiryParam="stockInquiryParam"
          >
          </StockInquiry>
          <!-- 成品库存查询 -->
          <FinishedStockInquiry
            :stockInquiryParam="stockInquiryParam"
            v-if="pageSelect == 7"
          ></FinishedStockInquiry>
          <!-- 待入库 -->
          <StockPending v-if="pageSelect == 2"></StockPending>
          <!-- 入库管理 -->
          <StockManagement v-if="pageSelect == 3"></StockManagement>
          <!-- 出库管理 -->
          <WarehouseManagement v-if="pageSelect == 4"></WarehouseManagement>
          <!-- 成品入库管理 -->
          <ProductManagement v-if="pageSelect == 6"></ProductManagement>
          <!-- 成品出库管理 -->
          <ProductDeliveryManagement
            v-if="pageSelect == 8"
          ></ProductDeliveryManagement>
          <!-- 用户管理 -->
          <UserAdmin v-if="pageSelect == 5"></UserAdmin>
          <!-- 销售报表 -->
          <SalesReport v-if="pageSelect == 9"></SalesReport>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import StockInquiry from "@/components/Stock-inquiry.vue";
import FinishedStockInquiry from "@/components/Finished-stock-inquiry.vue";
import StockPending from "@/components/Stock-pending";
import StockManagement from "@/components/Stock-management.vue";
import WarehouseManagement from "@/components/Warehouse-management.vue";
import ProductManagement from "@/components/Product-management.vue";
import ProductDeliveryManagement from "@/components/ProductDelivery-management.vue";
import UserAdmin from "@/components/User-admin.vue";
import SalesReport from "@/components/Sales-report.vue";

export default {
  name: "Home",
  components: {
    StockInquiry,
    FinishedStockInquiry,
    StockPending,
    StockManagement,
    WarehouseManagement,
    ProductManagement,
    UserAdmin,
    ProductDeliveryManagement,
    SalesReport,
  },
  data() {
    return {
      userNick: "",
      pageSelect: 1,
      updateUser: 0,
      pswDialogVisible: false,
      oldPsw: "",
      newPsw: "",
      systemAdmin: 0,

      stockInquiryParam: {
        sel: 0,
      },
      clientHeight: "",
    };
  },
  created() {
    this.userNick = sessionStorage.getItem("nick");
    this.systemAdmin = sessionStorage.getItem("isAdmin");
    console.log(this.systemAdmin);
    this.checkedPage02();
  },
  mounted() {
    this.clientHeight = document.documentElement.clientHeight;
    this.$refs.homePage.$el.style.height = this.clientHeight + "px";
    window.onresize = () => {
      this.clientHeight = document.documentElement.clientHeight;
      this.$refs.homePage.$el.style.height = this.clientHeight + "px";
    };
  },
  methods: {
    containerScrollTop(e) {
      if (e.target.scrollTop != 0) {
        sessionStorage.setItem("scrollTopHeight", e.target.scrollTop);
      }
    },
    // 原材料库存
    checkedPage01() {
      this.pageSelect = 1;
      this.stockInquiryParam.sel = 0;
      sessionStorage.setItem("scrollTopHeight", 0);

      this.backTop();
    },
    //成品库存查询
    checkedPage07() {
      this.pageSelect = 7;
      this.stockInquiryParam.sel = 0;
      sessionStorage.setItem("scrollTopHeight", 0);

      this.backTop();
    },
    // 待入库
    checkedPage02() {
      this.pageSelect = 2;

      this.backTop();
    },
    // 原材料入库管理
    checkedPage03() {
      this.pageSelect = 3;

      this.backTop();
    },
    // 原材料出库管理
    checkedPage04() {
      this.pageSelect = 4;

      this.backTop();
    },
    // 用户管理
    checkedPage05() {
      this.pageSelect = 5;

      this.backTop();
    },
    // 成品入库管理
    checkedPage06() {
      this.pageSelect = 6;
      this.backTop();
    },
    // 成品出库管理
    checkedPage08() {
      this.pageSelect = 8;
      this.backTop();
    },
    // 销售报表
    checkedPage09() {
      this.pageSelect = 9;
      this.backTop();
    },
    // 修改密码、退出登录
    updateUserClick() {
      if (this.updateUser == 1) {
        this.updateUser = 0;
      } else if (this.updateUser == 0) {
        this.updateUser = 1;
      }
    },
    otherClick() {
      let e = e || window.event;
      let className = e.target.className;
      if (
        className !== "downbtn" &&
        className !== "right-div" &&
        className !== "span1" &&
        className !== "span-img" &&
        className !== "img-self" &&
        className !== "span-psw" &&
        className !== "updateP" &&
        className !== "updateUl"
      ) {
        if (this.updateUser == 1) {
          this.updateUser = 0;
        }
      }
    },
    // 修改密码
    pswUpdate() {
      this.oldPsw = "";
      this.newPsw = "";
      this.pswDialogVisible = true;
    },
    // 确定修改
    updatePsw() {
      console.log(sessionStorage.getItem("token"));
      console.log(this.oldPsw, this.newPsw);
      if (this.newPsw != "") {
        this.$axios
          .post(this.$store.state.baseUrl + "/userModify", {
            oldPsw: this.oldPsw,
            psw: this.newPsw,
          })
          .then((res) => {
            console.log(res);
            if (res.data.token !== "") {
              this.$message.success({
                message: "密码修改成功",
                showClose: true,
                duration: 2000,
              });
              sessionStorage.setItem("token", res.data.token);
              this.pswDialogVisible = false;
              this.updateUser = 1;
            }
            console.log(sessionStorage.getItem("token"));
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
        this.$message.error({
          message: "新密码不能为空",
          showClose: true,
          duration: 2000,
        });
      }
    },
    // 退出登录
    logOut() {
      this.$router.push("/");
      this.$store.dispatch("setToken", null);
    },
    // 页面回到顶部
    backTop() {
      let timer = null;
      cancelAnimationFrame(timer);
      timer = requestAnimationFrame(function fn() {
        var oTop =
          document.body.scrollTop || document.documentElement.scrollTop;
        if (oTop > 0) {
          document.body.scrollTop = document.documentElement.scrollTop =
            oTop - 100;
          timer = requestAnimationFrame(fn);
        } else {
          cancelAnimationFrame(timer);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
ul li {
  list-style: none;
  text-align: left;
  cursor: pointer;
}

ul li a {
  text-decoration: none;
}

.font {
  width: 57px;
  margin: 0;
  margin-right: 10px;
  font-size: 14px;
  line-height: 40px;
}

.update-nick {
  width: 390px;
  height: 38px;
  line-height: 38px;
  padding: 0;
  padding-left: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
  outline: none;
}

.home-container {
  height: 100%;
  position: relative;

  .main-top-right {
    width: 100%;
    height: 78px;
    position: relative;

    .left-con {
      position: absolute;
      left: 40px;
      display: flex;

      .left-font-one {
        margin: 0;
        line-height: 78px;
        // font-size: 25px;
        font-weight: 600;
        color: #fff;
      }
    }

    .right-div {
      // width: 150px;
      position: absolute;
      top: 0;
      // right: 175px;
      height: 60px;
      line-height: 78px;
      padding: 0;
      // display: flex;
      cursor: pointer;

      .span1 {
        display: inline-block;
        // font-size: 18px;
        color: #fff;
        overflow: hidden;
        word-break: keep-all;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .downbtn {
      width: 120px;
      height: 100px;
      padding: 0;
      position: absolute;
      top: 78px;
      right: 155px;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 10px;
      // box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
      z-index: 999;

      .updateUl,
      .updateLi1 {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .updateLi1 {
        .updateP {
          text-align: center;
          color: #000;

          .update-nick-img {
            // width: 50px;
            height: 40px;
            margin: 0 auto;
            line-height: 40px;
            border-radius: 15px;
            display: flex;
            justify-content: space-around;

            span {
              font-size: 15px;
            }
          }

          .nick-img {
            width: 75%;
            margin: 10px auto;
            border-bottom: 1px solid #c8c8c8;
          }

          .psw-img {
            width: 75%;
            margin: -7px auto;
          }
        }

        .updateP:hover {
          cursor: pointer;
        }
      }

      li {
        line-height: 30px;
        text-align: left;
        padding-left: 5px;
      }

      a:hover {
        text-decoration: underline;
        color: #f00;
      }

      a {
        display: block;
        color: black;
        width: 100%;
      }
    }
  }

  .aside-ul-dad {
    padding: 30px 0 30px 10px;
    // padding-top: 0;
    margin: 0;
    color: #fff;

    p {
      margin: 0;
    }

    .dad-li {
      margin-top: 30px;

      .dad-li-font {
        font-size: 12px;
        color: #6f84a8;
      }

      .aside-ul-son {
        padding: 20px 0 0 0;

        .son-li {
          height: 46px;
          line-height: 46px;
          padding-right: 20px;
          display: flex;
          justify-content: space-between;

          .son-li-line {
            width: 4px;
            height: 46px;
            background-color: #3d81fd;
          }

          .son-li-center {
            display: flex;

            .center-img-div {
              padding-top: 3px;
              margin-right: 10px;

              .center-img {
                width: 18px;
                height: 18px;
              }
            }

            .center-font {
              font-size: 14px;
              color: #b7bdc6;
            }
          }
        }
      }
    }
  }
}

@media screen and (min-width: 501px) {
  .left-font-one {
    font-size: 25px;
  }

  .right-div {
    right: 175px;
    display: flex;

    .span1 {
      font-size: 18px;
    }

    .span-img {
      img {
        width: 15px;
        margin-left: 10px;
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .left-font-one {
    font-size: 6vw;
  }

  .right-div {
    right: 100px;
    display: none;

    .span1 {
      font-size: 48px;
    }

    .span-img {
      margin-left: 10px;
      margin-top: -25px;
      line-height: 78px;

      img {
        width: 40px;
        height: 20px;
        margin-left: 10px;
      }
    }
  }
}
</style>
<style lang="scss">
#home-container {
  .el-dialog__body {
    padding-bottom: 30px;
  }
  .el-header {
    position: relative;
    width: 100%;
    // height: 78px;
    padding: 0;
    background-color: #26303c;
  }

  .el-aside {
    position: absolute;
    // left: 0;
    // top: 78px;
    // bottom: 0;
    // min-height: 859px;
    background-color: #202732;
  }

  .el-aside::-webkit-scrollbar {
    width: 0;
  }

  .el-main {
    position: absolute;
    // left: 218px;
    // right: 0;
    // top: 78px;
    // bottom: 0;
    overflow-y: scroll;

    padding: 20px;
    background-color: #ececec;
  }

  .el-pagination__editor.el-input .el-input__inner {
    height: 28px;
  }

  .el-input__inner {
    height: 40px;
  }

  @media screen and(min-width: 501px) {
    .el-header {
      height: 78px;
    }

    .el-aside {
      left: 0;
      top: 78px;
      bottom: 0;
      display: block;
    }

    .el-main {
      left: 218px;
      right: 0;
      top: 78px;
      bottom: 0;
    }
  }

  @media screen and (max-width: 500px) {
    .el-header {
      height: 10vh;
    }

    .el-aside {
      left: 0;
      top: 78px;
      bottom: 0;
      display: none;
    }

    .el-main {
      left: 0;
      right: 0;
      top: 78px;
      bottom: 0;
    }
  }
}

.el-dialog {
  width: 520px;
  border-radius: 10px !important;
}

.el-dialog__header {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: #3d82fe;
}

.el-dialog__title {
  color: #fff;
  font-weight: bold;
}

.el-dialog__headerbtn {
  font-size: 18px;
}

.el-dialog__headerbtn .el-dialog__close {
  color: #fff;
}

.el-dialog__headerbtn .el-dialog__close:hover {
  color: #000;
}

[class*=" el-icon-"],
[class^="el-icon-"] {
  font-weight: bolder;
}

.el-dialog__body {
  text-align: left;
}

.el-dialog__footer {
  padding: 10px 20px 30px 0;
  text-align: right;
}

.el-button + .el-button {
  margin-left: 30px;
}

.el-scrollbar__wrap {
  overflow: auto;
  height: 100%;
  margin-bottom: 0 !important;
}

.el-cascader-node__postfix {
  position: absolute;
  right: 22px !important;
}

.el-table--border:after,
.el-table--group:after,
.el-table:before {
  background-color: #ccc;
}

.el-table--border,
.el-table--group {
  border-color: #ccc;
}

.el-table td,
.el-table th.is-leaf {
  border-bottom: 1px solid #ccc;
}

.el-table--border th,
.el-table--border th.gutter:last-of-type {
  border-bottom: 1px solid #ccc;
}

.el-table--border td,
.el-table--border th {
  border-right: 1px solid #ccc;
}

.el-table th {
  background-color: #f2f2f2;
}

.el-table {
  color: #666;
}

.el-table thead {
  color: #666;
}

.el-button--primary {
  color: #fff;
  background-color: #3d81fd;
  border-color: #3d81fd;
}

.el-drawer__header {
  text-align: left;
}

.el-drawer__header > :first-child {
  flex: 1;
  outline: 0;
}

.el-table__body,
.el-table__footer,
.el-table__header {
  width: 100% !important;
}

.el-table--border::after,
.el-table--group::after {
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
}

.el-drawer {
  overflow: scroll;
}
</style>
