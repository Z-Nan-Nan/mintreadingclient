<template>
  <div>
    <PageHeader :title="mainTitle">
      <template v-slot:actions>
        <div style="display: flex; align-items: center; width: 700px;">
          <i-switch v-model="showBook" size="large" style="margin-right: 60px;">
            <span slot="open">书籍</span>
            <span slot="close">书单</span>
          </i-switch>
          <Button type="primary" size="small" style="margin-right: 40px; height: 30px;" @click="visibleHandle" v-if="mainTitle">{{showBook ? '添加书籍' : '添加书单'}}</Button>
          <div>名称搜索：</div>
          <Input v-model="searchBookName" style="margin-left: 30px; width: 220px;" v-if="showBook" />
          <Input v-model="searchBookGroupName" style="margin-left: 30px; width: 220px;" v-if="!showBook" />
        </div>
      </template>
    </PageHeader>
    <Table :columns="allBookList" :data="allBookData" v-if="showBook" />
    <Table :columns="allBookGroupList" :data="allBookGroupData" v-if="!showBook" />
    <Page :page="mainPage.page" :page-size="mainPage.pageSize" :total="mainPage.total" show-elevator show-total @on-change="pageChange" v-if="showBook" />
    <Page :page="subPage.page" :page-size="subPage.pageSize" :total="subPage.total" show-elevator show-total @on-change="subPageChange" v-if="!showBook" />
    <Modal v-model="newBookVisible" title="添加书籍" width="50%" @on-ok="createNewBook">
      <div>
        <Form :label-width="160">
          <Form-item label="中文书名">
            <Input style="width: 600px;" v-model="newBookInfo.name_cn" />
          </Form-item>
          <Form-item label="英文书名">
            <Input style="width: 600px;" v-model="newBookInfo.name_en" />
          </Form-item>
          <Form-item label="作者">
            <Input style="width: 600px;" v-model="newBookInfo.author"/>
          </Form-item>
          <Form-item label="期数、章节数、评分、字数">
            <div>第<Input style="width: 50px; margin-left: 10px; margin-right: 10px;" v-model="newBookInfo.term" />期，共<Input style="width: 50px; margin-left: 10px; margin-right: 10px;" v-model="newBookInfo.chapter" />章，评<Input style="width: 50px; margin-left: 10px; margin-right: 10px;" v-model="newBookInfo.rate" />分，计<Input style="width: 50px; margin-left: 10px; margin-right: 10px;" v-model="newBookInfo.words" />字</div>
          </Form-item>
          <Form-item label="书籍封面上传">
            <Input placeholder="移步工具箱完成图片上传" style="width: 600px;" v-model="newBookInfo.img_src" />
          </Form-item>
          <Form-item label="书籍描述">
            <Input type="textarea" :rows="5" style="width: 600px;" v-model="newBookInfo.book_desc" />
          </Form-item>
          <Form-item label="售卖页图片">
            <Input placeholder="移步工具箱完成图片上传" style="width: 600px;" v-model="newBookInfo.sell_src" />
          </Form-item>
          <Form-item label="所属书单">
            <Select multiple :max-tag-count="3" style="width: 600px;" v-model="newBookInfo.book_group">
              <Option v-for="(item, index) in selectBookGroupData" :value="item.value" :key="index">{{item.label}}</Option>
            </Select>
          </Form-item>
          <Form-item label="标签">
            <div>
              <span style="width: 80px; height: 40px; border: 1px grey solid; border-radius: 3px; margin-right: 10px; padding: 10px;" v-for="(item, index) in newBookInfo.tags" :key="index">{{item}}</span>
              <Input v-model="tempTag" style="width: 80px;" @keyup.enter.native="addNewTag" />
            </div>
          </Form-item>
        </Form>
      </div>
    </Modal>
    <Modal v-model="newBookGroupVisible" title="添加书单" width="50%" @on-ok="createNewBookGroup">
      <div>
        <Form :label-width="120">
          <Form-item label="书单名称">
            <Input v-model="newBookGroupInfo.name" style="width: 400px;" />
          </Form-item>
          <Form-item label="标签集合">
            <div style="display: flex;">
              <span style="width: 50px; height: 30px; vertical-align: center; text-align: center; border: grey 1px solid; border-radius: 3px; margin-right: 10px;" v-for="(item, index) in newBookGroupInfo.tags" :key="index">{{item}}</span>
              <Select @on-change="addGroupTag" v-model="newGroupTag" style="width: 200px;">
                <Option v-for="(item, index) in tagList" :key="index" :value="item.value">{{item.label}}</Option>
              </Select>
            </div>
          </Form-item>
          <Form-item label="书籍集合">
            <div>
              <span style="width: 80px; height: 40px; border: 1px grey solid; border-radius: 3px; margin-right: 10px; padding: 10px;" v-for="(item, index) in newBookGroupInfo.book_list" :key="index">{{item.name_cn}}</span>
              <Select @on-change="addNewGroupBook" v-model="newGroupBook" style="width: 200px;">
                <Option v-for="(item, index) in tempBookList" :key="index" :value="item.value">{{item.label}}</Option>
              </Select>
            </div>
          </Form-item>
          <Form-item label="编辑信息">
            <div>
              <p style="margin-bottom: 15px;"><span style="margin-right: 10px;">姓名:</span><Input style="width: 400px;" v-model="newBookGroupInfo.editor" /></p>
              <p style="margin-bottom: 15px;"><span style="margin-right: 10px;">照片:</span><Input style="width: 400px;" v-model="newBookGroupInfo.avatar" /></p>
              <p style="margin-bottom: 15px;"><span style="margin-right: 10px;">学历:</span><Input style="width: 400px;" v-model="newBookGroupInfo.job" /></p>
            </div>
          </Form-item>
          <Form-item label="上线日期">
            <DatePicker type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px" @on-change="groupDateChange" />
          </Form-item>
          <Form-item label="价格">
            <Input v-model="newBookGroupInfo.cost" style="width: 200px;" />
          </Form-item>
          <Form-item label="书单描述">
            <Input type="textarea" v-model="newBookGroupInfo.group_desc" :rows="5" style="width: 600px;" />
          </Form-item>
          <Form-item label="评分">
            <Input v-model="newBookGroupInfo.rate" style="width: 400px;" />
          </Form-item>
          <Form-item label="内容策划">
            <div>
              <p style="margin-bottom: 15px;"><span style="margin-right: 10px;">姓名:</span><Input style="width: 400px;" v-model="newBookGroupInfo.content_men.men" /></p>
              <p style="margin-bottom: 15px;"><span style="margin-right: 10px;">照片:</span><Input style="width: 400px;" v-model="newBookGroupInfo.content_men.avatar" /></p>
            </div>
          </Form-item>
          <Form-item label="讲义编辑">
            <div>
              <p style="margin-bottom: 15px;"><span style="margin-right: 10px;">姓名:</span><Input style="width: 400px;" v-model="newBookGroupInfo.para_men.men" /></p>
              <p style="margin-bottom: 15px;"><span style="margin-right: 10px;">照片:</span><Input style="width: 400px;" v-model="newBookGroupInfo.para_men.avatar" /></p>
            </div>
          </Form-item>
          <Form-item label="销售头图">
            <Input v-model="newBookGroupInfo.sell_src" style="width: 400px;" />
          </Form-item>
          <Form-item label="适宜词汇">
            <Input v-model="newBookGroupInfo.fit_voc" style="width: 400px;" />
          </Form-item>
          <FormItem label="开课信息">
            <div>
              <p style="margin-bottom: 15px;"><span style="margin-right: 10px;">期数:</span><Input style="width: 400px;" v-model="newBookGroupInfo.term" /></p>
              <p style="margin-bottom: 15px;"><span style="margin-right: 10px;">月份:</span><Input style="width: 400px;" v-model="newBookGroupInfo.term_start_month" /></p>
              <p style="margin-bottom: 15px;"><span style="margin-right: 10px;">当日:</span><Input style="width: 400px;" v-model="newBookGroupInfo.term_start_day" /></p>
            </div>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
import PageHeader from '../modal/PageHeader';
export default {
  name: 'Book',
  components: {PageHeader},
  data() {
    return {
      tempBookList: [],
      newGroupBook: '',
      tempBook: '',
      tagList: [
        {
          label: '科幻',
          value: '0'
        },
        {
          label: '成长',
          value: '1'
        },
        {
          label: '悬疑',
          value: '2'
        },
        {
          label: '环球梦工厂',
          value: '3'
        },
        {
          label: '百科',
          value: '4'
        },
        {
          label: '漫威世界',
          value: '5'
        },
        {
          label: '心理学',
          value: '6'
        },
        {
          label: '美丽人生',
          value: '7'
        },
        {
          label: '女性成长',
          value: '8'
        },
        {
          label: '奇幻',
          value: '9'
        },
        {
          label: '家庭故事',
          value: '10'
        }
      ],
      newGroupTag: '',
      newBookGroupInfo: {
        name: '',
        tags: [],
        book_list: [],
        editor: '',
        cover: '',
        grade: 0,
        recommend: true,
        avatar: '',
        date: '',
        cost: '',
        group_desc: '',
        rate: 5,
        content_men: {
          men: '',
          avatar: ''
        },
        para_men: {
          men: '',
          avatar: ''
        },
        sell_src: '',
        fit_voc: 3000,
        job: '',
        term: 1,
        term_start_month: '',
        term_start_day: ''
      },
      newBookGroupVisible: false,
      allBookGroupList: [
        {
          title: 'id',
          key: 'group_id',
          align: 'center'
        },
        {
          title: '书单名',
          key: 'name',
          align: 'center',
          width: '140'
        },
        {
          title: '期数',
          key: 'term',
          align: 'center'
        },
        {
          title: '编辑',
          key: 'editor',
          align: 'center',
          width: '180',
          render: (h, params) => {
            return h('div', {
              style: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '180px'
              }
            }, [
              h('img', {
                style: {
                  width: '30px',
                  height: '30px',
                  borderRadius: '15px',
                  marginRight: '10px'
                },
                attrs: {
                  src: params.row.avatar
                }
              }),
              h('div', {
                style: {
                  width: '150px',
                  textAlign: 'start',
                  fontSize: '12px'
                }
              }, [
                h('p', params.row.editor),
                h('p', {
                  style: {
                    fontSize: '10px'
                  }
                }, params.row.job)
              ])
            ]);
          }
        },
        {
          title: '日期',
          key: 'date',
          align: 'center'
        },
        {
          title: '内容策划',
          key: 'content_men',
          align: 'center',
          width: '120',
          render: (h, params) => {
            return h('div', {
              style: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100px'
              }
            }, [
              h('img', {
                style: {
                  width: '30px',
                  height: '30px',
                  borderRadius: '15px',
                  marginRight: '10px'
                },
                attrs: {
                  src: params.row.content_men.avatar === undefined ? '' : params.row.content_men.avatar
                }
              }),
              h('div', {
                style: {
                  width: '80px',
                  textAlign: 'start',
                  fontSize: '12px'
                }
              }, [
                h('p', params.row.content_men.men === undefined ? '' : params.row.content_men.men)
              ])
            ]);
          }
        },
        {
          title: '讲义编辑',
          key: 'para_men',
          align: 'center',
          width: '120',
          render: (h, params) => {
            return h('div', {
              style: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100px'
              }
            }, [
              h('img', {
                style: {
                  width: '30px',
                  height: '30px',
                  borderRadius: '15px',
                  marginRight: '10px'
                },
                attrs: {
                  src: params.row.content_men.avatar === undefined ? '' : params.row.content_men.avatar
                }
              }),
              h('div', {
                style: {
                  width: '80px',
                  textAlign: 'start',
                  fontSize: '12px'
                }
              }, [
                h('p', params.row.para_men.men === undefined ? '' : params.row.para_men.men)
              ])
            ]);
          }
        },
        {
          title: '适宜词汇',
          key: 'fit_voc',
          align: 'center'
        }
      ],
      allBookGroupData: [],
      tempTag: '',
      selectBookGroupData: [],
      newBookInfo: {
        name_cn: '',
        name_en: '',
        img_src: '',
        book_desc: '',
        author: '',
        chapter: '',
        term: '',
        sell_src: '',
        rate: 0,
        tags: [],
        words: 0,
        book_group: []
      },
      showBook: true,
      mainTitle: '书籍管理',
      newBookVisible: false,
      allBookList: [
        {
          title: 'id',
          key: 'book_id',
          align: 'center'
        },
        {
          title: '封面',
          key: 'cover',
          align: 'center',
          render: (h, params) => {
            return h('div', {
              style: {
                paddingTop: '15px',
                width: '170px',
                height: '260px',
                paddingBottom: '15px'
              }
            }, [
              h('img', {
                style: {
                  width: '170px',
                  height: '230px'
                },
                attrs: {
                  src: params.row.img_src
                }
              })
            ]);
          }
        },
        {
          title: '书名',
          key: 'name_en',
          align: 'center'
        },
        {
          title: '中文名',
          key: 'name_cn',
          align: 'center'
        },
        {
          title: '作者',
          key: 'author',
          align: 'center'
        },
        {
          title: '简介',
          key: 'book_desc',
          align: 'center'
        },
        {
          title: '所属书单',
          key: 'book_group',
          align: 'center'
        },
        {
          title: '操作',
          key: 'handle',
          align: 'center',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'error',
                size: 'small'
              }
            }, '删除');
          }
        }
      ],
      allBookData: [],
      searchBookName: '',
      searchBookGroupName: '',
      mainPage: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      subPage: {
        page: 1,
        pageSize: 20,
        total: 0
      }
    };
  },
  methods: {
    groupDateChange(e) {
      const startDate = e[0].split('-');
      const endDate = e[1].split('-');
      this.newBookGroupInfo.date = `${startDate[0]}/${startDate[1]}/${startDate[2]}-${endDate[0]}/${endDate[1]}/${endDate[2]}`;
    },
    addNewGroupBook(e) {
      for (const i in this.tempBookList) {
        if (this.tempBookList[i].value === e) {
          this.newBookGroupInfo.book_list.push(this.tempBookList[i]);
          this.newGroupBook = '';
        }
      }
    },
    addGroupTag() {
      console.log(this.tagList[parseInt(this.newGroupTag)].label);
      this.newBookGroupInfo.tags.push(this.tagList[parseInt(this.newGroupTag)].label);
      this.newGroupTag = '';
    },
    createNewBookGroup() {
      const arr = [];
      for (const i in this.newBookGroupInfo.book_list) {
        arr.push(this.newBookGroupInfo.book_list[i].value);
      }
      this.newBookGroupInfo.book_list = arr;
      const params = {
        data: this.newBookGroupInfo
      };
      this.$api.sendNewBookGroup(params).then(res => {
        if (res.status === 1) {
          this.newBookGroupInfo = {
            name: '',
            tags: [],
            book_list: [],
            editor: '',
            cover: '',
            grade: 0,
            recommend: true,
            avatar: '',
            date: '',
            cost: '',
            group_desc: '',
            rate: 5,
            content_men: {
              men: '',
              avatar: ''
            },
            para_men: {
              men: '',
              avatar: ''
            },
            sell_src: '',
            fit_voc: 3000,
            job: '',
            term: 1,
            term_start_month: '',
            term_start_day: ''
          };
          this.getBookGroupInfo();
        }
      });
    },
    getBookGroupInfo() {
      const params = {
        page: this.subPage.page,
        name: this.searchBookGroupName
      };
      if (params.name === '') {
        delete params.name;
      }
      this.$api.getAllBookGroup(params).then(res => {
        if (res.status === 1) {
          for (const i in res.data) {
            if (res.data[i].content_men === undefined) {
              res.data[i].content_men = {
                men: '',
                avatar: ''
              };
            }
            if (res.data[i].para_men === undefined) {
              res.data[i].para_men = {
                men: '',
                avatar: ''
              };
            }
          }
          this.allBookGroupData = res.data;
          this.subPage.total = res.count;
        }
      });
    },
    createNewBook() {
      this.$api.sendNewBook({ obj: this.newBookInfo }).then(res => {
        if (res.status === 1) {
          this.newBookInfo = {
            name_cn: '',
            name_en: '',
            img_src: '',
            book_desc: '',
            author: '',
            chapter: '',
            term: '',
            sell_src: '',
            rate: 0,
            tags: [],
            words: 0,
            book_group: []
          };
          this.getBookInfo();
        }
      });
    },
    addNewTag() {
      this.newBookInfo.tags.push(this.tempTag);
      this.tempTag = '';
    },
    visibleHandle() {
      if (this.showBook) {
        this.newBookVisible = true;
        this.selectBookGroupData = [];
        this.$api.getAllBookGroup().then(res => {
          if (res.status === 1) {
            for (const i in res.data) {
              this.selectBookGroupData.push(
                {
                  value: res.data[i].group_id,
                  label: res.data[i].name
                }
              );
            }
          }
        });
      } else {
        this.newBookGroupVisible = true;
      }
    },
    subPageChange(index) {
      this.subPage.page = index;
      this.getBookInfo();
    },
    pageChange(index) {
      this.mainPage.page = index;
      this.getBookInfo();
    },
    getBookInfo() {
      const params = {
        page: this.mainPage.page,
        name: this.searchBookName
      };
      if (this.searchBookName === '') {
        delete params.name;
      }
      this.allBookData = [];
      this.$api.getAllBook(params).then(res => {
        if (res.status === 1) {
          this.mainPage.total = res.count;
          this.allBookData = res.data;
          for (const i in res.data) {
            this.tempBookList.push({
              name_cn: `${res.data[i].name_cn}`,
              book_id: res.data[i].book_id
            });
          }
        }
      });
    }
  },
  mounted() {
    this.getBookInfo();
  },
  watch: {
    searchBookName: function () {
      this.getBookInfo();
    },
    searchBookGroupName: function () {
      this.getBookGroupInfo();
    },
    showBook: function () {
      if (this.showBook) {
        this.mainTitle = '书籍管理';
        if (this.allBookData.length === 0) {
          this.mainPage.page = 1;
          this.getBookInfo();
        }
      } else {
        this.mainTitle = '书单管理';
        if (this.allBookGroupData.length === 0) {
          this.subPage.page = 1;
          this.getBookGroupInfo();
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>

</style>
