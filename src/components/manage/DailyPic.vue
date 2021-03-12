<template>
  <div>
    <PageHeader title="每日一句">
      <template v-slot:actions>
        <Button type="primary" size="small" @click="newModalVisible = true">新建每日一句</Button>
      </template>
    </PageHeader>
    <Table :columns="picList" :data="picData" style="width: 100%;" />
    <Page :page="mainPage.page" :page-size="mainPage.pageSize" :total="mainPage.total" show-total show-elevator @on-change="pageChange" />
    <Modal title="新建每日一句" v-model="newModalVisible" width="50%" @on-ok="sendNewPic">
      <Form :label-width="80">
        <Form-item label="日期">
          <DatePicker type="date" style="width: 200px;" formate="yyyy/MM/dd" @on-change="dateChange" />
        </Form-item>
        <Form-item label="图片地址">
          <Input v-model="newDailyPicture.src" style="width: 200px;" />
        </Form-item>
      </Form>
    </Modal>
  </div>
</template>

<script>
import PageHeader from '../modal/PageHeader';
export default {
  name: 'DailyPic',
  components: {PageHeader},
  data() {
    return {
      newDailyPicture: {
        date: '',
        src: ''
      },
      newModalVisible: false,
      mainPage: {
        page: 1,
        pageSize: 15,
        total: 0
      },
      picData: [],
      picList: [
        {
          title: 'id',
          key: '_id',
          align: 'center'
        },
        {
          title: '图片',
          key: 'src',
          align: 'center',
          render: (h, params) => {
            return h('div', {
              style: {
                width: '350px',
                height: '200px'
              }
            }, [
              h('img', {
                attrs: {
                  src: params.row.src
                },
                style: {
                  width: '430px',
                  height: '200px'
                }
              })
            ]);
          }
        },
        {
          title: '展示日期',
          key: 'date',
          align: 'center'
        },
        {
          title: '操作',
          key: 'handle',
          align: 'center',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  window.open(params.row.src);
                }
              }
            }, '看大图');
          }
        }
      ]
    };
  },
  methods: {
    sendNewPic() {
      this.$api.sendNewPic(this.newDailyPicture).then(res => {
        if (res.status === 1) {
          this.newDailyPicture = {
            date: '',
            src: ''
          };
          this.newModalVisible = false;
          this.getPicInfo();
        }
      });
    },
    dateChange(date) {
      const arr = date.split('-');
      this.newDailyPicture.date = `${arr[0]}/${arr[1]}/${arr[2]}`;
    },
    pageChange(index) {
      this.mainPage.page = index;
      this.getPicInfo();
    },
    getPicInfo() {
      const params = {
        page: this.mainPage.page
      };
      this.picData = [];
      this.$api.getAllPic(params).then(res => {
        if (res.status === 1) {
          this.mainPage.total = res.count;
          this.picData = res.data;
        }
      });
    }
  },
  mounted() {
    this.getPicInfo();
  }
};
</script>

<style lang="less" scoped>

</style>
