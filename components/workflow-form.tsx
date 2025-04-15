"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Play, Info } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ImageUploader from "./image-uploader"

interface Parameter {
  id: string
  name: string
  type: string
  required: boolean
  description?: string
  default?: any
  min?: number
  max?: number
  step?: number
  options?: { label: string; value: any }[]
  category?: string
  multiple?: boolean
  maxImages?: number
}

interface WorkflowFormProps {
  workflow: {
    parameters: Parameter[]
  }
  onSubmit: (formData: Record<string, any>) => void
}

export default function WorkflowForm({ workflow, onSubmit }: WorkflowFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [activeTab, setActiveTab] = useState<string>("")

  // 初始化表单数据
  useEffect(() => {
    const initialData: Record<string, any> = {}
    workflow.parameters.forEach((param) => {
      if (param.default !== undefined) {
        initialData[param.id] = param.default
      } else if (param.type === "text") {
        initialData[param.id] = ""
      } else if (param.type === "number") {
        initialData[param.id] = param.min || 0
      } else if (param.type === "checkbox") {
        initialData[param.id] = param.default || false
      } else if (param.type === "select" && param.options && param.options.length > 0) {
        initialData[param.id] = param.default || param.options[0].value
      } else if (param.type === "image") {
        initialData[param.id] = []
      }
    })
    setFormData(initialData)
  }, [workflow.parameters])

  // 获取所有参数类别
  const categories = useMemo(() => {
    const cats = new Set<string>()
    workflow.parameters.forEach((param) => {
      if (param.category) {
        cats.add(param.category)
      } else {
        cats.add("其他")
      }
    })
    return Array.from(cats)
  }, [workflow.parameters])

  // 设置默认活动标签页
  useEffect(() => {
    if (categories.length > 0 && !activeTab) {
      setActiveTab(categories[0])
    }
  }, [categories, activeTab])

  // 按类别分组参数
  const parametersByCategory = useMemo(() => {
    const grouped: Record<string, Parameter[]> = {}

    workflow.parameters.forEach((param) => {
      const category = param.category || "其他"
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(param)
    })

    return grouped
  }, [workflow.parameters])

  const handleChange = (id: string, value: any) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const renderParameter = (param: Parameter) => {
    return (
      <div key={param.id} className="space-y-1.5 mb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Label htmlFor={param.id} className="text-sm font-medium">
              {param.name} {param.required && <span className="text-red-500">*</span>}
            </Label>
            {param.description && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-1 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{param.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {param.type === "number" && <span className="text-xs text-muted-foreground">{formData[param.id]}</span>}
        </div>

        {param.type === "text" ? (
          <Textarea
            id={param.id}
            value={formData[param.id] || ""}
            onChange={(e) => handleChange(param.id, e.target.value)}
            placeholder={`输入${param.name}`}
            required={param.required}
            className={param.id === "prompt" ? "min-h-[100px]" : ""}
          />
        ) : param.type === "number" ? (
          <Input
            id={param.id}
            type="number"
            value={formData[param.id] || ""}
            onChange={(e) => handleChange(param.id, Number.parseFloat(e.target.value))}
            min={param.min}
            max={param.max}
            step={param.step || 1}
            required={param.required}
          />
        ) : param.type === "checkbox" ? (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={param.id}
              checked={formData[param.id] || false}
              onCheckedChange={(checked) => handleChange(param.id, checked)}
            />
            <label htmlFor={param.id} className="text-sm text-muted-foreground cursor-pointer">
              {param.description || `启用${param.name}`}
            </label>
          </div>
        ) : param.type === "select" && param.options ? (
          <Select value={formData[param.id] || ""} onValueChange={(value) => handleChange(param.id, value)}>
            <SelectTrigger>
              <SelectValue placeholder={`选择${param.name}`} />
            </SelectTrigger>
            <SelectContent>
              {param.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : param.type === "image" ? (
          <ImageUploader
            value={formData[param.id] || []}
            onChange={(images) => handleChange(param.id, images)}
            maxImages={param.multiple ? param.maxImages || 10 : 1}
          />
        ) : null}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="text-xs">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <ScrollArea className="h-[calc(100vh-360px)] max-h-[480px] mt-4 pr-6">
          {categories.map((category) => (
            <TabsContent key={category} value={category} className="px-1 pb-4">
              {parametersByCategory[category]?.map(renderParameter)}
            </TabsContent>
          ))}
        </ScrollArea>
      </Tabs>

      <Button type="submit" className="w-full mt-4" size="default">
        <Play className="mr-2 h-4 w-4" />
        提交任务
      </Button>
    </form>
  )
}

