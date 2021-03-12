const menus = {
  state: {
    menu: [],
    username: '',
    nickname: ''
  },
  getters: {
    getMenu(state) {
      return state.menu;
    },
    getUsername(state) {
      return state.username;
    },
    getNickname(state) {
      return state.nickname;
    }
  },
  mutations: {
    changeMenus(state, val) {
      state.menu = JSON.parse(val);
      // state.menu = val;
      window.localStorage.setItem('menu', val);
    },
    changeUsername(state, val) {
      state.username = val;
    },
    changeNickname(state, val) {
      state.nickname = val;
    }
  }
};

export default menus;
