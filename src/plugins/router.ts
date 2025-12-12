/**
 * plugins/router.ts
 *
 * Vue Router configuration
 */

import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import DataTable from '@/components/DataTable.vue'
import FileUpload from '@/components/FileUpload.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/datatable',
    name: 'DataTable',
    component: DataTable
  },
  {
    path: '/upload',
    name: 'FileUpload',
    component: FileUpload
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
