import { Divider } from '@mui/material'

const CustomDivider = () => {
    return (
        <Divider
            data-testid="custom-divider"
            orientation="vertical"
            flexItem
            sx={{
                display: {
                    xs: 'none',
                    sm: 'block',
                },
            }}
        />
    )
}

export default CustomDivider
