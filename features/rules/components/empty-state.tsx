import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export interface EmptyStateProps {
    message: string
}

export default function EmptyState(props: EmptyStateProps) {
    return (
        <Box
            sx={{
                border: '1.5px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                p: 2,
                bgcolor: 'action.hover',
                textAlign: 'center',
            }}
        >
            <Typography variant="body2" color="text.secondary">
                {props.message}
            </Typography>
        </Box>
    )
}