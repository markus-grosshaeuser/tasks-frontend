import { ListItemText } from '@mui/material'

type ListElementTitleProps = {
    title: string
}

const ListElementTitle = ({ title }: ListElementTitleProps) => {
    return (
        <ListItemText
            primary={title}
            disableTypography={true}
            sx={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'primary.contrastText',
                minWidth: '0',
            }}
        />
    )
}

export default ListElementTitle
