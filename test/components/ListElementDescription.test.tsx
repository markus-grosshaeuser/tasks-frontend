import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ListElementDescription from '../../src/components/ListElementDescription'

describe('<ListElementDescription />', () => {
    it('renders the description text', () => {
        render(
            <ListElementDescription
                description="This task needs a careful review."
                isCollapsed={false}
            />,
        )

        expect(
            screen.getByText('This task needs a careful review.'),
        ).toBeInTheDocument()
    })

    it('keeps the description available when collapsed', () => {
        render(
            <ListElementDescription
                description="Collapsed description text."
                isCollapsed={true}
            />,
        )

        expect(
            screen.getByText('Collapsed description text.'),
        ).toBeInTheDocument()
    })

    it('renders long descriptions without truncating the DOM text', () => {
        const description =
            'This is a longer description that may be visually shortened by CSS when collapsed.'

        render(
            <ListElementDescription
                description={description}
                isCollapsed={true}
            />,
        )

        expect(screen.getByText(description)).toHaveTextContent(description)
    })
})
