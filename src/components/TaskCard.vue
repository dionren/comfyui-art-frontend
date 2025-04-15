<template>
  <el-card
    class="task-card"
    :class="cardClass"
    shadow="hover"
  >
    <div class="task-header">
      <div class="task-info">
        <el-icon class="status-icon" :class="statusIconClass">
          <component :is="statusIcon" />
        </el-icon>
        
        <div class="task-details">
          <div class="task-title">
            任务 #{{ taskId }}
            <el-tag
              :type="statusTagType"
              size="small"
              effect="dark"
              class="status-tag"
            >
              {{ statusText }}
            </el-tag>
          </div>
          <div class="task-time">{{ formattedTime }}</div>
        </div>
      </div>
      
      <div class="task-actions">
        <el-button
          v-if="task.status === 'completed'"
          type="info"
          :icon="Download"
          circle
          size="small"
          class="action-button"
        />
        <el-button
          type="danger"
          :icon="Delete"
          circle
          size="small"
          class="action-button"
          @click="$emit('delete', task.id)"
        />
        <el-button
          type="info"
          :icon="expanded ? ArrowUp : ArrowDown"
          circle
          size="small"
          class="action-button"
          @click="expanded = !expanded"
        />
      </div>
    </div>
    
    <!-- Progress bar for processing tasks -->
    <div v-if="task.status === 'processing' && task.progress !== undefined" class="progress-section">
      <div class="progress-info">
        <span>处理中...</span>
        <span>{{ task.progress }}%</span>
      </div>
      <el-progress
        :percentage="task.progress"
        :stroke-width="8"
        :show-text="false"
        status="primary"
      />
    </div>
    
    <!-- Expanded content -->
    <el-collapse-transition>
      <div v-if="expanded" class="task-content">
        <!-- Parameters -->
        <div class="content-section">
          <div class="section-title">参数:</div>
          <div class="code-block">
            <pre>{{ JSON.stringify(task.parameters, null, 2) }}</pre>
          </div>
        </div>
        
        <!-- Error message for failed tasks -->
        <div v-if="task.status === 'failed' && task.errorMessage" class="content-section">
          <div class="section-title error-title">错误信息:</div>
          <div class="error-block">
            {{ task.errorMessage }}
          </div>
        </div>
        
        <!-- Outputs for completed tasks -->
        <div v-if="task.status === 'completed' && task.outputs && task.outputs.length > 0" class="content-section">
          <div class="section-title">输出:</div>
          <div class="outputs-grid">
            <div
              v-for="(output, index) in task.outputs"
              :key="index"
              class="output-item"
            >
              <div class="output-image-container">
                <img
                  :src="output.url || '/placeholder.svg'"
                  :alt="output.caption || `输出 ${index + 1}`"
                  class="output-image"
                />
                <div class="output-overlay">
                  <el-button type="primary" size="small" :icon="Download">
                    下载
                  </el-button>
                </div>
              </div>
              <div v-if="output.caption" class="output-caption">
                {{ output.caption }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-collapse-transition>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Clock,
  Loading,
  CircleCheck,
  Warning,
  Download,
  Delete,
  ArrowDown,
  ArrowUp
} from '@element-plus/icons-vue'

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
  task: Task
}>()

defineEmits(['delete'])

const expanded = ref(false)

// 提取任务ID的数字部分
const taskId = computed(() => {
  return props.task.id.split('-')[1] || props.task.id
})

// 格式化时间
const formattedTime = computed(() => {
  return new Date(props.task.createdAt).toLocaleString()
})

// 状态图标
const statusIcon = computed(() => {
  switch (props.task.status) {
    case 'pending':
      return Clock
    case 'processing':
      return Loading
    case 'completed':
      return CircleCheck
    case 'failed':
      return Warning
    default:
      return Clock
  }
})

// 状态图标样式
const statusIconClass = computed(() => {
  switch (props.task.status) {
    case 'pending':
      return 'status-pending'
    case 'processing':
      return 'status-processing'
    case 'completed':
      return 'status-completed'
    case 'failed':
      return 'status-failed'
    default:
      return ''
  }
})

// 状态标签类型
const statusTagType = computed(() => {
  switch (props.task.status) {
    case 'pending':
      return 'warning'
    case 'processing':
      return 'info'
    case 'completed':
      return 'success'
    case 'failed':
      return 'danger'
    default:
      return 'info'
  }
})

// 状态文本
const statusText = computed(() => {
  switch (props.task.status) {
    case 'pending':
      return '等待中'
    case 'processing':
      return '执行中'
    case 'completed':
      return '已完成'
    case 'failed':
      return '失败'
    default:
      return props.task.status
  }
})

// 卡片样式
const cardClass = computed(() => {
  return {
    'status-failed-card': props.task.status === 'failed',
    'status-completed-card': props.task.status === 'completed'
  }
})
</script>

<style scoped>
.task-card {
  margin-bottom: 16px;
  background-color: #1E293B;
  border-color: #334155;
  transition: all 0.2s;
}

.status-failed-card {
  border-color: var(--ep-color-danger);
}

.status-completed-card {
  border-color: var(--ep-color-success);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-info {
  display: flex;
  align-items: center;
}

.status-icon {
  font-size: 20px;
  margin-right: 16px;
}

.status-pending {
  color: var(--ep-color-warning);
}

.status-processing {
  color: var(--ep-color-primary);
  animation: spin 1.5s linear infinite;
}

.status-completed {
  color: var(--ep-color-success);
}

.status-failed {
  color: var(--ep-color-danger);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.task-details {
  display: flex;
  flex-direction: column;
}

.task-title {
  font-weight: 500;
  display: flex;
  align-items: center;
}

.status-tag {
  margin-left: 8px;
}

.task-time {
  font-size: 12px;
  color: #94A3B8;
  margin-top: 2px;
}

.task-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  border: none;
}

.progress-section {
  margin-top: 12px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #94A3B8;
  margin-bottom: 4px;
}

.task-content {
  margin-top: 16px;
  border-top: 1px solid #334155;
  padding-top: 16px;
}

.content-section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}

.error-title {
  color: var(--ep-color-danger);
}

.code-block {
  background-color: #0F172A;
  border-radius: 4px;
  padding: 12px;
  font-family: monospace;
  font-size: 12px;
  color: #E2E8F0;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
}

.error-block {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 4px;
  padding: 12px;
  font-size: 12px;
  color: var(--ep-color-danger);
}

.outputs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.output-item {
  position: relative;
}

.output-image-container {
  position: relative;
  aspect-ratio: 1/1;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #334155;
  background-color: #0F172A;
}

.output-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.output-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.output-image-container:hover .output-image {
  transform: scale(1.05);
}

.output-image-container:hover .output-overlay {
  opacity: 1;
}

.output-caption {
  text-align: center;
  font-size: 12px;
  color: #94A3B8;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

