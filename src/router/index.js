import Vue from 'vue';
import store from '@/store';
import Router from 'vue-router';
import iView from 'iview';
import routers from './router';

Vue.use(iView);
Vue.use(Router);

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: routers
});

router.beforeEach((to, from, next) => {
  console.log(router);
  console.log(to);
  store.dispatch('getCurrentPageName', to.name);
  next();
});

export default router;
