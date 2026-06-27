import { IconButton } from '@mui/material'

import React from 'react'

export type IconButtonCompProps = {
    onClicked: (event: React.MouseEvent<HTMLButtonElement>) => void
    children: React.ReactNode
    ariaLabel: string
    ariaExpanded?: boolean
    ariaControls?: string
}

const IconButtonComp = ({
    onClicked,
    children,
    ariaLabel,
    ariaExpanded,
    ariaControls,
}: IconButtonCompProps) => {
    return (
        <IconButton
            aria-label={ariaLabel}
            aria-expanded={ariaExpanded}
            aria-controls={ariaControls}
            onClick={onClicked}
            sx={{
                '&:hover': {
                    color: 'secondary.contrastText',
                    backgroundColor: 'secondary.main',
                },
                '&:active': {
                    color: 'secondary.contrastText',
                    backgroundColor: 'secondary.light',
                },
            }}
        >
            {children}
        </IconButton>
    )
}

export default IconButtonComp
