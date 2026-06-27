export type Task = {
    id: string | undefined
    title: string
    description: string
    dueDate: string
    positionInList: number | undefined
    priority: TaskPriority
    status: TaskStatus
    createdDate?: Date
    updatedDate?: Date
}

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'
export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED'


