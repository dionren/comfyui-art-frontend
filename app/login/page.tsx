"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import PhoneLogin from "@/components/phone-login"
import WechatLogin from "@/components/wechat-login"

// 畅绘Logo组件
function ChangHuiLogo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="absolute w-7 h-7 border-t-2 border-r-2 border-white rounded-tr-full transform rotate-45"></div>
        <div className="absolute w-3.5 h-3.5 bg-white rounded-full bottom-1.5 left-1.5"></div>
      </div>
      <span className="font-bold text-2xl text-white">畅绘</span>
    </div>
  )
}

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

export default function LoginPage() {
  const router = useRouter()
  const [loginMethod, setLoginMethod] = useState<"phone" | "wechat">("phone")

  const handleLogin = () => {
    // 模拟登录成功
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gray-950">
      <DarkGradientBackground />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="flex justify-center mb-8">
          <ChangHuiLogo />
        </div>

        <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">登录</CardTitle>
            <CardDescription className="text-center text-gray-400">选择以下方式登录到您的畅绘账户</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs defaultValue="phone" className="w-full" onValueChange={(value) => setLoginMethod(value as any)}>
              <TabsList className="grid w-full grid-cols-2 bg-gray-800 border border-gray-700">
                <TabsTrigger value="phone" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  手机号登录
                </TabsTrigger>
                <TabsTrigger
                  value="wechat"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  微信扫码登录
                </TabsTrigger>
              </TabsList>
              <TabsContent value="phone" className="mt-4">
                <PhoneLogin onLogin={handleLogin} />
              </TabsContent>
              <TabsContent value="wechat" className="mt-4">
                <WechatLogin onLogin={handleLogin} />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-400">
              还没有账户？{" "}
              <Link href="/register" className="text-purple-400 hover:text-purple-300">
                立即注册
              </Link>
            </div>
            <div className="text-xs text-center text-gray-500">
              登录即表示您同意我们的{" "}
              <Link href="/terms" className="text-gray-400 hover:text-gray-300 underline">
                服务条款
              </Link>{" "}
              和{" "}
              <Link href="/privacy" className="text-gray-400 hover:text-gray-300 underline">
                隐私政策
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
