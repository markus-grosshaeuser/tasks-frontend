import { CircularProgress, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'

const Loader = () => {
    const { t } = useTranslation()

    return (
        <Stack
            data-testid="loader"
            direction="row"
            sx={{ justifyContent: 'center', alignItems: 'center' }}
        >
            <CircularProgress aria-label={t('loading')} size={64} />
        </Stack>
    )
}

export default Loader
