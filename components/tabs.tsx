'use client'

import React from 'react'
import MuiTabs from '@mui/material/Tabs'
import MuiTab from '@mui/material/Tab'
import Box from '@mui/material/Box'

export interface TabProps {
    tabs: string[]
    onChange: (tab: string) => void
}

export default function Tabs({ tabs, onChange }: TabProps) {
    const [value, setValue] = React.useState(0)

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
        onChange(tabs[newValue])
    }

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <MuiTabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                indicatorColor="secondary" // maps to your accent color
                textColor="inherit"
            >
                {tabs.map((tab) => (
                    <MuiTab
                        key={tab}
                        label={tab}
                        sx={{
                            fontWeight: 600,
                            textTransform: 'none', // prevents ALL CAPS
                            minHeight: 48,
                        }}
                    />
                ))}
            </MuiTabs>
        </Box>
    )
}
