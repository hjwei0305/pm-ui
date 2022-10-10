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
            path: '/pm/ProjectPlan',
            component: './ProjectPlan',
            title: '项目计划表',
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
          {
            path: '/pm/Home',
            component: './Home',
            title: '首页',
          },
          {
            path: '/pm/Report',
            component: './Report',
            title: '数据报表',
          },
          {
            path: '/pm/TodolistDetails',
            component: './TodolistDetails',
            title: '待办列表清单',
          },
        ],
      },
      {
        path: '/em',
        name: '人员管理',
        routes: [
          {
            path: '/em/Emp',
            component: './Emp',
            title: '人员管理',
          },
        ],
      },
    ],
  },
];
