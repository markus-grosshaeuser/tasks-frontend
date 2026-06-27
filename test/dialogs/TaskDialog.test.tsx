import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
    within,
} from '@testing-library/react'
import TaskDialog, { type TaskFormData } from '../../src/dialogs/TaskDialog'
import type { Task } from '../../src/domain/Task.ts'

describe('<TaskDialog />', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        cleanup()
        vi.restoreAllMocks()
    })

    const existingTask: Task = {
        id: 'task-1',
        title: 'Prepare release',
        description: 'Check the release notes before publishing.',
        dueDate: '2026-06-26T14:30:00.000Z',
        positionInList: 2,
        priority: 'HIGH',
        status: 'IN_PROGRESS',
    }

    const renderComponent = (
        propsOverrides: Partial<{
            open: boolean
            initialData: Task | null
            dialogTitle: string
            onSubmit: (task: TaskFormData) => Promise<void>
            onCancel: () => void
        }> = {},
    ) => {
        const props = {
            open: true,
            initialData: null,
            dialogTitle: 'Create task',
            onSubmit: vi.fn().mockResolvedValue(undefined),
            onCancel: vi.fn(),
            ...propsOverrides,
        }

        return {
            ...render(<TaskDialog {...props} />),
            props,
        }
    }

    const openSelect = (name: string) => {
        const comboboxes = screen.getAllByRole('combobox')
        let box
        for (const combobox of comboboxes) {
            if (combobox.id === `mui-component-select-${name}`) {
                box = combobox
            }
        }
        if (box) {
            fireEvent.mouseDown(box)
        }
        return screen.getByRole('listbox')
    }

    it('does not render the dialog content when open is false', () => {
        renderComponent({ open: false })

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('renders the dialog with the provided title', () => {
        renderComponent({ dialogTitle: 'Create a new task' })

        expect(
            screen.getByRole('dialog', { name: 'Create a new task' }),
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
            dialogTitle: 'Edit task',
            initialData: existingTask,
        })

        expect(screen.getByText('update_the_details_below')).toBeInTheDocument()
    })

    it('renders empty text fields and default select values in create mode', () => {
        renderComponent({ initialData: null })

        expect(screen.getByRole('textbox', { name: 'title' })).toHaveValue('')
        expect(
            screen.getByRole('textbox', { name: 'description' }),
        ).toHaveValue('')

        const comboboxes = screen.getAllByRole('combobox')
        let priorityCombo
        let statusCombo
        for (const combobox of comboboxes) {
            if (combobox.id === 'mui-component-select-priority') {
                priorityCombo = combobox
            }
            if (combobox.id === 'mui-component-select-status') {
                statusCombo = combobox
            }
        }

        expect(priorityCombo).toHaveTextContent('LOW')
        expect(statusCombo).toHaveTextContent('OPEN')
    })

    it('populates fields from initial data in edit mode', () => {
        renderComponent({
            dialogTitle: 'Edit task',
            initialData: existingTask,
        })

        expect(screen.getByRole('textbox', { name: 'title' })).toHaveValue(
            'Prepare release',
        )
        expect(
            screen.getByRole('textbox', { name: 'description' }),
        ).toHaveValue('Check the release notes before publishing.')

        const comboboxes = screen.getAllByRole('combobox')
        let priorityCombo
        let statusCombo
        for (const combobox of comboboxes) {
            if (combobox.id === 'mui-component-select-priority') {
                priorityCombo = combobox
            }
            if (combobox.id === 'mui-component-select-status') {
                statusCombo = combobox
            }
        }

        expect(priorityCombo).toHaveTextContent('HIGH')
        expect(statusCombo).toHaveTextContent('IN_PROGRESS')
    })

    it('disables submit in create mode when the title is empty', () => {
        renderComponent({ initialData: null })

        expect(screen.getByRole('button', { name: 'create' })).toBeDisabled()
    })

    it('enables submit after a title is entered', () => {
        renderComponent({ initialData: null })

        fireEvent.change(screen.getByRole('textbox', { name: 'title' }), {
            target: { value: 'Write tests' },
        })

        expect(screen.getByRole('button', { name: 'create' })).toBeEnabled()
    })

    it('updates title and description fields when the user types', () => {
        renderComponent({ initialData: null })

        fireEvent.change(screen.getByRole('textbox', { name: 'title' }), {
            target: { value: 'Write tests' },
        })
        fireEvent.change(screen.getByRole('textbox', { name: 'description' }), {
            target: { value: 'Cover the dialog behavior.' },
        })

        expect(screen.getByRole('textbox', { name: 'title' })).toHaveValue(
            'Write tests',
        )
        expect(
            screen.getByRole('textbox', { name: 'description' }),
        ).toHaveValue('Cover the dialog behavior.')
    })

    it('updates the priority selection', () => {
        renderComponent({ initialData: null })

        const listbox = openSelect('priority')

        fireEvent.click(within(listbox).getByRole('option', { name: 'HIGH' }))

        const comboboxes = screen.getAllByRole('combobox')
        let priorityCombo
        for (const combobox of comboboxes) {
            if (combobox.id === 'mui-component-select-priority') {
                priorityCombo = combobox
            }
        }

        expect(priorityCombo).toHaveTextContent('HIGH')
    })

    it('updates the status selection', () => {
        renderComponent({ initialData: null })

        const listbox = openSelect('status')

        fireEvent.click(
            within(listbox).getByRole('option', { name: 'IN_PROGRESS' }),
        )

        const comboboxes = screen.getAllByRole('combobox')
        let statusCombo
        for (const combobox of comboboxes) {
            if (combobox.id === 'mui-component-select-status') {
                statusCombo = combobox
            }
        }

        expect(statusCombo).toHaveTextContent('IN_PROGRESS')
    })

    it('submits create form data with default priority and status', async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined)

        renderComponent({ initialData: null, onSubmit })

        fireEvent.change(screen.getByRole('textbox', { name: 'title' }), {
            target: { value: 'Write tests' },
        })
        fireEvent.change(screen.getByRole('textbox', { name: 'description' }), {
            target: { value: 'Cover the dialog behavior.' },
        })

        fireEvent.click(screen.getByRole('button', { name: 'create' }))

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1)
        })

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                id: undefined,
                title: 'Write tests',
                description: 'Cover the dialog behavior.',
                positionInList: 0,
                priority: 'LOW',
                status: 'OPEN',
            }),
        )
        expect(onSubmit.mock.calls[0][0].dueDate).toEqual(expect.any(String))
    })

    it('submits create form data with changed priority and status', async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined)

        renderComponent({ initialData: null, onSubmit })

        fireEvent.change(screen.getByRole('textbox', { name: 'title' }), {
            target: { value: 'Write tests' },
        })

        fireEvent.click(
            within(openSelect('priority')).getByRole('option', {
                name: 'HIGH',
            }),
        )
        fireEvent.click(
            within(openSelect('status')).getByRole('option', {
                name: 'COMPLETED',
            }),
        )

        fireEvent.click(screen.getByRole('button', { name: 'create' }))

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1)
        })

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                title: 'Write tests',
                priority: 'HIGH',
                status: 'COMPLETED',
            }),
        )
    })

    it('submits edit form data with the existing id and position', async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined)

        renderComponent({
            dialogTitle: 'Edit task',
            initialData: existingTask,
            onSubmit,
        })

        fireEvent.change(screen.getByRole('textbox', { name: 'title' }), {
            target: { value: 'Updated release task' },
        })

        fireEvent.click(screen.getByRole('button', { name: 'update' }))

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1)
        })

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'task-1',
                title: 'Updated release task',
                description: 'Check the release notes before publishing.',
                positionInList: 2,
                priority: 'HIGH',
                status: 'IN_PROGRESS',
            }),
        )
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
            target: { value: 'Write tests' },
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
            target: { value: 'Temporary task title' },
        })

        expect(screen.getByRole('textbox', { name: 'title' })).toHaveValue(
            'Temporary task title',
        )

        rerender(<TaskDialog {...props} open={false} />)
        rerender(<TaskDialog {...props} open={true} initialData={null} />)

        expect(screen.getByRole('textbox', { name: 'title' })).toHaveValue('')
    })
})
