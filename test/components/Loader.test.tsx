import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import Loader from '../../src/components/Loader'

describe('<Loader />', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    it('renders the loader container', () => {
        render(<Loader />)

        expect(screen.getByTestId('loader')).toBeInTheDocument()
    })

    it('renders an accessible progress indicator', () => {
        render(<Loader />)

        expect(
            screen.getByRole('progressbar', { name: 'loading' }),
        ).toBeInTheDocument()
    })

    it('renders the progress indicator inside the loader container', () => {
        render(<Loader />)

        const loader = screen.getByTestId('loader')

        expect(
            within(loader).getByRole('progressbar', { name: 'loading' }),
        ).toBeInTheDocument()
    })
})
