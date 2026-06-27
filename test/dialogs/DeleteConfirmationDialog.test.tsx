import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react'
import DeleteConfirmationDialog from '../../src/dialogs/DeleteConfirmationDialog'
import type { Task } from '../../src/domain/Task.ts'
import type { TaskList } from '../../src/domain/TaskList.ts'

describe('<DeleteConfirmationDialog />', () => {

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
        dueDate: '2026-06-26T14:30:00.000Z',
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

    it('does not render when open is false', () => {
        render(
            <DeleteConfirmationDialog
                open={false}
                item={task}
                onCancel={vi.fn()}
                onConfirm={vi.fn()}
            />,
        )

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('renders the confirmation dialog when open is true', () => {
        render(
            <DeleteConfirmationDialog
                open={true}
                item={task}
                onCancel={vi.fn()}
                onConfirm={vi.fn()}
            />,
        )

        expect(
            screen.getByRole('dialog', { name: 'delete_confirmation' }),
        ).toBeInTheDocument()
    })

    it('renders the delete confirmation message for the provided item', () => {
        render(
            <DeleteConfirmationDialog
                open={true}
                item={task}
                onCancel={vi.fn()}
                onConfirm={vi.fn()}
            />,
        )

        expect(
            screen.getByText('delete_confirmation_message'),
        ).toBeInTheDocument()
        expect(
            screen.getByText('this_action_cannot_be_undone'),
        ).toBeInTheDocument()
    })

    it('renders a custom description when provided', () => {
        render(
            <DeleteConfirmationDialog
                open={true}
                item={task}
                description="Deleting this task cannot be reversed."
                onCancel={vi.fn()}
                onConfirm={vi.fn()}
            />,
        )

        expect(
            screen.getByText('Deleting this task cannot be reversed.'),
        ).toBeInTheDocument()
        expect(
            screen.queryByText('this_action_cannot_be_undone'),
        ).not.toBeInTheDocument()
    })

    it('renders cancel and delete actions', () => {
        render(
            <DeleteConfirmationDialog
                open={true}
                item={task}
                onCancel={vi.fn()}
                onConfirm={vi.fn()}
            />,
        )

        expect(
            screen.getByRole('button', { name: 'cancel' }),
        ).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: 'delete' }),
        ).toBeInTheDocument()
    })

    it('calls onCancel when the cancel button is clicked', () => {
        const onCancel = vi.fn()

        render(
            <DeleteConfirmationDialog
                open={true}
                item={task}
                onCancel={onCancel}
                onConfirm={vi.fn()}
            />,
        )

        fireEvent.click(screen.getByRole('button', { name: 'cancel' }))

        expect(onCancel).toHaveBeenCalledTimes(1)
    })

    it('calls onConfirm and then onCancel when delete succeeds', async () => {
        const onCancel = vi.fn()
        const onConfirm = vi.fn().mockResolvedValue(undefined)

        render(
            <DeleteConfirmationDialog
                open={true}
                item={task}
                onCancel={onCancel}
                onConfirm={onConfirm}
            />,
        )

        fireEvent.click(screen.getByRole('button', { name: 'delete' }))

        await waitFor(() => {
            expect(onConfirm).toHaveBeenCalledTimes(1)
        })

        expect(onCancel).toHaveBeenCalledTimes(1)
    })

    it('does not call onCancel when delete fails', async () => {
        const onCancel = vi.fn()
        const onConfirm = vi.fn().mockRejectedValue(new Error('Delete failed'))
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => undefined)

        render(
            <DeleteConfirmationDialog
                open={true}
                item={task}
                onCancel={onCancel}
                onConfirm={onConfirm}
            />,
        )

        fireEvent.click(screen.getByRole('button', { name: 'delete' }))

        await waitFor(() => {
            expect(onConfirm).toHaveBeenCalledTimes(1)
        })

        expect(onCancel).not.toHaveBeenCalled()
        expect(consoleError).toHaveBeenCalled()

        consoleError.mockRestore()
    })

    it('disables both actions while externally loading', () => {
        render(
            <DeleteConfirmationDialog
                open={true}
                item={task}
                loading={true}
                onCancel={vi.fn()}
                onConfirm={vi.fn()}
            />,
        )

        expect(screen.getByRole('button', { name: 'cancel' })).toBeDisabled()
        expect(screen.getByRole('button', { name: 'deleting' })).toBeDisabled()
    })

    it('shows the deleting state while confirmation is pending', async () => {
        let resolveConfirm: () => void = () => undefined
        const onConfirm = vi.fn(
            () =>
                new Promise<void>((resolve) => {
                    resolveConfirm = resolve
                }),
        )

        render(
            <DeleteConfirmationDialog
                open={true}
                item={taskList}
                onCancel={vi.fn()}
                onConfirm={onConfirm}
            />,
        )

        fireEvent.click(screen.getByRole('button', { name: 'delete' }))

        expect(
            await screen.findByRole('button', { name: 'deleting' }),
        ).toBeDisabled()

        resolveConfirm()

        await waitFor(() => {
            expect(onConfirm).toHaveBeenCalledTimes(1)
        })
    })
})
