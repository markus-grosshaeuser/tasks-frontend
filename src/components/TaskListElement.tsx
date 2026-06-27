import type { TaskList } from '../domain/TaskList.ts'
import React, { useEffect } from 'react'
import { ListItemButton } from '@mui/material'
import BaseListItem from './BaseListItem.tsx'
import CustomDivider from './CustomDivider.tsx'
import CompletionIndicator from './CompletionIndicator.tsx'
import ListElementContent from './ListElementContent.tsx'
import CollapseToggleButton from './CollapseToggleButton.tsx'
import EditDeleteButtonGroup from './EditDeleteButtonGroup.tsx'
import { useTranslation } from 'react-i18next'

export type TaskListElementProps = {
    taskList: TaskList
    onElementClicked: (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        taskList: TaskList,
    ) => void
    onDeleteClicked: (
        event: React.MouseEvent<HTMLButtonElement>,
        taskList: TaskList,
    ) => void
    onEditClicked: (
        event: React.MouseEvent<HTMLButtonElement>,
        taskList: TaskList,
    ) => void
    collapsed: boolean
}

const TaskListElement = ({
    taskList,
    onElementClicked,
    onDeleteClicked,
    onEditClicked,
    collapsed,
}: TaskListElementProps) => {

    const [isCollapsed, setIsCollapsed] = React.useState(true)

    const { t } = useTranslation()

    const completionPercentage = taskList.completionRatio || 0

    useEffect(() => {
        const update = () => {
            setIsCollapsed(collapsed)
        }
        update()
    }, [collapsed, taskList.completionRatio])

    const toggleCollapse = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsCollapsed(!isCollapsed)
    }

    return (
        <BaseListItem>
            <CompletionIndicator value={completionPercentage} />

            <CustomDivider />

            <ListItemButton
                role="clickable-list-item"
                onClick={(e) => onElementClicked(e, taskList)}
                aria-label={t('open_task_list_named', {
                    title: taskList.title,
                })}
            >
                <ListElementContent
                    element={taskList}
                    isCollapsed={isCollapsed}
                />
            </ListItemButton>

            <CollapseToggleButton
                isCollapsed={isCollapsed}
                toggleCollapse={toggleCollapse}
            />

            <CustomDivider />

            <EditDeleteButtonGroup
                element={taskList}
                typeOfElement="TaskList"
                editCallback={onEditClicked}
                deleteCallback={onDeleteClicked}
            />
        </BaseListItem>
    )
}

export default TaskListElement
