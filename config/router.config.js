export default [
  {
    path: '/user',
    component: '../layouts/LoginLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './Login' },
    ],
  },
  {
    path: '/',
    component: '../layouts/AuthLayout',
    routes: [
      { path: '/', redirect: '/dashboard' },
      { path: '/dashboard', component: './Dashboard' },
      {
        path: '/moduleName',
        name: 'moduleName',
        routes: [{ path: '/moduleName/demo', component: './Demo' }],
      },
      {
        path: '/pm',
        name: '项目管理',
        routes: [
          {
            path: '/pm/PmBaseInfo',
            component: './PmBaseInfo',
            title: '项目基础信息',
          },
          {
            path: '/pm/PmBaseInfoEdit',
            component: './PmBaseInfoEdit',
            title: '项目基础信息编辑',
          },
          {
            path: '/pm/ProjectMembers',
            component: './ProjectMembers',
            title: '项目人员？',
          },
          {
            path: '/pm/ProjectSchedule',
            component: './ProjectSchedule',
            title: '项目进度',
          },
          {
            path: '/pm/TodoList',
            component: './TodoList',
            title: 'TodoList',
          },
          {
            path: '/pm/WfConfig',
            component: './WfConfig',
            title: 'WfConfig',
          },

        ],
      },
    ],
  },
];
