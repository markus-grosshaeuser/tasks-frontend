import { CircularProgress, Stack, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'

type CompletionIndicatorProps = {
    value: number
}

const CompletionIndicator = ({ value }: CompletionIndicatorProps) => {
    const { t } = useTranslation()

    return (
        <Stack>
            <Tooltip
                data-testid="tooltip-wrapper"
                title={t('completion_ratio')}
                placement="top-start"
                arrow
                disableInteractive
                disableFocusListener
                disableTouchListener
            >
                <CircularProgress
                    data-testid="completion-indicator"
                    value={Math.round(value * 100)}
                    aria-label={t('completion_ratio')}
                    aria-valuetext={t('completion_ratio_value', {
                        value: Math.round(value * 100),
                    })}
                    variant="determinate"
                    color="success"
                    enableTrackSlot={true}
                    size={50}
                    thickness={5}
                />
            </Tooltip>
        </Stack>
    )
}

export default CompletionIndicator
