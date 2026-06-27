import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import BaseScreen from '../../src/components/BaseScreen'

describe('<BaseScreen />', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    it('renders the screen container as the main landmark', () => {
        render(<BaseScreen>Screen content</BaseScreen>)

        expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('renders child content inside the main landmark', () => {
        render(
            <BaseScreen>
                <h1>Tasks</h1>
                <p>Manage your tasks here.</p>
            </BaseScreen>,
        )

        const main = screen.getByRole('main')

        expect(main).toContainElement(
            screen.getByRole('heading', { name: 'Tasks' }),
        )
        expect(main).toHaveTextContent('Manage your tasks here.')
    })

    it('keeps rendered content visible to the user', () => {
        render(<BaseScreen>Visible page content</BaseScreen>)

        expect(screen.getByText('Visible page content')).toBeVisible()
    })
})
