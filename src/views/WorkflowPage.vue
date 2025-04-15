<template>
  <div class="workflow-page">
    <!-- 顶部导航栏 -->
    <el-header class="page-header">
      <div class="header-container">
        <div class="logo-container">
          <router-link to="/" class="logo">
            <div class="logo-icon"></div>
            <span class="logo-text">畅绘</span>
          </router-link>
        </div>

        <div class="header-right">
          <!-- 订阅状态 -->
          <el-tooltip content="查看订阅详情" placement="bottom">
            <el-button class="subscription-button">
              <el-icon v-if="currentUser.subscription === 'premium'">
                <Crown class="icon-gold" />
              </el-icon>
              <el-icon v-else-if="currentUser.subscription === 'regular'">
                <Check class="icon-blue" />
              </el-icon>
              <el-icon v-else>
                <InfoFilled class="icon-gray" />
              </el-icon>
              {{ subscriptionText }}
            </el-button>
          </el-tooltip>

          <!-- 用户钱包 -->
          <el-tooltip content="查看钱包详情" placement="bottom">
            <el-button class="wallet-button" @click="showWalletDetails = true">
              <el-icon><Wallet class="icon-purple" /></el-icon>
              {{ formatCurrency(currentUser.wallet.balance) }}
            </el-button>
          </el-tooltip>

          <!-- 通知按钮 -->
          <el-tooltip :content="`您有 ${currentUser.notifications} 条未读通知`" placement="bottom">
            <el-badge :value="currentUser.notifications" :hidden="currentUser.notifications === 0" class="notification-badge">
              <el-button circle class="icon-button">
                <el-icon><Bell /></el-icon>
              </el-button>
            </el-badge>
          </el-tooltip>

          <!-- 用户菜单 -->
          <el-dropdown trigger="click">
            <el-avatar :size="32" :src="currentUser.avatar" class="user-avatar" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>
                  <div class="user-info">
                    <div class="user-name">{{ currentUser.name }}</div>
                    <div class="user-email">{{ currentUser.email }}</div>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item divided>个人资料</el-dropdown-item>
                <el-dropdown-item>我的工作流</el-dropdown-item>
                <el-dropdown-item>账户设置</el-dropdown-item>
                <el-dropdown-item divided>
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <!-- 钱包详情弹出层 -->
    <el-dialog
      v-model="showWalletDetails"
      title="钱包详情"
      width="400px"
      class="wallet-dialog"
      destroy-on-close
    >
      <div class="wallet-balance">
        <span class="balance-label">人民币余额</span>
        <span class="balance-amount">{{ formatCurrency(currentUser.wallet.balance) }}</span>
      </div>

      <div class="wallet-transactions">
        <h4 class="transactions-title">最近交易</h4>
        <div class="transactions-list">
          <div
            v-for="transaction in currentUser.wallet.history"
            :key="transaction.id"
            class="transaction-item"
          >
            <div class="transaction-info">
              <div class="transaction-desc">{{ transaction.description }}</div>
              <div class="transaction-date">{{ formatDate(transaction.date) }}</div>
            </div>
            <div
              class="transaction-amount"
              :class="transaction.amount > 0 ? 'amount-positive' : 'amount-negative'"
            >
              {{ transaction.amount > 0 ? '+' : '' }}{{ formatCurrency(transaction.amount) }}
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button type="primary" @click="showWalletDetails = false">
          <el-icon><CreditCard /></el-icon>充值
        </el-button>
      </template>
    </el-dialog>

    <!-- 页面内容 -->
    <div class="page-content">
      <!-- 工作流标题和返回按钮 -->
      <div class="workflow-header">
        <div class="workflow-title-container">
          <el-button
            @click="$router.push('/')"
            class="back-button"
          >
            <el-icon><ArrowLeft /></el-icon>
            返回空间
          </el-button>
          <div class="workflow-info">
            <h1 class="workflow-title">{{ workflow.name }}</h1>
            <p class="workflow-description">{{ workflow.description }}</p>
          </div>
        </div>
        <div v-if="workflow.cost > 0" class="workflow-cost">
          <span class="cost-label">单次使用费用:</span>
          <span class="cost-value">{{ formatCurrency(workflow.cost) }}</span>
        </div>
      </div>

      <workflow-executor :workflow-id="workflowId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeft,
  Bell,
  Check,
  CreditCard,
  Crown,
  InfoFilled,
  SwitchButton,
  Wallet
} from '@element-plus/icons-vue'
import WorkflowExecutor from '../components/WorkflowExecutor.vue'
import { workflowsData } from '../data/workflows'

const route = useRoute()
const workflowId = computed(() => route.params.id as string)
const showWalletDetails = ref(false)

// 当前用户数据
const currentUser = ref({
  id: "user-current",
  name: "无心飞翔",
  email: "wuxinfeixiang@example.com",
  avatar: "/placeholder.svg?height=100&width=100&text=📷&bgcolor=8B5CF6&textcolor=FFFFFF",
  role: "会员",
  subscription: "regular" as "free" | "regular" | "premium", // 当前用户的订阅类型
  wallet: {
    balance: 2500,
    currency: "¥",
    history: [
      { id: "tx1", amount: -100, description: "使用Stable Diffusion XL", date: "2024-03-25T10:30:00Z" },
      { id: "tx2", amount: 500, description: "每月充值", date: "2024-03-20T08:15:00Z" },
      { id: "tx3", amount: -50, description: "使用文本生成", date: "2024-03-18T14:45:00Z" },
      { id: "tx4", amount: -198, description: "普通会员月费", date: "2024-03-01T00:00:00Z" },
    ],
  },
  notifications: 3,
  memberSince: "2023-11-10T00:00:00Z",
})

// 获取当前工作流数据
const workflow = computed(() => {
  return workflowsData[workflowId.value as keyof typeof workflowsData] || {
    id: workflowId.value,
    name: "未知工作流",
    description: "无法找到此工作流的详细信息",
    imageUrl: "/placeholder.svg?height=300&width=400",
    cost: 0,
    accessType: "free",
  }
})

// 订阅文本
const subscriptionText = computed(() => {
  switch (currentUser.value.subscription) {
    case 'premium':
      return '高级会员'
    case 'regular':
      return '普通会员'
    default:
      return '免费会员'
  }
})

// 格式化金额
const formatCurrency = (amount: number, currency = "¥") => {
  return `${currency}${amount.toLocaleString()}`
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// 页面加载时自动滚动到顶部
onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
.workflow-page {
  min-height: 100vh;
  background-color: #0F172A;
  color: #E2E8F0;
}

.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #334155;
  height: 64px;
  display: flex;
  align-items: center;
}

.header-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #F8FAFC;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #8B5CF6, #6366F1);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  margin-right: 8px;
}

.logo-icon::before {
  content: '';
  position: absolute;
  width: 24px;
  height: 24px;
  border-top: 2px solid white;
  border-right: 2px solid white;
  border-top-right-radius: 100%;
  transform: rotate(45deg);
  top: 0;
  left: 0;
}

.logo-icon::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: white;
  border-radius: 50%;
  bottom: 4px;
  left: 4px;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.subscription-button,
.wallet-button {
  background-color: #1E293B;
  border-color: #334155;
  color: #E2E8F0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
}

.icon-gold {
  color: #F59E0B;
}

.icon-blue {
  color: #3B82F6;
}

.icon-gray {
  color: #94A3B8;
}

.icon-purple {
  color: #8B5CF6;
}

.icon-button {
  background-color: #1E293B;
  border-color: #334155;
  color: #E2E8F0;
}

.notification-badge :deep(.el-badge__content) {
  background-color: #EF4444;
  border: none;
}

.user-avatar {
  border: 2px solid #334155;
  cursor: pointer;
}

.user-info {
  padding: 4px 0;
}

.user-name {
  font-weight: 500;
  font-size: 14px;
}

.user-email {
  font-size: 12px;
  color: #94A3B8;
}

.wallet-dialog :deep(.el-dialog__header) {
  border-bottom: 1px solid #334155;
  padding-bottom: 16px;
}

.wallet-balance {
  background-color: #1E293B;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.balance-label {
  color: #94A3B8;
}

.balance-amount {
  font-size: 24px;
  font-weight: bold;
}

.transactions-title {
  font-size: 14px;
  color: #94A3B8;
  margin-bottom: 8px;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-radius: 4px;
}

.transaction-item:hover {
  background-color: #1E293B;
}

.transaction-desc {
  font-size: 14px;
}

.transaction-date {
  font-size: 12px;
  color: #64748B;
}

.amount-positive {
  color: #22C55E;
}

.amount-negative {
  color: #EF4444;
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

.workflow-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

@media (min-width: 768px) {
  .workflow-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.workflow-title-container {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.back-button {
  background-color: #1E293B;
  border-color: #334155;
  color: #E2E8F0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.workflow-info {
  display: flex;
  flex-direction: column;
}

.workflow-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 4px 0;
}

.workflow-description {
  font-size: 14px;
  color: #94A3B8;
  margin: 0;
}

.workflow-cost {
  background-color: #1E293B;
  border: 1px solid #334155;
  border-radius: 6px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cost-label {
  font-size: 14px;
  color: #94A3B8;
}

.cost-value {
  font-size: 16px;
  font-weight: 500;
  color: #8B5CF6;
}
</style>

