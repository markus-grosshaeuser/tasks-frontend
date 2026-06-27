import Stack from '@mui/material/Stack'
import React from 'react'

type BaseScreenProps = {
    children: React.ReactNode
}

const BaseScreen = ({ children }: BaseScreenProps) => {
    return (
        <Stack
            component="main"
            sx={{
                backgroundColor: 'background.default',
                width: {
                    xs: '100%',
                    sm: '90vw',
                    md: '80vw',
                },
                maxWidth: '1200px',
                minHeight: {
                    xs: 'auto',
                    md: '60vh',
                },
                maxHeight: {
                    xs: 'none',
                    md: '80vh',
                },
                padding: {
                    xs: 2,
                    sm: 3,
                },
                borderRadius: '5px',
                overflowY: 'auto',
                boxSizing: 'border-box',
            }}
        >
            {children}
        </Stack>
    )
}

export default BaseScreen
