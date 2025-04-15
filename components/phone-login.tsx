"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import VerificationCodeInput from "./verification-code-input"

interface PhoneLoginProps {
  onLogin: () => void
  buttonText?: string
}

export default function PhoneLogin({ onLogin, buttonText = "登录" }: PhoneLoginProps) {
  const [phone, setPhone] = useState("")
  const [step, setStep] = useState<"phone" | "verification">("phone")
  const [countdown, setCountdown] = useState(0)

  const handleSendCode = () => {
    // 模拟发送验证码
    setStep("verification")
    setCountdown(60)

    // 倒计时
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleVerifyCode = (code: string) => {
    // 模拟验证码验证
    if (code.length === 6) {
      // 假设验证成功
      setTimeout(() => {
        onLogin()
      }, 500)
    }
  }

  const isValidPhone = /^1[3-9]\d{9}$/.test(phone)

  return (
    <div className="space-y-4">
      {step === "phone" ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-300">
              手机号
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
            />
          </div>
          <Button
            onClick={handleSendCode}
            disabled={!isValidPhone}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            获取验证码
          </Button>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="verification-code" className="text-gray-300">
                验证码
              </Label>
              <span className="text-sm text-gray-400">已发送至 {phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")}</span>
            </div>
            <VerificationCodeInput length={6} onComplete={handleVerifyCode} />
            <div className="flex justify-between items-center mt-2">
              <Button
                variant="link"
                className="text-sm text-gray-400 hover:text-gray-300 p-0"
                onClick={() => setStep("phone")}
              >
                更换手机号
              </Button>
              <Button
                variant="link"
                className="text-sm text-purple-400 hover:text-purple-300 p-0"
                disabled={countdown > 0}
                onClick={handleSendCode}
              >
                {countdown > 0 ? `重新发送(${countdown}s)` : "重新发送"}
              </Button>
            </div>
          </div>
          <Button onClick={() => onLogin()} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            {buttonText}
          </Button>
        </>
      )}
    </div>
  )
}
