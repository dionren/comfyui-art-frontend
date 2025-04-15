<template>
  <div class="image-uploader">
    <!-- 已上传图像预览 -->
    <div v-if="modelValue.length > 0" :class="previewGridClass">
      <el-card
        v-for="image in modelValue"
        :key="image.id"
        class="image-card"
        shadow="hover"
        :body-style="{ padding: '0' }"
      >
        <div class="image-container">
          <img :src="image.url" :alt="image.name" class="preview-image" />
          <div class="image-overlay">
            <el-button
              type="danger"
              circle
              size="small"
              @click="removeImage(image.id)"
              class="delete-button"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
        <div class="image-info">{{ image.name }}</div>
      </el-card>

      <!-- 添加更多图像按钮 (多图模式) -->
      <el-card
        v-if="maxImages > 1 && canAddMoreImages"
        class="add-more-card"
        shadow="hover"
        @click="triggerFileInput"
      >
        <div class="add-more-content">
          <el-icon class="add-icon"><Plus /></el-icon>
          <span class="add-text">添加更多图像</span>
          <span class="count-text">{{ modelValue.length }}/{{ maxImages }}</span>
        </div>
      </el-card>
    </div>

    <!-- 上传区域 (空状态或单图模式) -->
    <div
      v-if="modelValue.length === 0 || (maxImages === 1 && canAddMoreImages)"
      class="upload-area"
      :class="{ 'is-dragging': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
      @click="triggerFileInput"
    >
      <el-icon class="upload-icon"><Upload /></el-icon>
      <div class="upload-text">
        <p class="primary-text">
          {{ maxImages === 1 ? '上传图像' : `上传图像 (最多 ${maxImages} 张)` }}
        </p>
        <p class="secondary-text">点击此处选择文件或拖放图像</p>
      </div>
    </div>

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden-input"
      :multiple="maxImages > 1"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Delete, Plus, Upload } from '@element-plus/icons-vue'

export interface UploadedImage {
  id: string
  url: string
  name: string
}

const props = defineProps({
  modelValue: {
    type: Array as () => UploadedImage[],
    default: () => []
  },
  maxImages: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['update:modelValue'])

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

const canAddMoreImages = computed(() => props.modelValue.length < props.maxImages)

const previewGridClass = computed(() => {
  return {
    'preview-grid': true,
    'single-column': props.maxImages === 1,
    'multi-column': props.maxImages > 1
  }
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    addFiles(Array.from(target.files))
  }
  // 重置文件输入，以便可以再次选择相同的文件
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const onDrop = (e: DragEvent) => {
  isDragging.value = false
  if (e.dataTransfer?.files) {
    addFiles(Array.from(e.dataTransfer.files))
  }
}

const addFiles = (files: File[]) => {
  // 过滤出图像文件
  const imageFiles = files.filter(file => file.type.startsWith('image/'))
  
  // 计算可以添加的图像数量
  const remainingSlots = props.maxImages - props.modelValue.length
  const filesToAdd = imageFiles.slice(0, remainingSlots)
  
  if (filesToAdd.length === 0) return
  
  // 创建新的图像对象
  const newImages = filesToAdd.map(file => ({
    id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    url: URL.createObjectURL(file),
    name: file.name
  }))
  
  // 更新状态
  if (props.maxImages === 1) {
    emit('update:modelValue', newImages)
  } else {
    emit('update:modelValue', [...props.modelValue, ...newImages])
  }
}

const removeImage = (id: string) => {
  emit('update:modelValue', props.modelValue.filter(image => image.id !== id))
}
</script>

<style scoped>
.image-uploader {
  width: 100%;
}

.preview-grid {
  display: grid;
  gap: 12px;
  margin-bottom: 12px;
}

.single-column {
  grid-template-columns: 1fr;
}

.multi-column {
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}

.image-card {
  position: relative;
  overflow: hidden;
  background-color: #1E293B;
  border-color: #334155;
}

.image-container {
  position: relative;
  aspect-ratio: 1/1;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.image-container:hover .image-overlay {
  opacity: 1;
}

.delete-button {
  position: absolute;
  top: 8px;
  right: 8px;
}

.image-info {
  padding: 8px;
  font-size: 12px;
  color: #94A3B8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.add-more-card {
  background-color: #1E293B;
  border: 1px dashed #334155;
  cursor: pointer;
  transition: all 0.3s;
}

.add-more-card:hover {
  background-color: #334155;
}

.add-more-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1/1;
  padding: 16px;
  text-align: center;
}

.add-icon {
  font-size: 24px;
  color: #94A3B8;
  margin-bottom: 8px;
}

.add-text {
  font-size: 14px;
  color: #94A3B8;
}

.count-text {
  font-size: 12px;
  color: #64748B;
  margin-top: 4px;
}

.upload-area {
  border: 2px dashed #334155;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  background-color: rgba(30, 41, 59, 0.3);
  transition: all 0.3s;
}

.upload-area:hover {
  background-color: rgba(30, 41, 59, 0.5);
}

.upload-area.is-dragging {
  border-color: var(--ep-color-primary);
  background-color: rgba(139, 92, 246, 0.1);
}

.upload-icon {
  font-size: 32px;
  color: #94A3B8;
  background-color: #334155;
  padding: 12px;
  border-radius: 50%;
  margin-bottom: 12px;
}

.primary-text {
  font-size: 14px;
  font-weight: 500;
  color: #E2E8F0;
  margin-bottom: 4px;
}

.secondary-text {
  font-size: 12px;
  color: #94A3B8;
}

.hidden-input {
  display: none;
}
</style>

