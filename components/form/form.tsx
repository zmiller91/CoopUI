import { ReactNode, FormEvent } from "react";
import { Box, Button } from "@mui/material";

export interface FormProps {
    submitText?: string;
    children: ReactNode;
    onSubmit?: () => void;
    disabled?: boolean;
}

export default function Form({
                                 submitText = "Submit",
                                 children,
                                 onSubmit,
                                 disabled,
                             }: FormProps) {
    function handleSubmit(e: FormEvent) {
        if (!onSubmit) return;
        e.preventDefault();
        onSubmit();
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            width="100%"
            display="flex"
            flexDirection="column"
            gap={2}
        >
            {children}

            {onSubmit && (
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={disabled}
                    sx={{ height: 40 }}
                >
                    {submitText}
                </Button>
            )}
        </Box>
    );
}
