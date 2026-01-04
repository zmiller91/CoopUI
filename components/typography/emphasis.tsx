import * as React from "react";
import Box from "@mui/material/Box";

interface EmphasisProps {
    children: React.ReactNode;
    strong?: boolean;
    color?: string;
}

export default function Emphasis({
                                     children,
                                     strong = true,
                                     color,
                                 }: EmphasisProps) {
    return (
        <Box component="span" sx={{
                fontWeight: strong ? 600 : 400,
                color,
            }}
        >
            {children}
        </Box>
    );
}
