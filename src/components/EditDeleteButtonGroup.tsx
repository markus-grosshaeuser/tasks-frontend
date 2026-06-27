import IconButtonComp from './IconButtonComp.tsx'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Stack } from '@mui/material'
import React from 'react'
import type { TaskList } from '../domain/TaskList.ts'
import { useTranslation } from 'react-i18next'
import type { Task } from '../domain/Task.ts'

type Element = Task | TaskList

type EditDeleteButtonGroupProps<T extends Element> = {
    element: T
    typeOfElement: 'Task' | 'TaskList'
    editCallback: (
        e: React.MouseEvent<HTMLButtonElement>,
        editElement: T,
    ) => void
    deleteCallback: (
        e: React.MouseEvent<HTMLButtonElement>,
        deleteElement: T,
    ) => void
}

const EditDeleteButtonGroup = <T extends Element>({
    element,
    typeOfElement,
    editCallback,
    deleteCallback,
}: EditDeleteButtonGroupProps<T>) => {
    const { t } = useTranslation()

    return (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0}>
            <IconButtonComp
                onClicked={(e) => editCallback(e, element)}
                ariaLabel={
                    typeOfElement === 'Task'
                        ? t('edit_task_named', {
                              title: element.title,
                          })
                        : t('edit_task_list_named', {
                              title: element.title,
                          })
                }
            >
                <EditIcon />
            </IconButtonComp>
            <IconButtonComp
                onClicked={(e) => deleteCallback(e, element)}
                ariaLabel={
                    typeOfElement === 'Task'
                        ? t('delete_task_named', {
                              title: element.title,
                          })
                        : t('delete_task_list_named', {
                              title: element.title,
                          })
                }
            >
                <DeleteIcon />
            </IconButtonComp>
        </Stack>
    )
}

export default EditDeleteButtonGroup
