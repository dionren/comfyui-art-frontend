"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface VerificationCodeInputProps {
  length: number
  onComplete: (code: string) => void
}

export default function VerificationCodeInput({ length = 6, onComplete }: VerificationCodeInputProps) {
  const [code, setCode] = useState<string[]>(Array(length).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // 初始化 inputRefs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])

  // 自动聚焦第一个输入框
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value

    // 只允许输入数字
    if (!/^\d*$/.test(value)) return

    // 处理粘贴多个数字的情况
    if (value.length > 1) {
      const chars = value.split("")
      const newCode = [...code]

      // 填充当前及后续输入框
      for (let i = 0; i < chars.length && index + i < length; i++) {
        newCode[index + i] = chars[i]
      }

      setCode(newCode)

      // 如果粘贴完成了所有输入框，则触发完成回调
      if (newCode.every((c) => c !== "")) {
        onComplete(newCode.join(""))
      } else {
        // 聚焦到下一个空输入框
        const nextEmptyIndex = newCode.findIndex((c) => c === "")
        if (nextEmptyIndex !== -1 && inputRefs.current[nextEmptyIndex]) {
          inputRefs.current[nextEmptyIndex].focus()
        }
      }
      return
    }

    // 处理单个数字输入
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // 自动聚焦下一个输入框
    if (value !== "" && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }

    // 检查是否所有输入框都已填写
    if (newCode.every((c) => c !== "")) {
      onComplete(newCode.join(""))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // 处理退格键
    if (e.key === "Backspace" && index > 0 && code[index] === "") {
      inputRefs.current[index - 1]?.focus()
    }

    // 处理左右箭头键
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")
    if (!/^\d*$/.test(pastedData)) return

    const newCode = [...code]
    for (let i = 0; i < pastedData.length && index + i < length; i++) {
      newCode[index + i] = pastedData[i]
    }

    setCode(newCode)

    // 聚焦到下一个空输入框或最后一个输入框
    const nextEmptyIndex = newCode.findIndex((c) => c === "")
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus()
    } else {
      inputRefs.current[length - 1]?.focus()
    }

    // 检查是否所有输入框都已填写
    if (newCode.every((c) => c !== "")) {
      onComplete(newCode.join(""))
    }
  }

  return (
    <div className="flex justify-between gap-2">
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={code[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={(e) => handlePaste(e, index)}
          className="w-10 h-12 text-center text-lg font-medium bg-gray-800 border-gray-700 text-gray-200 focus:border-purple-500"
        />
      ))}
    </div>
  )
}
