"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { X, ImageIcon, Plus } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export interface UploadedImage {
  id: string
  url: string
  name: string
}

interface ImageUploaderProps {
  value: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
  maxImages?: number
  className?: string
}

export default function ImageUploader({ value = [], onChange, maxImages = 1, className }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      const newImages = files.map((file) => ({
        id: `img-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        url: URL.createObjectURL(file),
        name: file.name,
      }))

      if (maxImages === 1) {
        onChange(newImages.slice(0, 1))
      } else {
        const totalImages = [...value, ...newImages]
        onChange(totalImages.slice(0, maxImages))
      }
    }
  }

  const removeImage = (id: string) => {
    onChange(value.filter((image) => image.id !== id))
  }

  const canAddMoreImages = value.length < maxImages

  return (
    <div className={cn("space-y-3", className)}>
      {/* 已上传图像预览 */}
      {value.length > 0 && (
        <div className={cn("grid gap-3", maxImages === 1 ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3")}>
          {value.map((image) => (
            <Card key={image.id} className="relative group overflow-hidden border-gray-700 bg-gray-800">
              <div className="aspect-square relative">
                <Image src={image.url || "/placeholder.svg"} alt={image.name} fill className="object-cover" />

                {/* 删除按钮 */}
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* 图像信息 */}
              <div className="p-2 text-xs text-gray-300 truncate">{image.name}</div>
            </Card>
          ))}

          {/* 添加更多图像按钮 (多图模式) */}
          {maxImages > 1 && canAddMoreImages && (
            <label
              className={cn(
                "border-dashed flex items-center justify-center cursor-pointer hover:bg-gray-800/50 transition-colors border-gray-700 bg-gray-800/30",
                isDragging && "border-purple-500 bg-purple-500/10",
                "card", // 添加card样式
              )}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                multiple={maxImages > 1}
                onChange={handleFileChange}
              />
              <div className="aspect-square flex flex-col items-center justify-center p-4 text-center">
                <Plus className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-400">添加更多图像</span>
                <span className="text-xs text-gray-500 mt-1">
                  {value.length}/{maxImages}
                </span>
              </div>
            </label>
          )}
        </div>
      )}

      {/* 上传区域 (空状态或单图模式) */}
      {(value.length === 0 || (maxImages === 1 && canAddMoreImages)) && (
        <label
          className={cn(
            "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-800/50 transition-colors border-gray-700 bg-gray-800/30",
            isDragging && "border-purple-500 bg-purple-500/10",
          )}
        >
          <input type="file" accept="image/*" className="hidden" multiple={maxImages > 1} onChange={handleFileChange} />
          <div className="rounded-full bg-gray-800 p-3 mb-3">
            <ImageIcon className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-300 mb-1">
            {maxImages === 1 ? "上传图像" : `上传图像 (最多 ${maxImages} 张)`}
          </p>
          <p className="text-xs text-gray-500">点击此处选择文件或拖放图像</p>
        </label>
      )}
    </div>
  )
}
