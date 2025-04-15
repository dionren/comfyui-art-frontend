"use client"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Wallet, Bell, LogOut, Info, Crown, Check, CreditCard } from "lucide-react"
import WorkflowExecutor from "@/components/workflow-executor"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState, useEffect } from "react"

// 工作流数据映射
const workflowsData = {
  "stable-diffusion-xl": {
    id: "stable-diffusion-xl",
    name: "Stable Diffusion XL 图像生成",
    description: "高质量图像生成工作流，基于Stable Diffusion XL模型。支持高分辨率输出和多种风格。",
    imageUrl: "/placeholder.svg?height=300&width=400",
    cost: 0.2,
    accessType: "pay-per-use",
  },
  "midjourney-style": {
    id: "midjourney-style",
    name: "MidJourney 风格生成",
    description: "模拟MidJourney风格的图像生成工作流，创建艺术感强的图像。",
    imageUrl: "/placeholder.svg?height=300&width=400",
    cost: 0.2,
    accessType: "regular",
  },
  "text-to-video": {
    id: "text-to-video",
    name: "文本转视频",
    description: "根据文本描述生成短视频片段，支持多种风格和场景。",
    imageUrl: "/placeholder.svg?height=300&width=400",
    cost: 0.5,
    accessType: "premium",
  },
  "image-upscaling": {
    id: "image-upscaling",
    name: "图像超分辨率",
    description: "提升图像分辨率和质量的工作流，适用于低分辨率图像增强。",
    imageUrl: "/placeholder.svg?height=300&width=400",
    cost: 0.1,
    accessType: "free",
  },
  "style-transfer": {
    id: "style-transfer",
    name: "风格迁移",
    description: "将一种艺术风格应用到图像上的工作流，创建艺术效果。",
    imageUrl: "/placeholder.svg?height=300&width=400",
    cost: 0.2,
    accessType: "pay-per-use",
  },
  "text-generation": {
    id: "text-generation",
    name: "文本生成",
    description: "基于提示生成创意文本内容，适用于创意写作和内容创作。",
    imageUrl: "/placeholder.svg?height=300&width=400",
    cost: 0.1,
    accessType: "free",
  },
  "3d-model-generation": {
    id: "3d-model-generation",
    name: "3D模型生成",
    description: "从文本描述生成3D模型，支持多种格式导出",
    imageUrl: "/placeholder.svg?height=300&width=400",
    cost: 0.5,
    accessType: "premium",
  },
  "image-to-image": {
    id: "image-to-image",
    name: "图像变换",
    description: "基于参考图像生成新的变体或修改",
    imageUrl: "/placeholder.svg?height=300&width=400",
    cost: 0.2,
    accessType: "regular",
  },
  "background-removal": {
    id: "background-removal",
    name: "背景移除",
    description: "自动移除图像背景，支持批量处理",
    imageUrl: "/placeholder.svg?height=300&width=400",
    cost: 0.1,
    accessType: "free",
  },
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

// 格式化金额
function formatCurrency(amount: number, currency = "¥") {
  return `${currency}${amount.toLocaleString()}`
}

// 当前用户数据
const currentUser = {
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
}

export default function WorkflowPage() {
  const params = useParams()
  const router = useRouter()
  const workflowId = params.id as string
  const [showWalletDetails, setShowWalletDetails] = useState(false)

  // 页面加载时自动滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // 获取当前工作流数据
  const workflow = workflowsData[workflowId as keyof typeof workflowsData] || {
    id: workflowId,
    name: "未知工作流",
    description: "无法找到此工作流的详细信息",
    imageUrl: "/placeholder.svg?height=300&width=400",
    cost: 0,
    accessType: "free",
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

      {/* 页面内容 */}
      <div className="container mx-auto p-4 pt-6">
        {/* 工作流标题和返回按钮 */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              className="mr-3 gap-1 h-8 px-2 bg-gray-800 border-gray-700 hover:bg-gray-700"
              onClick={() => router.push("/")}
            >
              <ChevronLeft className="h-4 w-4" />
              返回空间
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">{workflow.name}</h1>
              <p className="text-sm text-gray-400">{workflow.description}</p>
            </div>
          </div>
          {workflow.cost > 0 && (
            <div className="bg-gray-800 px-3 py-1.5 rounded-md border border-gray-700 flex items-center">
              <span className="text-gray-400 text-sm mr-2">单次使用费用:</span>
              <span className="text-purple-400 font-medium">{formatCurrency(workflow.cost)}</span>
            </div>
          )}
        </div>

        <WorkflowExecutor workflowId={workflowId} />
      </div>
    </div>
  )
}

