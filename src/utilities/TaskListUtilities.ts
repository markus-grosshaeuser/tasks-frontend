import type { ListFormData } from '../dialogs/TaskListDialog.tsx'
import type { TaskList } from '../domain/TaskList.ts'

export function taskListUpdateFromFormData(formData: ListFormData): TaskList {
    return {
        id: formData.id,
        title: formData.title,
        description: formData.description,
    }
}

export function taskListCreateFromFormData(formData: ListFormData): TaskList {
    return {
        id: undefined,
        title: formData.title,
        description: formData.description,
    }
}