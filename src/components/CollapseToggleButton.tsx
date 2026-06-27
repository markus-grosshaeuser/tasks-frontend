import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import IconButtonComp from './IconButtonComp.tsx'
import React from 'react'
import { useTranslation } from 'react-i18next'

export type CollapseToggleButtonProps = {
    isCollapsed: boolean
    toggleCollapse: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const CollapseToggleButton = ({
    isCollapsed,
    toggleCollapse,
}: CollapseToggleButtonProps) => {
    const { t } = useTranslation()

    return (
        <IconButtonComp
            data-testid="collapse-toggle-button"
            onClicked={(e) => toggleCollapse(e)}
            ariaLabel={isCollapsed ? t('expand') : t('collapse')}
            ariaExpanded={!isCollapsed}
        >
            {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButtonComp>
    )
}

export default CollapseToggleButton
