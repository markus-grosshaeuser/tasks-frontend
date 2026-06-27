import { Stack } from '@mui/material'
import Loader from './Loader.tsx'
import IconButtonComp from './IconButtonComp.tsx'
import AddIcon from '@mui/icons-material/Add'
import { Typography } from '@mui/material'
import React from 'react'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useTranslation } from 'react-i18next'

export type ScreenHeaderProps = {
    title?: string
    subtitle?: string
    loading?: boolean
    onCreateClicked: (e: React.MouseEvent<HTMLButtonElement>) => void
    ariaResourceName: 'TaskList' | 'Task'
    collapseAll: boolean
    onToggleCollapseAll: () => void
}

const ScreenHeader = ({
    title,
    subtitle,
    loading,
    onCreateClicked,
    ariaResourceName,
    collapseAll,
    onToggleCollapseAll,
}: ScreenHeaderProps) => {
    const { t } = useTranslation()

    return (
        <Stack>
            {loading && <Loader />}
            <Typography variant="h1" component="h1">
                {title || t('app_name')}
            </Typography>
            {subtitle && (
                <Typography variant="h2" component="h2">
                    {subtitle}
                </Typography>
            )}
            <Stack
                direction="row"
                spacing={2}
                sx={{ justifyContent: 'flex-end', alignItems: 'center' }}
            >
                <IconButtonComp
                    onClicked={onToggleCollapseAll}
                    ariaLabel={
                        collapseAll ? t('expand_all') : t('collapse_all')
                    }
                    ariaExpanded={!collapseAll}
                >
                    {collapseAll ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                </IconButtonComp>

                <IconButtonComp
                    onClicked={onCreateClicked}
                    ariaLabel={ariaResourceName === 'TaskList' ? t('create_new_task_list') : t('create_new_task')}
                >
                    <AddIcon />
                </IconButtonComp>
            </Stack>
        </Stack>
    )
}

export default ScreenHeader
