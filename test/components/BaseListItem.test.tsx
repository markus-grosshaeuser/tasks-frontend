import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import BaseListItem from '../../src/components/BaseListItem.tsx'

describe('<BaseListItem />', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    it('renders as a list item', () => {
        render(
            <ul>
                <BaseListItem>Task list item content</BaseListItem>
            </ul>,
        )

        expect(screen.getByRole('listitem')).toBeInTheDocument()
    })

    it('renders text children inside the list item', () => {
        render(
            <ul>
                <BaseListItem>Task list item content</BaseListItem>
            </ul>,
        )

        const listItem = screen.getByRole('listitem')

        expect(listItem).toHaveTextContent('Task list item content')
    })

    it('renders multiple child elements in order', () => {
        render(
            <ul>
                <BaseListItem>
                    <span>First child</span>
                    <button type="button">Second child</button>
                </BaseListItem>
            </ul>,
        )

        const listItem = screen.getByRole('listitem')
        const button = screen.getByRole('button', { name: 'Second child' })

        expect(listItem).toHaveTextContent('First child')
        expect(button).toBeInTheDocument()
    })
})
