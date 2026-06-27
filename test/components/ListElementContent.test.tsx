import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import ListElementContent, {
    type Element,
} from '../../src/components/ListElementContent'

describe('<ListElementContent />', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        cleanup()
        vi.restoreAllMocks()
    })

    const elementWithDescription: Element = {
        id: 'element-1',
        title: 'Write component tests',
        description: 'Replace shallow tests with behavior-focused tests.',
    }

    it('renders the element title', () => {
        render(
            <ListElementContent
                element={elementWithDescription}
                isCollapsed={false}
            />,
        )

        expect(screen.getByText('Write component tests')).toBeInTheDocument()
    })

    it('renders the description when the element has one', () => {
        render(
            <ListElementContent
                element={elementWithDescription}
                isCollapsed={false}
            />,
        )

        expect(
            screen.getByText(
                'Replace shallow tests with behavior-focused tests.',
            ),
        ).toBeInTheDocument()
    })

    it('renders title and description while collapsed', () => {
        render(
            <ListElementContent
                element={elementWithDescription}
                isCollapsed={true}
            />,
        )

        expect(screen.getByText('Write component tests')).toBeInTheDocument()
        expect(
            screen.getByText(
                'Replace shallow tests with behavior-focused tests.',
            ),
        ).toBeInTheDocument()
    })

    it('supports elements without a description property', () => {
        const element = {
            id: 'element-3',
            title: 'Element without optional description',
        } as Element

        render(<ListElementContent element={element} isCollapsed={false} />)

        expect(
            screen.getByText('Element without optional description'),
        ).toBeInTheDocument()
    })
})
