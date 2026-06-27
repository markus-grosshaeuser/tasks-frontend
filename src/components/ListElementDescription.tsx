import { ListItemText } from '@mui/material'

export type ListElementDescriptionProps = {
    description: string
    isCollapsed: boolean
}

const ListElementDescription = ({
    description,
    isCollapsed,
}: ListElementDescriptionProps) => {
    return (
        <ListItemText
            secondary={description}
            disableTypography={true}
            sx={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: '1.2rem',
                color: 'info.contrastText',
                maxWidth: '100%',
                minWidth: '0',
                ...(isCollapsed
                    ? {
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                      }
                    : { whiteSpace: 'normal' }),
            }}
        />
    )
}

export default ListElementDescription