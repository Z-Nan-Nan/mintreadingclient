import Vue from 'vue';
import Vuex from 'vuex';
import menus from './modules/menu';
import stage from './modules/stage';
import app from './modules/app';
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    stage,
    menus
  }
});

export default store;
