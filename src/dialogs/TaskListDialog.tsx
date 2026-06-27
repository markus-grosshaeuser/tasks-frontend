import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    CircularProgress,
    Box,
    DialogContentText,
} from '@mui/material'
import type { TaskList } from '../domain/TaskList.ts'
import { useTranslation } from 'react-i18next'

export type ListFormData = {
    id?: string
    title: string
    description: string
}

interface TaskListDialogProps {
    open: boolean
    initialData: TaskList | null
    dialogTitle: string
    onSubmit: (taskList: ListFormData) => Promise<void>
    onCancel: () => void
}

const TaskListDialog: React.FC<TaskListDialogProps> = ({
    open,
    initialData,
    dialogTitle,
    onSubmit,
    onCancel,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState<ListFormData>({
        id: undefined,
        title: '',
        description: '',
    })

    const { t } = useTranslation()

    const isEditMode = !!initialData?.id

    useEffect(() => {
        const processInitialData = (initialData: TaskList | null) => {
            if (initialData !== null) {
                setFormData({
                    id: initialData.id,
                    title: initialData.title,
                    description: initialData.description,
                })
            } else {
                setFormData({ id: undefined, title: '', description: '' })
            }
            setError(null)
        }

        if (open) {
            processInitialData(initialData)
        }
    }, [open, initialData])

    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        if (error) setError(null)
    }

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            setError(t('title_is_required'))
            return
        }

        setIsSubmitting(true)
        try {
            await onSubmit(formData)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog
            open={open}
            maxWidth="sm"
            fullWidth
            aria-labelledby="task-list-dialog-title"
            aria-describedby="task-list-dialog-description"
        >
            <DialogTitle id="task-list-dialog-title">{dialogTitle}</DialogTitle>

            <DialogContent>
                <DialogContentText
                    id="task-list-dialog-description"
                    sx={{ mb: 2 }}
                >
                    {isEditMode
                        ? t('update_the_details_below')
                        : t(
                              'fill_in_the_details_below_to_create_a_new_resource',
                          )}
                </DialogContentText>

                <Box sx={{ mt: 1 }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="title"
                        label={t('title')}
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.title}
                        onChange={handleTextInputChange}
                        error={!!error && !formData.title}
                        helperText={
                            error && !formData.title
                                ? t('title_is_required')
                                : ''
                        }
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label={t('description')}
                        type="text"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={handleTextInputChange}
                    />
                </Box>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onCancel}
                    color="secondary"
                    disabled={isSubmitting}
                >
                    {t('cancel')}
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isSubmitting || !formData.title.trim()}
                    startIcon={
                        isSubmitting ? (
                            <CircularProgress size={20} aria-hidden="true" />
                        ) : null
                    }
                >
                    {isSubmitting
                        ? t('saving')
                        : isEditMode
                          ? t('update')
                          : t('create')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default TaskListDialog
