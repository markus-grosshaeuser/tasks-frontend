import React, { useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    CircularProgress,
} from '@mui/material'
import type { TaskList } from '../domain/TaskList.ts'
import type { Task } from '../domain/Task.ts'
import { useTranslation } from 'react-i18next'

interface DeleteConfirmDialogProps {
    open: boolean
    item: Task | TaskList | null
    description?: string
    onCancel: () => void
    onConfirm: () => void | Promise<void>
    loading?: boolean
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmDialogProps> = ({
    open,
    item,
    description,
    onCancel,
    onConfirm,
    loading = false,
}) => {
    const [isDeleting, setIsDeleting] = useState(false)

    const { t } = useTranslation()

    const handleDeleteClick = async () => {
        setIsDeleting(true)
        try {
            await onConfirm()
            onCancel()
        } catch (error) {
            console.error('Failed to delete item:', error)
        } finally {
            setIsDeleting(false)
        }
    }

    if (!open) return null

    return (
        <Dialog
            open={open}
            onClose={onCancel}
            maxWidth="xs"
            fullWidth
            aria-labelledby="delete-confirmation-dialog-title"
            aria-describedby="delete-confirmation-dialog-description"
        >
            <DialogTitle id="delete-confirmation-dialog-title">
                {t('delete_confirmation')}
            </DialogTitle>

            <DialogContent id="delete-confirmation-dialog-description">
                <Typography variant="body1" gutterBottom>
                    {t('delete_confirmation_message', { title: item?.title })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description || t('this_action_cannot_be_undone')}
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button onClick={onCancel} disabled={isDeleting || loading}>
                    {t('cancel')}
                </Button>
                <Button
                    onClick={handleDeleteClick}
                    variant="contained"
                    color="error"
                    disabled={isDeleting || loading}
                    startIcon={
                        isDeleting || loading ? (
                            <CircularProgress
                                size={20}
                                color="inherit"
                                aria-hidden="true"
                            />
                        ) : null
                    }
                >
                    {isDeleting || loading ? t('deleting') : t('delete')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteConfirmationDialog
