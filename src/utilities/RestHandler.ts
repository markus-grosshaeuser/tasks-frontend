import axios from 'axios'
import type { TaskList } from '../domain/TaskList.ts'
import type { Task } from '../domain/Task.ts'

export default class RestHandler {
    BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/task-lists'


    constructor() {}

    async getTaskLists(): Promise<TaskList[]> {
        const response = await axios.get<TaskList[]>(`${this.BASE_URL}`)
        return response.data
    }

    async getTaskListById(id: string): Promise<TaskList> {
        const response = await axios.get<TaskList>(`${this.BASE_URL}/${id}`)
        return response.data
    }

    async createNewTaskList(taskList: TaskList): Promise<TaskList> {
        const response = await axios.post<TaskList>(
            `${this.BASE_URL}`,
            taskList,
        )
        return response.data
    }

    async updateTaskList(taskList: TaskList): Promise<TaskList> {
        const response = await axios.put<TaskList>(
            `${this.BASE_URL}/${taskList.id}`,
            taskList,
        )
        return response.data
    }

    async deleteTaskList(taskList: TaskList): Promise<void> {
        const response = await axios.delete<void>(
            `${this.BASE_URL}/${taskList.id}`,
        )
        return response.data
    }

    async getTasksByTaskListId(id: string): Promise<Task[]> {
        const response = await axios.get<Task[]>(`${this.BASE_URL}/${id}/tasks`)
        return response.data
    }

    async getTasksByTaskListIdAndId(
        listId: string,
        taskId: string,
    ): Promise<Task> {
        const response = await axios.get<Task>(
            `${this.BASE_URL}/${listId}/tasks/${taskId}`,
        )
        return response.data
    }

    async createNewTaskInTaskList(listId: string, task: Task): Promise<Task> {
        const response = await axios.post<Task>(
            `${this.BASE_URL}/${listId}/tasks`,
            task,
        )
        return response.data
    }

    async updateTaskInTaskList(
        listId: string,
        taskId: string,
        task: Task,
    ): Promise<Task> {
        const response = await axios.put<Task>(
            `${this.BASE_URL}/${listId}/tasks/${taskId}`,
            task,
        )
        return response.data
    }

    async deleteTaskFromTaskList(
        listId: string,
        taskId: string,
    ): Promise<void> {
        const response = await axios.delete<void>(
            `${this.BASE_URL}/${listId}/tasks/${taskId}`,
        )
        return response.data
    }
}
