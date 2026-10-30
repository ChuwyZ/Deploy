import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import UserList from '@/views/admin/UserList.vue'
import UserDetail from '@/views/admin/UserDetail.vue'
import UserInfo from '@/views/admin/UserInfo.vue'
import UserHistory from '@/views/admin/UserHistory.vue'
import UserEdit from '@/views/admin/UserEdit.vue'
import LevelList from '@/views/admin/LevelList.vue'
import Dashboard from '@/views/user/Dashboard.vue'
import EditDetail from '@/views/user/EditDetail.vue'
import DashboardInfo from '@/views/user/DashboardInfo.vue'
import Profile from '@/views/user/profile/Profile.vue'
import ProfileInfo from '@/views/user/profile/ProfileInfo.vue'
import ProfileExamHistory from '@/views/user/profile/ProfileExamHistory.vue'
import ProfileBadges from '@/views/user/profile/ProfileBadges.vue'
import ProfileServices from '@/views/user/profile/ProfileServices.vue'
import Exam from '@/views/user/Exam.vue'
import ELearning from '@/views/user/ELearning.vue'
import LevelDetail from '@/views/admin/LevelDetail.vue'
import LevelInfo from '@/views/admin/LevelInfo.vue'
import LevelInfoEdit from '@/views/admin/LevelInfoEdit.vue'
import LevelBenefit from '@/views/admin/LevelBenefit.vue'
import LevelBenefitEdit from '@/views/admin/LevelBenefitEdit.vue'
import LevelBenefitAdd from '@/views/admin/LevelBenefitAdd.vue'
import LevelQuestion from '@/views/admin/LevelQuestion.vue'
import LevelQuestionAdd from '@/views/admin/LevelQuestionAdd.vue'
import LevelQuestionEdit from '@/views/admin/LevelQuestionEdit.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { authenUser } from '@/stores/authen'

declare module 'vue-router' {
  interface RouteMeta {
    role?: 'admin' | 'user'
    guestOnly?: boolean
  }
}

import LevelService from '@/views/admin/LevelService.vue'
import LevelServiceAdd from '@/views/admin/LevelServiceAdd.vue'
import LevelServiceEdit from '@/views/admin/LevelServiceEdit.vue'
import LevelElearning from '@/views/admin/LevelElearning.vue'
import LevelElearningAdd from '@/views/admin/LevelElearningAdd.vue'
import LevelElearningEdit from '@/views/admin/LevelElearningEdit.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'register',
      component: Register,
      meta: { guestOnly: true },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { guestOnly: true },
    },
    {
      path: '/admin',
      name: 'admin-userList',
      component: UserList,
      meta: { role: 'admin' },
    },
    {
      path: '/admin/users/:id',
      name: 'admin-userDetail',
      component: UserDetail,
      meta: { role: 'admin' },
      redirect: { name: 'admin-userInfo' },
      children: [
        {
          path: '',
          name: 'admin-userInfo',
          component: UserInfo,
        },
        {
          path: 'history',
          name: 'admin-userHistory',
          component: UserHistory,
        },
        {
          path: 'edit',
          name: 'admin-userEdit',
          component: UserEdit,
        },
      ],
    },
    {
      path: '/admin/levels',
      name: 'admin-levelList',
      component: LevelList,
      meta: { role: 'admin' },
    },
    {
      path: '/dashboard',
      name: 'user-dashboard',
      component: Dashboard,
      meta: { role: 'user' },
      redirect: { name: 'dashboard-info' },
      children: [
        {
          path: 'info',
          name: 'dashboard-info',
          component: DashboardInfo,
        },

        {
          path: 'profile',
          name: 'user-profile',
          component: Profile,
          redirect: { name: 'profile-info' },
          children: [
            {
              path: '',
              name: 'profile-info',
              component: ProfileInfo,
            },
            {
              path: 'history',
              name: 'profile-history',
              component: ProfileExamHistory,
            },
            {
              path: 'badges',
              name: 'profile-badges',
              component: ProfileBadges,
            },
            {
              path: 'services',
              name: 'profile-services',
              component: ProfileServices,
            },
            {
              path: 'edit',
              name: 'profile-edit',
              component: EditDetail,
            },
          ],
        },
        {
          path: 'elearning',
          name: 'e-learning',
          component: ELearning,
        },
        {
          path: 'exam',
          name: 'exam',
          component: Exam,
        },
      ],
    },
    {
      path: '/admin/levels/:id',
      name: 'admin-levelDetail',
      component: LevelDetail,
      meta: { role: 'admin' },
      redirect: { name: 'admin-levelInfo' },
      children: [
        {
          path: '',
          name: 'admin-levelInfo',
          component: LevelInfo,
        },
        {
          path: 'info-edit',
          name: 'admin-levelInfoEdit',
          component: LevelInfoEdit,
        },
        {
          path: 'benefit',
          name: 'admin-levelBenefit',
          component: LevelBenefit,
        },
        {
          path: 'benefit-add',
          name: 'admin-levelBenefitAdd',
          component: LevelBenefitAdd,
        },
        {
          path: 'benefit-edit',
          name: 'admin-levelBenefitEdit',
          component: LevelBenefitEdit,
        },
        {
          path: 'question',
          name: 'admin-levelQuestion',
          component: LevelQuestion,
        },
        {
          path: 'question-add',
          name: 'admin-levelQuestionAdd',
          component: LevelQuestionAdd,
        },
        {
          path: 'question-edit',
          name: 'admin-levelQuestionEdit',
          component: LevelQuestionEdit,
        },
        {
          path: 'service',
          name: 'admin-levelService',
          component: LevelService,
        },
        {
          path: 'service/add',
          name: 'admin-levelServiceAdd',
          component: LevelServiceAdd,
        },
        {
          path: 'service/edit',
          name: 'admin-levelServiceEdit',
          component: LevelServiceEdit,
        },
        {
          path: 'elearning',
          name: 'admin-levelElearning',
          component: LevelElearning,
        },
        {
          path: 'elearning/add',
          name: 'admin-levelElearningAdd',
          component: LevelElearningAdd,
        },
        {
          path: 'elearning/edit',
          name: 'admin-levelElearningEdit',
          component: LevelElearningEdit,
        },
      ],
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-foundView',
      component: NotFoundView,
    },
  ],
})

// Route guard: not logged in -> /login, wrong role -> your own home page,
// logged-in users cannot open the login / register pages again.
router.beforeEach((to) => {
  const authen = authenUser()
  const home = { path: authen.role === 'admin' ? '/admin' : '/dashboard' }
  const requiredRole = to.matched.find((r) => r.meta.role)?.meta.role

  if (requiredRole && !authen.isLoggedIn) return { name: 'login' }
  if (requiredRole && authen.role !== requiredRole) return home
  if (to.matched.some((r) => r.meta.guestOnly) && authen.isLoggedIn) return home
})

export default router
