import { useParams } from 'react-router-dom'
import React, { useEffect, useMemo, useState } from 'react'
import type { TaskList } from '../domain/TaskList.ts'
import RestHandler from '../utilities/RestHandler.ts'
import {
    type Task,

} from '../domain/Task.ts'
import { List } from '@mui/material'
import TaskDialog, { type TaskFormData } from '../dialogs/TaskDialog.tsx'
import DeleteConfirmationDialog from '../dialogs/DeleteConfirmationDialog.tsx'
import ScreenHeader from '../components/ScreenHeader.tsx'
import BaseScreen from '../components/BaseScreen.tsx'
import TaskElement from '../components/TaskElement.tsx'
import { useTranslation } from 'react-i18next'
import {
    taskCreateFromFormData,
    taskUpdateFromFormData,
} from '../utilities/TaskUtilities.ts'

export default function TasksScreen() {
    const params = useParams()

    const [taskList, setTaskList] = useState<TaskList | null>(null)
    const [tasks, setTasks] = useState<Task[]>([])

    const [openCreateEditDialog, setOpenCreateEditDialog] = useState(false)
    const [itemToEdit, setItemToEdit] = useState<Task | null>(null)

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<Task | null>(null)

    const [loading, setLoading] = useState(false)
    const [collapsed, setCollapsed] = useState(true)

    const restHandler = useMemo(() => new RestHandler(), [])

    const { t } = useTranslation()

    useEffect(() => {
        const load = () => {
            setLoading(true)
            if (params.taskListId) {
                try {
                    restHandler
                        .getTaskListById(params.taskListId)
                        .then((data) => setTaskList(data))
                    restHandler
                        .getTasksByTaskListId(params.taskListId)
                        .then((data) => setTasks(data))
                } catch (error) {
                    console.error('Error fetching task list:', error)
                } finally {
                    setLoading(false)
                }
            }
        }
        load()
    }, [params.taskListId, restHandler])

    const onCreateEditSubmit = async (formData: TaskFormData) => {
        setLoading(true)
        try {
            if (taskList?.id) {
                if (formData.id) {
                    await restHandler.updateTaskInTaskList(
                        taskList.id,
                        formData.id,
                        taskUpdateFromFormData(formData),
                    )
                } else {
                    await restHandler.createNewTaskInTaskList(
                        taskList?.id,
                        taskCreateFromFormData(formData),
                    )
                }
                const data = await restHandler.getTasksByTaskListId(
                    taskList?.id,
                )
                setTasks(data)
                closeDialog()
            }
        } catch (error) {
            console.error('Error creating/updating task:', error)
        } finally {
            setLoading(false)
        }
    }

    const onCreateClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setItemToEdit(null)
        setOpenCreateEditDialog(true)
    }

    const onEditClicked = (
        event: React.MouseEvent<HTMLButtonElement>,
        item: Task,
    ) => {
        event.preventDefault()
        event.stopPropagation()
        setItemToEdit(item)
        setOpenCreateEditDialog(true)
    }

    const onDeleteClicked = (
        event: React.MouseEvent<HTMLButtonElement>,
        item: Task | null,
    ) => {
        event.preventDefault()
        event.stopPropagation()
        setItemToDelete(item)
        setOpenDeleteDialog(true)
    }

    const onDeleteConfirmed = async () => {
        if (!itemToDelete?.id || !taskList?.id) {
            return
        }
        setLoading(true)
        try {
            await restHandler.deleteTaskFromTaskList(
                taskList.id,
                itemToDelete.id,
            )
            setTasks(tasks.filter((task) => task.id !== itemToDelete.id))
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

    const toggleCollapseAllTasks = () => {
        setCollapsed(!collapsed)
    }

    return (
        <BaseScreen>
            <ScreenHeader
                title={taskList?.title}
                subtitle={taskList?.description}
                loading={loading}
                onCreateClicked={onCreateClicked}
                ariaResourceName="Task"
                collapseAll={collapsed}
                onToggleCollapseAll={toggleCollapseAllTasks}
            />
            <List>
                {tasks?.map((task) => {
                    return (
                        <TaskElement
                            key={task.id}
                            task={task}
                            onDeleteClicked={(e) => onDeleteClicked(e, task)}
                            onEditClicked={(e) => onEditClicked(e, task)}
                            collapsed={collapsed}
                        />
                    )
                })}
            </List>
            <TaskDialog
                open={openCreateEditDialog}
                initialData={itemToEdit}
                onSubmit={onCreateEditSubmit}
                onCancel={closeDialog}
                dialogTitle={itemToEdit ? t('edit_task') : t('create_new_task')}
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
