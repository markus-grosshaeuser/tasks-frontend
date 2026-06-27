import { ListItemText, Stack } from '@mui/material'
import dayjs from 'dayjs'
import type { Task } from '../domain/Task.ts'
import { useTranslation } from 'react-i18next'

type TaskAttributesProps = {
    task: Task
}

const TaskAttributes = ({ task }: TaskAttributesProps) => {
    const { t } = useTranslation()

    return (
        <Stack direction="column" spacing={2}>
            <ListItemText
                secondary={dayjs(task.dueDate).format(t('date_format'))}
                disableTypography={true}
                sx={asideStyle}
            />
            <ListItemText
                secondary={t(task.priority)}
                disableTypography={true}
                sx={asideStyle}
            />
            <ListItemText
                secondary={t(task.status)}
                disableTypography={true}
                sx={asideStyle}
            />
        </Stack>
    )
}

const asideStyle = {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '1rem',
    textWrap: 'nowrap',
}

export default TaskAttributes
