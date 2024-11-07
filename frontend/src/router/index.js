import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Public/Login.vue';
import Register from '../views/Public/Register.vue';

import Home from '../views/Protected/Home.vue';
import PetPostDetail from '../views/Protected/PetPostDetail.vue';
import PetPostAdd from '../views/Protected/PetPostAdd.vue';
import PetPostEdit from '../views/Protected/PetPostEdit.vue';
import Events from '@/views/Protected/Events.vue';
import EventDetail from '@/views/Protected/EventDetail.vue'; 
import Notifications from '@/views/Protected/Notifications.vue';
import Calendar from '@/views/Protected/Calendar.vue';
import Friends from '@/views/Protected/Friends.vue';
import Profile from '../views/Protected/Profile.vue';
import ProfileUpdate from '@/views/Protected/ProfileUpdate.vue';
import PetsProfile from '@/views/Protected/PetsProfile.vue';
import Chats from '@/views/Protected/Chats.vue';
import FriendProfile from '@/views/Protected/FriendProfile.vue';
import sample from '@/views/Protected/Sample.vue'

import PublicLayout from '../layouts/PublicLayout.vue';
import ProtectedLayout from '../layouts/ProtectedLayout.vue'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Add onAuthStateChanged here
import EventsAdmin from '@/views/Protected/EventsAdmin.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: ProtectedLayout,
      meta: { requiresAuth: true }, // Requires authentication
      children: [
        {
          path: "",
          name: "Home",
          component: Home,
        },
        {
          path: '/posts/:postId',
          name: 'petPostDetail',
          component: PetPostDetail,
          props: true,
        },
        {
          path: "addpost",
          name: "petPostAdd",
          component: PetPostAdd,
        },
        {
          path: "editpost",
          name: "petPostEdit",
          component: PetPostEdit,
        },
        {
          path: "events",
          name: "Events",
          component: Events,
        },
        {
          path: "eventdetail/:id",
          name: "eventDetail",
          component: EventDetail,
          props: true,
        },
        {
          path: "notifications",
          name: "Notifications",
          component: Notifications,
        },
        {
          path: "Calendar",
          name: "Calendar",
          component: Calendar,
        },
        {
          path: "friends",
          name: "friends",
          component: Friends,
        },
        {
          path: "profile/:uid?", // `uid` is optional here
          name: "Profile",
          component: Profile,
          props: true, // Pass the `uid` as a prop to the Profile component
        },
        {
          path: "editprofile",
          name: "ProfileUpdate",
          component: ProfileUpdate,
        },
        {
          path: "manage-pets", // Updated path
          name: "ManagePets", // Updated route name
          component: PetsProfile,
        },
        {
          path: "chats",
          name: "chats",
          component: Chats,
        },
        {
          path: "eventsadmin",
          name: "eventsAdmin",
          component: EventsAdmin,
        },
        {
          path: "/friendprofile/:id",
          name: "friendProfile",
          component: FriendProfile,
          props: true,
        },
        {
          path: "sample",
          name: "sample",
          component: sample,
        },
        {
          path: "/:pathMatch(.*)*", // Catch-all route for undefined paths in protected routes
          redirect: { name: "Home" }, // Always redirect to home if authenticated
        },
      ],
    },
    {
      path: "/login",
      component: PublicLayout,
      meta: { requiresAuth: false },
      children: [
        {
          path: "",
          name: "Login",
          component: Login,
        },
      ],
    },
    {
      path: "/register",
      component: PublicLayout,
      meta: { requiresAuth: false },
      children: [
        {
          path: "",
          name: "Register",
          component: Register,
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*", // Catch-all route for undefined paths in public routes
      redirect: { name: "Login" }, // Redirect to login if not authenticated
    },
  ],
});

// Add route guard to check Firebase authentication status
// Add route guard to check Firebase authentication status
router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const requiresAuth = to.meta.requiresAuth;

  // Wait for Firebase to initialize the user state before proceeding
  const checkAuthState = () =>
    new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe(); // Unsubscribe after getting the user state
        resolve(user); // Resolve with the user state
      });
    });

  checkAuthState().then((user) => {
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
});


export default router;
