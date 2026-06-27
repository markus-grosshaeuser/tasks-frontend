import { List } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import {
    type TaskList,

} from '../domain/TaskList.ts'
import TaskListDialog, {
    type ListFormData,
} from '../dialogs/TaskListDialog.tsx'
import { useNavigate } from 'react-router-dom'
import DeleteConfirmationDialog from '../dialogs/DeleteConfirmationDialog.tsx'
import RestHandler from '../utilities/RestHandler.ts'
import TaskListElement from '../components/TaskListElement.tsx'
import ScreenHeader from '../components/ScreenHeader.tsx'
import BaseScreen from '../components/BaseScreen.tsx'
import { useTranslation } from 'react-i18next'
import {
    taskListCreateFromFormData,
    taskListUpdateFromFormData,
} from '../utilities/TaskListUtilities.ts'

export default function TaskListsScreen() {
    const [taskLists, setTaskLists] = useState<TaskList[]>([])

    const [openCreateEditDialog, setOpenCreateEditDialog] = useState(false)
    const [itemToEdit, setItemToEdit] = useState<TaskList | null>(null)

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<TaskList | null>(null)

    const [loading, setLoading] = useState(false)
    const [collapsed, setCollapsed] = useState(true)

    const navigate = useNavigate()
    const { t } = useTranslation()

    const restHandler = useMemo(() => new RestHandler(), [])

    useEffect(() => {
        const load = () => {
            try {
                setLoading(true)
                restHandler.getTaskLists().then((data) => {
                    setTaskLists(data)
                })
            } catch (error) {
                console.error('Error fetching task lists:', error)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [restHandler])

    const onCreateClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setItemToEdit(null)
        setOpenCreateEditDialog(true)
    }

    const onEditClicked = (
        event: React.MouseEvent<HTMLButtonElement>,
        item: TaskList,
    ) => {
        event.preventDefault()
        event.stopPropagation()
        setItemToEdit(item)
        setOpenCreateEditDialog(true)
    }

    const onCreateEditSubmit = async (formData: ListFormData) => {
        setLoading(true)
        try {
            if (formData.id) {
                await restHandler.updateTaskList(
                    taskListUpdateFromFormData(formData),
                )
            } else {
                await restHandler.createNewTaskList(
                    taskListCreateFromFormData(formData),
                )
            }
            const data = await restHandler.getTaskLists()
            setTaskLists(data)
            closeDialog()
        } catch (error) {
            console.error('Error creating/updating task list:', error)
        } finally {
            setLoading(false)
        }
    }

    const onDeleteClicked = (
        event: React.MouseEvent<HTMLButtonElement>,
        item: TaskList,
    ) => {
        event.preventDefault()
        event.stopPropagation()
        setItemToDelete(item)
        setOpenDeleteDialog(true)
    }

    const onDeleteConfirmed = async () => {
        if (!itemToDelete) {
            return
        }
        setLoading(true)
        try {
            await restHandler.deleteTaskList(itemToDelete)
            setTaskLists(
                taskLists.filter((taskList) => taskList.id !== itemToDelete.id),
            )
            setOpenDeleteDialog(false)
            setItemToDelete(null)

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const closeDialog = () => {
        setItemToEdit(null)
        setItemToDelete(null)
        setOpenCreateEditDialog(false)
    }

    const onTaskListItemClick = (taskList: TaskList) => {
        navigate(`/${taskList.id}`)
    }

    const onToggleCollapseAll = () => {
        setCollapsed(!collapsed)
    }

    return (
        <BaseScreen>
            <ScreenHeader
                title={t('task_lists')}
                loading={loading}
                onCreateClicked={onCreateClicked}
                ariaResourceName="TaskList"
                collapseAll={collapsed}
                onToggleCollapseAll={onToggleCollapseAll}
            />
            <List>
                {taskLists.map((taskList: TaskList) => {
                    return (
                        <TaskListElement
                            key={taskList.id}
                            taskList={taskList}
                            onElementClicked={() =>
                                onTaskListItemClick(taskList)
                            }
                            onDeleteClicked={(e) =>
                                onDeleteClicked(e, taskList)
                            }
                            onEditClicked={(e) => onEditClicked(e, taskList)}
                            collapsed={collapsed}
                        />
                    )
                })}
            </List>
            <TaskListDialog
                open={openCreateEditDialog}
                initialData={itemToEdit}
                onSubmit={onCreateEditSubmit}
                onCancel={closeDialog}
                dialogTitle={
                    itemToEdit ? t('edit_task_list') : t('create_new_task_list')
                }
            />
            <DeleteConfirmationDialog
                open={openDeleteDialog}
                item={itemToDelete}
                onCancel={() => setOpenDeleteDialog(false)}
                onConfirm={onDeleteConfirmed}
            />
        </BaseScreen>
    )
}
