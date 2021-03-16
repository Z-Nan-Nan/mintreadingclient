import fetch from './fetch.js';

const getAllStudent = (params) => {
  return fetch({
    url: '/all_student_info',
    method: 'get',
    params: params
  });
};

const getAllPic = (params) => {
  return fetch({
    url: '/get_daily_pic',
    method: 'get',
    params: params
  });
};

const sendNewPic = (params) => {
  return fetch({
    url: '/send_daily_pic',
    method: 'POST',
    data: params
  });
};

const getAllBook = (params) => {
  return fetch({
    url: '/get_all_book',
    method: 'GET',
    params: params
  });
};

const getAllBookGroup = (params) => {
  return fetch({
    url: '/get_all_book_group',
    method: 'GET',
    params: params
  });
};

const sendNewBook = (params) => {
  return fetch({
    url: '/send_new_book',
    method: 'POST',
    data: params
  });
};

const sendNewBookGroup = (params) => {
  return fetch({
    url: '/send_new_book_group',
    method: 'POST',
    data: params
  });
};

const getPgcList = (params) => {
  return fetch({
    url: '/get_all_pgc_list',
    method: 'GET',
    params: params
  });
};

const newPgcArticle = (params) => {
  return fetch({
    url: '/new_pgc_article',
    method: 'POST',
    data: params
  });
};

const updateComment = (params) => {
  return fetch({
    url: '/update_comment',
    method: 'POST',
    data: params
  });
};

const updateBook = (params) => {
  return fetch({
    url: '/update_book',
    method: 'POST',
    data: params
  });
};

const apiList = {
  getAllStudent,
  getAllPic,
  sendNewPic,
  getAllBook,
  getAllBookGroup,
  sendNewBook,
  sendNewBookGroup,
  getPgcList,
  newPgcArticle,
  updateComment,
  updateBook
};

export default apiList;
