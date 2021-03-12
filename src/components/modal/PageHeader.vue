<template>
  <div class="pro-page-header">
    <div class="pro-page-header-breadcrumbs" v-if="breadcrumbs.length > 0">
      <Breadcrumb separator=">">
        <BreadcrumbItem v-for="breadcrumb in breadcrumbs" :key="breadcrumb">{{breadcrumb}}</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="pro-header-main">
      <div class="pro-header-row">
        <div class="pro-header-title">{{title}}</div>
        <div class="pro-header-actions">
          <slot name="actions" />
        </div>
      </div>
      <div class="pro-header-row">
        <div class="pro-header-content">
          <slot />
        </div>
        <div class="pro-header-extra">
          <slot name="extra" />
        </div>
      </div>
    </div>
    <div class="pro-header-tabs" v-if="tabs.length > 0">
      <Tabs @on-click="handleTabClick" :value="activeTab">
        <TabPane v-for="tab in tabs" :label="tab.label" :name="tab.name" :key="tab.name" />
        <template slot="extra">
          <slot name="tabExtra" />
        </template>
      </Tabs>
    </div>
  </div>
</template>

<script>
let selectedTab = null;
export default {
  name: 'PageHeader',
  props: {
    breadcrumbs: {
      type: Array,
      default: () => []
    },
    title: {
      type: String
    },
    tabs: {
      type: Array,
      default: () => []
    },
    activeTab: {
      type: String
    }
  },
  data() {
    // console.log(this.activeTab);
    return {

    };
  },
  methods: {
    handleTabClick (name) {
      if (selectedTab !== name) {
        this.$emit('change', name);
        selectedTab = name;
      }
    }
  }
};
</script>

<style scoped lang="less">
.pro-page-header {
  padding: 16px 32px 0 32px;
  background: #fff;
  border-bottom: 1px solid #e8eaec;
  .pro-page-header-breadcrumbs {
    margin-bottom: 16px;
  }
  .pro-header-main {
    .pro-header-row {
      display: flex;
      .pro-header-title {
        padding-left: 30px;
        text-align: left;
        display: inline-block;
        color: #17233d;
        font-weight: 500;
        font-size: 20px;
        margin-bottom: 16px;
        flex: 1;
        white-space: nowrap;
      }
      .pro-header-actions {
        margin-left: 56px;
        margin-bottom: 16px;
      }
      .pro-header-content {
        margin-bottom: 16px;
        flex: 1;
      }
      .pro-header-extra {
        margin-bottom: 16px;
      }
    }
  }
  .pro-header-tabs {

  }
}
</style>
<style>
.pro-header-tabs > .ivu-tabs > .ivu-tabs-bar {
  margin-bottom: 0;
  border-bottom: none;
}
</style>
