import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import axios from 'axios'
import VueDND from 'awe-dnd'

// css样式还是需要全部引入
import 'element-ui/lib/theme-chalk/index.css'
import element from './element/index'

// 大图
// 点击查看大图
import vueDirectiveImagePreviewer from 'vue-directive-image-previewer'
import 'vue-directive-image-previewer/dist/assets/style.css'

Vue.use(vueDirectiveImagePreviewer)

// 全局函数
import functions from './utils/globalFunctions.js'

// 防止重复点击
import preventClick from './utils/clickStatefrom'


Vue.use(element)
Vue.use(functions)
Vue.use(preventClick)
Vue.use(VueDND)

Vue.config.productionTip = false

Vue.prototype.$axios = axios

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  const type = to.meta.type
  // 判断该路由是否需要登录权限
  if (type === 'login') {
    if (store.state.token) {
      next()
    } else {
      next('/')
    }
  } else {
    next() // 确保一定要有next()被调用
  }

  // 禁止退出当前程序
  let allowBack = true //    给个默认值true
  if (to.meta.allowBack !== undefined) {
    allowBack = to.meta.allowBack
  }

  if (!allowBack) {
    console.log('当前路由', allowBack, location.href);
    history.pushState(null, null, location.href)
  }
  store.dispatch('updateAppSetting', {
    allowBack
  })
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")