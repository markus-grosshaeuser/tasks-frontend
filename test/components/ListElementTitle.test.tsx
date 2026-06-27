import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ListElementTitle from '../../src/components/ListElementTitle'

describe('<ListElementTitle />', () => {
    it('renders the title text', () => {
        render(<ListElementTitle title="Important task title" />)

        expect(screen.getByText('Important task title')).toBeInTheDocument()
    })

    it('renders the exact title provided by props', () => {
        render(<ListElementTitle title="Fix failing component tests" />)

        expect(
            screen.getByText('Fix failing component tests'),
        ).toHaveTextContent('Fix failing component tests')
    })

    it('supports long titles without changing the DOM text', () => {
        const title =
            'Investigate why coverage looks good while behavior assertions are weak'

        render(<ListElementTitle title={title} />)

        expect(screen.getByText(title)).toHaveTextContent(title)
    })
})
