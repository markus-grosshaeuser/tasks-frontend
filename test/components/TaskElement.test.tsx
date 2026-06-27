import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import TaskElement, {
    type TaskElementProps,
} from '../../src/components/TaskElement'
import type { Task } from '../../src/domain/Task.ts'

vi.mock('dayjs', () => ({
    default: vi.fn(() => ({
        format: vi.fn(() => '26.06.2026 14:30'),
    })),
}))

describe('<TaskElement />', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    const task: Task = {
        id: 'task-1',
        title: 'Prepare release',
        description: 'Check the release notes before publishing.',
        dueDate: '2026-06-26T14:30:00.000Z',
        positionInList: 1,
        priority: 'HIGH',
        status: 'IN_PROGRESS',
    }

    const renderComponent = (
        propsOverrides: Partial<TaskElementProps> = {},
    ) => {
        const props: TaskElementProps = {
            task,
            collapsed: true,
            onDeleteClicked: vi.fn(),
            onEditClicked: vi.fn(),
            ...propsOverrides,
        }

        return {
            ...render(<TaskElement {...props} />),
            props,
        }
    }

    it('renders the task as a list item', () => {
        renderComponent()

        expect(screen.getByRole('listitem')).toBeInTheDocument()
    })

    it('renders the task title and description', () => {
        renderComponent()

        expect(screen.getByText('Prepare release')).toBeInTheDocument()
        expect(
            screen.getByText('Check the release notes before publishing.'),
        ).toBeInTheDocument()
    })

    it('renders task attributes', () => {
        renderComponent()

        expect(screen.getByText('26.06.2026 14:30')).toBeInTheDocument()
        expect(screen.getByText('HIGH')).toBeInTheDocument()
        expect(screen.getByText('IN_PROGRESS')).toBeInTheDocument()
    })

    it('starts collapsed when collapsed is true', () => {
        renderComponent({ collapsed: true })

        expect(screen.getByRole('button', { name: 'expand' })).toHaveAttribute(
            'aria-expanded',
            'false',
        )
    })

    it('starts expanded when collapsed is false', () => {
        renderComponent({ collapsed: false })

        expect(
            screen.getByRole('button', { name: 'collapse' }),
        ).toHaveAttribute('aria-expanded', 'true')
    })

    it('toggles from collapsed to expanded when the toggle button is clicked', () => {
        renderComponent({ collapsed: true })

        fireEvent.click(screen.getByRole('button', { name: 'expand' }))

        expect(
            screen.getByRole('button', { name: 'collapse' }),
        ).toHaveAttribute('aria-expanded', 'true')
    })

    it('toggles from expanded to collapsed when the toggle button is clicked', () => {
        renderComponent({ collapsed: false })

        fireEvent.click(screen.getByRole('button', { name: 'collapse' }))

        expect(screen.getByRole('button', { name: 'expand' })).toHaveAttribute(
            'aria-expanded',
            'false',
        )
    })

    it('syncs the collapse state when the collapsed prop changes', () => {
        const { rerender, props } = renderComponent({ collapsed: true })

        expect(screen.getByRole('button', { name: 'expand' })).toHaveAttribute(
            'aria-expanded',
            'false',
        )

        rerender(<TaskElement {...props} collapsed={false} />)

        expect(
            screen.getByRole('button', { name: 'collapse' }),
        ).toHaveAttribute('aria-expanded', 'true')
    })

    it('calls onEditClicked with the click event and task', () => {
        const onEditClicked = vi.fn()

        renderComponent({ onEditClicked })

        fireEvent.click(screen.getByRole('button', { name: 'edit_task_named' }))

        expect(onEditClicked).toHaveBeenCalledTimes(1)
        expect(onEditClicked).toHaveBeenCalledWith(
            expect.objectContaining({}),
            task,
        )
    })

    it('calls onDeleteClicked with the click event and task', () => {
        const onDeleteClicked = vi.fn()

        renderComponent({ onDeleteClicked })

        fireEvent.click(
            screen.getByRole('button', { name: 'delete_task_named' }),
        )

        expect(onDeleteClicked).toHaveBeenCalledTimes(1)
        expect(onDeleteClicked).toHaveBeenCalledWith(
            expect.objectContaining({}),
            task,
        )
    })
})
