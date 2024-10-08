import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Protected/Home.vue';
import Profile from '../views/Protected/Profile.vue';
import Login from '../views/Public/Login.vue';
import Register from '../views/Public/Register.vue';
import PublicLayout from '../layouts/PublicLayout.vue'; // Import your PublicLayout
import { getAuth } from 'firebase/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true } // Protected route
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: { requiresAuth: true } // Protected route
    },
    {
      path: '/login',
      name: 'Login',
      component: PublicLayout, // Use PublicLayout
      children: [
        {
          path: '/login',
          component: Login, // Render Login as a child component
        },
      ],
      meta: { requiresAuth: false } // Public route
    },
    {
      path: '/register',
      name: 'Register',
      component: PublicLayout, // Use PublicLayout
      children: [
        {
          path: '/register',
          component: Register, // Render Register as a child component
        },
      ],
      meta: { requiresAuth: false } // Public route
    },
  ]
});

// Add route guard to check Firebase authentication status
router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && !user) {
    next({ name: 'Login' }); // Redirect to login if not authenticated
  } else {
    next(); // Proceed to route
  }
});

export default router;
