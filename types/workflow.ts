export interface Parameter {
  id: string
  name: string
  type: "text" | "number" | "select" | "checkbox"
  required: boolean
  description?: string
  default?: any
  min?: number
  max?: number
  step?: number
  options?: { label: string; value: any }[]
}

export interface WorkflowData {
  id: string
  name: string
  description: string
  imageUrl: string
  parameters: Parameter[]
}

export interface TaskOutput {
  type: "image" | "video" | "text"
  url: string
  caption?: string
}

export interface Task {
  id: string
  workflowId: string
  status: "pending" | "processing" | "completed" | "failed"
  parameters: Record<string, any>
  createdAt: string // Changed from Date to string
  startedAt?: string // Changed from Date to string
  completedAt?: string // Changed from Date to string
  outputs: TaskOutput[]
}
