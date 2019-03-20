import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

import DragToWorkplace from '@/components/DragToWorkplace'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
 
    {
      path: '/flowchart',
      name: 'DragToWorkplace',
      component: DragToWorkplace
    },
  
  ]
})
