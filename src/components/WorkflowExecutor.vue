<template>
  <div class="workflow-executor">
    <el-row :gutter="24">
      <!-- 左侧 - 参数输入区域 -->
      <el-col :span="8">
        <el-card class="dark-card h-full">
          <template #header>
            <div class="card-header">
              <span class="header-title">参数设置</span>
            </div>
          </template>
          <workflow-form :workflow="workflow" @submit="handleSubmit" />
        </el-card>
      </el-col>

      <!-- 右侧 - 任务执行区域 -->
      <el-col :span="16">
        <el-card class="dark-card h-full">
          <template #header>
            <div class="card-header">
              <span class="header-title">任务列表</span>
              <el-tabs v-model="activeTab" class="task-tabs">
                <el-tab-pane label="全部" name="all" />
                <el-tab-pane label="等待中" name="pending" />
                <el-tab-pane label="执行中" name="processing" />
                <el-tab-pane label="已完成" name="completed" />
              </el-tabs>
            </div>
          </template>

          <div class="tasks-container">
            <!-- 无任务状态 -->
            <div v-if="filteredTasks.length === 0" class="empty-state">
              <el-icon class="empty-icon"><Clock /></el-icon>
              <h3 class="empty-title">暂无任务</h3>
              <p class="empty-desc">提交新任务后将在此处显示</p>
            </div>

            <!-- 任务列表 -->
            <div v-else class="tasks-list">
              <task-card
                v-for="task in currentTasks"
                :key="task.id"
                :task="task"
                @delete="deleteTask"
              />
            </div>
          </div>

          <!-- 分页控制 -->
          <div v-if="filteredTasks.length > 0" class="pagination-container">
            <div class="pagination-info">
              共 {{ filteredTasks.length }} 个任务，第 {{ currentPage }} / {{ totalPages }} 页
            </div>

            <el-pagination
              v-model:current-page="currentPage"
              :page-size="tasksPerPage"
              layout="prev, pager, next"
              :total="filteredTasks.length"
              background
              hide-on-single-page
              class="pagination"
            />

            <div class="page-size-selector">
              <span>每页显示:</span>
              <el-select v-model="tasksPerPage" size="small">
                <el-option :value="5" label="5" />
                <el-option :value="10" label="10" />
                <el-option :value="20" label="20" />
                <el-option :value="50" label="50" />
              </el-select>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Clock } from '@element-plus/icons-vue'
import WorkflowForm from './WorkflowForm.vue'
import TaskCard from './TaskCard.vue'
import { workflowsData } from '../data/workflows'

interface TaskOutput {
  url: string
  caption?: string
}

interface Task {
  id: string
  workflowId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  parameters: Record<string, any>
  createdAt: string
  progress?: number
  errorMessage?: string
  outputs?: TaskOutput[]
}

const props = defineProps<{
  workflowId: string
}>()

const workflow = ref(workflowsData['stable-diffusion-xl'])
const tasks = ref<Task[]>([])
const activeTab = ref('all')

// 分页状态
const currentPage = ref(1)
const tasksPerPage = ref(5)

// 当工作流ID变化时更新工作流数据
watch(() => props.workflowId, (newId) => {
  if (newId && workflowsData[newId as keyof typeof workflowsData]) {
    workflow.value = workflowsData[newId as keyof typeof workflowsData]
  }
}, { immediate: true })

onMounted(() => {
  if (props.workflowId && workflowsData[props.workflowId as keyof typeof workflowsData]) {
    workflow.value = workflowsData[props.workflowId as keyof typeof workflowsData]
  }
})

const handleSubmit = (formData: Record<string, any>) => {
  const newTask: Task = {
    id: `task-${Date.now()}`,
    workflowId: workflow.value.id,
    status: 'pending',
    parameters: formData,
    createdAt: new Date().toISOString(),
  }

  tasks.value = [newTask, ...tasks.value]
  // 新任务添加后，确保显示第一页
  currentPage.value = 1

  // 模拟任务执行
  setTimeout(() => {
    tasks.value = tasks.value.map(task => 
      task.id === newTask.id ? { ...task, status: 'processing', progress: 0 } : task
    )

    // 模拟进度更新
    const progressInterval = setInterval(() => {
      tasks.value = tasks.value.map(task => {
        if (task.id === newTask.id && task.status === 'processing') {
          const newProgress = (task.progress || 0) + 10
          if (newProgress >= 100) {
            clearInterval(progressInterval)
            return {
              ...task,
              status: Math.random() > 0.8 ? 'failed' : 'completed',
              progress: 100,
              ...(Math.random() > 0.8
                ? { errorMessage: '随机生成的错误，用于演示' }
                : {
                    outputs: [
                      { url: '/placeholder.svg?height=512&width=512', caption: '生成的图像 - 视角1' },
                      { url: '/placeholder.svg?height=512&width=512', caption: '生成的图像 - 视角2' },
                    ],
                  }),
            }
          }
          return { ...task, progress: newProgress }
        }
        return task
      })
    }, 500)
  }, 1000)
}

// 根据标签筛选任务
const filteredTasks = computed(() => {
  return activeTab.value === 'all' 
    ? tasks.value 
    : tasks.value.filter(task => task.status === activeTab.value)
})

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(filteredTasks.value.length / tasksPerPage.value)
})

// 获取当前页的任务
const currentTasks = computed(() => {
  const startIndex = (currentPage.value - 1) * tasksPerPage.value
  const endIndex = startIndex + tasksPerPage.value
  return filteredTasks.value.slice(startIndex, endIndex)
})

// 删除任务
const deleteTask = (taskId: string) => {
  tasks.value = tasks.value.filter(task => task.id !== taskId)
  // 如果当前页没有任务了且不是第一页，则返回上一页
  if (currentPage.value > 1 && (currentPage.value - 1) * tasksPerPage.value >= filteredTasks.value.length) {
    currentPage.value--
  }
}
</script>

<style scoped>
.workflow-executor {
  width: 100%;
}

.h-full {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
}

.task-tabs {
  margin-bottom: 0;
}

.tasks-container {
  min-height: 400px;
  max-height: calc(100vh - 250px);
  overflow-y: auto;
  padding: 8px 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  text-align: center;
}

.empty-icon {
  font-size: 32px;
  color: #64748B;
  background-color: #334155;
  padding: 12px;
  border-radius: 50%;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: #94A3B8;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #334155;
}

.pagination-info {
  font-size: 14px;
  color: #94A3B8;
}

.pagination {
  --el-pagination-bg-color: #1E293B;
  --el-pagination-text-color: #E2E8F0;
  --el-pagination-button-color: #94A3B8;
  --el-pagination-button-bg-color: #334155;
  --el-pagination-button-disabled-color: #64748B;
  --el-pagination-button-disabled-bg-color: #1E293B;
  --el-pagination-hover-color: var(--ep-color-primary);
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #94A3B8;
}
</style>

