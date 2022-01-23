import Vue from 'vue'
import VueRouter from 'vue-router'
import Unstarted from '../views/Unstarted.vue'
// import Work from '../views/Work.vue'
import Explorer from '../views/Explorer.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Unstarted',
    component: Unstarted
  },
  // {
  //   path: '/work',
  //   name: 'Work',    
  //   component: Work
  // }, 
  {
    path: '/explorer',
    name: 'Explorer',    
    component: Explorer
  }, 
]

const router = new VueRouter({
  routes
})

export default router
