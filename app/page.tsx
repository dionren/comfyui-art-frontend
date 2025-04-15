"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Sparkles,
  Search,
  ArrowRight,
  Star,
  Users,
  Layers,
  Eye,
  Wallet,
  Bell,
  LogOut,
  Palette,
  Video,
  Music,
  Code,
  ImageIcon,
  MessageSquare,
  Lightbulb,
  Wand2,
  Rocket,
  Bookmark,
  TrendingUp,
  Plus,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 当前用户数据
const currentUser = {
  id: "user-current",
  name: "无心飞翔",
  email: "wuxinfeixiang@example.com",
  avatar: "/placeholder.svg?height=100&width=100&text=&bgcolor=8B5CF6&textcolor=FFFFFF",
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
}

// 热门空间数据
const popularSpaces = [
  {
    id: "advance-aigc",
    name: "高级摄影AIGC工具集",
    description: "我们编写优化了大量的摄影专用工作流，帮助摄影师最高效率的满足客户需求。",
    category: "摄影",
    thumbnail: "/placeholder.svg?height=300&width=500&text=摄影AIGC&bgcolor=3B82F6",
    members: 8,
    workflowCount: 12,
    visits: 1258,
    author: {
      id: "user-1",
      name: "赵老师",
      avatar: "/placeholder.svg?height=40&width=40&text=📷&fontsize=16",
    },
    featured: true,
    popular: true,
  },
  {
    id: "ai-character",
    name: "AI角色设计工作室",
    description: "专注于游戏和动画角色设计的AI工作流集合，从概念到成品一站式解决方案。",
    category: "角色设计",
    thumbnail: "/placeholder.svg?height=300&width=500&text=角色设计&bgcolor=EC4899",
    members: 12,
    workflowCount: 8,
    visits: 2458,
    author: {
      id: "user-2",
      name: "李设计",
      avatar: "/placeholder.svg?height=40&width=40&text=🎮&fontsize=16",
    },
    featured: true,
    popular: true,
  },
  {
    id: "3d-modeling",
    name: "3D模型生成空间",
    description: "使用AI技术快速生成高质量3D模型，适用于游戏、建筑和产品设计等领域。",
    category: "3D建模",
    thumbnail: "/placeholder.svg?height=300&width=500&text=3D模型&bgcolor=6366F1",
    members: 15,
    workflowCount: 10,
    visits: 1876,
    author: {
      id: "user-3",
      name: "王建模",
      avatar: "/placeholder.svg?height=40&width=40&text=🏗️&fontsize=16",
    },
    featured: false,
    popular: true,
  },
  {
    id: "video-generation",
    name: "AI视频创作中心",
    description: "从文本到视频，一键生成各种风格的短视频内容，提升创作效率。",
    category: "视频创作",
    thumbnail: "/placeholder.svg?height=300&width=500&text=视频创作&bgcolor=EF4444",
    members: 20,
    workflowCount: 15,
    visits: 3245,
    author: {
      id: "user-4",
      name: "张导演",
      avatar: "/placeholder.svg?height=40&width=40&text=🎬&fontsize=16",
    },
    featured: true,
    popular: true,
  },
  {
    id: "music-composition",
    name: "AI音乐创作空间",
    description: "使用AI辅助作曲、编曲和混音，为您的项目创作独特的音乐作品。",
    category: "音乐创作",
    thumbnail: "/placeholder.svg?height=300&width=500&text=音乐创作&bgcolor=8B5CF6",
    members: 18,
    workflowCount: 9,
    visits: 1567,
    author: {
      id: "user-5",
      name: "刘作曲",
      avatar: "/placeholder.svg?height=40&width=40&text=🎵&fontsize=16",
    },
    featured: false,
    popular: true,
  },
  {
    id: "code-generation",
    name: "代码生成工作室",
    description: "AI驱动的代码生成和优化工具集，提高开发效率，减少重复工作。",
    category: "编程开发",
    thumbnail: "/placeholder.svg?height=300&width=500&text=代码生成&bgcolor=10B981",
    members: 25,
    workflowCount: 14,
    visits: 2789,
    author: {
      id: "user-6",
      name: "陈程序",
      avatar: "/placeholder.svg?height=40&width=40&text=💻&fontsize=16",
    },
    featured: true,
    popular: true,
  },
]

// 平台特性数据
const platformFeatures = [
  {
    title: "AI图像生成",
    description: "使用最先进的AI模型，从文本描述生成高质量图像，支持多种风格和参数调整。",
    icon: <ImageIcon className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "视频创作",
    description: "将文本、图像转换为流畅的视频内容，支持多种场景和风格，满足不同创作需求。",
    icon: <Video className="h-10 w-10 text-red-500" />,
  },
  {
    title: "3D模型生成",
    description: "从文本描述或2D图像生成3D模型，适用于游戏、建筑和产品设计等领域。",
    icon: <Palette className="h-10 w-10 text-indigo-500" />,
  },
  {
    title: "音频创作",
    description: "AI辅助音乐创作、配音和音效生成，为您的项目增添听觉体验。",
    icon: <Music className="h-10 w-10 text-purple-500" />,
  },
  {
    title: "代码生成",
    description: "根据需求描述生成高质量代码，支持多种编程语言和框架，提高开发效率。",
    icon: <Code className="h-10 w-10 text-green-500" />,
  },
  {
    title: "文本创作",
    description: "AI辅助文案写作、内容创作和文本优化，提升内容质量和创作效率。",
    icon: <MessageSquare className="h-10 w-10 text-yellow-500" />,
  },
]

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

// 格式化金额
function formatCurrency(amount: number, currency = "¥") {
  return `${currency}${amount.toLocaleString()}`
}

// 格式化数字（添加千位分隔符）
function formatNumber(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export default function HomePage() {
  const [showWalletDetails, setShowWalletDetails] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // 过滤空间
  const filteredSpaces = popularSpaces.filter((space) => {
    // 搜索过滤
    if (
      searchQuery &&
      !space.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !space.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !space.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // 标签过滤
    if (activeTab === "featured" && !space.featured) {
      return false
    }
    if (activeTab === "popular" && !space.popular) {
      return false
    }

    return true
  })

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
                >
                  <Wallet className="h-4 w-4 mr-2 text-purple-400" />
                  会员中心
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>查看您的订阅和会员信息</p>
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
                <Wallet className="mr-2 h-4 w-4" />
                充值
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 英雄区域 */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-950 to-indigo-950">
          {/* 装饰性元素 */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20"></div>

          {/* 光晕效果 */}
          <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl"></div>
        </div>

        <div className="container relative z-10 px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <Badge
              variant="outline"
              className="mb-6 px-3 py-1.5 text-sm bg-gray-800/50 border-purple-700 text-purple-400 backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI创作新时代
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-200">
              畅绘 - 释放AI创作的无限可能
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              集成多种AI模型和工作流，一站式解决您的创意需求。从图像生成到视频创作，从3D建模到音频合成，畅绘让AI创作变得简单高效。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                <Rocket className="mr-2 h-5 w-5" />
                开始创作
              </Button>
              <Button size="lg" variant="outline" className="bg-gray-800/50 border-gray-700 text-gray-200">
                <Lightbulb className="mr-2 h-5 w-5" />
                了解更多
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 平台特性 */}
      <section className="py-16 bg-gray-900/50">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">强大的AI创作能力</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              畅绘集成了多种先进的AI模型和工作流，为您提供全方位的创作支持
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformFeatures.map((feature, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all">
                <CardHeader>
                  <div className="bg-gray-800/50 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 热门空间 */}
      <section className="py-16">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-white">探索创作空间</h2>
              <p className="text-lg text-gray-300">发现由专业创作者打造的AI工作流空间，开启您的创作之旅</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                创建空间
              </Button>
            </div>
          </div>

          {/* 搜索和过滤 */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="搜索空间..."
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
                  value="featured"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  精选
                </TabsTrigger>
                <TabsTrigger
                  value="popular"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  热门
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* 空间列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpaces.map((space) => (
              <Link key={space.id} href={`/space/${space.id}`} className="group">
                <Card className="h-full bg-gray-900 border-gray-800 overflow-hidden hover:border-gray-700 transition-all">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={space.thumbnail || "/placeholder.svg"}
                      alt={space.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                    <Badge
                      variant="outline"
                      className="absolute top-2 left-2 bg-gray-900/70 backdrop-blur-sm border-gray-700 text-gray-300"
                    >
                      {space.category}
                    </Badge>
                    {space.featured && (
                      <Badge
                        variant="outline"
                        className="absolute top-2 right-2 bg-purple-900/70 backdrop-blur-sm border-purple-700 text-purple-300"
                      >
                        <Star className="h-3 w-3 mr-1 fill-purple-300" />
                        精选
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-white">{space.name}</CardTitle>
                    </div>
                    <CardDescription className="text-gray-400">{space.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={space.author.avatar || "/placeholder.svg"} alt={space.author.name} />
                        <AvatarFallback className="bg-gray-700 text-gray-200">
                          {space.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-300">{space.author.name}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t border-gray-800">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Users className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        {space.members}
                      </span>
                      <span className="flex items-center">
                        <Layers className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        {space.workflowCount}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        {formatNumber(space.visits)}
                      </span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300 p-0">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>

          {/* 无结果提示 */}
          {filteredSpaces.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-900/50 rounded-xl mt-6 border border-gray-800">
              <div className="rounded-full bg-gray-800 p-3 mb-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white">未找到空间</h3>
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

          {/* 查看更多按钮 */}
          <div className="flex justify-center mt-10">
            <Button variant="outline" className="bg-gray-800 border-gray-700 text-gray-200">
              查看更多空间
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* 统计数据 */}
      <section className="py-16 bg-gray-900/50">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="bg-purple-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">10,000+</div>
                <p className="text-gray-400">活跃用户</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layers className="h-6 w-6 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <p className="text-gray-400">创作空间</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="bg-green-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wand2 className="h-6 w-6 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">5,000+</div>
                <p className="text-gray-400">AI工作流</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="bg-amber-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-amber-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">100万+</div>
                <p className="text-gray-400">创作成果</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 行动召唤 */}
      <section className="py-20">
        <div className="container px-4">
          <div className="bg-gradient-to-r from-gray-900 via-purple-900/30 to-gray-900 rounded-xl overflow-hidden border border-gray-800/50 shadow-xl">
            <div className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">准备好开始您的AI创作之旅了吗？</h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                加入畅绘平台，探索AI创作的无限可能，让您的创意更快、更好地实现。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Rocket className="mr-2 h-5 w-5" />
                  立即开始
                </Button>
                <Button size="lg" variant="outline" className="bg-gray-800/50 border-gray-700 text-gray-200">
                  <Bookmark className="mr-2 h-5 w-5" />
                  查看教程
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="py-12 border-t border-gray-800">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ChangHuiLogo />
              </div>
              <p className="text-gray-400 mb-4">畅绘 - AI创作平台，释放创意无限可能</p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-4">产品</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    功能介绍
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    价格方案
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    API文档
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    更新日志
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-4">资源</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    教程中心
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    社区论坛
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    创作者计划
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    合作伙伴
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-4">公司</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    关于我们
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    联系我们
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    隐私政策
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    服务条款
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">© 2024 畅绘. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
