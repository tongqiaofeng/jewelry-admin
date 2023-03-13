import axios from "axios";
import store from "../store";
import { Message } from "element-ui";

const base_request_url = "https://hk.wistechx.cn/JewelleryStockApi";
// const base_request_url = "http://192.168.0.164:8086/app/jewellery/api";

// const base_request_url = 'https://hk.wistechx.cn/app/jewellery/api'
// const base_request_url = 'http://hexx.natapp1.cc/app/jewellery/api'

// 请求基础 URL
axios.defaults.baseURL = base_request_url;

// POST 请求头
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

// http 请求拦截器
axios.interceptors.request.use(
  (config) => {
    // console.log('请求拦截器', config);
    // 在发送请求前
    let pathname = location.pathname;
    if (store.state.token) {
      if (pathname !== "#/" && pathname !== "#/login") {
        config.headers.common["token"] = store.state.token;
      }
    }

    // switch (config.url) {
    // 	case '/warehouseStockTotalGet':
    // 		config.baseURL = base_new_url;
    // 		break;
    // 	case '/stockMaterialList':
    // 		config.baseURL = base_new_url;
    // 		break;
    // 	case '/materialSave':
    // 		config.baseURL = base_new_url;
    // 		break;
    // 	default:
    // 		config.baseURL = base_request_url;
    // }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    // console.log('响应',response);
    if (response.data.code === 200) {
      return Promise.resolve(response);
    } else {
      if (response.data.code) {
        switch (response.data.code) {
          case 404:
            Message.warning("接口不存在，请刷新重试");
            break;
          case 500:
            Message.error("服务异常，请稍后刷新重试");
            break;
          case 502:
            Message.error("服务异常，请稍后刷新重试");
            break;
          default:
            Message.warning(response.data.data);
            return Promise.reject(response);
        }
      }
    }
  },
  // 服务器状态码不是200的情况
  (error) => {
    // console.log('报错啦~~',error)
    if (error.data.code) {
      switch (error.data.code) {
        case 404:
          Message.warning("接口不存在，请刷新重试");
          break;
        case 500:
          Message.error("服务异常，请稍后刷新重试");
          break;
        case 502:
          Message.error("服务异常，请稍后刷新重试");
          break;
        default:
          Message.warning(error.data.data);
          return Promise.reject(error);
      }
    }
  }
);

/**
 * 封装 get方法 对应 GET 请求
 * @param {string} url 请求url
 * @param {object} params 查询参数
 * @returns {Promise}
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
/**
 * 封装 post 方法，对应 POST 请求
 * @param {string} url 请求url
 * @param {object} data 请求体
 * @param {boolean | undefined} info 请求体是否为 FormData 格式
 * @returns {Promise}
 */
export function post(url, data = {}, info) {
  return new Promise((resolve, reject) => {
    let newData = data;
    if (info) {
      //  转formData格式
      newData = new FormData();
      for (let i in data) {
        newData.append(i, data[i]);
      }
    }
    axios
      .post(url, newData)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * 封装 put 方法，对应 PUT 请求
 * @param {string} url 请求url
 * @param {object} params 请求体
 * @returns {Promise}
 */
export function put(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, params).then(
      (res) => {
        resolve(res);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

/**
 * 封装 axiosDelete 方法，对应 DELETE 请求
 * @param {string} url 请求url
 * @param {object} params 请求体
 * @returns {Promise}
 */
export function axiosDelete(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, params)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export { base_request_url };
