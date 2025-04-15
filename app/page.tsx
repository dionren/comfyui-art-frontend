"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Clock,
  Search,
  Plus,
  Star,
  StarOff,
  Users,
  Layers,
  Settings,
  ArrowRight,
  Play,
  Camera,
  Eye,
  Wallet,
  Bell,
  LogOut,
  CreditCard,
  Crown,
  Check,
  Lock,
  Sparkles,
  Info,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// 订阅类型
type SubscriptionType = "free" | "regular" | "premium"
type AccessType = "free" | "regular" | "premium" | "pay-per-use"

// 当前用户数据
const currentUser = {
  id: "user-current",
  name: "无心飞翔",
  email: "wuxinfeixiang@example.com",
  avatar: "/placeholder.svg?height=100&width=100&text=&bgcolor=8B5CF6&textcolor=FFFFFF",
  role: "会员",
  subscription: "regular" as SubscriptionType, // 当前用户的订阅类型
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
}

// 订阅计划
const subscriptionPlans = [
  {
    id: "free",
    name: "免费会员",
    price: 0,
    description: "基础功能，体验AI创作",
    features: ["访问基础工作流", "每日有限使用次数", "标准分辨率输出", "社区支持"],
    recommended: false,
    buttonText: "当前方案",
  },
  {
    id: "regular",
    name: "普通会员",
    price: 198,
    description: "更多功能，提升创作效率",
    features: ["访问大部分工作流", "优先处理队列", "高分辨率输出", "保存历史记录", "技术支持"],
    recommended: true,
    buttonText: "升级",
  },
  {
    id: "premium",
    name: "高级会员",
    price: 398,
    description: "全部功能，无限创作可能",
    features: ["访问全部工作流", "最高优先级处理", "超高分辨率输出", "批量处理能力", "专属客户经理", "API访问权限"],
    recommended: false,
    buttonText: "升级",
  },
]

// 更新工作空间数据
const workspaceData = {
  id: "ws-ai-generation",
  name: "高级摄影AIGC工具集",
  description: "我们编写优化了大量的摄影专用工作流，帮助摄影师最高效率的满足客户需求。",
  members: 8,
  createdAt: "2023-05-15T10:30:00Z",
  updatedAt: "2024-03-20T14:45:00Z",
  backgroundImage:
    "/placeholder.svg?height=400&width=1200&text=AI+生成工作室&fontsize=32&textcolor=white&bgcolor=4F46E5",
  author: {
    id: "user-1",
    name: "赵老师",
    avatar: "/placeholder.svg?height=40&width=40&text=📷&fontsize=16",
  },
  visits: 1258,
}

// 更新工作流应用数据中的单次使用费用
const workflowApps = [
  {
    id: "stable-diffusion-xl",
    name: "Stable Diffusion XL",
    description: "高质量图像生成工作流，基于Stable Diffusion XL模型",
    category: "图像生成",
    thumbnail: "/placeholder.svg?height=200&width=300&text=SDXL&bgcolor=3B82F6",
    featured: true,
    popular: true,
    lastUsed: "2024-03-25T08:30:00Z",
    cost: 0.2,
    accessType: "pay-per-use" as AccessType,
    stats: {
      runs: 256,
      favorites: 42,
      createdAt: "2023-08-10T00:00:00Z",
    },
  },
  {
    id: "midjourney-style",
    name: "MidJourney 风格生成",
    description: "模拟MidJourney风格的图像生成工作流",
    category: "图像生成",
    thumbnail: "/placeholder.svg?height=200&width=300&text=MJ&bgcolor=8B5CF6",
    featured: false,
    popular: true,
    lastUsed: "2024-03-24T15:45:00Z",
    cost: 0.2,
    accessType: "regular" as AccessType,
    stats: {
      runs: 189,
      favorites: 37,
      createdAt: "2023-09-05T00:00:00Z",
    },
  },
  {
    id: "text-to-video",
    name: "文本转视频",
    description: "根据文本描述生成短视频片段",
    category: "视频生成",
    thumbnail: "/placeholder.svg?height=200&width=300&text=T2V&bgcolor=EC4899",
    featured: true,
    popular: false,
    lastUsed: "2024-03-22T11:20:00Z",
    cost: 0.5,
    accessType: "premium" as AccessType,
    stats: {
      runs: 78,
      favorites: 15,
      createdAt: "2023-11-18T00:00:00Z",
    },
  },
  {
    id: "image-upscaling",
    name: "图像超分辨率",
    description: "提升图像分辨率和质量的工作流",
    category: "图像处理",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Upscale&bgcolor=10B981",
    featured: false,
    popular: false,
    lastUsed: "2024-03-20T09:15:00Z",
    cost: 0.1,
    accessType: "free" as AccessType,
    stats: {
      runs: 145,
      favorites: 28,
      createdAt: "2023-10-02T00:00:00Z",
    },
  },
  {
    id: "style-transfer",
    name: "风格迁移",
    description: "将一种艺术风格应用到图像上的工作流",
    category: "图像处理",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Style&bgcolor=F59E0B",
    featured: false,
    popular: true,
    lastUsed: "2024-03-23T16:40:00Z",
    cost: 0.2,
    accessType: "pay-per-use" as AccessType,
    stats: {
      runs: 203,
      favorites: 51,
      createdAt: "2023-07-25T00:00:00Z",
    },
  },
  {
    id: "text-generation",
    name: "文本生成",
    description: "基于提示生成创意文本内容",
    category: "文本生成",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Text&bgcolor=EF4444",
    featured: false,
    popular: false,
    lastUsed: "2024-03-21T14:10:00Z",
    cost: 0.1,
    accessType: "free" as AccessType,
    stats: {
      runs: 112,
      favorites: 19,
      createdAt: "2023-12-05T00:00:00Z",
    },
  },
  // 添加更多工作流以展示不同的访问级别
  {
    id: "3d-model-generation",
    name: "3D模型生成",
    description: "从文本描述生成3D模型，支持多种格式导出",
    category: "3D创作",
    thumbnail: "/placeholder.svg?height=200&width=300&text=3D&bgcolor=6366F1",
    featured: true,
    popular: true,
    lastUsed: "2024-03-18T12:30:00Z",
    cost: 0.5,
    accessType: "premium" as AccessType,
    stats: {
      runs: 87,
      favorites: 32,
      createdAt: "2023-12-15T00:00:00Z",
    },
  },
  {
    id: "image-to-image",
    name: "图像变换",
    description: "基于参考图像生成新的变体或修改",
    category: "图像生成",
    thumbnail: "/placeholder.svg?height=200&width=300&text=I2I&bgcolor=0EA5E9",
    featured: false,
    popular: true,
    lastUsed: "2024-03-19T10:15:00Z",
    cost: 0.2,
    accessType: "regular" as AccessType,
    stats: {
      runs: 176,
      favorites: 41,
      createdAt: "2023-10-20T00:00:00Z",
    },
  },
  {
    id: "audio-generation",
    name: "AI音频生成",
    description: "生成音乐、音效和语音内容",
    category: "音频创作",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Audio&bgcolor=8B5CF6",
    featured: true,
    popular: false,
    lastUsed: "2024-03-15T14:20:00Z",
    cost: 0.3,
    accessType: "premium" as AccessType,
    stats: {
      runs: 64,
      favorites: 28,
      createdAt: "2024-01-10T00:00:00Z",
    },
  },
  {
    id: "background-removal",
    name: "背景移除",
    description: "自动移除图像背景，支持批量处理",
    category: "图像处理",
    thumbnail: "/placeholder.svg?height=200&width=300&text=BG&bgcolor=22C55E",
    featured: false,
    popular: true,
    lastUsed: "2024-03-22T09:45:00Z",
    cost: 0.1,
    accessType: "free" as AccessType,
    stats: {
      runs: 312,
      favorites: 67,
      createdAt: "2023-09-12T00:00:00Z",
    },
  },
  {
    id: "character-design",
    name: "角色设计",
    description: "创建独特的角色形象，适用于游戏和动画",
    category: "角色创作",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Character&bgcolor=EC4899",
    featured: true,
    popular: true,
    lastUsed: "2024-03-20T16:30:00Z",
    cost: 0.3,
    accessType: "pay-per-use" as AccessType,
    stats: {
      runs: 143,
      favorites: 56,
      createdAt: "2023-11-05T00:00:00Z",
    },
  },
  {
    id: "code-generation",
    name: "代码生成",
    description: "根据描述生成代码片段和完整程序",
    category: "开发工具",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Code&bgcolor=3B82F6",
    featured: false,
    popular: false,
    lastUsed: "2024-03-17T11:20:00Z",
    cost: 0.1,
    accessType: "regular" as AccessType,
    stats: {
      runs: 98,
      favorites: 24,
      createdAt: "2024-01-25T00:00:00Z",
    },
  },
]

// 创建一个深色渐变背景的组件
function DarkGradientBackground() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-950 to-indigo-950">
      {/* 添加更多视觉元素 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 波浪形状 */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full opacity-10"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#8B5CF6"
            fillOpacity="1"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
        <svg
          className="absolute bottom-0 left-0 right-0 w-full opacity-10"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: "translateY(20px)" }}
        >
          <path
            fill="#6366F1"
            fillOpacity="1"
            d="M0,128L48,144C96,160,192,192,288,197.3C384,203,480,181,576,154.7C672,128,768,96,864,101.3C960,107,1056,149,1152,165.3C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>

        {/* 粒子效果 */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-purple-300 rounded-full animate-pulse"></div>
          <div
            className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-indigo-300 rounded-full animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-blue-300 rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/4 w-2 h-2 bg-purple-300 rounded-full animate-pulse"
            style={{ animationDelay: "1.5s" }}
          ></div>
          <div
            className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-indigo-300 rounded-full animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* 光晕效果 */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl"></div>
      </div>

      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]"></div>

      {/* 装饰性元素 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20"></div>
    </div>
  )
}

// 格式化金额
function formatCurrency(amount: number, currency = "¥") {
  return `${currency}${amount.toLocaleString()}`
}

// 格式化日期
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// 格式化数字（添加千位分隔符）
function formatNumber(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// 畅绘Logo组件
function ChangHuiLogo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="absolute w-6 h-6 border-t-2 border-r-2 border-white rounded-tr-full transform rotate-45"></div>
        <div className="absolute w-3 h-3 bg-white rounded-full bottom-1 left-1"></div>
      </div>
      <span className="font-bold text-xl text-white">畅绘</span>
    </div>
  )
}

// 访问类型徽章组件
function AccessTypeBadge({ type, className }: { type: AccessType; className?: string }) {
  switch (type) {
    case "free":
      return (
        <Badge variant="outline" className={`bg-green-900/30 border-green-700 text-green-400 ${className}`}>
          <Check className="h-3 w-3 mr-1" />
          免费使用
        </Badge>
      )
    case "regular":
      return (
        <Badge variant="outline" className={`bg-blue-900/30 border-blue-700 text-blue-400 ${className}`}>
          <Check className="h-3 w-3 mr-1" />
          普通会员
        </Badge>
      )
    case "premium":
      return (
        <Badge variant="outline" className={`bg-amber-900/30 border-amber-700 text-amber-400 ${className}`}>
          <Crown className="h-3 w-3 mr-1" />
          高级会员
        </Badge>
      )
    case "pay-per-use":
      return (
        <Badge variant="outline" className={`bg-purple-900/30 border-purple-700 text-purple-400 ${className}`}>
          <CreditCard className="h-3 w-3 mr-1" />
          单次付费
        </Badge>
      )
    default:
      return null
  }
}

// 检查用户是否可以访问特定工作流
function canUserAccess(userSubscription: SubscriptionType, appAccessType: AccessType): boolean {
  if (appAccessType === "free") return true
  if (appAccessType === "pay-per-use") return true // 假设用户可以支付
  if (userSubscription === "premium") return true
  if (userSubscription === "regular" && appAccessType === "regular") return true
  return false
}

export default function WorkspaceHome() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [favorites, setFavorites] = useState<string[]>(["stable-diffusion-xl", "style-transfer"])
  const [showWalletDetails, setShowWalletDetails] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)

  // 计算总使用次数
  const totalUsageCount = workflowApps.reduce((total, app) => total + app.stats.runs, 0)

  // 过滤工作流应用
  const filteredApps = workflowApps.filter((app) => {
    // 搜索过滤
    if (
      searchQuery &&
      !app.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !app.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !app.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // 标签过滤
    if (activeTab === "favorites" && !favorites.includes(app.id)) {
      return false
    }
    if (activeTab === "featured" && !app.featured) {
      return false
    }
    if (activeTab === "popular" && !app.popular) {
      return false
    }
    if (activeTab === "free" && app.accessType !== "free") {
      return false
    }
    if (activeTab === "premium" && app.accessType !== "premium") {
      return false
    }
    if (activeTab === "pay-per-use" && app.accessType !== "pay-per-use") {
      return false
    }

    return true
  })

  // 切换收藏状态
  const toggleFavorite = (appId: string) => {
    setFavorites((prev) => (prev.includes(appId) ? prev.filter((id) => id !== appId) : [...prev, appId]))
  }

  return (
    <div className="min-h-screen pb-8 dark bg-gray-950 text-gray-200">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              <ChangHuiLogo />
            </Link>
          </div>

          <div className="flex-1"></div>

          {/* 订阅状态 */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2 bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                  onClick={() => setShowSubscriptionModal(true)}
                >
                  {currentUser.subscription === "premium" ? (
                    <Crown className="h-4 w-4 mr-2 text-amber-400" />
                  ) : currentUser.subscription === "regular" ? (
                    <Check className="h-4 w-4 mr-2 text-blue-400" />
                  ) : (
                    <Info className="h-4 w-4 mr-2 text-gray-400" />
                  )}
                  {currentUser.subscription === "premium"
                    ? "高级会员"
                    : currentUser.subscription === "regular"
                      ? "普通会员"
                      : "免费会员"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>查看订阅详情</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* 用户钱包 */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2 bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                  onClick={() => setShowWalletDetails(!showWalletDetails)}
                >
                  <Wallet className="h-4 w-4 mr-2 text-purple-400" />
                  {formatCurrency(currentUser.wallet.balance)}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>查看钱包详情</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* 通知按钮 */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative mr-2 bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                >
                  <Bell className="h-4 w-4" />
                  {currentUser.notifications > 0 && (
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 transform translate-x-1 -translate-y-1"></span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>您有 {currentUser.notifications} 条未读通知</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* 用户菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-gray-800 border border-gray-700">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="bg-indigo-600 text-white">{currentUser.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-1 bg-gray-900 border-gray-800" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-gray-200">{currentUser.name}</p>
                  <p className="text-xs leading-none text-gray-400">{currentUser.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-gray-100">
                个人资料
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-gray-100">
                我的工作流
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-gray-100">
                账户设置
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-gray-100">
                <LogOut className="mr-2 h-4 w-4" />
                <span>退出登录</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* 订阅计划弹出层 */}
      {showSubscriptionModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          onClick={() => setShowSubscriptionModal(false)}
        >
          <div
            className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl w-full max-w-4xl p-6 overflow-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">会员订阅计划</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                onClick={() => setShowSubscriptionModal(false)}
              >
                ✕
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`bg-gray-800 rounded-lg p-6 border ${
                    plan.recommended ? "border-purple-500 shadow-lg shadow-purple-500/20" : "border-gray-700"
                  } relative`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      推荐方案
                    </div>
                  )}
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold text-white mb-1">{plan.name}</h4>
                    <div className="flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">{formatCurrency(plan.price)}</span>
                      <span className="text-gray-400 ml-1">/月</span>
                    </div>
                    <p className="text-gray-400 mt-2">{plan.description}</p>
                  </div>
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className={`w-full ${
                      plan.id === currentUser.subscription
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        : plan.id === "premium"
                          ? "bg-amber-600 hover:bg-amber-700 text-white"
                          : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                    disabled={plan.id === currentUser.subscription}
                  >
                    {plan.id === currentUser.subscription ? "当前方案" : `升级至${plan.name}`}
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-lg font-medium text-white mb-2">订阅说明</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>所有订阅均为按月计费，可随时取消</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>单次付费功能可使用钱包余额支付，不受订阅限制</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>高级会员可使用所有功能，包括普通会员专属功能</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>订阅计划只适用于当前创作者空间，不适用畅绘平台的其他创作者空间</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>如有任何问题，请联系客服获取帮助</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 钱包详情弹出层 */}
      {showWalletDetails && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          onClick={() => setShowWalletDetails(false)}
        >
          <div
            className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">钱包详情</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                onClick={() => setShowWalletDetails(false)}
              >
                ✕
              </Button>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">人民币余额</span>
                <span className="text-2xl font-bold text-white">{formatCurrency(currentUser.wallet.balance)}</span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">最近交易</h4>
              <div className="space-y-2">
                {currentUser.wallet.history.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex justify-between items-center p-2 rounded-md hover:bg-gray-800"
                  >
                    <div>
                      <p className="text-sm text-gray-300">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`font-medium ${transaction.amount > 0 ? "text-green-400" : "text-red-400"}`}>
                      {transaction.amount > 0 ? "+" : ""}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <CreditCard className="mr-2 h-4 w-4" />
                充值
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 工作空间背景图片和信息 */}
      <div className="relative">
        {/* 背景图片 - 使用渐变背景代替 */}
        <div className="relative h-64 w-full overflow-hidden">
          {/* 使用深色渐变背景 */}
          <DarkGradientBackground />

          {/* 更换背景图片按钮 */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4 bg-gray-800/80 text-gray-200 backdrop-blur-sm hover:bg-gray-700/80"
          >
            <Camera className="h-4 w-4 mr-2" />
            更换背景
          </Button>

          {/* 工作空间信息 - 放在背景图片上 */}
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8">
            <div className="flex flex-col">
              <div className="flex items-center mb-3">
                <h1 className="text-3xl font-bold text-white drop-shadow-md">{workspaceData.name}</h1>
                <div className="ml-4 flex items-center bg-gray-800/70 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={workspaceData.author.avatar} alt={workspaceData.author.name} />
                    <AvatarFallback className="bg-gray-700 text-gray-200">
                      {workspaceData.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-200">{workspaceData.author.name}</span>
                </div>
              </div>
              <p className="text-gray-300/90 drop-shadow-md max-w-2xl">{workspaceData.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="container mx-auto px-4">
        {/* 工作空间统计信息 */}
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 -mt-6 mb-8 border border-gray-800/50 shadow-xl">
          <div className="flex flex-wrap items-center gap-4">
            <Badge
              variant="outline"
              className="text-sm py-1.5 bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-800"
            >
              <Users className="h-4 w-4 mr-1.5 text-purple-400" />
              {workspaceData.members} 会员
            </Badge>
            <Badge
              variant="outline"
              className="text-sm py-1.5 bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-800"
            >
              <Layers className="h-4 w-4 mr-1.5 text-indigo-400" />
              {workflowApps.length} 工作流
            </Badge>
            <Badge
              variant="outline"
              className="text-sm py-1.5 bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-800"
            >
              <Play className="h-4 w-4 mr-1.5 text-blue-400" />
              {totalUsageCount} 使用量
            </Badge>
            <Badge
              variant="outline"
              className="text-sm py-1.5 bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-800"
            >
              <Eye className="h-4 w-4 mr-1.5 text-teal-400" />
              {formatNumber(workspaceData.visits)} 访问量
            </Badge>
            <Badge
              variant="outline"
              className="text-sm py-1.5 bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-800"
            >
              <Clock className="h-4 w-4 mr-1.5 text-amber-400" />
              更新于 {formatDate(workspaceData.updatedAt)}
            </Badge>
            <div className="ml-auto">
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700 hover:text-white"
              >
                <Settings className="h-4 w-4 mr-2" />
                空间设置
              </Button>
            </div>
          </div>
        </div>

        {/* 订阅计划卡片 */}
        <div className="mb-8 bg-gradient-to-r from-gray-900 via-purple-900/30 to-gray-900 rounded-xl overflow-hidden border border-gray-800/50 shadow-xl">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-2 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
                  升级您的创作体验
                </h2>
                <p className="text-gray-300 max-w-2xl">
                  解锁更多高级功能，提升创作效率。选择适合您的订阅计划，享受更多专属特权。
                </p>
              </div>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => setShowSubscriptionModal(true)}
              >
                查看订阅计划
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 flex items-center">
                <div className="rounded-full bg-green-900/30 p-2 mr-3">
                  <Check className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">免费会员</h3>
                  <p className="text-xs text-gray-400">基础功能，体验AI创作</p>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-blue-700/30 flex items-center">
                <div className="rounded-full bg-blue-900/30 p-2 mr-3">
                  <Check className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">普通会员</h3>
                  <p className="text-xs text-gray-400">更多功能，提升创作效率</p>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-amber-700/30 flex items-center">
                <div className="rounded-full bg-amber-900/30 p-2 mr-3">
                  <Crown className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">高级会员</h3>
                  <p className="text-xs text-gray-400">全部功能，无限创作可能</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 搜索和过滤 */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="搜索工作流..."
              className="pl-8 bg-gray-900 border-gray-800 text-gray-300 placeholder:text-gray-500 focus-visible:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="border-b-0">
            <TabsList className="bg-gray-900 border border-gray-800">
              <TabsTrigger value="all" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                全部
              </TabsTrigger>
              <TabsTrigger
                value="favorites"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                收藏
              </TabsTrigger>
              <TabsTrigger value="free" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                免费
              </TabsTrigger>
              <TabsTrigger value="premium" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                高级
              </TabsTrigger>
              <TabsTrigger
                value="pay-per-use"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                单次付费
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* 工作流应用列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => {
            const userCanAccess = canUserAccess(currentUser.subscription, app.accessType)

            return (
              <Card
                key={app.id}
                className={`overflow-hidden group bg-gray-900 border-gray-800 shadow-md hover:shadow-lg transition-all duration-200 hover:border-gray-700 ${
                  !userCanAccess && app.accessType !== "pay-per-use" ? "opacity-80" : ""
                }`}
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={app.thumbnail || "/placeholder.svg"}
                    alt={app.name}
                    fill
                    className={`object-cover transition-transform group-hover:scale-105 ${
                      !userCanAccess && app.accessType !== "pay-per-use" ? "grayscale" : ""
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-40"></div>

                  {/* 收藏按钮 */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-gray-900/70 text-gray-300 backdrop-blur-sm hover:bg-gray-800/90 hover:text-white"
                    onClick={(e) => {
                      e.preventDefault()
                      toggleFavorite(app.id)
                    }}
                  >
                    {favorites.includes(app.id) ? (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
                  </Button>

                  {/* 访问类型徽章 */}
                  <div className="absolute top-2 left-2">
                    <AccessTypeBadge type={app.accessType} />
                  </div>

                  {/* 锁定图标 */}
                  {!userCanAccess && app.accessType !== "pay-per-use" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                      <div className="bg-gray-900/80 rounded-full p-3 border border-gray-700">
                        <Lock className="h-6 w-6 text-gray-300" />
                      </div>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-white">{app.name}</CardTitle>
                      <CardDescription className="text-gray-400">{app.category}</CardDescription>
                    </div>
                    {app.accessType === "pay-per-use" ? (
                      <Badge variant="outline" className="bg-gray-800 border-gray-700 text-purple-400">
                        {formatCurrency(app.cost)}/次
                      </Badge>
                    ) : app.accessType === "premium" ? (
                      <Badge variant="outline" className="bg-gray-800 border-amber-700/50 text-amber-400">
                        <Crown className="h-3 w-3 mr-1" />
                        高级专属
                      </Badge>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-400 line-clamp-2">{app.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between pt-2 border-t border-gray-800">
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="mr-3">{app.stats.runs} 次运行</span>
                    <span>创建于 {formatDate(app.stats.createdAt)}</span>
                  </div>
                  {!userCanAccess && app.accessType !== "pay-per-use" ? (
                    <Button
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                      onClick={() => setShowSubscriptionModal(true)}
                    >
                      升级会员
                    </Button>
                  ) : (
                    <Link href={`/workflow/${app.id}`}>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                        {app.accessType === "pay-per-use" ? `使用 (${formatCurrency(app.cost)})` : "使用"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            )
          })}

          {/* 添加新工作流卡片 */}
          <Card className="flex flex-col items-center justify-center h-full min-h-[300px] border-dashed border-gray-700 bg-gray-900/50 hover:bg-gray-900 transition-colors">
            <CardContent className="flex flex-col items-center justify-center text-center p-6">
              <div className="rounded-full bg-purple-500/10 p-3 mb-4">
                <Plus className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">创建新工作流</h3>
              <p className="text-sm text-gray-400 mb-4">从模板开始或从头创建新的工作流应用</p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                新建工作流
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 无结果提示 */}
        {filteredApps.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-900/50 rounded-xl mt-6 border border-gray-800">
            <div className="rounded-full bg-gray-800 p-3 mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white">未找到工作流</h3>
            <p className="text-sm text-gray-400 mt-1 mb-4">尝试使用不同的搜索词或筛选条件</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setActiveTab("all")
              }}
              className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
            >
              清除筛选
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

