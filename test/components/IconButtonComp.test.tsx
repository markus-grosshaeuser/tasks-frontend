import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import IconButtonComp from '../../src/components/IconButtonComp'

describe('<IconButtonComp />', () => {
    const icon = <span aria-hidden="true">Icon</span>

    it('renders an accessible button using the provided aria label', () => {
        render(
            <IconButtonComp ariaLabel="Edit task" onClicked={vi.fn()}>
                {icon}
            </IconButtonComp>,
        )

        expect(
            screen.getByRole('button', { name: 'Edit task' }),
        ).toBeInTheDocument()
    })

    it('renders the provided children inside the button', () => {
        render(
            <IconButtonComp ariaLabel="Delete task" onClicked={vi.fn()}>
                <span>Delete icon</span>
            </IconButtonComp>,
        )

        const button = screen.getByRole('button', { name: 'Delete task' })

        expect(button).toHaveTextContent('Delete icon')
    })

    it('calls onClicked with the click event when clicked', () => {
        const onClicked = vi.fn()

        render(
            <IconButtonComp ariaLabel="Open menu" onClicked={onClicked}>
                {icon}
            </IconButtonComp>,
        )

        fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))

        expect(onClicked).toHaveBeenCalledTimes(1)
        expect(onClicked).toHaveBeenCalledWith(expect.objectContaining({}))
    })

    it('sets aria-expanded when ariaExpanded is provided as true', () => {
        render(
            <IconButtonComp
                ariaLabel="Collapse section"
                ariaExpanded={true}
                onClicked={vi.fn()}
            >
                {icon}
            </IconButtonComp>,
        )

        expect(
            screen.getByRole('button', { name: 'Collapse section' }),
        ).toHaveAttribute('aria-expanded', 'true')
    })

    it('sets aria-expanded when ariaExpanded is provided as false', () => {
        render(
            <IconButtonComp
                ariaLabel="Expand section"
                ariaExpanded={false}
                onClicked={vi.fn()}
            >
                {icon}
            </IconButtonComp>,
        )

        expect(
            screen.getByRole('button', { name: 'Expand section' }),
        ).toHaveAttribute('aria-expanded', 'false')
    })

    it('does not set aria-expanded when ariaExpanded is omitted', () => {
        render(
            <IconButtonComp ariaLabel="Simple action" onClicked={vi.fn()}>
                {icon}
            </IconButtonComp>,
        )

        expect(
            screen.getByRole('button', { name: 'Simple action' }),
        ).not.toHaveAttribute('aria-expanded')
    })

    it('sets aria-controls when ariaControls is provided', () => {
        render(
            <IconButtonComp
                ariaLabel="Open controlled panel"
                ariaControls="controlled-panel"
                onClicked={vi.fn()}
            >
                {icon}
            </IconButtonComp>,
        )

        expect(
            screen.getByRole('button', { name: 'Open controlled panel' }),
        ).toHaveAttribute('aria-controls', 'controlled-panel')
    })

    it('does not set aria-controls when ariaControls is omitted', () => {
        render(
            <IconButtonComp ariaLabel="No controlled panel" onClicked={vi.fn()}>
                {icon}
            </IconButtonComp>,
        )

        expect(
            screen.getByRole('button', { name: 'No controlled panel' }),
        ).not.toHaveAttribute('aria-controls')
    })
})
