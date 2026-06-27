import { createTheme } from '@mui/material/styles'
import {
    grey,
    teal,
    orange,
    red,
    yellow,
    brown,
    green,
} from '@mui/material/colors'

export const theme = createTheme({
    palette: {
        primary: {
            light: teal[300],
            main: teal[500],
            dark: teal[700],
            contrastText: grey[50],
        },
        secondary: {
            light: orange[300],
            main: orange[500],
            dark: orange[700],
            contrastText: grey[50],
        },
        error: {
            light: red[500],
            main: red[700],
            dark: red[900],
            contrastText: grey[100],
        },
        warning: {
            light: yellow[200],
            main: yellow[400],
            dark: yellow[600],
            contrastText: grey[800],
        },
        info: {
            light: brown[300],
            main: brown[500],
            dark: brown[700],
            contrastText: grey[100],
        },
        success: {
            light: green['A100'],
            main: green['A400'],
            dark: green['A700'],
            contrastText: 'grey[800]',
        },
        background: {
            default: teal[100],
            paper: '#fff',
        },
    },
    components: {
        MuiTypography: {
            styleOverrides: {
                h1: {
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 'bold',
                    fontSize: '2.7rem',
                },
                h2: {
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                },
            },
        },
        MuiListItemText: {
            styleOverrides: {
                root: {
                    cursor: 'default',
                },
            },
        },
    },
})
