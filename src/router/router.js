import Home from '../components/layout/Home';

const AllStudent = () => import('@/components/student/Student');
const DailyPic = () => import('@/components/manage/DailyPic');
const Book = () => import('@/components/manage/Book');
const ImageUpload = () => import('@/components/tool/ImageUpload');
const Community = () => import('@/components/manage/Community');

const routers = [
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect: '/all_students',
    children: [
      {
        path: '/all_students',
        name: '所有学员',
        level: 1,
        component: AllStudent
      },
      {
        path: '/daily_pic',
        name: '每日一句',
        level: 1,
        component: DailyPic
      },
      {
        path: '/book_manage',
        name: '书籍管理',
        level: 1,
        component: Book
      },
      {
        path: '/image_upload',
        name: '图片上传',
        level: 1,
        component: ImageUpload
      },
      {
        path: '/pgc_manage',
        name: '社区管理',
        level: 1,
        component: Community
      }
    ]
  }
];

export default routers;
