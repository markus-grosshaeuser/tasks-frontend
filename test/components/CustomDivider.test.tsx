import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import CustomDivider from '../../src/components/CustomDivider'

describe('<CustomDivider />', () => {
    it('renders a vertical separator', () => {
        render(<CustomDivider />)

        const divider = screen.getByRole('separator')

        expect(divider).toBeInTheDocument()
        expect(divider).toHaveAttribute('aria-orientation', 'vertical')
    })
})
