"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Loader2, AlertTriangle, Smartphone, QrCode, Laptop } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AccountSettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingPassword(true)

    // 模拟API请求
    setTimeout(() => {
      setIsUpdatingPassword(false)
      // 这里可以添加成功提示
    }, 1500)
  }

  const handlePhoneVerification = () => {
    setIsVerifyingPhone(true)

    // 模拟API请求
    setTimeout(() => {
      setIsVerifyingPhone(false)
      // 这里可以添加成功提示
    }, 1500)
  }

  const handleDeleteAccount = () => {
    // 模拟账户删除
    setShowDeleteDialog(false)
    // 这里可以添加重定向到登出页面
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">账户设置</h1>
        <p className="text-gray-400">管理您的账户安全和登录方式</p>
      </div>

      {/* 密码修改 */}
      <Card className="bg-gray-900 border-gray-800 mb-6">
        <CardHeader>
          <CardTitle className="text-white">修改密码</CardTitle>
          <CardDescription>定期更改密码可以提高账户安全性</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-gray-300">
                当前密码
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  className="bg-gray-800 border-gray-700 text-gray-200 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-300"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-gray-300">
                新密码
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  className="bg-gray-800 border-gray-700 text-gray-200 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-300"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-400">密码长度至少8位，包含字母和数字</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-gray-300">
                确认新密码
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  className="bg-gray-800 border-gray-700 text-gray-200 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    更新中...
                  </>
                ) : (
                  "更新密码"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 手机绑定 */}
      <Card className="bg-gray-900 border-gray-800 mb-6">
        <CardHeader>
          <CardTitle className="text-white">手机绑定</CardTitle>
          <CardDescription>绑定手机号可以提高账户安全性，并用于接收验证码</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Smartphone className="h-8 w-8 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-300">手机号码</p>
                <p className="text-sm text-gray-400">138****5678</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-900/30 border-green-700 text-green-400">
              已绑定
            </Badge>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              className="bg-gray-800 border-gray-700 text-gray-200"
              onClick={handlePhoneVerification}
              disabled={isVerifyingPhone}
            >
              {isVerifyingPhone ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  验证中...
                </>
              ) : (
                "更换手机号"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 微信绑定 */}
      <Card className="bg-gray-900 border-gray-800 mb-6">
        <CardHeader>
          <CardTitle className="text-white">微信绑定</CardTitle>
          <CardDescription>绑定微信账号可以快速登录，无需输入密码</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <QrCode className="h-8 w-8 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-300">微信账号</p>
                <p className="text-sm text-gray-400">微信昵称：无心飞翔</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-900/30 border-green-700 text-green-400">
              已绑定
            </Badge>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" className="bg-gray-800 border-gray-700 text-gray-200">
              解除绑定
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 登录设备 */}
      <Card className="bg-gray-900 border-gray-800 mb-6">
        <CardHeader>
          <CardTitle className="text-white">登录设备</CardTitle>
          <CardDescription>查看并管理您当前的登录设备</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-900/30 p-2 rounded-full">
                <Smartphone className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-300">iPhone 13 Pro</p>
                <p className="text-xs text-gray-400">上海市 · 最近登录于 2024-03-28 10:30</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-900/30 border-green-700 text-green-400">
              当前设备
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-700 p-2 rounded-full">
                <Laptop className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-300">MacBook Pro</p>
                <p className="text-xs text-gray-400">上海市 · 最近登录于 2024-03-27 18:45</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-gray-700">
              退出登录
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 账户注销 */}
      <Card className="bg-gray-900 border-gray-800 mb-6 border-red-900/50">
        <CardHeader>
          <CardTitle className="text-white">账户注销</CardTitle>
          <CardDescription>永久删除您的账户和所有相关数据</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="bg-red-950/30 border-red-900 text-red-400">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>警告</AlertTitle>
            <AlertDescription>
              注销账户是不可逆操作，您的所有数据将被永久删除，包括个人资料、创作内容和购买记录。
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-end">
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                  注销账户
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-white">确认注销账户</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    此操作不可撤销。这将永久删除您的账户和所有相关数据。
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-sm text-gray-300">
                    请输入 <span className="font-bold text-red-400">DELETE</span> 以确认注销
                  </p>
                  <Input
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-200"
                  />
                </div>
                <DialogFooter>
                  <Button variant="ghost" className="text-gray-400" onClick={() => setShowDeleteDialog(false)}>
                    取消
                  </Button>
                  <Button
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    disabled={deleteConfirmation !== "DELETE"}
                    onClick={handleDeleteAccount}
                  >
                    确认注销
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
