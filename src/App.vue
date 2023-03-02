<template>
  <div id="app" :style="{ height: cliHeight }">
    <router-view />
  </div>
</template>
<script>
export default {
  data() {
    return {
      cliHeight: 0,
    };
  },
  mounted() {
    console.log(document.body.clientHeight);
    this.cliHeight = document.body.clientHeight + "px";
  },
  methods: {},
};
</script>
<style lang="scss">
#app {
  // min-height: 800px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  input[type="checkbox" i] {
    background-color: #fff;
    padding: initial;
    border: 1px solid #dcdfe6;
  }

  .one-right {
    .el-textarea__inner {
      padding: 5px 0 0;
      height: 100px;
      display: block;
      resize: vertical;
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

  .back-img {
    margin-bottom: 30px;
    display: inline-flex;
    align-items: center;
    cursor: pointer;

    .back-icon {
      width: 19px;
      height: 21px;
    }

    .font {
      margin-left: 8px;
      font-size: 16px;
    }
  }

  .del-style {
    padding: 20px;
    font-size: 16px;
    text-align: center;
  }

  #delInven {
    .el-dialog__body {
      height: 85px;
      overflow-y: hidden;
    }
  }
}
</style>
