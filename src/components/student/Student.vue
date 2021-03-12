<template>
 <div>
   <PageHeader title="学员信息">
      <template v-slot:actions>
        <Form :label-width="80" inline>
          <Form-item label="查询条件：" />
          <Form-item label="学号">
            <Input v-model="searchStudent.id" width="100" />
          </Form-item>
          <Form-item label="姓名">
            <Input v-model="searchStudent.name" width="100" />
          </Form-item>
        </Form>
      </template>
   </PageHeader>
   <Card>
     <Table :columns="allStudentsList" :data="allStudentsData" style="width: 100%" />
     <Page :page="mainPage.page" :page-size="mainPage.pageSize" :total="mainPage.total" show-total show-elevator @on-change="pageChange" />
   </Card>
   <Modal v-model="studentDetailVisible" title="学员详情" width="70%">
     <div></div>
     <div slot="footer"></div>
   </Modal>
 </div>
</template>

<script>
import PageHeader from '../modal/PageHeader';
export default {
  name: 'Student',
  components: {PageHeader},
  data() {
    return {
      studentDetailVisible: false,
      mainPage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      searchStudent: {
        id: '',
        name: ''
      },
      allStudentsData: [],
      allStudentsList: [
        {
          title: '头像',
          key: 'avatar',
          align: 'center',
          width: '100',
          render: (h, params) => {
            return h('div', {
              style: {
                width: '60px',
                height: '60px',
                padding: '5px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }
            }, [
              h('Avatar', {
                props: {
                  shape: 'square',
                  src: params.row.avatar
                }
              })
            ]);
          }
        },
        {
          title: '昵称',
          key: 'nickname',
          align: 'center',
          width: '200'
        },
        {
          title: '学号',
          key: 'r_id',
          align: 'center',
          width: '200'
        },
        {
          title: '词汇量',
          key: 'vocab_count',
          align: 'center',
          width: '100'
        },
        {
          title: '在读书单',
          key: 'group_name',
          align: 'center'
        },
        {
          title: '操作',
          key: 'handle',
          align: 'center',
          render: (h, params) => {
            return h('div', {
              style: {
                display: 'flex',
                justifyContent: 'center'
              }
            }, [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  width: '40px'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    this.studentDetailVisible = true;
                  }
                }
              }, '详情'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  width: '40px'
                }
              }, '删除')
            ]);
          }
        }
      ]
    };
  },
  methods: {
    pageChange(index) {
      this.mainPage.page = index;
      this.getStudentsInfo();
    },
    getStudentsInfo() {
      const params = {
        page: this.mainPage.page,
        id: this.searchStudent.id,
        name: this.searchStudent.name
      };
      for (let i in params) {
        if (params[i] === '') {
          delete params[i];
        }
      }
      this.$api.getAllStudent(params).then(res => {
        if (res.status === 1) {
          this.mainPage.total = res.count;
          this.allStudentsData = [];
          this.allStudentsData = res.data;
        }
      });
    }
  },
  mounted() {
    this.getStudentsInfo();
  },
  watch: {
    searchStudent: {
      handler(n, o) {
        this.getStudentsInfo();
      },
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>

</style>
