import { describe, expect, it } from 'vitest'
import type { ListFormData } from '../../src/dialogs/TaskListDialog.tsx'
import {
    taskListCreateFromFormData,
    taskListUpdateFromFormData,
} from '../../src/utilities/TaskListUtilities.ts'

describe('TaskListUtilities', () => {
    describe('taskListUpdateFromFormData', () => {
        it('keeps the id when converting update form data', () => {
            const formData: ListFormData = {
                id: 'list-1',
                title: 'Release checklist',
                description: 'Tasks needed before release.',
            }

            expect(taskListUpdateFromFormData(formData)).toEqual({
                id: 'list-1',
                title: 'Release checklist',
                description: 'Tasks needed before release.',
            })
        })

        it('uses the title and description from the form data', () => {
            const formData: ListFormData = {
                id: 'list-1',
                title: 'Updated list title',
                description: 'Updated list description.',
            }

            const result = taskListUpdateFromFormData(formData)

            expect(result.title).toBe('Updated list title')
            expect(result.description).toBe('Updated list description.')
        })

        it('does not add completionRatio to update payloads', () => {
            const formData: ListFormData = {
                id: 'list-1',
                title: 'Release checklist',
                description: 'Tasks needed before release.',
            }

            expect(taskListUpdateFromFormData(formData)).not.toHaveProperty(
                'completionRatio',
            )
        })
    })

    describe('taskListCreateFromFormData', () => {
        it('sets id to undefined when converting create form data', () => {
            const formData: ListFormData = {
                id: 'list-that-should-not-be-kept',
                title: 'Inbox',
                description: 'Unsorted tasks.',
            }

            expect(taskListCreateFromFormData(formData)).toEqual({
                id: undefined,
                title: 'Inbox',
                description: 'Unsorted tasks.',
            })
        })

        it('uses the title and description from the form data', () => {
            const formData: ListFormData = {
                id: undefined,
                title: 'Personal tasks',
                description: 'Tasks outside work.',
            }

            const result = taskListCreateFromFormData(formData)

            expect(result.title).toBe('Personal tasks')
            expect(result.description).toBe('Tasks outside work.')
        })

        it('does not add completionRatio to create payloads', () => {
            const formData: ListFormData = {
                id: undefined,
                title: 'Inbox',
                description: 'Unsorted tasks.',
            }

            expect(taskListCreateFromFormData(formData)).not.toHaveProperty(
                'completionRatio',
            )
        })
    })
})
