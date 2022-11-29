export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    name: '编辑文章',
    path: '/blog/:id',
    component: './Blog/blog',
    layout: false,
  },
  {
    name: '文章管理',
    icon: 'table',
    path: '/blog',
    component: './Blog',
  },
  {
    name: '标签管理',
    icon: 'table',
    path: '/tag',
    component: './Tag',
  },
  {
    name: '素材库',
    icon: 'table',
    path: '/resource',
    component: './Resource',
  },
  {
    name: '设置',
    icon: 'table',
    path: '/setting',
    component: './Setting',
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
