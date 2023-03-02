<template>
  <div class="home-container" id="home-container" @click="otherClick">
    <el-container ref="homePage">
      <el-header height="78px">
        <div class="main-top-right">
          <div class="left-con">
            <p class="left-font-one">珠宝后台管理系统</p>
          </div>
          <div style="display: flex">
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
                    <div class="update-nick-img" style="display: flex">
                      <div style="margin-top: 3px">
                        <img
                          src="../assets/imgs/update-psw.png"
                          style="width: 17px; height: 20px"
                        />
                      </div>
                      <span class="span-psw">修改密码</span>
                    </div>
                  </div>
                </div>
                <el-dialog
                  id="updatePsw"
                  title="修改密码"
                  :visible.sync="pswDialogVisible"
                  :append-to-body="true"
                  :close-on-press-escape="false"
                  :close-on-click-modal="false"
                >
                  <div style="width: 100%; display: flex">
                    <p class="font">旧密码：</p>
                    <input
                      class="update-nick"
                      type="text"
                      v-model="oldPsw"
                      placeholder="请输入旧密码"
                    />
                  </div>
                  <div style="width: 100%; margin-top: 15px; display: flex">
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
                      style="margin-left: 35%"
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
                    <div class="update-nick-img" style="display: flex">
                      <div style="margin-top: 3px">
                        <img
                          src="../assets/imgs/logOut.png"
                          style="width: 17px; height: 18px"
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
            <li class="dad-li" v-if="isMedia != 1 && systemAdmin == 1">
              <div style="width: 100%">
                <p class="dad-li-font">统一管理</p>
              </div>
              <ul class="aside-ul-son">
                <li
                  class="son-li"
                  v-if="systemAdmin == 1"
                  @click="pageJump(9)"
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
            <li class="dad-li" v-if="isMedia != 1 && systemAdmin == 1">
              <div style="width: 100%">
                <p class="dad-li-font">原材料管理</p>
              </div>
              <ul class="aside-ul-son">
                <li
                  class="son-li"
                  @click="pageJump(1)"
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
                  @click="pageJump(3)"
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
                  @click="pageJump(27)"
                  :style="{
                    backgroundColor:
                      pageSelect == 27 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 27"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 27 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/04.png"
                      />
                    </div>
                    <p class="center-font">采购记录</p>
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
                  @click="pageJump(4)"
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
                <li
                  class="son-li"
                  @click="pageJump(28)"
                  :style="{
                    backgroundColor:
                      pageSelect == 28 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 28"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 28 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/04.png"
                      />
                    </div>
                    <p class="center-font">销售记录</p>
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
            <li class="dad-li" v-if="isMedia != 1 && systemAdmin == 1">
              <div style="width: 100%">
                <p class="dad-li-font">成品管理</p>
              </div>
              <ul class="aside-ul-son">
                <li
                  class="son-li"
                  @click="pageJump(7)"
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
                  @click="pageJump(6)"
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
                  @click="pageJump(8)"
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
                <li
                  class="son-li"
                  @click="pageJump(29)"
                  :style="{
                    backgroundColor:
                      pageSelect == 29 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 29"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 29 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/04.png"
                      />
                    </div>
                    <p class="center-font">销售记录</p>
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

            <li class="dad-li" v-if="isMedia != 1 && systemAdmin == 1">
              <div style="width: 100%">
                <p class="dad-li-font">借入/借出</p>
              </div>
              <ul class="aside-ul-son">
                <li
                  class="son-li"
                  @click="pageJump(22)"
                  :style="{
                    backgroundColor:
                      pageSelect == 22 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 22"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 22 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/01.png"
                      />
                    </div>
                    <p class="center-font">借入记录</p>
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
                  @click="pageJump(23)"
                  :style="{
                    backgroundColor:
                      pageSelect == 23 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 23"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 23 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/04.png"
                      />
                    </div>
                    <p class="center-font">借出记录</p>
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

            <li class="dad-li" v-if="isMedia != 1 && systemAdmin == 1">
              <div style="width: 100%">
                <p class="dad-li-font">盘点管理</p>
              </div>
              <ul class="aside-ul-son">
                <li
                  class="son-li"
                  @click="pageJump(24)"
                  :style="{
                    backgroundColor:
                      pageSelect == 24 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 24"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 24 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/01.png"
                      />
                    </div>
                    <p class="center-font">新增盘点</p>
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
                  @click="pageJump(25)"
                  :style="{
                    backgroundColor:
                      pageSelect == 25 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 25"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 25 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/04.png"
                      />
                    </div>
                    <p class="center-font">盘点记录</p>
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

            <li class="dad-li" v-if="isMedia != 1 && systemAdmin == 1">
              <div style="width: 100%">
                <p class="dad-li-font">账单管理</p>
              </div>
              <ul class="aside-ul-son">
                <li
                  class="son-li"
                  @click="pageJump(20)"
                  :style="{
                    backgroundColor:
                      pageSelect == 20 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 20"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 20 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/01.png"
                      />
                    </div>
                    <p class="center-font">账单录入</p>
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
                  @click="pageJump(21)"
                  :style="{
                    backgroundColor:
                      pageSelect == 21 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 21"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 21 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/04.png"
                      />
                    </div>
                    <p class="center-font">账单管理</p>
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

            <li class="dad-li" v-if="isMedia == 1 || systemAdmin == 1">
              <div style="width: 100%">
                <p class="dad-li-font">订单管理</p>
              </div>
              <ul class="aside-ul-son">
                <li
                  class="son-li"
                  @click="pageJump(19)"
                  :style="{
                    backgroundColor:
                      pageSelect == 19 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 19"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 19 ? '-66px' : '32px' }"
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
                  @click="pageJump(10)"
                  :style="{
                    backgroundColor:
                      pageSelect == 10 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 10"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 10 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/13.png"
                      />
                    </div>
                    <p class="center-font">商品发货</p>
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
                  @click="pageJump(11)"
                  :style="{
                    backgroundColor:
                      pageSelect == 11 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 11"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 11 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/14.png"
                      />
                    </div>
                    <p class="center-font">退款审核</p>
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

            <li class="dad-li" v-if="isMedia == 1 || systemAdmin == 1">
              <div style="width: 100%">
                <p class="dad-li-font">小程序管理</p>
              </div>
              <ul class="aside-ul-son">
                <li
                  class="son-li"
                  @click="pageJump(12)"
                  :style="{
                    backgroundColor:
                      pageSelect == 12 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 12"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 12 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/17.png"
                      />
                    </div>
                    <p class="center-font">近期活动</p>
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
                  @click="pageJump(17)"
                  :style="{
                    backgroundColor:
                      pageSelect == 17 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 17"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 17 ? '-52px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/18.png"
                      />
                    </div>
                    <p class="center-font">优惠券</p>
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
                  @click="pageJump(13)"
                  :style="{
                    backgroundColor:
                      pageSelect == 13 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 13"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 13 ? '-66px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/19.png"
                      />
                    </div>
                    <p class="center-font">首页</p>
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
                  @click="pageJump(14)"
                  :style="{
                    backgroundColor:
                      pageSelect == 14 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 14"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 14 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/20.png"
                      />
                    </div>
                    <!-- 品牌/联名 -->
                    <p class="center-font">分类管理</p>
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
                  @click="pageJump(18)"
                  :style="{
                    backgroundColor:
                      pageSelect == 18 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 18"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 18 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/21.png"
                      />
                    </div>
                    <p class="center-font">专属定制</p>
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
                  @click="pageJump(26)"
                  :style="{
                    backgroundColor:
                      pageSelect == 26 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 26"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 26 ? '-25px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/21.png"
                      />
                    </div>
                    <p class="center-font">设计图管理</p>
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
              v-if="isMedia != 1 && systemAdmin == 1"
              style="
                width: 100%;
                height: 1px;
                margin-top: 20px;
                background-color: #262e3d;
              "
            ></li>
            <li
              v-if="isMedia != 1 && systemAdmin == 1"
              class="dad-li"
              style="margin-top: 20px"
            >
              <div style="width: 100%">
                <p class="dad-li-font">系统设置</p>
              </div>
              <ul class="aside-ul-son">
                <li
                  class="son-li"
                  @click="pageJump(5)"
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

          <!-- 入库管理 -->
          <StockManagement v-if="pageSelect == 3"></StockManagement>
          <!-- 出库管理 -->
          <WarehouseManagement v-if="pageSelect == 4"></WarehouseManagement>
          <!-- 采购记录 -->
          <PurchaseRecord v-if="pageSelect == 27"></PurchaseRecord>
          <!-- 销售记录 -->
          <SaleRecord v-if="pageSelect == 28"></SaleRecord>

          <!-- 成品入库管理 -->
          <ProductManagement v-if="pageSelect == 6"></ProductManagement>
          <!-- 成品出库管理 -->
          <ProductDeliveryManagement
            v-if="pageSelect == 8"
          ></ProductDeliveryManagement>
          <!-- 销售记录 -->
          <ProductSaleRecord v-if="pageSelect == 29"></ProductSaleRecord>

          <!-- 用户管理 -->
          <UserAdmin v-if="pageSelect == 5"></UserAdmin>
          <!-- 销售报表 -->
          <SalesReport v-if="pageSelect == 9"></SalesReport>
          <!-- 订单查询 -->
          <OrderList v-if="pageSelect == 19"></OrderList>
          <!-- 商品发货 -->
          <GoodsDelivery v-if="pageSelect == 10"></GoodsDelivery>
          <!-- 退货确认 -->
          <GoodsReturn v-if="pageSelect == 11"></GoodsReturn>
          <!-- 商品活动管理 -->
          <ActivityAdmin v-if="pageSelect == 12"></ActivityAdmin>
          <!-- 分类页面图片 -->
          <ClassifyImg v-if="pageSelect == 13"></ClassifyImg>
          <!-- 品牌/联名 -->
          <BrandOrJointly v-if="pageSelect == 14"></BrandOrJointly>

          <!-- 优惠券 -->
          <DiscountCoupon v-if="pageSelect == 17"></DiscountCoupon>
          <!-- 专属定制 -->
          <ExclusiveAdmin v-if="pageSelect == 18"></ExclusiveAdmin>
          <!-- 设计图管理 -->
          <DesignAdmin v-if="pageSelect == 26"></DesignAdmin>

          <!-- 账单录入 -->
          <BillEnter v-if="pageSelect == 20"></BillEnter>
          <BillQuery v-if="pageSelect == 21"></BillQuery>

          <!-- 借入/借出 -->
          <Borrow v-if="pageSelect == 22"></Borrow>
          <Lend v-if="pageSelect == 23"></Lend>

          <!-- 仓库盘点 -->
          <AddCheck v-if="pageSelect == 24"></AddCheck>
          <CheckRecord v-if="pageSelect == 25"></CheckRecord>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { updatePsw } from "_req/api/user.js";
import StockInquiry from "@/views/material/stock-inquiry.vue";
import FinishedStockInquiry from "@/views/product/finished-stock-inquiry.vue";

import StockManagement from "@/views/material/stock-management.vue";
import WarehouseManagement from "@/views/material/warehouse-management.vue";
import ProductManagement from "@/views/product/product-management.vue";
import ProductDeliveryManagement from "@/views/product/product-delivery-management.vue";
import UserAdmin from "@/views/system/user-admin.vue";
import SalesReport from "@/views/admin/sales-report.vue";
import GoodsDelivery from "@/views/order/goods-delivery.vue";
import GoodsReturn from "@/views/order/goods-return.vue";
import OrderList from "@/views/order/order-list.vue";
import ActivityAdmin from "@/views/program/activity-admin.vue";
import ClassifyImg from "@/views/program/classify-img.vue";
import BrandOrJointly from "@/views/program/brand-or-jointly.vue";

import DiscountCoupon from "@/views/program/discount-coupon.vue";
import ExclusiveAdmin from "@/views/program/exclusive-admin.vue";
import BillEnter from "@/views/bill/bill-enter.vue";
import BillQuery from "@/views/bill/bill-query.vue";
import Borrow from "@/views/borrow/borrow.vue";
import Lend from "@/views/borrow/lend.vue";
import AddCheck from "@/views/check/add-check.vue";
import CheckRecord from "@/views/check/check-record.vue";
import DesignAdmin from "@/views/program//design-admin.vue";
import PurchaseRecord from "@/views/material/purchase-record.vue";
import SaleRecord from "@/views/material/sale-record.vue";
import ProductSaleRecord from "@/views/product/product-sale-record.vue";

export default {
  name: "Home",
  components: {
    StockInquiry,
    FinishedStockInquiry,
    StockManagement,
    WarehouseManagement,
    ProductManagement,
    UserAdmin,
    ProductDeliveryManagement,
    SalesReport,
    GoodsDelivery,
    GoodsReturn,
    OrderList,
    ActivityAdmin,
    ClassifyImg,
    BrandOrJointly,
    DiscountCoupon,
    ExclusiveAdmin,
    DesignAdmin,
    BillEnter,
    BillQuery,
    Borrow,
    Lend,
    AddCheck,
    CheckRecord,
    PurchaseRecord,
    SaleRecord,
    ProductSaleRecord,
  },
  data() {
    return {
      userNick: "",
      pageSelect: 9,
      updateUser: 0,
      pswDialogVisible: false,
      oldPsw: "",
      newPsw: "",
      systemAdmin: 0,
      isMedia: 0,

      stockInquiryParam: {
        sel: 0,
      },
      clientHeight: "",
    };
  },
  created() {
    this.userNick = this.$store.state.nick;
    this.systemAdmin = this.$store.state.isAdmin;
    console.log(this.systemAdmin);
    this.isMedia = this.$store.state.isMedia;

    if (this.isMedia == 1) {
      this.pageJump(19);
    } else {
      this.pageJump(9);
    }
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
      // console.log(e.target.scrollTop);
      if (e.target.scrollTop != 0) {
        sessionStorage.setItem("scrollTopHeight", e.target.scrollTop);
      }
    },
    // 侧边栏页面切换
    pageJump(val) {
      this.pageSelect = val;

      if (val == 1 || val == 7) {
        this.stockInquiryParam.sel = 0;
        sessionStorage.setItem("scrollTopHeight", 0);
      }

      this.$nextTick(() => {
        // document
        //   .getElementById("mainContainer")
        //   .scrollIntoView({ behavior: "smooth" });
        document.getElementById("mainContainer").scrollTop = 0;
      });
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
      console.log(this.$store.state.token);
      console.log(this.oldPsw, this.newPsw);
      if (this.newPsw != "") {
        updatePsw({ oldPsw: this.oldPsw, psw: this.newPsw }).then((res) => {
          console.log(res);
          if (res.data.data.token) {
            this.$message.success("密码修改成功");
            // 将用户昵称、用户角色及token等放入vuex
            this.$store.dispatch("setUserStatus", {
              nick: this.$store.state.nick,
              token: res.data.data.token,
              isAdmin: this.$store.state.isAdmin,
              isMedia: this.$store.state.isMedia,
            });

            this.pswDialogVisible = false;
            this.updateUser = 1;
          }
          console.log(this.$store.state.token);
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
      this.$store.dispatch("setUserStatus", null);
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
        font-weight: 600;
        color: #fff;
        font-size: 25px;
      }
    }

    .right-div {
      position: absolute;
      top: 0;
      right: 175px;
      height: 60px;
      line-height: 78px;
      padding: 0;
      cursor: pointer;
      display: flex;

      .span-img {
        img {
          width: 15px;
          margin-left: 10px;
        }
      }

      .span1 {
        display: inline-block;
        color: #fff;
        overflow: hidden;
        word-break: keep-all;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 18px;
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
    }
  }

  .aside-ul-dad {
    padding: 30px 0 30px 10px;
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
</style>
<style lang="scss">
#home-container {
  .el-dialog__body {
    padding-bottom: 30px;
  }

  .el-header {
    position: relative;
    width: 100%;
    height: 78px;
    padding: 0;
    background-color: #26303c;
  }

  .el-aside {
    position: absolute;
    left: 0;
    top: 78px;
    bottom: 0;
    display: block;
    background-color: #202732;
  }

  .el-aside::-webkit-scrollbar {
    width: 0;
  }

  .el-main {
    position: absolute;
    left: 218px;
    right: 0;
    top: 78px;
    bottom: 0;
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
}

.el-collapse-item__header {
  color: #409eff;
}

.el-collapse-item__content {
  padding-bottom: 0;
}

#updatePsw {
  .el-dialog__body {
    height: 120px;
    overflow: auto;
    padding: 20px;
  }
}

.fixedBtn {
  position: fixed;
  right: 50px;
  bottom: 50px;
}

.no-data {
  margin-top: 20px;
  text-align: center;
  font-size: 15px;
}

#productRemove {
  .el-input__inner {
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 30px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
  }

  .el-textarea__inner {
    height: auto;
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
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
}

.code-table {
  width: 100%;
  display: flex;
  justify-content: space-between;

  .add-button {
    width: 200px;
    height: 40px;
    margin: 0 auto;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #c3c3c3;
    border-radius: 10px;
    cursor: pointer;

    img {
      width: 32px;
      height: 32px;
      margin-right: 10px;
    }
  }

  .every1,
  .every2,
  .every3,
  .every4,
  .every5 {
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
  }

  .every1 {
    width: 15%;
  }

  .every2 {
    width: 40%;
  }

  .every3 {
    width: 17%;
  }
  .every4 {
    width: 13%;
  }

  .every5 {
    width: 10%;
  }
}

.note-table {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .add-button {
    width: 200px;
    height: 40px;
    margin: 0 auto;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #c3c3c3;
    border-radius: 10px;
    cursor: pointer;

    img {
      width: 32px;
      height: 32px;
      margin-right: 10px;
    }
  }

  .every1,
  .every2,
  .every3 {
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
    font-size: 14px;
  }

  .every1 {
    width: 29%;
  }

  .every2 {
    width: 60%;
  }

  .every3 {
    width: 8%;
  }
}

.el-dialog {
  width: 620px;
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

#bigImgDialog {
  .el-dialog {
    width: 50%;
  }

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    height: auto !important;
    padding: 30px 0;
    background-color: transparent;
    overflow: hidden;
  }
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

.tooltipFlow {
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box; //使用自适应布局
  -webkit-line-clamp: 4; //设置超出行数，要设置超出几行显示省略号就把这里改成几
  -webkit-box-orient: vertical;
}

.el-tabs__content {
  overflow: inherit;
}
</style>
