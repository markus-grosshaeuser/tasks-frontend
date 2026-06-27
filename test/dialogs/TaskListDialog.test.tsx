import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react'
import TaskListDialog, {
    type ListFormData,
} from '../../src/dialogs/TaskListDialog'
import type { TaskList } from '../../src/domain/TaskList.ts'

describe('<TaskListDialog />', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        cleanup()
        vi.restoreAllMocks()
    })

    const existingTaskList: TaskList = {
        id: 'task-list-1',
        title: 'Release checklist',
        description: 'Everything needed before release.',
        completionRatio: 0.5,
    }

    const renderComponent = (
        propsOverrides: Partial<{
            open: boolean
            initialData: TaskList | null
            dialogTitle: string
            onSubmit: (taskList: ListFormData) => Promise<void>
            onCancel: () => void
        }> = {},
    ) => {
        const props = {
            open: true,
            initialData: null,
            dialogTitle: 'Create task list',
            onSubmit: vi.fn().mockResolvedValue(undefined),
            onCancel: vi.fn(),
            ...propsOverrides,
        }

        return {
            ...render(<TaskListDialog {...props} />),
            props,
        }
    }

    it('does not render the dialog content when open is false', () => {
        renderComponent({ open: false })

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('renders the dialog with the provided title', () => {
        renderComponent({ dialogTitle: 'Create a new task list' })

        expect(
            screen.getByRole('dialog', { name: 'Create a new task list' }),
        ).toBeInTheDocument()
    })

    it('renders create-mode helper text when initial data is not provided', () => {
        renderComponent({ initialData: null })

        expect(
            screen.getByText(
                'fill_in_the_details_below_to_create_a_new_resource',
            ),
        ).toBeInTheDocument()
    })

    it('renders edit-mode helper text when initial data is provided', () => {
        renderComponent({
            dialogTitle: 'Edit task list',
            initialData: existingTaskList,
        })

        expect(screen.getByText('update_the_details_below')).toBeInTheDocument()
    })

    it('renders empty form fields in create mode', () => {
        renderComponent({ initialData: null })

        expect(screen.getByRole('textbox', { name: 'title' })).toHaveValue('')
        expect(
            screen.getByRole('textbox', { name: 'description' }),
        ).toHaveValue('')
    })

    it('populates form fields from initial data in edit mode', () => {
        renderComponent({
            dialogTitle: 'Edit task list',
            initialData: existingTaskList,
        })

        expect(screen.getByRole('textbox', { name: 'title' })).toHaveValue(
            'Release checklist',
        )
        expect(
            screen.getByRole('textbox', { name: 'description' }),
        ).toHaveValue('Everything needed before release.')
    })

    it('disables submit in create mode when the title is empty', () => {
        renderComponent({ initialData: null })

        expect(screen.getByRole('button', { name: 'create' })).toBeDisabled()
    })

    it('enables submit after a title is entered', () => {
        renderComponent({ initialData: null })

        fireEvent.change(screen.getByRole('textbox', { name: 'title' }), {
            target: { value: 'Inbox' },
        })

        expect(screen.getByRole('button', { name: 'create' })).toBeEnabled()
    })

    it('updates text fields when the user types', () => {
        renderComponent({ initialData: null })

        fireEvent.change(screen.getByRole('textbox', { name: 'title' }), {
            target: { value: 'Inbox' },
        })
        fireEvent.change(screen.getByRole('textbox', { name: 'description' }), {
            target: { value: 'Tasks without a list.' },
        })

        expect(screen.getByRole('textbox', { name: 'title' })).toHaveValue(
            'Inbox',
        )
        expect(
            screen.getByRole('textbox', { name: 'description' }),
        ).toHaveValue('Tasks without a list.')
    })

    it('submits create form data', async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined)

        renderComponent({ initialData: null, onSubmit })

        fireEvent.change(screen.getByRole('textbox', { name: 'title' }), {
            target: { value: 'Inbox' },
        })
        fireEvent.change(screen.getByRole('textbox', { name: 'description' }), {
            target: { value: 'Tasks without a list.' },
        })

        fireEvent.click(screen.getByRole('button', { name: 'create' }))

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1)
        })

        expect(onSubmit).toHaveBeenCalledWith({
            id: undefined,
            title: 'Inbox',
            description: 'Tasks without a list.',
        })
    })

    it('submits edit form data with the existing id', async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined)

        renderComponent({
            dialogTitle: 'Edit task list',
            initialData: existingTaskList,
            onSubmit,
        })

        fireEvent.change(screen.getByRole('textbox', { name: 'title' }), {
            target: { value: 'Updated release checklist' },
        })

        fireEvent.click(screen.getByRole('button', { name: 'update' }))

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1)
        })

        expect(onSubmit).toHaveBeenCalledWith({
            id: 'task-list-1',
            title: 'Updated release checklist',
            description: 'Everything needed before release.',
        })
    })

    it('calls onCancel when the cancel button is clicked', () => {
        const onCancel = vi.fn()

        renderComponent({ onCancel })

        fireEvent.click(screen.getByRole('button', { name: 'cancel' }))

        expect(onCancel).toHaveBeenCalledTimes(1)
    })

    it('disables actions and shows saving text while submitting', async () => {
        let resolveSubmit: () => void = () => undefined
        const onSubmit = vi.fn(
            () =>
                new Promise<void>((resolve) => {
                    resolveSubmit = resolve
                }),
        )

        renderComponent({ initialData: null, onSubmit })

        fireEvent.change(screen.getByRole('textbox', { name: 'title' }), {
            target: { value: 'Inbox' },
        })

        fireEvent.click(screen.getByRole('button', { name: 'create' }))

        expect(
            await screen.findByRole('button', { name: 'saving' }),
        ).toBeDisabled()
        expect(screen.getByRole('button', { name: 'cancel' })).toBeDisabled()

        resolveSubmit()

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1)
        })
    })

    it('resets create-mode form values when reopened without initial data', () => {
        const { rerender, props } = renderComponent({ initialData: null })

        fireEvent.change(screen.getByRole('textbox', { name: 'title' }), {
            target: { value: 'Temporary title' },
        })

        expect(screen.getByRole('textbox', { name: 'title' })).toHaveValue(
            'Temporary title',
        )

        rerender(<TaskListDialog {...props} open={false} />)
        rerender(<TaskListDialog {...props} open={true} initialData={null} />)

        expect(screen.getByRole('textbox', { name: 'title' })).toHaveValue('')
    })
})
