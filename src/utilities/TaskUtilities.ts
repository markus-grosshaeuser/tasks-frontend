import type { TaskFormData } from '../dialogs/TaskDialog.tsx'
import dayjs from 'dayjs'
import type { Task } from '../domain/Task.ts'

export function taskUpdateFromFormData(formData: TaskFormData): Task {
    return {
        id: formData.id,
        title: formData.title,
        description: formData.description,
        dueDate: dayjs(formData.dueDate)
            .add(dayjs(new Date()).utcOffset(), 'minutes')
            .toISOString(),
        positionInList: formData.positionInList,
        priority: formData.priority,
        status: formData.status,
    }
}

export function taskCreateFromFormData(formData: TaskFormData): Task {
    return {
        id: undefined,
        title: formData.title,
        description: formData.description,
        dueDate: dayjs(formData.dueDate)
            .add(dayjs(new Date()).utcOffset(), 'minutes')
            .toISOString(),
        positionInList: undefined,
        priority: formData.priority,
        status: 'OPEN',
    }
}