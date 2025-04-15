"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, Loader2, AlertTriangle, Download, Trash2 } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface TaskOutput {
  url: string
  caption?: string
}

interface Task {
  id: string
  workflowId: string
  status: "pending" | "processing" | "completed" | "failed"
  parameters: Record<string, any>
  createdAt: string
  progress?: number
  errorMessage?: string
  outputs?: TaskOutput[]
}

interface TaskCardProps {
  task: Task
  onDelete: (taskId: string) => void
}

export default function TaskCard({ task, onDelete }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false)

  // Status badge styling
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "outline"
      case "processing":
        return "secondary"
      case "completed":
        return "default"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Status icon
  const StatusIcon = () => {
    switch (task.status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "processing":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "failed":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  // Status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "等待中"
      case "processing":
        return "执行中"
      case "completed":
        return "已完成"
      case "failed":
        return "失败"
      default:
        return status
    }
  }

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-200 bg-gray-900 border-gray-800",
        task.status === "failed" ? "border-red-800" : "",
        task.status === "completed" ? "border-green-800" : "",
      )}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <StatusIcon />

            <div>
              <div className="font-medium flex items-center text-white">
                任务 #{task.id.split("-")[1]}
                <Badge variant={getBadgeVariant(task.status)} className="ml-2">
                  {getStatusText(task.status)}
                </Badge>
              </div>
              <div className="text-xs text-gray-400">{new Date(task.createdAt).toLocaleString()}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {task.status === "completed" && (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                <Download className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-400"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <path
                    d="M3.13523 8.84197C3.3241 9.04343 3.64052 9.05363 3.84197 8.86477L7.5 5.43536L11.158 8.86477C11.3595 9.05363 11.6759 9.04343 11.8648 8.84197C12.0536 8.64051 12.0434 8.32409 11.842 8.13523L7.84197 4.38523C7.64964 4.20492 7.35036 4.20492 7.15803 4.38523L3.15803 8.13523C2.95657 8.32409 2.94637 8.64051 3.13523 8.84197Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <path
                    d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </Button>
          </div>
        </div>

        {/* Progress bar for processing tasks */}
        {task.status === "processing" && task.progress !== undefined && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">处理中...</span>
              <span className="text-gray-400">{task.progress}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${task.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4">
          {/* Parameters */}
          <div className="mb-4">
            <div className="text-sm font-medium mb-1 text-gray-300">参数:</div>
            <div className="bg-gray-800 rounded-md p-3 text-xs font-mono max-h-32 overflow-y-auto text-gray-300">
              <pre>{JSON.stringify(task.parameters, null, 2)}</pre>
            </div>
          </div>

          {/* Error message for failed tasks */}
          {task.status === "failed" && task.errorMessage && (
            <div className="mb-4">
              <div className="text-sm font-medium text-red-400 mb-1">错误信息:</div>
              <div className="bg-red-900/30 border border-red-800 text-red-300 rounded-md p-3 text-xs">
                {task.errorMessage}
              </div>
            </div>
          )}

          {/* Outputs for completed tasks */}
          {task.status === "completed" && task.outputs && task.outputs.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2 text-gray-300">输出:</div>
              <div className="grid grid-cols-2 gap-3">
                {task.outputs.map((output, index) => (
                  <div key={index} className="group relative">
                    <div className="relative aspect-square rounded-md overflow-hidden border border-gray-700 bg-gray-800">
                      <Image
                        src={output.url || "/placeholder.svg"}
                        alt={output.caption || `输出 ${index + 1}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button variant="secondary" size="sm" className="shadow-lg">
                          <Download className="h-4 w-4 mr-1" /> 下载
                        </Button>
                      </div>
                    </div>
                    {output.caption && (
                      <p className="text-xs text-center mt-1 text-gray-400 truncate">{output.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

