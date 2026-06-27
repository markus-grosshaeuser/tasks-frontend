import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { theme } from './theme.ts'
import { lazy } from 'react'

const TasksScreen = lazy(() => import('./pages/TasksScreen.tsx'))
const TaskListsScreen = lazy(() => import('./pages/TaskListsScreen.tsx'))

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<TaskListsScreen />} />
                    <Route path="/:taskListId" element={<TasksScreen />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}
