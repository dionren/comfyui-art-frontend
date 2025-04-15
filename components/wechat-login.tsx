"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { RefreshCw } from "lucide-react"

interface WechatLoginProps {
  onLogin: () => void
}

export default function WechatLogin({ onLogin }: WechatLoginProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [isExpired, setIsExpired] = useState(false)
  const [countdown, setCountdown] = useState(120)

  // 模拟二维码过期
  useEffect(() => {
    if (isScanning && !isExpired) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setIsExpired(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isScanning, isExpired])

  // 模拟扫码登录
  useEffect(() => {
    if (isScanning && !isExpired) {
      // 模拟10秒后登录成功
      const loginTimer = setTimeout(() => {
        onLogin()
      }, 10000)

      return () => clearInterval(loginTimer)
    }
  }, [isScanning, isExpired, onLogin])

  const handleRefresh = () => {
    setIsExpired(false)
    setIsScanning(true)
    setCountdown(120)
  }

  useEffect(() => {
    // 初始化时自动开始扫码
    setIsScanning(true)
  }, [])

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-56 h-56 mx-auto">
        {isExpired ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/80 rounded-lg">
            <p className="text-gray-300 mb-2">二维码已过期</p>
            <Button onClick={handleRefresh} variant="outline" size="sm" className="gap-1">
              <RefreshCw className="h-4 w-4" />
              刷新
            </Button>
          </div>
        ) : null}
        <div className="bg-white p-3 rounded-lg">
          <Image
            src="/placeholder.svg?height=200&width=200&text=微信扫码登录&bgcolor=FFFFFF&textcolor=333333"
            alt="微信扫码登录"
            width={200}
            height={200}
            className="rounded"
          />
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-gray-300">请使用微信扫一扫</p>
        <p className="text-sm text-gray-400">扫描二维码登录「畅绘」</p>
        {!isExpired && (
          <p className="text-xs text-gray-500">
            二维码有效期 {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")}
          </p>
        )}
      </div>
    </div>
  )
}
