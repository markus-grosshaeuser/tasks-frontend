import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import TaskListElement, {
    type TaskListElementProps,
} from '../../src/components/TaskListElement'
import type { TaskList } from '../../src/domain/TaskList.ts'

describe('<TaskListElement />', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    const taskList: TaskList = {
        id: 'task-list-1',
        title: 'Release checklist',
        description: 'Everything needed before release.',
        completionRatio: 0.75,
    }

    const renderComponent = (
        propsOverrides: Partial<TaskListElementProps> = {},
    ) => {
        const props: TaskListElementProps = {
            taskList,
            collapsed: true,
            onElementClicked: vi.fn(),
            onDeleteClicked: vi.fn(),
            onEditClicked: vi.fn(),
            ...propsOverrides,
        }

        return {
            ...render(<TaskListElement {...props} />),
            props,
        }
    }

    it('renders the task list as a list item', () => {
        renderComponent()

        expect(screen.getByRole('listitem')).toBeInTheDocument()
    })

    it('renders the task list title and description', () => {
        renderComponent()

        expect(screen.getByText('Release checklist')).toBeInTheDocument()
        expect(
            screen.getByText('Everything needed before release.'),
        ).toBeInTheDocument()
    })

    it('renders the completion ratio as a percentage', () => {
        renderComponent()

        expect(
            screen.getByRole('progressbar', { name: 'completion_ratio' }),
        ).toHaveAttribute('aria-valuenow', '75')
    })

    it('uses zero as the completion ratio when completionRatio is missing', () => {
        renderComponent({
            taskList: {
                id: 'task-list-without-ratio',
                title: 'Inbox',
                description: 'Unsorted tasks.',
            },
        })

        expect(
            screen.getByRole('progressbar', { name: 'completion_ratio' }),
        ).toHaveAttribute('aria-valuenow', '0')
    })

    it('renders a clickable task list area with an accessible name', () => {
        renderComponent()

        expect(
            screen.getByRole('clickable-list-item', {
                name: 'open_task_list_named',
            }),
        ).toBeInTheDocument()
    })

    it('calls onElementClicked with the click event and task list', () => {
        const onElementClicked = vi.fn()

        renderComponent({ onElementClicked })

        fireEvent.click(
            screen.getByRole('clickable-list-item', {
                name: 'open_task_list_named',
            }),
        )

        expect(onElementClicked).toHaveBeenCalledTimes(1)
        expect(onElementClicked).toHaveBeenCalledWith(
            expect.objectContaining({}),
            taskList,
        )
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

    it('toggles from collapsed to expanded without opening the task list', () => {
        const onElementClicked = vi.fn()

        renderComponent({ collapsed: true, onElementClicked })

        fireEvent.click(screen.getByRole('button', { name: 'expand' }))

        expect(
            screen.getByRole('button', { name: 'collapse' }),
        ).toHaveAttribute('aria-expanded', 'true')
        expect(onElementClicked).not.toHaveBeenCalled()
    })

    it('toggles from expanded to collapsed without opening the task list', () => {
        const onElementClicked = vi.fn()

        renderComponent({ collapsed: false, onElementClicked })

        fireEvent.click(screen.getByRole('button', { name: 'collapse' }))

        expect(screen.getByRole('button', { name: 'expand' })).toHaveAttribute(
            'aria-expanded',
            'false',
        )
        expect(onElementClicked).not.toHaveBeenCalled()
    })

    it('syncs the collapse state when the collapsed prop changes', () => {
        const { rerender, props } = renderComponent({ collapsed: true })

        expect(screen.getByRole('button', { name: 'expand' })).toHaveAttribute(
            'aria-expanded',
            'false',
        )

        rerender(<TaskListElement {...props} collapsed={false} />)

        expect(
            screen.getByRole('button', { name: 'collapse' }),
        ).toHaveAttribute('aria-expanded', 'true')
    })

    it('calls onEditClicked with the click event and task list', () => {
        const onEditClicked = vi.fn()

        renderComponent({ onEditClicked })

        fireEvent.click(
            screen.getByRole('button', { name: 'edit_task_list_named' }),
        )

        expect(onEditClicked).toHaveBeenCalledTimes(1)
        expect(onEditClicked).toHaveBeenCalledWith(
            expect.objectContaining({}),
            taskList,
        )
    })

    it('calls onDeleteClicked with the click event and task list', () => {
        const onDeleteClicked = vi.fn()

        renderComponent({ onDeleteClicked })

        fireEvent.click(
            screen.getByRole('button', { name: 'delete_task_list_named' }),
        )

        expect(onDeleteClicked).toHaveBeenCalledTimes(1)
        expect(onDeleteClicked).toHaveBeenCalledWith(
            expect.objectContaining({}),
            taskList,
        )
    })
})
