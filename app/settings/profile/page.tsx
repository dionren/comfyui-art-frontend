"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

// 当前用户数据
const currentUser = {
  id: "user-current",
  name: "无心飞翔",
  email: "wuxinfeixiang@example.com",
  avatar: "/placeholder.svg?height=100&width=100&text=&bgcolor=8B5CF6&textcolor=FFFFFF",
  bio: "热爱AI创作，专注于图像生成和创意设计。希望通过AI技术探索艺术的无限可能。",
  location: "上海",
  website: "https://example.com",
  gender: "male",
  birthday: "1990-01-01",
  profession: "设计师",
  interests: ["AI绘画", "摄影", "数字艺术"],
  socialLinks: {
    weibo: "wuxinfeixiang",
    wechat: "wxfx123",
    github: "wuxinfeixiang",
  },
  privacySettings: {
    showEmail: false,
    showLocation: true,
    showBirthday: false,
  },
}

export default function ProfileSettingsPage() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    bio: currentUser.bio,
    location: currentUser.location,
    website: currentUser.website,
    gender: currentUser.gender,
    birthday: currentUser.birthday,
    profession: currentUser.profession,
    showEmail: currentUser.privacySettings.showEmail,
    showLocation: currentUser.privacySettings.showLocation,
    showBirthday: currentUser.privacySettings.showBirthday,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    // 模拟API请求
    setTimeout(() => {
      setIsUpdating(false)
      // 这里可以添加成功提示
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">个人资料</h1>
        <p className="text-gray-400">管理您的个人信息和公开资料</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 头像设置 */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white">头像</CardTitle>
            <CardDescription>您的头像将显示在您的个人资料和评论中</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                <AvatarFallback className="bg-indigo-600 text-white text-2xl">
                  {currentUser.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="bg-gray-800 border-gray-700 text-gray-200">
                    <Camera className="h-4 w-4 mr-2" />
                    更换头像
                  </Button>
                  <Button type="button" variant="outline" className="bg-gray-800 border-gray-700 text-gray-200">
                    移除
                  </Button>
                </div>
                <p className="text-xs text-gray-400">推荐使用正方形图片，支持JPG、PNG格式，最大2MB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 基本信息 */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white">基本信息</CardTitle>
            <CardDescription>更新您的个人基本信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                  用户名
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700 text-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  电子邮箱
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700 text-gray-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-300">
                个人简介
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="bg-gray-800 border-gray-700 text-gray-200 resize-none"
              />
              <p className="text-xs text-gray-400">简短介绍一下自己，这将显示在您的个人资料页面</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-300">
                  所在地
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700 text-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website" className="text-gray-300">
                  个人网站
                </Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700 text-gray-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-gray-300">
                  性别
                </Label>
                <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                    <SelectValue placeholder="选择性别" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="male">男</SelectItem>
                    <SelectItem value="female">女</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                    <SelectItem value="prefer-not-to-say">不愿透露</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthday" className="text-gray-300">
                  生日
                </Label>
                <Input
                  id="birthday"
                  name="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700 text-gray-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profession" className="text-gray-300">
                职业
              </Label>
              <Input
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-gray-200"
              />
            </div>
          </CardContent>
        </Card>

        {/* 隐私设置 */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white">隐私设置</CardTitle>
            <CardDescription>控制您的个人信息对其他用户的可见性</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-300">显示电子邮箱</h4>
                <p className="text-xs text-gray-400">允许其他用户查看您的电子邮箱地址</p>
              </div>
              <Switch
                checked={formData.showEmail}
                onCheckedChange={(checked) => handleSwitchChange("showEmail", checked)}
              />
            </div>
            <Separator className="bg-gray-800" />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-300">显示所在地</h4>
                <p className="text-xs text-gray-400">允许其他用户查看您的所在地</p>
              </div>
              <Switch
                checked={formData.showLocation}
                onCheckedChange={(checked) => handleSwitchChange("showLocation", checked)}
              />
            </div>
            <Separator className="bg-gray-800" />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-300">显示生日</h4>
                <p className="text-xs text-gray-400">允许其他用户查看您的生日</p>
              </div>
              <Switch
                checked={formData.showBirthday}
                onCheckedChange={(checked) => handleSwitchChange("showBirthday", checked)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              "保存更改"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
