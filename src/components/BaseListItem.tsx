import { ListItem, Stack } from '@mui/material'
import React from 'react'

type BaseListItemProps = {
    children: React.ReactNode
}

const BaseListItem = ({ children }: BaseListItemProps) => {
    return (
        <ListItem
            sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '10px',
                width: '100%',
                minWidth: '0',
                backgroundColor: 'primary.dark',
                borderRadius: '5px',
                '&:hover': { backgroundColor: 'primary.main' },
                '&:active': { backgroundColor: 'primary.light' },
                color: 'primary.contrastText',
            }}
        >
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{
                    display: 'flex',
                    flexGrow: 1,
                    alignItems: 'center',
                    minWidth: '0',
                }}
            >
                {children}
            </Stack>
        </ListItem>
    )
}

export default BaseListItem
