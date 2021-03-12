<template>
  <div>
    <PageHeader title="社区管理">
      <template v-slot:actions>
        <div style="display: flex; align-items: center; width: 80%;">
          <div style="width: 1000px; margin-right: 30px;">
            <Table :columns="allStatisticList" :data="allStatisticData" />
          </div>
          <Select v-model="searchChannel" style="width: 150px; margin-right: 40px;">
            <Option v-for="(item, index) in channelList" :key="index" :value="item.value">{{item.label}}</Option>
          </Select>
          <Button type="primary" size="small" icon="md-add" @click="handleNewArticle('new')">新建文章</Button>
        </div>
      </template>
    </PageHeader>
    <Card>
      <Table :columns="articleList" :data="articleData" />
      <Page :page-size="mainPage.pageSize" :page="mainPage.page" :total="mainPage.count" @on-change="pageChange" />
    </Card>
    <Modal :title="modalTitle" v-model="handleArticleVisible" width="70%" @on-ok="sendNewArticle">
      <div style="overflow-y: scroll;">
        <Form :label-width="120">
          <Form-item label="频道选择">
            <Select v-model="handleArticleData.channel">
              <Option v-for="(item, index) in channelList" :value="item.value" :key="index">{{item.label}}</Option>
            </Select>
          </Form-item>
          <Form-item label="标题">
            <Input v-model="handleArticleData.title" style="width: 600px;" />
          </Form-item>
          <Form-item label="副标题">
            <Input v-model="handleArticleData.sub_title" style="width: 600px;" />
          </Form-item>
          <Form-item label="上线时间">
            <DatePicker type="date" @on-change="onlineDateChange" />
          </Form-item>
          <Form-item label="封面">
            <Input v-model="handleArticleData.cover" style="width: 600px;" />
          </Form-item>
          <Form-item label="预设阅读量">
            <Input v-model="handleArticleData.read_num" style="width: 600px;" />
          </Form-item>
          <Form-item label="预设点赞量">
            <Input v-model="handleArticleData.like" style="width: 600px;" />
          </Form-item>
          <Form-item label="正文">
            <quill-editor ref="myQuillEditorAdd" v-model="handleArticleData.content" :options="editorOption" @on-change="editAddContent()" style="height: 800px; width: 800px;"></quill-editor>
            <upload class="avatar-uploader"
                    :on-success="mainUpSuccessEdit"
                    :on-format-error="mainHandleFormatError"
                    :on-error="uploadError"
                    name="media"
                    :before-upload="beforeUpload"
                    style="display: none;"
                    :action="getUpAction()">
            </upload>
          </Form-item>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
import PageHeader from '../modal/PageHeader';
import { quillEditor } from 'vue-quill-editor';
import { addQuillTitle } from './../modal/quill-title.js';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],

  [{ size: ['small', false, 'large', 'huge'] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ['link', 'image', 'video'],
  ['clean']
];
export default {
  name: 'Community',
  components: {PageHeader, quillEditor},
  data() {
    return {
      editorOption: {
        placeholder: '',
        theme: 'snow',
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: function (value) {
                if (value) {
                  document.querySelector('.avatar-uploader input').click();
                } else {
                  this.quill.format('image', false);
                }
              }
            }
          }
        }
      },
      handleArticleData: {
        channel: '4',
        title: '',
        sub_title: '',
        online_time: '',
        cover: '',
        content: '',
        read_num: 0,
        like: 0
      },
      handleArticleVisible: false,
      modalTitle: '新建模板',
      mainPage: {
        pageSize: 10,
        page: 1,
        count: 0
      },
      articleData: [],
      articleList: [
        {
          title: 'id',
          key: 'p_id',
          align: 'center',
          fixed: 'left'
        },
        {
          title: '封面',
          key: 'cover',
          align: 'center',
          fixed: 'left',
          render: (h, params) => {
            return h('div', [
              h('poptip',
                {
                  props: {
                    placement: 'right',
                    trigger: 'hover'
                  },
                  style: {
                    width: '100px',
                    height: '100px'
                  }
                },
                [
                  h('img', {
                    attrs: {
                      src: params.row.cover
                    },
                    style: {
                      paddingTop: '10px',
                      width: '100px',
                      height: '100px'
                    },
                    on: {}
                  }),
                  h('div', {
                    slot: 'content',
                    style: {
                      width: '300px',
                      height: '300px'
                    }
                  },
                  [
                    h('img', {
                      attrs: {
                        src: params.row.cover
                      },
                      style: {
                        width: '300px',
                        height: '300px'
                      },
                      on: {}
                    })
                  ])
                ])
            ]);
          }
        },
        {
          title: '标题',
          key: 'title',
          align: 'center',
          fixed: 'left'

        },
        {
          title: '频道',
          key: 'type',
          align: 'center',
          fixed: 'left'
        },
        {
          title: '阅读数',
          key: 'read_num',
          align: 'center'
        },
        {
          title: '点赞数',
          key: 'like',
          align: 'center'
        },
        {
          title: '评论数',
          key: 'comment_num',
          align: 'center'
        },
        {
          title: '评论点赞数',
          key: 'comment_like_num',
          align: 'center'
        },
        {
          title: '上线评论数',
          key: 'online_comment_num',
          align: 'center'
        },
        {
          title: '上线时间',
          key: 'online_time',
          align: 'center',
          fixed: 'right'
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          fixed: 'right'
        },
        {
          title: '操作',
          key: 'handle',
          fixed: 'right',
          width: '260',
          render: (h, params) => {
            return h('div', {
              style: {
                display: 'flex',
                flexDirection: 'column'
              }
            },
            [
              h('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'row'
                }
              },
              [
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                    shape: 'circle'
                  },
                  style: {
                    width: '48%',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: params.row.statusTypeChange,
                    size: 'small',
                    shape: 'circle'
                  },
                  style: {
                    width: '48%'
                  },
                  on: {
                    click: () => {
                    }
                  }
                }, params.row.statusWord)
              ]),
              h('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: '10px'
                }},
              [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    shape: 'circle'
                  },
                  style: {
                    width: '48%',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                    }
                  }
                }, '查看留言'),
                h('poptip',
                  {
                    props: {
                      placement: 'right',
                      trigger: 'hover'
                    },
                    style: {
                      width: '48%'
                    }
                  },
                  [
                    h('Button', {
                      props: {
                        type: 'primary',
                        size: 'small',
                        shape: 'circle',
                        icon: 'md-alert'
                      },
                      attrs: {
                      },
                      style: {
                        width: 'auto'
                      },
                      on: {
                        click: () => {
                        }
                      }
                    }, '发布正式环境'),
                    h('div', {
                      slot: 'content',
                      style: {
                      }},
                    [
                      h('p', {
                        style: {
                          color: 'red'
                        },
                        on: {}
                      }, '发布到正式环境，慎点！')
                    ])
                  ])
              ])
            ]);
          }
        }
      ],
      allStatisticData: [],
      allStatisticList: [
        {
          title: '阅读总数',
          key: 'read',
          align: 'center'
        },
        {
          title: '点赞总数',
          key: 'like',
          align: 'center'
        },
        {
          title: '评论总数',
          key: 'comment',
          align: 'center'
        },
        {
          title: '评论点赞总数',
          key: 'comment_like',
          align: 'center'
        },
        {
          title: '上线评论总数',
          key: 'online_comment',
          align: 'center'
        }
      ],
      channelList: [
        {
          label: '全部',
          value: 4
        },
        {
          label: '书单故事',
          value: 0
        },
        {
          label: '看见TA们',
          value: 1
        },
        {
          label: 'Mint News',
          value: 2
        },
        {
          label: '浅荷话题',
          value: 3
        }
      ],
      searchChannel: '4'
    };
  },
  methods: {
    sendNewArticle() {
      console.log(this.handleArticleData);
      this.$api.newPgcArticle(this.handleArticleData).then(res => {
        if (res.status === 1) {
          this.handleArticleData = {
            channel: '4',
            title: '',
            sub_title: '',
            online_time: '',
            cover: '',
            content: '',
            read_num: 0,
            like: 0
          };
        }
      });
    },
    getUpAction () {
      return 'http://rdmint-admin.baicizhan.com/' + '/api/abtest/upfile/images';
      // return 'rdmint-admin.baicizhan.com/' + '/api/abtest/upfile/images';
    },
    beforeUpload() {
      // this.quillUpdateImg = true;
    },
    uploadError() {
      this.$Message.error('图片上传失败');
    },
    mainHandleFormatError(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc:
          '文件' +
          file.name +
          '格式不正确，请上传mp4,avi,wmv或mpeg格式的视频'
      });
    },
    mainUpSuccessEdit(res, file, filelist) {
      let quill = this.$refs.myQuillEditorAdd.quill;
      if (res.code === 0 && res.result !== null) {
        let length = quill.getSelection().index;
        quill.insertEmbed(length, 'image', `//ali.baicizhan.com/${res.data.key}`);
        quill.setSelection(length + 1);
      } else {
        this.$message.error('图片插入失败');
      }
    },
    editAddContent(e) {
      this.handleArticleData.content = e;
    },
    onlineDateChange(e) {
      const arr = e.split('-');
      this.handleArticleData.online_time = `${arr[0]}/${arr[1]}/${arr[2]}`;
    },
    handleNewArticle(type) {
      if (type === 'new') {
        this.modalTitle = '新建模板';
      }
      this.handleArticleVisible = true;
    },
    pageChange(e) {
      this.mainPage.page = e;
      this.getPgcData();
    },
    getPgcData() {
      const params = {
        page: this.mainPage.page,
        channel: this.searchChannel
      };
      this.$api.getPgcList(params).then(res => {
        if (res.status === 1) {
          this.allStatisticData = [];
          this.articleData = [];
          this.articleData = res.data;
          this.allStatisticData.push(res.count);
          this.mainPage.count = res.article_count;
        }
      });
    }
  },
  mounted() {
    this.getPgcData();
    addQuillTitle();
  },
  watch: {
    searchChannel: function () {
      this.mainPage.page = 1;
      this.getPgcData();
    }
  }
};
</script>

<style lang="less" scoped>

</style>
