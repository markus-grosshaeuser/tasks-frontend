import ListElementTitle from './ListElementTitle.tsx'
import ListElementDescription from './ListElementDescription.tsx'
import { Stack } from '@mui/material'
import type { TaskList } from '../domain/TaskList.ts'
import type { Task } from '../domain/Task.ts'

export type Element = Task | TaskList

export type ListElementContentProps<T extends Element> = {
    element: T
    isCollapsed: boolean
}

const ListElementContent = <T extends Element>({
    element,
    isCollapsed,
}: ListElementContentProps<T>) => {
    return (
        <Stack
            direction="column"
            spacing={2}
            sx={{
                flexGrow: 2,
                minWidth: '0',
            }}
        >
            <ListElementTitle title={element.title} />

            {element.description && (
                <ListElementDescription
                    description={element.description}
                    isCollapsed={isCollapsed}
                />
            )}
        </Stack>
    )
}

export default ListElementContent
