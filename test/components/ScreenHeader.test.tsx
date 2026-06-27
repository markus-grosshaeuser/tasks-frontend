import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import ScreenHeader, {
    type ScreenHeaderProps,
} from '../../src/components/ScreenHeader'

describe('<ScreenHeader />', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    const defaultProps: ScreenHeaderProps = {
        title: 'Task lists',
        subtitle: 'Select a list to see its tasks',
        loading: false,
        onCreateClicked: vi.fn(),
        ariaResourceName: 'TaskList',
        collapseAll: false,
        onToggleCollapseAll: vi.fn(),
    }

    const renderComponent = (
        propsOverrides: Partial<ScreenHeaderProps> = {},
    ) => {
        const props = {
            ...defaultProps,
            onCreateClicked: vi.fn(),
            onToggleCollapseAll: vi.fn(),
            ...propsOverrides,
        }

        return {
            ...render(<ScreenHeader {...props} />),
            props,
        }
    }

    it('renders the provided title as the main heading', () => {
        renderComponent()

        expect(
            screen.getByRole('heading', { level: 1, name: 'Task lists' }),
        ).toBeInTheDocument()
    })

    it('renders the subtitle when provided', () => {
        renderComponent()

        expect(
            screen.getByRole('heading', {
                level: 2,
                name: 'Select a list to see its tasks',
            }),
        ).toBeInTheDocument()
    })

    it('does not render a subtitle heading when subtitle is omitted', () => {
        renderComponent({ subtitle: undefined })

        expect(
            screen.queryByRole('heading', { level: 2 }),
        ).not.toBeInTheDocument()
    })

    it('falls back to the application name when title is omitted', () => {
        renderComponent({ title: undefined })

        expect(
            screen.getByRole('heading', { level: 1, name: 'app_name' }),
        ).toBeInTheDocument()
    })

    it('renders a loader when loading is true', () => {
        renderComponent({ loading: true })

        expect(
            screen.getByRole('progressbar', { name: 'loading' }),
        ).toBeInTheDocument()
    })

    it('does not render a loader when loading is false', () => {
        renderComponent({ loading: false })

        expect(
            screen.queryByRole('progressbar', { name: 'loading' }),
        ).not.toBeInTheDocument()
    })

    it('renders a create task list button for task list resources', () => {
        renderComponent({ ariaResourceName: 'TaskList' })

        expect(
            screen.getByRole('button', { name: 'create_new_task_list' }),
        ).toBeInTheDocument()
    })

    it('renders a create task button for task resources', () => {
        renderComponent({ ariaResourceName: 'Task' })

        expect(
            screen.getByRole('button', { name: 'create_new_task' }),
        ).toBeInTheDocument()
    })

    it('calls onCreateClicked when the create button is clicked', () => {
        const onCreateClicked = vi.fn()

        renderComponent({ onCreateClicked, ariaResourceName: 'TaskList' })

        fireEvent.click(
            screen.getByRole('button', { name: 'create_new_task_list' }),
        )

        expect(onCreateClicked).toHaveBeenCalledTimes(1)
        expect(onCreateClicked).toHaveBeenCalledWith(
            expect.objectContaining({}),
        )
    })

    it('renders a collapse all button when not all content is collapsed', () => {
        renderComponent({ collapseAll: false })

        const button = screen.getByRole('button', { name: 'collapse_all' })

        expect(button).toBeInTheDocument()
        expect(button).toHaveAttribute('aria-expanded', 'true')
    })

    it('renders an expand all button when all content is collapsed', () => {
        renderComponent({ collapseAll: true })

        const button = screen.getByRole('button', { name: 'expand_all' })

        expect(button).toBeInTheDocument()
        expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('calls onToggleCollapseAll when the collapse or expand all button is clicked', () => {
        const onToggleCollapseAll = vi.fn()

        renderComponent({ collapseAll: false, onToggleCollapseAll })

        fireEvent.click(screen.getByRole('button', { name: 'collapse_all' }))

        expect(onToggleCollapseAll).toHaveBeenCalledTimes(1)
    })

    it('updates the collapse all button after rerendering', () => {
        const { rerender, props } = renderComponent({ collapseAll: false })

        expect(
            screen.getByRole('button', { name: 'collapse_all' }),
        ).toHaveAttribute('aria-expanded', 'true')

        rerender(<ScreenHeader {...props} collapseAll={true} />)

        expect(
            screen.getByRole('button', { name: 'expand_all' }),
        ).toHaveAttribute('aria-expanded', 'false')
    })
})
