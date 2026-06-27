import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import CollapseToggleButton from '../../src/components/CollapseToggleButton'

describe('<CollapseToggleButton />', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    it('renders an expand button when the content is collapsed', () => {
        render(
            <CollapseToggleButton
                isCollapsed={true}
                toggleCollapse={vi.fn()}
            />,
        )

        const button = screen.getByRole('button', { name: 'expand' })

        expect(button).toBeInTheDocument()
        expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('renders a collapse button when the content is expanded', () => {
        render(
            <CollapseToggleButton
                isCollapsed={false}
                toggleCollapse={vi.fn()}
            />,
        )

        const button = screen.getByRole('button', { name: 'collapse' })

        expect(button).toBeInTheDocument()
        expect(button).toHaveAttribute('aria-expanded', 'true')
    })

    it('calls toggleCollapse when clicked', () => {
        const toggleCollapse = vi.fn()

        render(
            <CollapseToggleButton
                isCollapsed={true}
                toggleCollapse={toggleCollapse}
            />,
        )

        fireEvent.click(screen.getByRole('button', { name: 'expand' }))

        expect(toggleCollapse).toHaveBeenCalledTimes(1)
    })

    it('passes the click event to toggleCollapse', () => {
        const toggleCollapse = vi.fn()

        render(
            <CollapseToggleButton
                isCollapsed={true}
                toggleCollapse={toggleCollapse}
            />,
        )

        const button = screen.getByRole('button', { name: 'expand' })
        fireEvent.click(button)

        expect(toggleCollapse).toHaveBeenCalledWith(expect.objectContaining({}))
    })

    it('updates accessible state after rerendering with a different collapsed value', () => {
        const { rerender } = render(
            <CollapseToggleButton
                isCollapsed={true}
                toggleCollapse={vi.fn()}
            />,
        )

        expect(screen.getByRole('button', { name: 'expand' })).toHaveAttribute(
            'aria-expanded',
            'false',
        )

        rerender(
            <CollapseToggleButton
                isCollapsed={false}
                toggleCollapse={vi.fn()}
            />,
        )

        expect(
            screen.getByRole('button', { name: 'collapse' }),
        ).toHaveAttribute('aria-expanded', 'true')
    })
})
