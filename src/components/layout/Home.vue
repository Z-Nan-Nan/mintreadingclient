<template>
  <div>
    <div style="height: 100%; width: 100%; position: absolute; display: flex;" class="body">
      <div style="height: 100%; width: 200px;" class="left-container">
        <Menu @on-select="menuChange" style="height: 100%; position: absolute; width: 200px; text-align: left; padding-top: 30px; padding-bottom: 80px;" theme="dark" :accordion="true" active-name="1">
          <div style="height:50px; padding-left: 20px;" class="logo-box">
            <span style="color: #19be6b; font-size: 18px;">Route</span>
            <strong style="color:#ff9900;font-size: 24px;">~八戒</strong>
          </div>
          <Menu-item name="/index"><Icon />首页</Menu-item>
          <Submenu :name="i" v-for="(item, i) in menu" :key="i" :title="item.name" v-if="item.children && item.children.length>0 && !item.hidden">
            <template slot="title">
              <Icon :type="item.icon" />
              <i class="icon iconfont" :class="item.icon ? item.icon :'icon-collection'" />
              {{item.name}}
            </template>
            <menu-item :name="subItem.path" v-for="(subItem, j) in item.children" :key="j">
              <Icon :type="subItem.icon" />
              {{subItem.name}}
            </menu-item>
          </Submenu>
        </Menu>
      </div>
      <div class="right-container" style="width: 100%; overflow-y: scroll;">
        <div class="page-nav-header" style="height: 100px; width: 100%;">
          <Breadcrumb separator=">">
            <BreadcrumbItem to="/">首页</BreadcrumbItem>
            <BreadcrumbItem>{{$store.state.app.router.currentPageName}}</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div class="main-container">
          <container>
            <!-- 路由 -->
            <transition name="fade" mode="out-in">
              <router-view />
            </transition>
            <!-- 路由/ -->
          </container>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import routes from '../../router/routes';
import Container from './container/Container';
export default {
  name: 'Home',
  components: {
    routes,
    Container
  },
  data () {
    return {
      isMenuSelect: '',
      menu: []
    };
  },
  methods: {
    menuChange(url) {
      for (const i in this.menu) {
        for (const j in this.menu[i].children) {
          if (this.menu[i].children[j].path === url) {
            this.isMenuSelect = this.menu[i].children[j].name;
          }
        }
      }
      this.$router.push({
        path: url
      });
    },
    loadMenu () {
      // this.menu = this.$store.state.menus.menu;
      this.menu = routes;
    }
  },
  mounted () {
    this.loadMenu();
  },
  watch: {
    menuState() {
      this.menu = this.$store.state.menus.menu;
    }
  },
  computed: {
    state() {
      return this.$store.state.app;
    }
  }
};
</script>
<style lang="less" scoped>
.page-nav-header {
  height: 64px;
  width: 100%;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  transition: all .2s ease-in-out;
  z-index: 99;
  position: relative;
  display: flex;
  align-items: center;
  text-align: left;
  padding: 20px;
  padding-left: 50px;
  .page-nav-header-left {
    flex: 1;
  }
  .page-nav-header-right {
    margin-left: 32px;
  }
}
</style>
