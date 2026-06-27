import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import CompletionIndicator from '../../src/components/CompletionIndicator'

describe('<CompletionIndicator />', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        cleanup()
        vi.restoreAllMocks()
    })

    it.each([
        { ratio: 0, expectedPercentage: 0 },
        { ratio: 0.5, expectedPercentage: 50 },
        { ratio: 0.75, expectedPercentage: 75 },
        { ratio: 1, expectedPercentage: 100 },
    ])(
        'renders $ratio as $expectedPercentage%',
        ({ ratio, expectedPercentage }) => {
            render(<CompletionIndicator value={ratio} />)

            const progress = screen.getByRole('progressbar', {
                name: 'completion_ratio',
            })

            expect(progress).toBeInTheDocument()
            expect(progress).toHaveAttribute(
                'aria-valuenow',
                String(expectedPercentage),
            )
        },
    )

    it('rounds fractional percentages to the nearest integer', () => {
        render(<CompletionIndicator value={0.756} />)

        expect(
            screen.getByRole('progressbar', { name: 'completion_ratio' }),
        ).toHaveAttribute('aria-valuenow', '76')
    })

    it('provides accessible text describing the completion value', () => {
        render(<CompletionIndicator value={0.75} />)

        const progress = screen.getByRole('progressbar', {
            name: 'completion_ratio',
        })

        expect(progress).toHaveAttribute(
            'aria-valuetext',
            'completion_ratio_value',
        )
    })

    it('renders the determinate progress indicator with the expected test id', () => {
        render(<CompletionIndicator value={0.25} />)

        const progress = screen.getByTestId('completion-indicator')

        expect(progress).toBe(
            screen.getByRole('progressbar', { name: 'completion_ratio' }),
        )
    })
})
