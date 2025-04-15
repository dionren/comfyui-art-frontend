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
  Search,
  ArrowRight,
  Users,
  Layers,
  Wallet,
  Bell,
  LogOut,
  Crown,
  Check,
  Info,
  Plus,
  Clock,
  Bookmark,
  BookmarkCheck,
  Settings,
  Edit,
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

// 用户加入的空间数据
const joinedSpaces = [
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
    joinedAt: "2023-12-10T00:00:00Z",
    role: "member", // member, admin
    lastVisited: "2024-03-28T10:30:00Z",
    subscription: "regular" as "free" | "regular" | "premium", // 用户在该空间的订阅级别
    isOwner: false,
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
    joinedAt: "2024-01-15T00:00:00Z",
    role: "admin",
    lastVisited: "2024-03-27T14:20:00Z",
    subscription: "premium" as "free" | "regular" | "premium",
    isOwner: true,
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
    joinedAt: "2024-02-05T00:00:00Z",
    role: "member",
    lastVisited: "2024-03-25T09:15:00Z",
    subscription: "free" as "free" | "regular" | "premium",
    isOwner: false,
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
    joinedAt: "2024-03-01T00:00:00Z",
    role: "member",
    lastVisited: "2024-03-26T16:40:00Z",
    subscription: "free" as "free" | "regular" | "premium",
    isOwner: false,
  },
  {
    id: "my-personal-space",
    name: "我的个人创作空间",
    description: "我创建的个人AI创作空间，用于实验和开发各种创意项目。",
    category: "个人创作",
    thumbnail: "/placeholder.svg?height=300&width=500&text=个人创作&bgcolor=8B5CF6",
    members: 3,
    workflowCount: 7,
    visits: 421,
    author: {
      id: "user-current",
      name: "无心飞翔",
      avatar: "/placeholder.svg?height=40&width=40&text=🎨&fontsize=16",
    },
    featured: false,
    popular: false,
    joinedAt: "2024-02-10T00:00:00Z",
    role: "owner",
    lastVisited: "2024-03-29T08:45:00Z",
    subscription: "owner" as "free" | "regular" | "premium" | "owner",
    isOwner: true,
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

// 格式化日期
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function MySpacesPage() {
  const [showWalletDetails, setShowWalletDetails] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"all" | "my" | "joined">("all")

  // 过滤空间
  const filteredSpaces = joinedSpaces.filter((space) => {
    // 视图模式过滤
    if (viewMode === "my" && !space.isOwner) {
      return false
    }
    if (viewMode === "joined" && space.isOwner) {
      return false
    }

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
    if (activeTab === "admin" && space.role !== "admin" && space.role !== "owner") {
      return false
    }
    if (activeTab === "subscribed" && space.subscription === "free" && !space.isOwner) {
      return false
    }
    if (activeTab === "recent" && new Date(space.lastVisited).getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000) {
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

      {/* 页面内容 */}
      <div className="container px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">我的空间</h1>
            <p className="text-lg text-gray-300">管理您创建和参与的所有创作空间，探索更多创作可能</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              创建新空间
            </Button>
          </div>
        </div>

        {/* 视图切换 */}
        <div className="mb-6">
          <Tabs defaultValue="all" value={viewMode} onValueChange={(v) => setViewMode(v as "all" | "my" | "joined")}>
            <TabsList className="bg-gray-900 border border-gray-800">
              <TabsTrigger value="all" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                全部空间
              </TabsTrigger>
              <TabsTrigger value="my" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                我创建的空间
              </TabsTrigger>
              <TabsTrigger value="joined" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                我加入的空间
              </TabsTrigger>
            </TabsList>
          </Tabs>
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
              <TabsTrigger value="admin" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                我管理的
              </TabsTrigger>
              <TabsTrigger
                value="subscribed"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                已订阅
              </TabsTrigger>
              <TabsTrigger value="recent" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                最近访问
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* 空间列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpaces.map((space) => (
            <Link key={space.id} href={`/space/${space.id}`} className="group">
              <Card
                className={`h-full overflow-hidden hover:border-gray-700 transition-all ${
                  space.isOwner
                    ? "bg-gradient-to-br from-gray-900 via-purple-950/30 to-gray-900 border-purple-800/40"
                    : "bg-gray-900 border-gray-800"
                }`}
              >
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
                  {space.isOwner ? (
                    <Badge
                      variant="outline"
                      className="absolute top-2 right-2 bg-purple-900/70 backdrop-blur-sm border-purple-700 text-purple-300"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      我的空间
                    </Badge>
                  ) : space.role === "admin" ? (
                    <Badge
                      variant="outline"
                      className="absolute top-2 right-2 bg-blue-900/70 backdrop-blur-sm border-blue-700 text-blue-300"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      管理员
                    </Badge>
                  ) : null}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-white">{space.name}</CardTitle>
                    {!space.isOwner && space.subscription !== "free" && (
                      <Badge
                        variant="outline"
                        className={`${
                          space.subscription === "premium"
                            ? "bg-amber-900/30 border-amber-700 text-amber-400"
                            : "bg-blue-900/30 border-blue-700 text-blue-400"
                        }`}
                      >
                        {space.subscription === "premium" ? (
                          <>
                            <Crown className="h-3 w-3 mr-1" />
                            高级会员
                          </>
                        ) : (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            普通会员
                          </>
                        )}
                      </Badge>
                    )}
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
                    <span className="text-sm text-gray-300">
                      {space.isOwner ? "您创建的空间" : `创建者: ${space.author.name}`}
                    </span>
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
                      <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      {new Date(space.lastVisited).toLocaleDateString()}
                    </span>
                  </div>
                  {space.isOwner ? (
                    <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300 p-0">
                      <Edit className="h-4 w-4 mr-1" />
                      <span className="sr-only md:not-sr-only">编辑</span>
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300 p-0">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </Link>
          ))}

          {/* 加入新空间卡片 */}
          <Card className="flex flex-col items-center justify-center h-full min-h-[300px] border-dashed border-gray-700 bg-gray-900/50 hover:bg-gray-900 transition-colors">
            <CardContent className="flex flex-col items-center justify-center text-center p-6">
              <div className="rounded-full bg-purple-500/10 p-3 mb-4">
                <Bookmark className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">加入新空间</h3>
              <p className="text-sm text-gray-400 mb-4">探索并加入更多创作者的AI工作流空间</p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <BookmarkCheck className="mr-2 h-4 w-4" />
                浏览空间
              </Button>
            </CardContent>
          </Card>
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
                setViewMode("all")
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
