import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import EditDeleteButtonGroup from '../../src/components/EditDeleteButtonGroup.tsx'
import type { Task } from '../../src/domain/Task.ts'
import type { TaskList } from '../../src/domain/TaskList.ts'

describe('<EditDeleteButtonGroup />', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        cleanup()
        vi.restoreAllMocks()
    })

    const task: Task = {
        id: 'task-1',
        title: 'Prepare release',
        description: 'Check the release notes before publishing.',
        dueDate: '2026-06-26T12:00:00.000Z',
        positionInList: 1,
        priority: 'HIGH',
        status: 'OPEN',
    }

    const taskList: TaskList = {
        id: 'task-list-1',
        title: 'Release checklist',
        description: 'Everything needed before release.',
        completionRatio: 0.5,
    }

    it('renders edit and delete buttons for a task with accessible names', () => {
        render(
            <EditDeleteButtonGroup
                element={task}
                typeOfElement="Task"
                editCallback={vi.fn()}
                deleteCallback={vi.fn()}
            />,
        )

        expect(
            screen.getByRole('button', { name: 'edit_task_named' }),
        ).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: 'delete_task_named' }),
        ).toBeInTheDocument()
    })

    it('calls the task edit callback with the click event and task', () => {
        const editCallback = vi.fn()

        render(
            <EditDeleteButtonGroup
                element={task}
                typeOfElement="Task"
                editCallback={editCallback}
                deleteCallback={vi.fn()}
            />,
        )

        fireEvent.click(screen.getByRole('button', { name: 'edit_task_named' }))

        expect(editCallback).toHaveBeenCalledTimes(1)
        expect(editCallback).toHaveBeenCalledWith(
            expect.objectContaining({}),
            task,
        )
    })

    it('calls the task delete callback with the click event and task', () => {
        const deleteCallback = vi.fn()

        render(
            <EditDeleteButtonGroup
                element={task}
                typeOfElement="Task"
                editCallback={vi.fn()}
                deleteCallback={deleteCallback}
            />,
        )

        fireEvent.click(
            screen.getByRole('button', { name: 'delete_task_named' }),
        )

        expect(deleteCallback).toHaveBeenCalledTimes(1)
        expect(deleteCallback).toHaveBeenCalledWith(
            expect.objectContaining({}),
            task,
        )
    })

    it('renders edit and delete buttons for a task list with accessible names', () => {
        render(
            <EditDeleteButtonGroup
                element={taskList}
                typeOfElement="TaskList"
                editCallback={vi.fn()}
                deleteCallback={vi.fn()}
            />,
        )

        expect(
            screen.getByRole('button', { name: 'edit_task_list_named' }),
        ).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: 'delete_task_list_named' }),
        ).toBeInTheDocument()
    })

    it('calls the task list callbacks with the task list element', () => {
        const editCallback = vi.fn()
        const deleteCallback = vi.fn()

        render(
            <EditDeleteButtonGroup
                element={taskList}
                typeOfElement="TaskList"
                editCallback={editCallback}
                deleteCallback={deleteCallback}
            />,
        )

        fireEvent.click(
            screen.getByRole('button', { name: 'edit_task_list_named' }),
        )
        fireEvent.click(
            screen.getByRole('button', { name: 'delete_task_list_named' }),
        )

        expect(editCallback).toHaveBeenCalledWith(
            expect.objectContaining({}),
            taskList,
        )
        expect(deleteCallback).toHaveBeenCalledWith(
            expect.objectContaining({}),
            taskList,
        )
    })

})
