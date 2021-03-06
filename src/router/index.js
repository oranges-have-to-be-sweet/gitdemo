import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";
const teacherVisual = () => import("@/views/visualPack/teacherVisual.vue");
const studentsVisual = () => import("@/views/visualPack/studentsVisual.vue");
const getStudentsVisual = () =>
  import("@/views/visualPack/getStudentsVisual.vue");
const packToMap = () => import("@/views/visualPack/packToMap.vue");
const parkLocal = () => import("@/views/visualPack/parkLocal/index");
const principal = () => import("@/views/visualPack/principal/index");

const xqfbIcon = require("../assets/siderbarIcon/xqfb.png");
const xqfbActiveIcon = require("../assets/siderbarIcon/xqfb_active.png");
const jscqIcon = require("../assets/siderbarIcon/jscq.png");
const jscqActiveIcon = require("../assets/siderbarIcon/jscq_active.png");
const xscqIcon = require("../assets/siderbarIcon/xscq.png");
const xscqActiveIcon = require("../assets/siderbarIcon/xscq_active.png");
const zsqkIcon = require("../assets/siderbarIcon/zsqk.png");
const zsqkActiveIcon = require("../assets/siderbarIcon/zsqk_active.png");
const xxglIcon = require("../assets/siderbarIcon/xxgl.png");
const xxglActiveIcon = require("../assets/siderbarIcon/xxgl_active.png");
const zhglIcon = require("../assets/siderbarIcon/zhgl.png");
const zhglActiveIcon = require("../assets/siderbarIcon/zhgl_active.png");
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  {
    path: "/packToMap",
    component: Layout,
    children: [
      {
        path: "/packToMap",
        component: packToMap,
        name: "校区分布",
        meta: { title: "校区分布", icon: xqfbIcon, activeIcon: xqfbActiveIcon }
      }
    ]
  },
  {
    path: "/packTeacher",
    component: Layout,
    children: [
      {
        path: "/packTeacher",
        component: teacherVisual,
        name: "教师出勤",
        meta: { title: "教师出勤", icon: jscqIcon, activeIcon: jscqActiveIcon }
      }
    ]
  },
  {
    path: "/packStudent",
    component: Layout,
    children: [
      {
        path: "/packStudent",
        component: studentsVisual,
        name: "学生出勤",
        meta: { title: "学生出勤", icon: xscqIcon, activeIcon: xscqActiveIcon }
      }
    ]
  },
  {
    path: "/packGetStudents",
    component: Layout,
    children: [
      {
        path: "/packGetStudents",
        component: getStudentsVisual,
        name: "招生情况",
        meta: { title: "招生情况", icon: zsqkIcon, activeIcon: zsqkActiveIcon }
      }
    ]
  },
  {
    path: "/parkLocalMam",
    component: Layout,
    children: [
      {
        path: "/parkLocalMam",
        meta: { title: "校区管理", icon: xxglIcon, activeIcon: xxglActiveIcon },
        component: parkLocal
      },
      {
        path: "/parkLocalMam/updata",
        hidden: true,
        meta: { title: "编辑" },
        component: () =>
          import("@/views/visualPack/parkLocal/modules/updataParkLocal")
      }
    ]
  },
  {
    path: "/principalMam",
    component: Layout,
    children: [
      {
        path: "/principalMam",
        component: principal,
        name: "账号管理",
        meta: { title: "账号管理", icon: zhglIcon, activeIcon: zhglActiveIcon }
      }
    ]
  },
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [{
  //     path: 'dashboard',
  //     name: 'Dashboard',
  //     component: () => import('@/views/dashboard/index'),
  //     meta: { title: 'Dashboard', icon: 'dashboard' }
  //   }]
  // },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [{
  //     path: 'dashboard',
  //     name: 'Dashboard',
  //     component: () => import('@/views/dashboard/index'),
  //     meta: { title: 'Dashboard', icon: 'dashboard' }
  //   }]
  // },

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },
  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
