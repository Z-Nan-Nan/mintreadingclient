const routes = [
  {
    path: '/',
    name: '学员管理',
    id: 'student',
    icon: 'ios-contacts',
    level: 0,
    fixed: false,
    children: [
      {
        path: '/all_students',
        id: 'all_students',
        name: '所有学员',
        level: 1,
        children: [],
        fixed: false,
        icon: 'ios-people'
      }
    ]
  },
  {
    path: '/',
    name: '素材管理',
    id: 'components',
    icon: 'ios-book',
    level: 0,
    fixed: false,
    children: [
      {
        path: '/book_manage',
        id: 'book_manage',
        name: '书籍管理',
        level: 1,
        children: [],
        fixed: false,
        icon: 'ios-bookmarks'
      },
      {
        path: '/pgc_manage',
        id: 'pgc_manage',
        name: '社区管理',
        level: 1,
        children: [],
        fixed: false,
        icon: 'ios-cafe'
      },
      {
        path: '/daily_pic',
        id: 'daily_pic',
        name: '每日一句',
        level: 1,
        children: [],
        fixed: false,
        icon: 'ios-images'
      }
    ]
  },
  {
    path: '/',
    name: '工具箱',
    id: 'toolBox',
    icon: 'ios-hammer',
    level: 0,
    fixed: false,
    children: [
      {
        path: '/image_upload',
        id: '/image_upload',
        name: '图片上传',
        level: 1,
        children: [],
        fixed: false,
        icon: 'ios-image'
      }
    ]
  }
];

export default routes;
