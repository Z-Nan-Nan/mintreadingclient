const itemStore = {
  state: {
    item: []
  },
  getters: {
    getStageInfo: (state) => (id) => {
      const index = state.item.findIndex(ele => {
        return parseInt(ele.id) === parseInt(id);
      });
      if (index !== -1) {
        let result = [];
        state.item[index].stageInfos.forEach(element => {
          if (element.is_del !== true) {
            result.push(element);
          }
        });
        return result;
      }
    }
  },
  mutations: {
    updateItem(state, item) {
      state.item = item;
    }
  }
};

export default itemStore;
