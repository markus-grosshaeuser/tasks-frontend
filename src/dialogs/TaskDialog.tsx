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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    type SelectChangeEvent,
} from '@mui/material'
import { type Task, type TaskPriority, type TaskStatus } from '../domain/Task.ts'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

export type TaskFormData = {
    id?: string
    title: string
    description: string
    dueDate: string
    positionInList: number | undefined
    priority: TaskPriority
    status: TaskStatus
}

interface TaskDialogProps {
    open: boolean
    initialData: Task | null
    dialogTitle: string
    onSubmit: (task: TaskFormData) => Promise<void>
    onCancel: () => void
}

const TaskDialog: React.FC<TaskDialogProps> = ({
    open,
    initialData,
    dialogTitle,
    onSubmit,
    onCancel,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { t } = useTranslation()

    const [formData, setFormData] = useState<TaskFormData>({
        id: undefined,
        title: '',
        description: '',
        dueDate: dayjs().toISOString(),
        positionInList: 0,
        status: 'OPEN',
        priority: 'LOW',
    })

    const isEditMode = !!initialData?.id

    useEffect(() => {
        const processInitialData = (initialData: Task | null) => {
            if (initialData !== null) {
                setFormData({
                    id: initialData.id,
                    title: initialData.title,
                    description: initialData.description,
                    dueDate: dayjs(initialData.dueDate).toISOString(),
                    positionInList: initialData.positionInList,
                    status: initialData.status,
                    priority: initialData.priority,
                })
            } else {
                setFormData({
                    id: undefined,
                    title: '',
                    description: '',
                    dueDate: dayjs().toISOString(),
                    positionInList: 0,
                    status: 'OPEN',
                    priority: 'LOW',
                })
            }
            setError(null)
        }
        if (open) {
            processInitialData(initialData)
        }
    }, [open, initialData])

    const handleTextInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | { name: string; value: unknown }
        >,
    ) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        if (error) setError(null)
    }

    const handleStatusChange = (e: SelectChangeEvent<TaskStatus>) => {
        setFormData((prev) => ({
            ...prev,
            status: e.target.value as TaskStatus,
        }))
    }

    const handlePriorityChange = (e: SelectChangeEvent<TaskPriority>) => {
        setFormData((prev) => ({
            ...prev,
            priority: e.target.value as TaskPriority,
        }))
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
            aria-labelledby="task-dialog-title"
            aria-describedby="task-dialog-description"
        >
            <DialogTitle id="task-dialog-title">{dialogTitle}</DialogTitle>

            <DialogContent>
                <DialogContentText id="task-dialog-description" sx={{ mb: 2 }}>
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

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: {
                            xs: 'column',
                            sm: 'row',
                        },
                        gap: 2,
                    }}
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            sx={{ mt: 2, width: '100%' }}
                            label={t('due_date')}
                            name="dueDate"
                            timezone="system"
                            ampm={false}
                            format="YYYY-MM-DD HH:mm"
                            value={dayjs(formData.dueDate)}
                            onChange={(newValue) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    dueDate: dayjs(newValue).toISOString(),
                                }))
                            }}
                        ></DateTimePicker>
                    </LocalizationProvider>
                    <FormControl sx={{ mt: 2, width: '80%' }}>
                        <InputLabel>{t('priority')}</InputLabel>
                        <Select
                            label={t('priority')}
                            name="priority"
                            value={formData.priority}
                            onChange={(e) => handlePriorityChange(e)}
                        >
                            <MenuItem value="LOW">{t('LOW')}</MenuItem>
                            <MenuItem value="MEDIUM">{t('MEDIUM')}</MenuItem>
                            <MenuItem value="HIGH">{t('HIGH')}</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ mt: 2, width: '80%' }}>
                        <InputLabel>{t('status')}</InputLabel>
                        <Select
                            label={t('status')}
                            name="status"
                            value={formData.status}
                            onChange={(e) => handleStatusChange(e)}
                        >
                            <MenuItem value="OPEN">{t('OPEN')}</MenuItem>
                            <MenuItem value="IN_PROGRESS">
                                {t('IN_PROGRESS')}
                            </MenuItem>
                            <MenuItem value="COMPLETED">
                                {t('COMPLETED')}
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Box>

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
                                <CircularProgress
                                    size={20}
                                    aria-hidden="true"
                                />
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
            </DialogContent>
        </Dialog>
    )
}

export default TaskDialog
