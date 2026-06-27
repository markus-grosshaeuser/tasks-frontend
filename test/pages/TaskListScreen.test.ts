import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react'
import type { TaskList } from '../../src/domain/TaskList.ts'
import TaskListsScreen from '../../src/pages/TaskListsScreen.tsx'

const mocks = vi.hoisted(() => ({
    navigate: vi.fn(),
    getTaskLists: vi.fn(),
    createNewTaskList: vi.fn(),
    updateTaskList: vi.fn(),
    deleteTaskList: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
    useNavigate: () => mocks.navigate,
}))

vi.mock('../../src/utilities/RestHandler.ts', () => ({
    default: vi.fn(function MockRestHandler() {
        return {
            getTaskLists: mocks.getTaskLists,
            createNewTaskList: mocks.createNewTaskList,
            updateTaskList: mocks.updateTaskList,
            deleteTaskList: mocks.deleteTaskList,
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
        loading,
        onCreateClicked,
        collapseAll,
        onToggleCollapseAll,
    }: {
        title?: string
        loading?: boolean
        onCreateClicked: (event: React.MouseEvent<HTMLButtonElement>) => void
        collapseAll: boolean
        onToggleCollapseAll: () => void
    }) =>
        React.createElement(
            'header',
            null,
            React.createElement('h1', null, title),
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
                    'aria-label': 'create_new_task_list',
                },
                'create_new_task_list',
            ),
        ),
}))

vi.mock('../../src/components/TaskListElement.tsx', () => ({
    default: ({
        taskList,
        collapsed,
        onElementClicked,
        onEditClicked,
        onDeleteClicked,
    }: {
        taskList: TaskList
        collapsed: boolean
        onElementClicked: (
            event: React.MouseEvent<HTMLButtonElement>,
            taskList: TaskList,
        ) => void
        onEditClicked: (
            event: React.MouseEvent<HTMLButtonElement>,
            taskList: TaskList,
        ) => void
        onDeleteClicked: (
            event: React.MouseEvent<HTMLButtonElement>,
            taskList: TaskList,
        ) => void
    }) =>
        React.createElement(
            'li',
            { 'data-collapsed': String(collapsed) },
            React.createElement('span', null, taskList.title),
            React.createElement('span', null, taskList.description),
            React.createElement(
                'button',
                {
                    type: 'button',
                    onClick: (
                        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                    ) => onElementClicked(event, taskList),
                    'aria-label': `open ${taskList.title}`,
                },
                `open ${taskList.title}`,
            ),
            React.createElement(
                'button',
                {
                    type: 'button',
                    onClick: (
                        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                    ) => onEditClicked(event, taskList),
                    'aria-label': `edit ${taskList.title}`,
                },
                `edit ${taskList.title}`,
            ),
            React.createElement(
                'button',
                {
                    type: 'button',
                    onClick: (
                        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                    ) => onDeleteClicked(event, taskList),
                    'aria-label': `delete ${taskList.title}`,
                },
                `delete ${taskList.title}`,
            ),
        ),
}))

vi.mock('../../src/dialogs/TaskListDialog.tsx', () => ({
    default: ({
        open,
        initialData,
        dialogTitle,
        onSubmit,
        onCancel,
    }: {
        open: boolean
        initialData: TaskList | null
        dialogTitle: string
        onSubmit: (formData: {
            id?: string
            title: string
            description: string
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
                                ? 'Updated task list'
                                : 'Created task list',
                            description: initialData
                                ? 'Updated description'
                                : 'Created description',
                        }),
                    'aria-label': 'submit task list dialog',
                },
                'submit task list dialog',
            ),
            React.createElement(
                'button',
                {
                    type: 'button',
                    onClick: onCancel,
                    'aria-label': 'cancel task list dialog',
                },
                'cancel task list dialog',
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
        item: TaskList | null
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

describe('<TaskListsScreen />', () => {
    const initialTaskLists: TaskList[] = [
        {
            id: 'list-1',
            title: 'Inbox',
            description: 'Unsorted tasks.',
            completionRatio: 0.25,
        },
        {
            id: 'list-2',
            title: 'Release checklist',
            description: 'Release preparation tasks.',
            completionRatio: 0.75,
        },
    ]

    beforeEach(() => {
        vi.clearAllMocks()
        mocks.getTaskLists.mockResolvedValue(initialTaskLists)
        mocks.createNewTaskList.mockResolvedValue(undefined)
        mocks.updateTaskList.mockResolvedValue(undefined)
        mocks.deleteTaskList.mockResolvedValue(undefined)
    })

    afterEach(() => {
        cleanup()
    })

    it('loads and renders task lists', async () => {
        render(React.createElement(TaskListsScreen))

        expect(mocks.getTaskLists).toHaveBeenCalledTimes(1)

        expect(await screen.findByText('Inbox')).toBeInTheDocument()
        expect(screen.getByText('Release checklist')).toBeInTheDocument()
    })

    it('renders the task-list screen heading', async () => {
        render(React.createElement(TaskListsScreen))

        expect(
            await screen.findByRole('heading', { name: 'task_lists' }),
        ).toBeInTheDocument()
    })

    it('navigates to the selected task list', async () => {
        render(React.createElement(TaskListsScreen))

        await screen.findByText('Inbox')

        fireEvent.click(screen.getByRole('button', { name: 'open Inbox' }))

        expect(mocks.navigate).toHaveBeenCalledTimes(1)
        expect(mocks.navigate).toHaveBeenCalledWith('/list-1')
    })

    it('opens the create dialog from the header', async () => {
        render(React.createElement(TaskListsScreen))

        await screen.findByText('Inbox')

        fireEvent.click(
            screen.getByRole('button', { name: 'create_new_task_list' }),
        )

        expect(
            screen.getByRole('dialog', { name: 'create_new_task_list' }),
        ).toBeInTheDocument()
        expect(screen.getByText('no initial data')).toBeInTheDocument()
    })

    it('creates a task list and refreshes the list', async () => {
        mocks.getTaskLists
            .mockResolvedValueOnce(initialTaskLists)
            .mockResolvedValueOnce([
                ...initialTaskLists,
                {
                    id: 'list-3',
                    title: 'Created task list',
                    description: 'Created description',
                },
            ])

        render(React.createElement(TaskListsScreen))

        await screen.findByText('Inbox')

        fireEvent.click(
            screen.getByRole('button', { name: 'create_new_task_list' }),
        )
        fireEvent.click(
            screen.getByRole('button', { name: 'submit task list dialog' }),
        )

        await waitFor(() => {
            expect(mocks.createNewTaskList).toHaveBeenCalledTimes(1)
        })

        expect(mocks.createNewTaskList).toHaveBeenCalledWith({
            id: undefined,
            title: 'Created task list',
            description: 'Created description',
        })

        await waitFor(() => {
            expect(screen.getByText('Created task list')).toBeInTheDocument()
        })

        expect(mocks.getTaskLists).toHaveBeenCalledTimes(2)
    })

    it('opens the edit dialog with the selected task list', async () => {
        render(React.createElement(TaskListsScreen))

        await screen.findByText('Inbox')

        fireEvent.click(screen.getByRole('button', { name: 'edit Inbox' }))

        expect(
            screen.getByRole('dialog', { name: 'edit_task_list' }),
        ).toBeInTheDocument()
        const element = screen.getAllByText('Inbox')[0]
        expect(element).toBeInTheDocument()
    })

    it('updates a task list and refreshes the list', async () => {
        mocks.getTaskLists
            .mockResolvedValueOnce(initialTaskLists)
            .mockResolvedValueOnce([
                {
                    id: 'list-1',
                    title: 'Updated task list',
                    description: 'Updated description',
                },
            ])

        render(React.createElement(TaskListsScreen))

        await screen.findByText('Inbox')

        fireEvent.click(screen.getByRole('button', { name: 'edit Inbox' }))
        fireEvent.click(
            screen.getByRole('button', { name: 'submit task list dialog' }),
        )

        await waitFor(() => {
            expect(mocks.updateTaskList).toHaveBeenCalledTimes(1)
        })

        expect(mocks.updateTaskList).toHaveBeenCalledWith({
            id: 'list-1',
            title: 'Updated task list',
            description: 'Updated description',
        })

        await waitFor(() => {
            expect(screen.getByText('Updated task list')).toBeInTheDocument()
        })
    })

    it('opens the delete confirmation dialog for the selected task list', async () => {
        render(React.createElement(TaskListsScreen))

        await screen.findByText('Inbox')

        fireEvent.click(screen.getByRole('button', { name: 'delete Inbox' }))

        expect(
            screen.getByRole('dialog', { name: 'delete_confirmation' }),
        ).toBeInTheDocument()
        const element = screen.getAllByText('Inbox')[0]
        expect(element).toBeInTheDocument()
    })

    it('deletes a task list and removes it from the screen', async () => {
        render(React.createElement(TaskListsScreen))

        await screen.findByText('Inbox')

        fireEvent.click(screen.getByRole('button', { name: 'delete Inbox' }))
        fireEvent.click(screen.getByRole('button', { name: 'confirm delete' }))

        await waitFor(() => {
            expect(mocks.deleteTaskList).toHaveBeenCalledTimes(1)
        })

        expect(mocks.deleteTaskList).toHaveBeenCalledWith(initialTaskLists[0])

        await waitFor(() => {
            expect(screen.queryByText('Inbox')).not.toBeInTheDocument()
        })

        expect(screen.getByText('Release checklist')).toBeInTheDocument()
    })

    it('closes the task-list dialog when cancelled', async () => {
        render(React.createElement(TaskListsScreen))

        await screen.findByText('Inbox')

        fireEvent.click(
            screen.getByRole('button', { name: 'create_new_task_list' }),
        )

        expect(
            screen.getByRole('dialog', { name: 'create_new_task_list' }),
        ).toBeInTheDocument()

        fireEvent.click(
            screen.getByRole('button', { name: 'cancel task list dialog' }),
        )

        expect(
            screen.queryByRole('dialog', { name: 'create_new_task_list' }),
        ).not.toBeInTheDocument()
    })

    it('toggles collapse state for rendered task-list elements', async () => {
        render(React.createElement(TaskListsScreen))

        await screen.findByText('Inbox')

        const listItem = screen.getByText('Inbox').closest('li')

        expect(listItem).toHaveAttribute('data-collapsed', 'true')

        fireEvent.click(screen.getByRole('button', { name: 'expand_all' }))

        expect(listItem).toHaveAttribute('data-collapsed', 'false')
    })
})
