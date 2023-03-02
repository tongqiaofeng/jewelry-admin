<template>
  <div class="login-container">
    <div class="container-login-one">
      <div class="container-login-main">
        <div class="main-right" @keydown="keyLogin()">
          <div class="login-top">
            <div class="top-img">
              <img src="../assets/imgs/login/logo02.png" />
            </div>
            <div style="padding-top: 10px; margin-left: 5px">
              <span class="top-span-login">珠宝后台管理系统</span>
            </div>
          </div>
          <div class="login-form">
            <div class="username">
              <input
                class="user-input"
                type="text"
                v-model="loginForm.user"
                placeholder="请输入用户名"
                autofocus="autofocus"
                prefix-icon="el-icon-s-custom"
                tabindex="1"
                auto-complete="on"
              />
            </div>
            <div class="password">
              <input
                class="pass-input"
                type="password"
                v-model="loginForm.psw"
                placeholder="请输入密码"
                prefix-icon="el-icon-lock"
                tabindex="2"
                auto-complete="on"
              />
            </div>
          </div>
          <div class="login-button">
            <button @click="handleLogin" class="loginBtn">登录</button>
          </div>
        </div>
      </div>
    </div>
    <div class="container-login-phone">
      <div class="login-top-phone">
        <div class="top-img-phone">
          <img src="../assets/imgs/login/logo02.png" />
        </div>
        <div class="top-span-font">
          <span class="top-span-login-phone">珠宝后台管理系统</span>
        </div>
      </div>
      <div class="login-form-phone">
        <div class="username-phone">
          <input
            class="user-input-phone"
            type="text"
            v-model="loginForm.user"
            placeholder="请输入用户名"
            autofocus="autofocus"
            prefix-icon="el-icon-s-custom"
            tabindex="1"
            auto-complete="on"
          />
        </div>
        <div class="password-phone">
          <input
            class="pass-input-phone"
            type="password"
            v-model="loginForm.psw"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            tabindex="2"
            auto-complete="on"
          />
        </div>
      </div>
      <div class="login-button-phone">
        <button @click="handleLogin" class="loginBtn-phone">登录</button>
      </div>
    </div>
  </div>
</template>
<script>
import { userLogin } from "_req/api/user.js";
export default {
  data() {
    return {
      loginForm: {
        user: "",
        psw: "",
      },
      usernameImg: require("../assets/imgs/user1.png"),
      passwordImg: require("../assets/imgs/psw1.png"),
    };
  },
  beforeRouteEnter: (to, from, next) => {
    // 组件内守卫
    // 已登录状态回到登录状态，即 登出
    next((vm) => {
      vm.$store.dispatch("setUserStatus", null);
    });
  },
  mounted() {
    console.log(document.getElementsByClassName("container-login-main"));
    console.log(document.documentElement.clientHeight);
    console.log(document.body.clientHeight);
    console.log(window.innerHeight);
    document.getElementsByClassName("container-login-main")[0].style.height =
      document.body.clientHeight + "px";
  },
  methods: {
    // 登录
    handleLogin() {
      if (this.loginForm.user == "" || this.loginForm.psw == "") {
        this.$message.warning({
          message: "用户名或密码不能为空 !",
          showClose: true,
          duration: 2000,
        });
      } else {
        userLogin(this.loginForm)
          .then((res) => {
            console.log("登陆成功啦");
            console.log(res);

            if (res.data.data.isAdmin == 1 || res.data.data.isMedia == 1) {
              this.$message.success("登陆成功");

              // 将用户昵称、用户角色及token等放入vuex
              this.$store.dispatch("setUserStatus", res.data.data);
              this.$router.push("/home");
            } else {
              this.$message.error("您没有权限访问该程序");
            }
          })
          .catch(() => {
            this.$store.dispatch("setUserStatus", null);
            this.loginForm.password = "";
          });
      }
    },
    // 回车键登录
    keyLogin() {
      if (event.keyCode == 13) {
        this.handleLogin();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.login-container {
  width: 100%;
}

.container-login-one {
  /*定义body的元素垂直居中*/

  background: url("../assets/imgs/login/back01.png") no-repeat;
  background-size: 100% 100%;

  .container-login-main {
    width: 1064px;
    margin: 0 auto;
    // padding-top: 233px;
    display: flex;
    justify-content: center;
    align-items: center;

    .main-right {
      width: 532px;
      height: 614px;
      margin-top: -4px;
      padding: 0 10px;
      // background-color: #fff;
      background-color: rgba(225, 225, 225, 0.57);
    }
  }
}

.login-top {
  width: 470px;
  margin: 0 auto;
  margin-top: 60px;
  display: flex;
  justify-content: center;

  .top-img {
    img {
      width: 50px;
    }
  }

  .top-span-login {
    color: #15183a;
    font-family: "华文行楷";
  }
}

.login-form {
  width: 100%;
  margin-top: 50px;

  .username {
    width: 380px;
    margin: 0 auto;
    display: flex;
    border: 1px solid #dedede;

    p {
      margin: 0;
      margin-top: 10px;
    }
  }

  .user-input,
  .pass-input {
    width: 100%;
    height: 50px;
    padding-left: 20px;
    border: 0;
    background-color: #fff;
    outline: none;
    font-size: 16px;
    // color: #dedede;
  }

  .password {
    width: 380px;
    margin: 0 auto;
    margin-top: 20px;
    display: flex;
    border: 1px solid #dedede;

    p {
      margin: 0;
      margin-top: 3px;
    }
  }
}

.login-button {
  width: 100%;
  margin-top: 60px;

  .loginBtn {
    width: 380px;
    height: 50px;
    margin: 0 auto;
    font-size: 16px;
    color: #fff;
    background-color: #3d82fe;
    border: 0;
    outline: none;
    cursor: pointer;
  }
}

@media screen and (min-width: 501px) {
  .container-login-one {
    display: block;
  }

  .container-login-phone {
    display: none;
  }

  .top-span-login {
    font-size: 36px;
  }
}

@media screen and (max-width: 500px) {
  .container-login-one {
    display: none;
  }

  .container-login-phone {
    display: block;
    width: 100%;
    margin: 0 auto;

    .login-top-phone {
      // width: 320px;
      width: 85%;
      margin: 0 auto;
      // margin-top: 200px;
      margin-top: 10vh;
      display: flex;
      justify-content: center;

      .top-img-phone {
        img {
          width: 10vw;
          height: 10vw;
          // width: 80px;
          // height: 80px;
        }
      }

      .top-span-font {
        margin-left: 10px;
        line-height: 11vw;
        // margin-top: -25px;

        .top-span-login-phone {
          font-size: 8vw;
          // font-size: 0.6rem;
          color: #15183a;
          font-family: "华文行楷";
        }
      }
    }

    .login-form-phone {
      width: 100%;
      margin-top: 50px;

      .username-phone {
        // width: 380px;
        width: 90%;
        margin: 0 auto;
        display: flex;
        border: 1px solid #dedede;

        p {
          margin: 0;
          margin-top: 10px;
        }
      }

      .user-input-phone,
      .pass-input-phone {
        width: 100%;
        height: 10vw;
        // height: 0.3rem;
        padding-left: 20px;
        border: 0;
        background: 0;
        outline: none;
        // font-size: 0.4rem;
        font-size: 4vw;
        // color: #dedede;
      }

      .password-phone {
        // width: 380px;
        width: 90%;
        margin: 0 auto;
        margin-top: 20px;
        display: flex;
        border: 1px solid #dedede;

        p {
          margin: 0;
          margin-top: 3px;
        }
      }
    }

    .login-button-phone {
      width: 100%;
      margin-top: 40px;

      .loginBtn-phone {
        // width: 380px;
        width: 40%;
        // height: 0.3rem;
        height: 12vw;
        margin: 0 auto;
        // font-size: 0.4rem;
        font-size: 6vw;
        color: #fff;
        background-color: #3d82fe;
        border: 0;
        outline: none;
        cursor: pointer;
      }
    }
  }
}

input::-webkit-input-placeholder {
  color: #dedede;
}

input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #dedede;
}

input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #dedede;
}

input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #dedede;
}
</style>
<style lang="scss">
input:-internal-autofill-selected {
  background-color: transparent !important;
  background-image: none !important;
  color: -internal-light-dark-color(black, white) !important;
}
</style>
