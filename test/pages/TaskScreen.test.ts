import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react'
import type { Task } from '../../src/domain/Task.ts'
import type { TaskList } from '../../src/domain/TaskList.ts'
import TasksScreen from '../../src/pages/TasksScreen.tsx'

const mocks = vi.hoisted(() => ({
    routeTaskListId: 'list-1' as string | undefined,
    getTaskListById: vi.fn(),
    getTasksByTaskListId: vi.fn(),
    createNewTaskInTaskList: vi.fn(),
    updateTaskInTaskList: vi.fn(),
    deleteTaskFromTaskList: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
    useParams: () => ({ taskListId: mocks.routeTaskListId }),
}))

vi.mock('../../src/utilities/RestHandler.ts', () => ({
    default: vi.fn(function MockRestHandler() {
        return {
            getTaskListById: mocks.getTaskListById,
            getTasksByTaskListId: mocks.getTasksByTaskListId,
            createNewTaskInTaskList: mocks.createNewTaskInTaskList,
            updateTaskInTaskList: mocks.updateTaskInTaskList,
            deleteTaskFromTaskList: mocks.deleteTaskFromTaskList,
        }
    }),
}))

vi.mock('../../src/components/BaseScreen.tsx', () => ({
    default: ({ children }: { children: React.ReactNode }) =>
        React.createElement('main', null, children),
}))

vi.mock('../../src/components/ScreenHeader.tsx', () => ({
    default: ({
        title,
        subtitle,
        loading,
        onCreateClicked,
        collapseAll,
        onToggleCollapseAll,
    }: {
        title?: string
        subtitle?: string
        loading?: boolean
        onCreateClicked: (event: React.MouseEvent<HTMLButtonElement>) => void
        collapseAll: boolean
        onToggleCollapseAll: () => void
    }) =>
        React.createElement(
            'header',
            null,
            React.createElement('h1', null, title),
            subtitle && React.createElement('h2', null, subtitle),
            loading &&
                React.createElement(
                    'div',
                    { role: 'status', 'aria-label': 'loading' },
                    'loading',
                ),
            React.createElement(
                'button',
                {
                    type: 'button',
                    onClick: onToggleCollapseAll,
                    'aria-label': collapseAll ? 'expand_all' : 'collapse_all',
                    'aria-expanded': !collapseAll,
                },
                collapseAll ? 'expand_all' : 'collapse_all',
            ),
            React.createElement(
                'button',
                {
                    type: 'button',
                    onClick: onCreateClicked,
                    'aria-label': 'create_new_task',
                },
                'create_new_task',
            ),
        ),
}))

vi.mock('../../src/components/TaskElement.tsx', () => ({
    default: ({
        task,
        collapsed,
        onEditClicked,
        onDeleteClicked,
    }: {
        task: Task
        collapsed: boolean
        onEditClicked: (
            event: React.MouseEvent<HTMLButtonElement>,
            task: Task,
        ) => void
        onDeleteClicked: (
            event: React.MouseEvent<HTMLButtonElement>,
            task: Task,
        ) => void
    }) =>
        React.createElement(
            'li',
            { 'data-collapsed': String(collapsed) },
            React.createElement('span', null, task.title),
            React.createElement('span', null, task.description),
            React.createElement(
                'button',
                {
                    type: 'button',
                    onClick: (
                        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                    ) => onEditClicked(event, task),
                    'aria-label': `edit ${task.title}`,
                },
                `edit ${task.title}`,
            ),
            React.createElement(
                'button',
                {
                    type: 'button',
                    onClick: (
                        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                    ) => onDeleteClicked(event, task),
                    'aria-label': `delete ${task.title}`,
                },
                `delete ${task.title}`,
            ),
        ),
}))

vi.mock('../../src/dialogs/TaskDialog.tsx', () => ({
    default: ({
        open,
        initialData,
        dialogTitle,
        onSubmit,
        onCancel,
    }: {
        open: boolean
        initialData: Task | null
        dialogTitle: string
        onSubmit: (formData: {
            id?: string
            title: string
            description: string
            dueDate: string
            positionInList: number | undefined
            priority: 'LOW' | 'MEDIUM' | 'HIGH'
            status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED'
        }) => Promise<void>
        onCancel: () => void
    }) => {
        if (!open) return null

        return React.createElement(
            'section',
            { role: 'dialog', 'aria-label': dialogTitle },
            React.createElement(
                'p',
                null,
                initialData?.title ?? 'no initial data',
            ),
            React.createElement(
                'button',
                {
                    type: 'button',
                    onClick: () =>
                        onSubmit({
                            id: initialData?.id,
                            title: initialData
                                ? 'Updated task'
                                : 'Created task',
                            description: initialData
                                ? 'Updated task description'
                                : 'Created task description',
                            dueDate: '2026-06-26T14:30:00.000Z',
                            positionInList: initialData?.positionInList ?? 0,
                            priority: initialData?.priority ?? 'LOW',
                            status: initialData?.status ?? 'OPEN',
                        }),
                    'aria-label': 'submit task dialog',
                },
                'submit task dialog',
            ),
            React.createElement(
                'button',
                {
                    type: 'button',
                    onClick: onCancel,
                    'aria-label': 'cancel task dialog',
                },
                'cancel task dialog',
            ),
        )
    },
}))

vi.mock('../../src/dialogs/DeleteConfirmationDialog.tsx', () => ({
    default: ({
        open,
        item,
        onCancel,
        onConfirm,
    }: {
        open: boolean
        item: Task | null
        onCancel: () => void
        onConfirm: () => void | Promise<void>
    }) => {
        if (!open) return null

        return React.createElement(
            'section',
            { role: 'dialog', 'aria-label': 'delete_confirmation' },
            React.createElement('p', null, item?.title),
            React.createElement(
                'button',
                {
                    type: 'button',
                    onClick: () => onConfirm(),
                    'aria-label': 'confirm delete',
                },
                'confirm delete',
            ),
            React.createElement(
                'button',
                {
                    type: 'button',
                    onClick: onCancel,
                    'aria-label': 'cancel delete',
                },
                'cancel delete',
            ),
        )
    },
}))

describe('<TasksScreen />', () => {
    const taskList: TaskList = {
        id: 'list-1',
        title: 'Release checklist',
        description: 'Tasks needed before release.',
        completionRatio: 0.5,
    }

    const initialTasks: Task[] = [
        {
            id: 'task-1',
            title: 'Write tests',
            description: 'Cover screen behavior.',
            dueDate: '2026-06-26T14:30:00.000Z',
            positionInList: 1,
            priority: 'HIGH',
            status: 'IN_PROGRESS',
        },
        {
            id: 'task-2',
            title: 'Update docs',
            description: 'Document the release process.',
            dueDate: '2026-06-27T14:30:00.000Z',
            positionInList: 2,
            priority: 'MEDIUM',
            status: 'OPEN',
        },
    ]

    beforeEach(() => {
        vi.clearAllMocks()

        mocks.routeTaskListId = 'list-1'

        mocks.getTaskListById.mockResolvedValue(taskList)
        mocks.getTasksByTaskListId.mockResolvedValue(initialTasks)
        mocks.createNewTaskInTaskList.mockResolvedValue(undefined)
        mocks.updateTaskInTaskList.mockResolvedValue(undefined)
        mocks.deleteTaskFromTaskList.mockResolvedValue(undefined)
    })

    afterEach(() => {
        cleanup()
    })

    it('loads the task list and tasks for the route task-list id', async () => {
        render(React.createElement(TasksScreen))

        await waitFor(() => {
            expect(mocks.getTaskListById).toHaveBeenCalledWith('list-1')
        })

        expect(mocks.getTasksByTaskListId).toHaveBeenCalledWith('list-1')

        expect(await screen.findByText('Release checklist')).toBeInTheDocument()
        expect(screen.getByText('Write tests')).toBeInTheDocument()
        expect(screen.getByText('Update docs')).toBeInTheDocument()
    })

    it('does not load data when the route has no task-list id', async () => {
        mocks.routeTaskListId = undefined

        render(React.createElement(TasksScreen))

        await waitFor(() => {
            expect(mocks.getTaskListById).not.toHaveBeenCalled()
        })

        expect(mocks.getTasksByTaskListId).not.toHaveBeenCalled()
    })

    it('renders the task-list title and description in the header', async () => {
        render(React.createElement(TasksScreen))

        expect(
            await screen.findByRole('heading', { name: 'Release checklist' }),
        ).toBeInTheDocument()
        expect(
            screen.getByRole('heading', {
                name: 'Tasks needed before release.',
            }),
        ).toBeInTheDocument()
    })

    it('opens the create task dialog from the header', async () => {
        render(React.createElement(TasksScreen))

        await screen.findByText('Write tests')

        fireEvent.click(screen.getByRole('button', { name: 'create_new_task' }))

        expect(
            screen.getByRole('dialog', { name: 'create_new_task' }),
        ).toBeInTheDocument()
        expect(screen.getByText('no initial data')).toBeInTheDocument()
    })

    it('creates a task and refreshes the task list', async () => {
        mocks.getTasksByTaskListId
            .mockResolvedValueOnce(initialTasks)
            .mockResolvedValueOnce([
                ...initialTasks,
                {
                    id: 'task-3',
                    title: 'Created task',
                    description: 'Created task description',
                    dueDate: '2026-06-26T14:30:00.000Z',
                    positionInList: 3,
                    priority: 'LOW',
                    status: 'OPEN',
                },
            ])

        render(React.createElement(TasksScreen))

        await screen.findByText('Write tests')

        fireEvent.click(screen.getByRole('button', { name: 'create_new_task' }))
        fireEvent.click(
            screen.getByRole('button', { name: 'submit task dialog' }),
        )

        await waitFor(() => {
            expect(mocks.createNewTaskInTaskList).toHaveBeenCalledTimes(1)
        })

        expect(mocks.createNewTaskInTaskList).toHaveBeenCalledWith(
            'list-1',
            expect.objectContaining({
                id: undefined,
                title: 'Created task',
                description: 'Created task description',
                priority: 'LOW',
                status: 'OPEN',
                positionInList: undefined,
            }),
        )

        await waitFor(() => {
            expect(screen.getByText('Created task')).toBeInTheDocument()
        })

        expect(mocks.getTasksByTaskListId).toHaveBeenCalledTimes(2)
    })

    it('opens the edit task dialog with the selected task', async () => {
        render(React.createElement(TasksScreen))

        await screen.findByText('Write tests')

        fireEvent.click(
            screen.getByRole('button', { name: 'edit Write tests' }),
        )

        expect(
            screen.getByRole('dialog', { name: 'edit_task' }),
        ).toBeInTheDocument()
        const element = screen.getAllByText('Write tests')[0]
        expect(element).toBeInTheDocument()
    })

    it('updates a task and refreshes the task list', async () => {
        mocks.getTasksByTaskListId
            .mockResolvedValueOnce(initialTasks)
            .mockResolvedValueOnce([
                {
                    ...initialTasks[0],
                    title: 'Updated task',
                    description: 'Updated task description',
                },
                initialTasks[1],
            ])

        render(React.createElement(TasksScreen))

        await screen.findByText('Write tests')

        fireEvent.click(
            screen.getByRole('button', { name: 'edit Write tests' }),
        )
        fireEvent.click(
            screen.getByRole('button', { name: 'submit task dialog' }),
        )

        await waitFor(() => {
            expect(mocks.updateTaskInTaskList).toHaveBeenCalledTimes(1)
        })

        expect(mocks.updateTaskInTaskList).toHaveBeenCalledWith(
            'list-1',
            'task-1',
            expect.objectContaining({
                id: 'task-1',
                title: 'Updated task',
                description: 'Updated task description',
                positionInList: 1,
                priority: 'HIGH',
                status: 'IN_PROGRESS',
            }),
        )

        await waitFor(() => {
            expect(screen.getByText('Updated task')).toBeInTheDocument()
        })
    })

    it('opens the delete confirmation dialog for the selected task', async () => {
        render(React.createElement(TasksScreen))

        await screen.findByText('Write tests')

        fireEvent.click(
            screen.getByRole('button', { name: 'delete Write tests' }),
        )

        expect(
            screen.getByRole('dialog', { name: 'delete_confirmation' }),
        ).toBeInTheDocument()
        const element = screen.getAllByText('Write tests')[0]
        expect(element).toBeInTheDocument()
    })

    it('deletes a task and removes it from the screen', async () => {
        render(React.createElement(TasksScreen))

        await screen.findByText('Write tests')

        fireEvent.click(
            screen.getByRole('button', { name: 'delete Write tests' }),
        )
        fireEvent.click(screen.getByRole('button', { name: 'confirm delete' }))

        await waitFor(() => {
            expect(mocks.deleteTaskFromTaskList).toHaveBeenCalledTimes(1)
        })

        expect(mocks.deleteTaskFromTaskList).toHaveBeenCalledWith(
            'list-1',
            'task-1',
        )

        await waitFor(() => {
            expect(screen.queryByText('Write tests')).not.toBeInTheDocument()
        })

        expect(screen.getByText('Update docs')).toBeInTheDocument()
    })

    it('closes the task dialog when cancelled', async () => {
        render(React.createElement(TasksScreen))

        await screen.findByText('Write tests')

        fireEvent.click(screen.getByRole('button', { name: 'create_new_task' }))

        expect(
            screen.getByRole('dialog', { name: 'create_new_task' }),
        ).toBeInTheDocument()

        fireEvent.click(
            screen.getByRole('button', { name: 'cancel task dialog' }),
        )

        expect(
            screen.queryByRole('dialog', { name: 'create_new_task' }),
        ).not.toBeInTheDocument()
    })

    it('closes the delete confirmation dialog when cancelled', async () => {
        render(React.createElement(TasksScreen))

        await screen.findByText('Write tests')

        fireEvent.click(
            screen.getByRole('button', { name: 'delete Write tests' }),
        )

        expect(
            screen.getByRole('dialog', { name: 'delete_confirmation' }),
        ).toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: 'cancel delete' }))

        expect(
            screen.queryByRole('dialog', { name: 'delete_confirmation' }),
        ).not.toBeInTheDocument()
    })

    it('toggles collapse state for rendered task elements', async () => {
        render(React.createElement(TasksScreen))

        await screen.findByText('Write tests')

        const taskItem = screen.getByText('Write tests').closest('li')

        expect(taskItem).toHaveAttribute('data-collapsed', 'true')

        fireEvent.click(screen.getByRole('button', { name: 'expand_all' }))

        expect(taskItem).toHaveAttribute('data-collapsed', 'false')
    })
})
