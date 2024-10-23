import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Public/Login.vue';
import Register from '../views/Public/Register.vue';

import Home from '../views/Protected/Home.vue';
import PetPostAdd from '../views/Protected/PetPostAdd.vue';
import Events from '@/views/Protected/Events.vue';
import EventDetail from '@/views/Protected/EventDetail.vue'; 
import Notifications from '@/views/Protected/Notifications.vue';
import Calendar from '@/views/Protected/Calendar.vue';
import Friends from '@/views/Protected/Friends.vue';
import Profile from '../views/Protected/Profile.vue';
import Chats from '@/views/Protected/Chats.vue';

import PublicLayout from '../layouts/PublicLayout.vue';
import ProtectedLayout from '../layouts/ProtectedLayout.vue'; 
import { getAuth } from 'firebase/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: ProtectedLayout,
      meta: { requiresAuth: true }, // Requires authentication
      children: [
        {
          path: '',
          name: 'Home',
          component: Home,
        },
        {
          path: 'addpost',
          name: 'petPostAdd',
          component: PetPostAdd,
        },
        {
          path: 'events',
          name: 'Events',
          component: Events,
        }, 
        {
          path: 'eventdetail/:id',
          name: 'eventDetail',
          component: EventDetail,
          props:true
        },
        {
          path: 'notifications',
          name: 'Notifications',
          component: Notifications,
        },
        {
          path: 'Calendar',
          name: 'Calendar',
          component: Calendar,
        },
        {
          path: 'friends',
          name: 'friends',
          component: Friends,
        },
        {
          path: 'profile',
          name: 'Profile',
          component: Profile,
        },
        {
          path: 'chats',
          name: 'chats',
          component: Chats,
        },
        {
          path: '/:pathMatch(.*)*', // Catch-all route for undefined paths in protected routes
          redirect: { name: 'Home' }, // Always redirect to home if authenticated
        },
      ],
    },
    {
      path: '/login',
      component: PublicLayout, 
      meta: { requiresAuth: false }, 
      children: [
        {
          path: '',
          name: 'Login',
          component: Login,
        },
      ],
    },
    {
      path: '/register',
      component: PublicLayout,
      meta: { requiresAuth: false }, 
      children: [
        {
          path: '',
          name: 'Register',
          component: Register,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*', // Catch-all route for undefined paths in public routes
      redirect: { name: 'Login' }, // Redirect to login if not authenticated
    },
  ],
});

// Add route guard to check Firebase authentication status
router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const requiresAuth = to.meta.requiresAuth;

  // If trying to access a protected route and not authenticated
  if (requiresAuth && !user) {
    next({ name: 'Login' }); // Redirect to login if not authenticated
  } 
  // If trying to access a public route and already authenticated
  else if (!requiresAuth && user && (to.name === 'Login' || to.name === 'Register')) {
    next({ name: 'Home' }); // Redirect to home if authenticated
  } 
  else {
    next(); // Proceed to route
  }
});

export default router;
