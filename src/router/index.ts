import { createRouter, createWebHistory } from "vue-router"
import WorkspaceHome from "../views/WorkspaceHome.vue"
import WorkflowPage from "../views/WorkflowPage.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: WorkspaceHome,
  },
  {
    path: "/workflow/:id",
    name: "Workflow",
    component: WorkflowPage,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

