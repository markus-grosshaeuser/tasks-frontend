import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import TaskAttributes from '../../src/components/TaskAttributes'
import type { Task } from '../../src/domain/Task.ts'

vi.mock('dayjs', () => ({
    default: vi.fn(() => ({
        format: vi.fn(() => '26.06.2026 14:30'),
    })),
}))

describe('<TaskAttributes />', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    const task: Task = {
        id: 'task-1',
        title: 'Prepare release',
        description: 'Check the release notes before publishing.',
        dueDate: '2026-06-26T14:30:00.000Z',
        positionInList: 1,
        priority: 'HIGH',
        status: 'IN_PROGRESS',
    }

    it('renders the formatted due date', () => {
        render(<TaskAttributes task={task} />)

        expect(screen.getByText('26.06.2026 14:30')).toBeInTheDocument()
    })

    it('renders the translated priority', () => {
        render(<TaskAttributes task={task} />)

        expect(screen.getByText('HIGH')).toBeInTheDocument()
    })

    it('renders the translated status', () => {
        render(<TaskAttributes task={task} />)

        expect(screen.getByText('IN_PROGRESS')).toBeInTheDocument()
    })

    it('renders completed status when the task is completed', () => {
        render(<TaskAttributes task={{ ...task, status: 'COMPLETED' }} />)

        expect(screen.getByText('COMPLETED')).toBeInTheDocument()
    })

    it('renders low priority when the task priority is low', () => {
        render(<TaskAttributes task={{ ...task, priority: 'LOW' }} />)

        expect(screen.getByText('LOW')).toBeInTheDocument()
    })

    it('renders all task attributes together', () => {
        render(<TaskAttributes task={task} />)

        expect(screen.getByText('26.06.2026 14:30')).toBeInTheDocument()
        expect(screen.getByText('HIGH')).toBeInTheDocument()
        expect(screen.getByText('IN_PROGRESS')).toBeInTheDocument()
    })
})
