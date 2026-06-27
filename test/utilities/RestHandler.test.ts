import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import RestHandler from '../../src/utilities/RestHandler.ts'
import type { TaskList } from '../../src/domain/TaskList.ts'
import type { Task } from '../../src/domain/Task.ts'

vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}))

const mockedAxios = vi.mocked(axios)

describe('RestHandler', () => {
    const baseUrl = 'http://localhost:8080/task-lists'

    const taskList: TaskList = {
        id: 'list-1',
        title: 'Release checklist',
        description: 'Tasks needed before release.',
        completionRatio: 0.75,
    }

    const task: Task = {
        id: 'task-1',
        title: 'Prepare release',
        description: 'Check release notes.',
        dueDate: '2026-06-26T14:30:00.000Z',
        positionInList: 1,
        priority: 'HIGH',
        status: 'IN_PROGRESS',
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('gets all task lists', async () => {
        const taskLists = [taskList]
        mockedAxios.get.mockResolvedValue({ data: taskLists })

        const result = await new RestHandler().getTaskLists()

        expect(mockedAxios.get).toHaveBeenCalledTimes(1)
        expect(mockedAxios.get).toHaveBeenCalledWith(baseUrl)
        expect(result).toEqual(taskLists)
    })

    it('gets a task list by id', async () => {
        mockedAxios.get.mockResolvedValue({ data: taskList })

        const result = await new RestHandler().getTaskListById('list-1')

        expect(mockedAxios.get).toHaveBeenCalledTimes(1)
        expect(mockedAxios.get).toHaveBeenCalledWith(`${baseUrl}/list-1`)
        expect(result).toEqual(taskList)
    })

    it('creates a new task list', async () => {
        const newTaskList: TaskList = {
            title: 'Inbox',
            description: 'Unsorted tasks.',
        }
        const createdTaskList: TaskList = {
            ...newTaskList,
            id: 'list-2',
        }

        mockedAxios.post.mockResolvedValue({ data: createdTaskList })

        const result = await new RestHandler().createNewTaskList(newTaskList)

        expect(mockedAxios.post).toHaveBeenCalledTimes(1)
        expect(mockedAxios.post).toHaveBeenCalledWith(baseUrl, newTaskList)
        expect(result).toEqual(createdTaskList)
    })

    it('updates a task list', async () => {
        const updatedTaskList: TaskList = {
            ...taskList,
            title: 'Updated release checklist',
        }

        mockedAxios.put.mockResolvedValue({ data: updatedTaskList })

        const result = await new RestHandler().updateTaskList(updatedTaskList)

        expect(mockedAxios.put).toHaveBeenCalledTimes(1)
        expect(mockedAxios.put).toHaveBeenCalledWith(
            `${baseUrl}/list-1`,
            updatedTaskList,
        )
        expect(result).toEqual(updatedTaskList)
    })

    it('deletes a task list', async () => {
        mockedAxios.delete.mockResolvedValue({ data: undefined })

        const result = await new RestHandler().deleteTaskList(taskList)

        expect(mockedAxios.delete).toHaveBeenCalledTimes(1)
        expect(mockedAxios.delete).toHaveBeenCalledWith(`${baseUrl}/list-1`)
        expect(result).toBeUndefined()
    })

    it('gets all tasks for a task list', async () => {
        const tasks = [task]
        mockedAxios.get.mockResolvedValue({ data: tasks })

        const result = await new RestHandler().getTasksByTaskListId('list-1')

        expect(mockedAxios.get).toHaveBeenCalledTimes(1)
        expect(mockedAxios.get).toHaveBeenCalledWith(`${baseUrl}/list-1/tasks`)
        expect(result).toEqual(tasks)
    })

    it('gets a task by task list id and task id', async () => {
        mockedAxios.get.mockResolvedValue({ data: task })

        const result = await new RestHandler().getTasksByTaskListIdAndId(
            'list-1',
            'task-1',
        )

        expect(mockedAxios.get).toHaveBeenCalledTimes(1)
        expect(mockedAxios.get).toHaveBeenCalledWith(
            `${baseUrl}/list-1/tasks/task-1`,
        )
        expect(result).toEqual(task)
    })

    it('creates a new task in a task list', async () => {
        const newTask: Task = {
            ...task,
            id: undefined,
            title: 'Created task',
            positionInList: undefined,
            status: 'OPEN',
        }
        const createdTask: Task = {
            ...newTask,
            id: 'task-2',
        }

        mockedAxios.post.mockResolvedValue({ data: createdTask })

        const result = await new RestHandler().createNewTaskInTaskList(
            'list-1',
            newTask,
        )

        expect(mockedAxios.post).toHaveBeenCalledTimes(1)
        expect(mockedAxios.post).toHaveBeenCalledWith(
            `${baseUrl}/list-1/tasks`,
            newTask,
        )
        expect(result).toEqual(createdTask)
    })

    it('updates a task in a task list', async () => {
        const updatedTask: Task = {
            ...task,
            title: 'Updated task',
        }

        mockedAxios.put.mockResolvedValue({ data: updatedTask })

        const result = await new RestHandler().updateTaskInTaskList(
            'list-1',
            'task-1',
            updatedTask,
        )

        expect(mockedAxios.put).toHaveBeenCalledTimes(1)
        expect(mockedAxios.put).toHaveBeenCalledWith(
            `${baseUrl}/list-1/tasks/task-1`,
            updatedTask,
        )
        expect(result).toEqual(updatedTask)
    })

    it('deletes a task from a task list', async () => {
        mockedAxios.delete.mockResolvedValue({ data: undefined })

        const result = await new RestHandler().deleteTaskFromTaskList(
            'list-1',
            'task-1',
        )

        expect(mockedAxios.delete).toHaveBeenCalledTimes(1)
        expect(mockedAxios.delete).toHaveBeenCalledWith(
            `${baseUrl}/list-1/tasks/task-1`,
        )
        expect(result).toBeUndefined()
    })

    it('rejects when getting task lists fails', async () => {
        const error = new Error('Network error')
        mockedAxios.get.mockRejectedValue(error)

        await expect(new RestHandler().getTaskLists()).rejects.toThrow(
            'Network error',
        )
    })

    it('rejects when creating a task list fails', async () => {
        const error = new Error('Create failed')
        mockedAxios.post.mockRejectedValue(error)

        await expect(
            new RestHandler().createNewTaskList(taskList),
        ).rejects.toThrow('Create failed')
    })

    it('rejects when updating a task fails', async () => {
        const error = new Error('Update failed')
        mockedAxios.put.mockRejectedValue(error)

        await expect(
            new RestHandler().updateTaskInTaskList('list-1', 'task-1', task),
        ).rejects.toThrow('Update failed')
    })

    it('rejects when deleting a task list fails', async () => {
        const error = new Error('Delete failed')
        mockedAxios.delete.mockRejectedValue(error)

        await expect(
            new RestHandler().deleteTaskList(taskList),
        ).rejects.toThrow('Delete failed')
    })
})
