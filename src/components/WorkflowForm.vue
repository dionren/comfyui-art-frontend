<template>
  <el-form @submit.prevent="handleSubmit" class="workflow-form">
    <el-tabs v-model="activeTab" class="workflow-tabs">
      <el-tab-pane
        v-for="category in categories"
        :key="category"
        :label="category"
        :name="category"
      >
        <el-scrollbar height="calc(100vh - 360px)" max-height="480px">
          <div class="parameter-list">
            <div
              v-for="param in parametersByCategory[category]"
              :key="param.id"
              class="parameter-item"
            >
              <div class="parameter-header">
                <div class="parameter-label">
                  <span>{{ param.name }}</span>
                  <span v-if="param.required" class="required-mark">*</span>
                  <el-tooltip
                    v-if="param.description"
                    :content="param.description"
                    placement="top"
                  >
                    <el-icon class="info-icon"><InfoFilled /></el-icon>
                  </el-tooltip>
                </div>
                <span v-if="param.type === 'number'" class="value-display">
                  {{ formData[param.id] }}
                </span>
              </div>

              <!-- 文本输入 -->
              <el-input
                v-if="param.type === 'text'"
                v-model="formData[param.id]"
                :placeholder="`输入${param.name}`"
                type="textarea"
                :rows="param.id === 'prompt' ? 4 : 2"
                :required="param.required"
              />

              <!-- 数字输入 -->
              <el-input-number
                v-else-if="param.type === 'number'"
                v-model="formData[param.id]"
                :min="param.min"
                :max="param.max"
                :step="param.step || 1"
                :required="param.required"
                class="full-width"
              />

              <!-- 复选框 -->
              <el-checkbox
                v-else-if="param.type === 'checkbox'"
                v-model="formData[param.id]"
                :label="param.description || `启用${param.name}`"
              />

              <!-- 选择器 -->
              <el-select
                v-else-if="param.type === 'select' && param.options"
                v-model="formData[param.id]"
                :placeholder="`选择${param.name}`"
                class="full-width"
              >
                <el-option
                  v-for="option in param.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>

              <!-- 图像上传 -->
              <image-uploader
                v-else-if="param.type === 'image'"
                v-model="formData[param.id]"
                :max-images="param.multiple ? (param.maxImages || 10) : 1"
              />
            </div>
          </div>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>

    <el-button
      type="primary"
      native-type="submit"
      class="submit-button"
      :icon="Play"
    >
      提交任务
    </el-button>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { InfoFilled, VideoPlay as Play } from '@element-plus/icons-vue'
import ImageUploader from './ImageUploader.vue'
import type { UploadedImage } from './ImageUploader.vue'

interface Parameter {
  id: string
  name: string
  type: string
  required: boolean
  description?: string
  default?: any
  min?: number
  max?: number
  step?: number
  options?: { label: string; value: any }[]
  category?: string
  multiple?: boolean
  maxImages?: number
}

interface WorkflowProps {
  parameters: Parameter[]
}

const props = defineProps<{
  workflow: WorkflowProps
}>()

const emit = defineEmits(['submit'])

const formData = ref<Record<string, any>>({})
const activeTab = ref('')

// 初始化表单数据
watch(() => props.workflow.parameters, (parameters) => {
  const initialData: Record<string, any> = {}
  parameters.forEach((param) => {
    if (param.default !== undefined) {
      initialData[param.id] = param.default
    } else if (param.type === 'text') {
      initialData[param.id] = ''
    } else if (param.type === 'number') {
      initialData[param.id] = param.min || 0
    } else if (param.type === 'checkbox') {
      initialData[param.id] = param.default || false
    } else if (param.type === 'select' && param.options && param.options.length > 0) {
      initialData[param.id] = param.default || param.options[0].value
    } else if (param.type === 'image') {
      initialData[param.id] = []
    }
  })
  formData.value = initialData
}, { immediate: true })

// 获取所有参数类别
const categories = computed(() => {
  const cats = new Set<string>()
  props.workflow.parameters.forEach((param) => {
    if (param.category) {
      cats.add(param.category)
    } else {
      cats.add('其他')
    }
  })
  return Array.from(cats)
})

// 设置默认活动标签页
onMounted(() => {
  if (categories.value.length > 0 && !activeTab.value) {
    activeTab.value = categories.value[0]
  }
})

// 按类别分组参数
const parametersByCategory = computed(() => {
  const grouped: Record<string, Parameter[]> = {}

  props.workflow.parameters.forEach((param) => {
    const category = param.category || '其他'
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(param)
  })

  return grouped
})

const handleSubmit = () => {
  emit('submit', formData.value)
}
</script>

<style scoped>
.workflow-form {
  width: 100%;
}

.workflow-tabs {
  margin-bottom: 16px;
}

.parameter-list {
  padding: 0 4px 16px;
}

.parameter-item {
  margin-bottom: 16px;
}

.parameter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.parameter-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
}

.required-mark {
  color: var(--ep-color-danger);
  margin-left: 4px;
}

.info-icon {
  margin-left: 4px;
  font-size: 14px;
  color: #94A3B8;
  cursor: help;
}

.value-display {
  font-size: 12px;
  color: #94A3B8;
}

.full-width {
  width: 100%;
}

.submit-button {
  width: 100%;
  margin-top: 16px;
}
</style>

