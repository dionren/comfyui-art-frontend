"use client"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@/types/workflow"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Clock, CheckCircle, Loader2 } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"

interface TaskListProps {
  tasks: Task[]
}

// Fix the date handling in the component
export default function TaskList({ tasks }: TaskListProps) {
  const [openTasks, setOpenTasks] = useState<Record<string, boolean>>({})

  const toggleTask = (taskId: string) => {
    setOpenTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }))
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <Clock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">暂无任务</h3>
        <p className="text-sm text-muted-foreground mt-1">提交新任务后将在此处显示</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Collapsible
          key={task.id}
          open={openTasks[task.id]}
          onOpenChange={() => toggleTask(task.id)}
          className="border rounded-lg overflow-hidden"
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              {task.status === "pending" && <Clock className="h-5 w-5 text-yellow-500" />}
              {task.status === "processing" && <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />}
              {task.status === "completed" && <CheckCircle className="h-5 w-5 text-green-500" />}

              <div>
                <div className="font-medium">
                  任务 #{task.id.split("-")[1]}
                  <Badge
                    variant={
                      task.status === "completed" ? "default" : task.status === "processing" ? "secondary" : "outline"
                    }
                    className="ml-2"
                  >
                    {task.status === "pending" ? "等待中" : task.status === "processing" ? "执行中" : "已完成"}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {/* Safely handle date formatting */}
                  {task.createdAt ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true }) : "刚刚"}
                </div>
              </div>
            </div>

            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {openTasks[task.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            <div className="px-4 pb-4 pt-0">
              <div className="text-sm font-medium mb-2">参数:</div>
              <div className="bg-muted rounded-md p-3 text-xs font-mono mb-4 max-h-32 overflow-y-auto">
                <pre>{JSON.stringify(task.parameters, null, 2)}</pre>
              </div>

              {task.status === "completed" && task.outputs && task.outputs.length > 0 && (
                <>
                  <div className="text-sm font-medium mb-2">输出:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {task.outputs.map((output, index) => (
                      <div key={index} className="relative">
                        <div className="relative aspect-square rounded-md overflow-hidden border">
                          <Image
                            src={output.url || "/placeholder.svg"}
                            alt={output.caption || `输出 ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {output.caption && (
                          <p className="text-xs text-center mt-1 text-muted-foreground truncate">{output.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}
