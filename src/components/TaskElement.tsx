import type { Task } from '../domain/Task.ts'
import React, { useEffect } from 'react'
import TaskAttributes from './TaskAttributes.tsx'
import BaseListItem from './BaseListItem.tsx'
import CustomDivider from './CustomDivider.tsx'
import ListElementContent from './ListElementContent.tsx'
import CollapseToggleButton from './CollapseToggleButton.tsx'
import EditDeleteButtonGroup from './EditDeleteButtonGroup.tsx'

export type TaskElementProps = {
    task: Task
    onDeleteClicked: (
        event: React.MouseEvent<HTMLButtonElement>,
        task: Task,
    ) => void
    onEditClicked: (
        event: React.MouseEvent<HTMLButtonElement>,
        task: Task,
    ) => void
    collapsed: boolean
}

const TaskElement = ({
    task,
    onDeleteClicked,
    onEditClicked,
    collapsed,
}: TaskElementProps) => {
    const [isCollapsed, setIsCollapsed] = React.useState(true)

    useEffect(() => {
        const initializeCollapse = () => {
            setIsCollapsed(collapsed)
        }
        initializeCollapse()
    }, [collapsed])

    const toggleCollapse = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsCollapsed(!isCollapsed)
    }

    return (
        <BaseListItem>
            <TaskAttributes task={task} />

            <CustomDivider />

            <ListElementContent element={task} isCollapsed={isCollapsed} />

            <CollapseToggleButton
                isCollapsed={isCollapsed}
                toggleCollapse={toggleCollapse}
            />

            <CustomDivider />

            <EditDeleteButtonGroup
                element={task}
                typeOfElement="Task"
                editCallback={onEditClicked}
                deleteCallback={onDeleteClicked}
            />
        </BaseListItem>
    )
}

export default TaskElement
