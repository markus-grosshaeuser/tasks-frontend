import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { TaskFormData } from '../../src/dialogs/TaskDialog.tsx'
import {
    taskCreateFromFormData,
    taskUpdateFromFormData,
} from '../../src/utilities/TaskUtilities.ts'

const mocks = vi.hoisted(() => ({
    add: vi.fn(),
    toISOString: vi.fn(),
    utcOffset: vi.fn(),
}))

vi.mock('dayjs', () => ({
    default: vi.fn(() => ({
        add: mocks.add,
        toISOString: mocks.toISOString,
        utcOffset: mocks.utcOffset,
    })),
}))

describe('TaskUtilities', () => {
    const formData: TaskFormData = {
        id: 'task-1',
        title: 'Prepare release',
        description: 'Check release notes before publishing.',
        dueDate: '2026-06-26T14:30:00.000Z',
        positionInList: 3,
        priority: 'HIGH',
        status: 'IN_PROGRESS',
    }

    beforeEach(() => {
        vi.clearAllMocks()

        mocks.utcOffset.mockReturnValue(120)
        mocks.toISOString.mockReturnValue('2026-06-26T16:30:00.000Z')
        mocks.add.mockReturnValue({
            toISOString: mocks.toISOString,
        })
    })

    describe('taskUpdateFromFormData', () => {
        it('keeps update-specific fields from the form data', () => {
            const result = taskUpdateFromFormData(formData)

            expect(result).toEqual({
                id: 'task-1',
                title: 'Prepare release',
                description: 'Check release notes before publishing.',
                dueDate: '2026-06-26T16:30:00.000Z',
                positionInList: 3,
                priority: 'HIGH',
                status: 'IN_PROGRESS',
            })
        })

        it('keeps the task status from the form data', () => {
            const result = taskUpdateFromFormData({
                ...formData,
                status: 'COMPLETED',
            })

            expect(result.status).toBe('COMPLETED')
        })

        it('keeps the task priority from the form data', () => {
            const result = taskUpdateFromFormData({
                ...formData,
                priority: 'LOW',
            })

            expect(result.priority).toBe('LOW')
        })

        it('keeps the position in list from the form data', () => {
            const result = taskUpdateFromFormData({
                ...formData,
                positionInList: 7,
            })

            expect(result.positionInList).toBe(7)
        })

        it('converts the due date using the current utc offset', () => {
            taskUpdateFromFormData(formData)

            expect(mocks.utcOffset).toHaveBeenCalled()
            expect(mocks.add).toHaveBeenCalledWith(120, 'minutes')
            expect(mocks.toISOString).toHaveBeenCalled()
        })
    })

    describe('taskCreateFromFormData', () => {
        it('sets create-specific fields regardless of form data id, position, and status', () => {
            const result = taskCreateFromFormData(formData)

            expect(result).toEqual({
                id: undefined,
                title: 'Prepare release',
                description: 'Check release notes before publishing.',
                dueDate: '2026-06-26T16:30:00.000Z',
                positionInList: undefined,
                priority: 'HIGH',
                status: 'OPEN',
            })
        })

        it('uses title and description from the form data', () => {
            const result = taskCreateFromFormData({
                ...formData,
                title: 'Created task',
                description: 'Created task description.',
            })

            expect(result.title).toBe('Created task')
            expect(result.description).toBe('Created task description.')
        })

        it('uses priority from the form data', () => {
            const result = taskCreateFromFormData({
                ...formData,
                priority: 'MEDIUM',
            })

            expect(result.priority).toBe('MEDIUM')
        })

        it('always creates tasks with OPEN status', () => {
            const result = taskCreateFromFormData({
                ...formData,
                status: 'COMPLETED',
            })

            expect(result.status).toBe('OPEN')
        })

        it('converts the due date using the current utc offset', () => {
            taskCreateFromFormData(formData)

            expect(mocks.utcOffset).toHaveBeenCalled()
            expect(mocks.add).toHaveBeenCalledWith(120, 'minutes')
            expect(mocks.toISOString).toHaveBeenCalled()
        })
    })
})
