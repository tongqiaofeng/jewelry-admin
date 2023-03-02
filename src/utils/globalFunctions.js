exports.install = function (Vue) {
  // 日期转换
  Vue.prototype.shellDate = function (dates) {
    // console.log(dates);
    if (dates !== '' && dates !== undefined) {
      let date = new Date(dates);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      m = m < 10 ? ('0' + m) : m;
      d = d < 10 ? ('0' + d) : d;
      return y + '-' + m + '-' + d;
    } else {
      return "";
    }
  };
  // 千分价格
  Vue.prototype.formatNumberRgx = function (num) {
    // console.log(num);
    if (num !== null && num !== undefined) {
      let parts = num.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    } else {
      return 0;
    }
  };
  Vue.prototype.formatStringRgx = function (param) {
    // console.log(param);
    let str = param.substring(0, param.length - 9);
    // console.log(str);
    return str;
  };
  // 提取价格数字
  Vue.prototype.getPriceNum = function (value) {
    console.log(value);
    if (value) {
      let reg = /[0-9]+([.]{1}[0-9]+){0,1}/g;
      let m = value.toString().match(reg);
      return m.join("");
    } else {
      return "";
    }
  }
  // 取第一张图
  Vue.prototype.imgFilter = function (img) {
    if (img) {
      if (img.indexOf("|") != -1) {
        return img.split("|")[0];
      } else {
        return img;
      }
    }

    return "";
  }
  // 获取图片列表
  Vue.prototype.imgListFilter = function (img) {
    let list = [];
    if (img) {
      if (img.indexOf("|") !== -1) {
        list = img.split("|").filter( (s) => {
          return s && s.trim(); 
      });
      } else {
        list.push(img);
      }
    } else {
      list = [];
    }

    return list;
  }
};