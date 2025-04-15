"use client"

import { useState, useEffect } from "react"
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
  Sparkles,
  Edit,
  BarChart,
  Trash2,
  Copy,
  Share2,
  Download,
  MoreHorizontal,
  Pencil,
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

// 我的空间数据
const mySpaceData = {
  id: "my-personal-space",
  name: "我的个人创作空间",
  description: "我创建的个人AI创作空间，用于实验和开发各种创意项目。",
  category: "个人创作",
  members: 3,
  createdAt: "2024-02-10T00:00:00Z",
  updatedAt: "2024-03-29T08:45:00Z",
  backgroundImage:
    "/placeholder.svg?height=400&width=1200&text=我的创作空间&fontsize=32&textcolor=white&bgcolor=8B5CF6",
  author: {
    id: "user-current",
    name: "无心飞翔",
    avatar: "/placeholder.svg?height=40&width=40&text=🎨&fontsize=16",
  },
  visits: 421,
  isPublic: true,
  allowJoin: true,
  membershipFee: {
    regular: 98,
    premium: 298,
  },
  stats: {
    totalRuns: 156,
    totalRevenue: 1280,
    activeMembers: 3,
  },
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
      runs: 56,
      favorites: 2,
      createdAt: "2024-02-15T00:00:00Z",
    },
    isPublished: true,
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
      runs: 42,
      favorites: 3,
      createdAt: "2024-02-20T00:00:00Z",
    },
    isPublished: true,
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
      runs: 18,
      favorites: 1,
      createdAt: "2024-03-01T00:00:00Z",
    },
    isPublished: true,
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
      runs: 25,
      favorites: 0,
      createdAt: "2024-02-25T00:00:00Z",
    },
    isPublished: true,
  },
  {
    id: "style-transfer-draft",
    name: "风格迁移（草稿）",
    description: "将一种艺术风格应用到图像上的工作流 - 开发中",
    category: "图像处理",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Style+Draft&bgcolor=F59E0B",
    featured: false,
    popular: false,
    lastUsed: "2024-03-23T16:40:00Z",
    cost: 0.2,
    accessType: "pay-per-use" as AccessType,
    stats: {
      runs: 8,
      favorites: 0,
      createdAt: "2024-03-15T00:00:00Z",
    },
    isPublished: false,
  },
  {
    id: "text-generation-draft",
    name: "文本生成（测试版）",
    description: "基于提示生成创意文本内容 - 测试中",
    category: "文本生成",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Text+Beta&bgcolor=EF4444",
    featured: false,
    popular: false,
    lastUsed: "2024-03-21T14:10:00Z",
    cost: 0.1,
    accessType: "free" as AccessType,
    stats: {
      runs: 7,
      favorites: 0,
      createdAt: "2024-03-18T00:00:00Z",
    },
    isPublished: false,
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

export default function MySpacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [favorites, setFavorites] = useState<string[]>(["stable-diffusion-xl"])
  const [showWalletDetails, setShowWalletDetails] = useState(false)
  const [showSpaceSettings, setShowSpaceSettings] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [showStats, setShowStats] = useState(false)

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
    if (activeTab === "published" && !app.isPublished) {
      return false
    }
    if (activeTab === "drafts" && app.isPublished) {
      return false
    }

    return true
  })

  // 切换收藏状态
  const toggleFavorite = (appId: string) => {
    setFavorites((prev) => (prev.includes(appId) ? prev.filter((id) => id !== appId) : [...prev, appId]))
  }

  // 页面加载时自动滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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

          {/* 编辑模式切换 */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={editMode ? "default" : "outline"}
                  size="sm"
                  className={`mr-2 ${
                    editMode
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                  }`}
                  onClick={() => setEditMode(!editMode)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  {editMode ? "退出编辑" : "编辑空间"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{editMode ? "退出编辑模式" : "进入编辑模式"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* 统计数据 */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2 bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                  onClick={() => setShowStats(!showStats)}
                >
                  <BarChart className="h-4 w-4 mr-2 text-blue-400" />
                  统计数据
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>查看空间统计数据</p>
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
                  <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
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
                <Link href="/settings/profile" className="flex w-full">
                  个人资料
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-gray-100">
                <Link href="/my-spaces" className="flex w-full">
                  我加入的空间
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-gray-100">
                <Link href="/settings/account" className="flex w-full">
                  账户设置
                </Link>
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

      {/* 统计数据弹出层 */}
      {showStats && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          onClick={() => setShowStats(false)}
        >
          <div
            className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">空间统计数据</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                onClick={() => setShowStats(false)}
              >
                ✕
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-300">总运行次数</h4>
                  <BarChart className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-white">{formatNumber(mySpaceData.stats.totalRuns)}</p>
                <p className="text-xs text-gray-400 mt-1">所有工作流的累计运行次数</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-300">总收入</h4>
                  <Wallet className="h-5 w-5 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-white">{formatCurrency(mySpaceData.stats.totalRevenue)}</p>
                <p className="text-xs text-gray-400 mt-1">来自会员订阅和单次付费的收入</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-300">活跃会员</h4>
                  <Users className="h-5 w-5 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-white">{mySpaceData.stats.activeMembers}</p>
                <p className="text-xs text-gray-400 mt-1">过去30天内活跃的会员数量</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-gray-300 mb-3">工作流使用情况</h4>
              <div className="space-y-3">
                {workflowApps.map((app) => (
                  <div key={app.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center mr-2 overflow-hidden">
                        <Image
                          src={app.thumbnail || "/placeholder.svg"}
                          alt={app.name}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm text-gray-300">{app.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-300 mr-2">{app.stats.runs}</span>
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, (app.stats.runs / Math.max(...workflowApps.map((a) => a.stats.runs))) * 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700 mr-2">
                <Download className="mr-2 h-4 w-4" />
                导出数据
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <BarChart className="mr-2 h-4 w-4" />
                查看详细分析
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 空间设置弹出层 */}
      {showSpaceSettings && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          onClick={() => setShowSpaceSettings(false)}
        >
          <div
            className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 overflow-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">空间设置</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                onClick={() => setShowSpaceSettings(false)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium text-white mb-3">基本信息</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">空间名称</label>
                    <Input defaultValue={mySpaceData.name} className="bg-gray-800 border-gray-700 text-gray-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">空间描述</label>
                    <textarea
                      defaultValue={mySpaceData.description}
                      rows={3}
                      className="w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">分类</label>
                    <Input defaultValue={mySpaceData.category} className="bg-gray-800 border-gray-700 text-gray-200" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-white mb-3">访问设置</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-300">公开空间</p>
                      <p className="text-xs text-gray-500">允许其他用户发现并加入您的空间</p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700">
                      <span
                        className={`absolute ${
                          mySpaceData.isPublic ? "translate-x-6 bg-purple-500" : "translate-x-1 bg-gray-500"
                        } inline-block h-4 w-4 transform rounded-full transition`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-300">允许加入</p>
                      <p className="text-xs text-gray-500">允许新用户加入您的空间</p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700">
                      <span
                        className={`absolute ${
                          mySpaceData.allowJoin ? "translate-x-6 bg-purple-500" : "translate-x-1 bg-gray-500"
                        } inline-block h-4 w-4 transform rounded-full transition`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-white mb-3">订阅计划</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">普通会员价格 (¥/月)</label>
                    <Input
                      type="number"
                      defaultValue={mySpaceData.membershipFee.regular}
                      className="bg-gray-800 border-gray-700 text-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">高级会员价格 (¥/月)</label>
                    <Input
                      type="number"
                      defaultValue={mySpaceData.membershipFee.premium}
                      className="bg-gray-800 border-gray-700 text-gray-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-gray-800">
              <Button
                variant="outline"
                className="mr-2 bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                onClick={() => setShowSpaceSettings(false)}
              >
                取消
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">保存设置</Button>
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
                <h1 className="text-3xl font-bold text-white drop-shadow-md">
                  {editMode ? (
                    <Input
                      defaultValue={mySpaceData.name}
                      className="bg-transparent border-gray-500 text-white text-3xl font-bold h-auto py-0 focus-visible:ring-purple-500"
                    />
                  ) : (
                    mySpaceData.name
                  )}
                </h1>
                <Badge
                  variant="outline"
                  className="ml-4 bg-purple-900/70 backdrop-blur-sm border-purple-700 text-purple-300"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  我的空间
                </Badge>
              </div>
              {editMode ? (
                <textarea
                  defaultValue={mySpaceData.description}
                  className="bg-transparent border border-gray-500 rounded-md text-gray-300/90 drop-shadow-md max-w-2xl p-2 focus:ring-purple-500 focus:border-purple-500"
                  rows={2}
                />
              ) : (
                <p className="text-gray-300/90 drop-shadow-md max-w-2xl">{mySpaceData.description}</p>
              )}
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
              {mySpaceData.members} 会员
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
              {mySpaceData.stats.totalRuns} 使用量
            </Badge>
            <Badge
              variant="outline"
              className="text-sm py-1.5 bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-800"
            >
              <Eye className="h-4 w-4 mr-1.5 text-teal-400" />
              {formatNumber(mySpaceData.visits)} 访问量
            </Badge>
            <Badge
              variant="outline"
              className="text-sm py-1.5 bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-800"
            >
              <Clock className="h-4 w-4 mr-1.5 text-amber-400" />
              更新于 {formatDate(mySpaceData.updatedAt)}
            </Badge>
            <div className="ml-auto">
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700 hover:text-white"
                onClick={() => setShowSpaceSettings(true)}
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
                  您的空间订阅计划
                </h2>
                <p className="text-gray-300 max-w-2xl">设置您空间的订阅计划，吸引更多用户加入并使用您的工作流。</p>
              </div>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => setShowSpaceSettings(true)}
              >
                管理订阅计划
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
                <div className="flex-1">
                  <h3 className="font-medium text-white">普通会员</h3>
                  <p className="text-xs text-gray-400">更多功能，提升创作效率</p>
                </div>
                <div className="text-blue-400 font-medium">{formatCurrency(mySpaceData.membershipFee.regular)}/月</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-amber-700/30 flex items-center">
                <div className="rounded-full bg-amber-900/30 p-2 mr-3">
                  <Crown className="h-5 w-5 text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">高级会员</h3>
                  <p className="text-xs text-gray-400">全部功能，无限创作可能</p>
                </div>
                <div className="text-amber-400 font-medium">{formatCurrency(mySpaceData.membershipFee.premium)}/月</div>
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
                value="published"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                已发布
              </TabsTrigger>
              <TabsTrigger value="drafts" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                草稿
              </TabsTrigger>
              <TabsTrigger
                value="favorites"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                收藏
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* 工作流应用列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <Card
              key={app.id}
              className={`overflow-hidden group bg-gray-900 border-gray-800 shadow-md hover:shadow-lg transition-all duration-200 hover:border-gray-700 ${
                !app.isPublished ? "opacity-80" : ""
              }`}
            >
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={app.thumbnail || "/placeholder.svg"}
                  alt={app.name}
                  fill
                  className={`object-cover transition-transform group-hover:scale-105 ${
                    !app.isPublished ? "grayscale" : ""
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

                {/* 编辑模式下的操作按钮 */}
                {editMode && (
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-gray-900/70 text-gray-300 backdrop-blur-sm hover:bg-gray-800/90 hover:text-white"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      编辑
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-gray-900/70 text-gray-300 backdrop-blur-sm hover:bg-gray-800/90 hover:text-white"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-900 border-gray-800">
                        <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-gray-100">
                          <Copy className="mr-2 h-4 w-4" />
                          <span>复制</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-gray-100">
                          <Share2 className="mr-2 h-4 w-4" />
                          <span>分享</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-800" />
                        <DropdownMenuItem className="text-red-400 focus:bg-gray-800 focus:text-red-300">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>删除</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                {editMode ? (
                  <Button
                    size="sm"
                    className={`${
                      app.isPublished
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {app.isPublished ? "取消发布" : "发布"}
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
          ))}

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
