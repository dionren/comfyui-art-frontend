"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, ChevronLeft, ChevronRight } from "lucide-react"
import WorkflowForm from "./workflow-form"
import TaskCard from "./task-card"
import { cn } from "@/lib/utils"

// 工作流数据映射
const workflowsData = {
  "stable-diffusion-xl": {
    id: "stable-diffusion-xl",
    name: "Stable Diffusion XL 图像生成",
    description: "高质量图像生成工作流，基于Stable Diffusion XL模型。支持高分辨率输出和多种风格。",
    imageUrl: "/placeholder.svg?height=300&width=400",
    cost: 0.2,
    accessType: "pay-per-use",
    parameters: [
      {
        id: "prompt",
        name: "提示词",
        type: "text",
        required: true,
        description: "描述你想要生成的图像内容",
        category: "基础设置",
      },
      {
        id: "negative_prompt",
        name: "负面提示词",
        type: "text",
        required: false,
        description: "描述你不想在图像中出现的内容",
        category: "基础设置",
      },
      {
        id: "steps",
        name: "步数",
        type: "number",
        required: false,
        default: 30,
        min: 10,
        max: 150,
        description: "生成过程的步数，更高的步数可能产生更精细的细节",
        category: "基础设置",
      },
      {
        id: "reference_image",
        name: "参考图像",
        type: "image",
        required: false,
        description: "上传参考图像以指导生成过程",
        category: "高级设置",
        multiple: false,
      },
    ],
  },
  "image-upscaling": {
    id: "image-upscaling",
    name: "图像超分辨率",
    description: "提升图像分辨率和质量的工作流，适用于低分辨率图像增强。",
    imageUrl: "/placeholder.svg?height=300&width=400",
    cost: 0.1,
    accessType: "free",
    parameters: [
      {
        id: "image",
        name: "图像",
        type: "image",
        required: true,
        description: "上传需要提升分辨率的图像",
        multiple: false,
      },
      {
        id: "scale",
        name: "缩放比例",
        type: "number",
        required: false,
        default: 2,
        min: 2,
        max: 4,
        description: "放大倍数",
      },
    ],
  },
  "style-transfer": {
    id: "style-transfer",
    name: "风格迁移",
    description: "将一种艺术风格应用到图像上的工作流，创建艺术效果。",
    imageUrl: "/placeholder.svg?height=300&width=400",
    cost: 0.2,
    accessType: "pay-per-use",
    parameters: [
      {
        id: "content",
        name: "内容图像",
        type: "image",
        required: true,
        description: "上传要应用风格的内容图像",
        multiple: false,
      },
      {
        id: "style",
        name: "风格图像",
        type: "image",
        required: true,
        description: "上传提供风格的参考图像",
        multiple: false,
      },
      {
        id: "strength",
        name: "强度",
        type: "number",
        required: false,
        default: 0.7,
        min: 0.1,
        max: 1.0,
        step: 0.1,
        description: "风格应用强度",
      },
    ],
  },
  "background-removal": {
    id: "background-removal",
    name: "背景移除",
    description: "自动移除图像背景，支持批量处理",
    imageUrl: "/placeholder.svg?height=300&width=400",
    cost: 0.1,
    accessType: "free",
    parameters: [
      {
        id: "images",
        name: "图像",
        type: "image",
        required: true,
        description: "上传需要移除背景的图像",
        multiple: true,
        maxImages: 5,
      },
      {
        id: "transparent",
        name: "透明背景",
        type: "checkbox",
        required: false,
        default: true,
        description: "输出透明背景而不是白色背景",
      },
    ],
  },
}

// Simplified task type
type Task = {
  id: string
  workflowId: string
  status: "pending" | "processing" | "completed" | "failed"
  parameters: Record<string, any>
  createdAt: string
  progress?: number
  errorMessage?: string
  outputs?: { url: string; caption?: string }[]
}

interface WorkflowExecutorProps {
  workflowId: string
}

export default function WorkflowExecutor({ workflowId }: WorkflowExecutorProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [workflow, setWorkflow] = useState(
    workflowsData[workflowId as keyof typeof workflowsData] || workflowsData["stable-diffusion-xl"],
  )

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const [tasksPerPage, setTasksPerPage] = useState(5)

  // 当工作流ID变化时更新工作流数据
  useEffect(() => {
    if (workflowId && workflowsData[workflowId as keyof typeof workflowsData]) {
      setWorkflow(workflowsData[workflowId as keyof typeof workflowsData])
    }
  }, [workflowId])

  const handleSubmit = (formData: Record<string, any>) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      workflowId: workflow.id,
      status: "pending",
      parameters: formData,
      createdAt: new Date().toISOString(),
    }

    setTasks((prev) => [newTask, ...prev])
    // 新任务添加后，确保显示第一页
    setCurrentPage(1)

    // Simulate task execution
    setTimeout(() => {
      setTasks((prev) =>
        prev.map((task) => (task.id === newTask.id ? { ...task, status: "processing", progress: 0 } : task)),
      )

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setTasks((prev) => {
          const updatedTasks = prev.map((task) => {
            if (task.id === newTask.id && task.status === "processing") {
              const newProgress = (task.progress || 0) + 10
              if (newProgress >= 100) {
                clearInterval(progressInterval)
                return {
                  ...task,
                  status: Math.random() > 0.8 ? "failed" : "completed",
                  progress: 100,
                  ...(Math.random() > 0.8
                    ? { errorMessage: "随机生成的错误，用于演示" }
                    : {
                        outputs: [
                          { url: "/placeholder.svg?height=512&width=512", caption: "生成的图像 - 视角1" },
                          { url: "/placeholder.svg?height=512&width=512", caption: "生成的图像 - 视角2" },
                        ],
                      }),
                }
              }
              return { ...task, progress: newProgress }
            }
            return task
          })
          return updatedTasks
        })
      }, 500)
    }, 1000)
  }

  // 根据标签筛选任务
  const filteredTasks = activeTab === "all" ? tasks : tasks.filter((task) => task.status === activeTab)

  // 计算总页数
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage)

  // 获取当前页的任务
  const currentTasks = filteredTasks.slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage)

  // 页码变更处理
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // 删除任务
  const deleteTask = (taskId: string) => {
    setTasks((prev) => {
      const newTasks = prev.filter((task) => task.id !== taskId)
      // 如果当前页没有任务了且不是第一页，则返回上一页
      if (currentPage > 1 && (currentPage - 1) * tasksPerPage >= newTasks.length) {
        setCurrentPage(currentPage - 1)
      }
      return newTasks
    })
  }

  // 生成页码数组
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5 // 最多显示的页码数

    if (totalPages <= maxPagesToShow) {
      // 如果总页数小于等于最大显示数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // 否则，显示当前页附近的页码
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
      let endPage = startPage + maxPagesToShow - 1

      if (endPage > totalPages) {
        endPage = totalPages
        startPage = Math.max(1, endPage - maxPagesToShow + 1)
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }
    }

    return pageNumbers
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left side - Parameter input area */}
      <div className="lg:col-span-1">
        <Card className="h-full bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">参数设置</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkflowForm workflow={workflow} onSubmit={handleSubmit} />
          </CardContent>
        </Card>
      </div>

      {/* Right side - Task execution area */}
      <div className="lg:col-span-2">
        <Card className="h-full bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg text-white">任务列表</CardTitle>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
                <TabsList className="grid grid-cols-4 bg-gray-800 border border-gray-700">
                  <TabsTrigger value="all" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    全部
                  </TabsTrigger>
                  <TabsTrigger
                    value="pending"
                    className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
                  >
                    等待中
                  </TabsTrigger>
                  <TabsTrigger
                    value="processing"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    执行中
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                  >
                    已完成
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-4 overflow-auto" style={{ maxHeight: "calc(100vh - 250px)" }}>
            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-gray-800 p-3 mb-4">
                  <Clock className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-white">暂无任务</h3>
                <p className="text-sm text-gray-400 mt-1">提交新任务后将在此处显示</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onDelete={deleteTask} />
                ))}
              </div>
            )}
          </CardContent>

          {/* 分页控制 */}
          {filteredTasks.length > 0 && (
            <CardFooter className="flex justify-between items-center border-t border-gray-800 px-4 py-3">
              <div className="text-sm text-gray-400">
                共 {filteredTasks.length} 个任务，第 {currentPage} / {totalPages} 页
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                >
                  <span className="sr-only">首页</span>
                  <ChevronLeft className="h-4 w-4" />
                  <ChevronLeft className="h-4 w-4 -ml-2" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                >
                  <span className="sr-only">上一页</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {getPageNumbers().map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      "h-8 w-8 p-0",
                      currentPage === page
                        ? "bg-purple-600 text-white"
                        : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700",
                    )}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="h-8 w-8 p-0 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                >
                  <span className="sr-only">下一页</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="h-8 w-8 p-0 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                >
                  <span className="sr-only">末页</span>
                  <ChevronRight className="h-4 w-4" />
                  <ChevronRight className="h-4 w-4 -ml-2" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">每页显示:</span>
                <select
                  value={tasksPerPage}
                  onChange={(e) => {
                    setTasksPerPage(Number(e.target.value))
                    setCurrentPage(1) // 重置到第一页
                  }}
                  className="bg-gray-800 border border-gray-700 rounded text-sm text-gray-300 p-1"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}

