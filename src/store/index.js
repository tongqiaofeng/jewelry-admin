import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: sessionStorage.getItem("token"),
    nick: sessionStorage.getItem('nick'), //用户昵称
    isAdmin: sessionStorage.getItem('isAdmin'),
    isMedia: sessionStorage.getItem('isMedia'),
    allowBack: false,
  },
  mutations: {
    // 更改用户状态信息
    userStatus(state, data) {
      if (data) {
        console.log('更改用户信息', data);
        state.token = data.token;
        state.nick = data.nick;
        state.isAdmin = data.isAdmin;
        state.isMedia = data.isMedia;
        // 将用户昵称和token等放入sessionStorage
        sessionStorage.setItem("nick", data.nick);
        sessionStorage.setItem("token", data.token);
        // 系统管理员权限
        sessionStorage.setItem("isAdmin", data.isAdmin);
        sessionStorage.setItem("isMedia", data.isMedia);
      } else {
        // 退出登录的时候清空sessionStorage里的内容
        state.token = '';
        state.nick = '';
        state.isAdmin = '';
        state.isMedia = '';
        // 将用户昵称和token等放入sessionStorage
        sessionStorage.setItem("nick", '');
        sessionStorage.setItem("token", '');
        // 系统管理员权限
        sessionStorage.setItem("isAdmin", '');
        sessionStorage.setItem("isMedia", '');
      }
    },

    allowBack(state, data) {
      console.log('禁止退出当前程序', data);
      state.allowBack = data.allowBack;
    },

  },
  actions: {
    // 应用mutations
    setUserStatus({
      commit
    }, data) {
      commit('userStatus', data)
    },

    updateAppSetting({
      commit
    }, data) {
      commit('allowBack', data)
    },
  },
  modules: {}
});