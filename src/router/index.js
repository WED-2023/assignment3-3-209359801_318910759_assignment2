import Main from '../pages/Main_Page.vue';
import NotFound from '../pages/Not_Found.vue';

const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../pages/Register.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/Login.vue"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../pages/Search.vue"),
  },
  {
    path: "/recipe/:recipe_id",
    name: "recipe",
    component: () => import("../pages/Recipe_View.vue"),
  },
  { 
    path: '/about', 
    name: 'about', 
    component: () => import("../pages/About.vue"), 
  }, 
  {
  path: "/favorites",
  name: "favorites",
  component: () => import("../pages/My_Favorite.vue"),
},
{
  path: "/my-recipes",
  name: "myRecipes",
  component: () => import("../pages/My_Recipes.vue"),
},
{
  path: "/family-recipes",
  name: "familyRecipes",
  component: () => import("../pages/My_Family_Recipes.vue"),
},

  {
    path: "/:catchAll(.*)",
    name: "notFound",
    component: NotFound,
  }
];

export default routes;