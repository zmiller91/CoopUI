'use client'

import React, { useState } from "react"
import componentClient from "../../../../client/component"
import { currentCoop } from "../../coop-context"
import { useRouter } from "next/navigation"
import { AppContent } from "../../../../components/app-content"
import { usePageTitle } from "../../../../components/app-bar"

import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"

export default function ComponentRegistry() {
    usePageTitle("Register Component")

    const coopId = currentCoop()
    const router = useRouter()

    const [serialNumber, setSerialNumber] = useState("")
    const [name, setName] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const canSubmit = serialNumber.trim().length > 0 && name.trim().length > 0 && !submitting

    function register() {
        if (!canSubmit) return
        setSubmitting(true)

        componentClient.register(coopId, serialNumber.trim(), name.trim(), () => {
            router.back()
        })
    }

    return (
        <AppContent>
            <Stack spacing={2}>
                {/* Header */}
                <Box>
                    <Typography variant="h6" fontWeight={700}>
                        Register component
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                        Give your device a friendly name. You can change it later.
                    </Typography>
                </Box>

                {/* Form card */}
                <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                    <Box sx={{ p: 2 }}>
                        <Stack spacing={2}>
                            <TextField
                                label="Serial Number"
                                value={serialNumber}
                                onChange={(e) => setSerialNumber(e.target.value)}
                                required
                                fullWidth
                                autoFocus
                                placeholder="e.g. C8AC0880"
                                inputProps={{ inputMode: "text", autoCapitalize: "characters" as any }}
                            />

                            <TextField
                                label="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                fullWidth
                                placeholder="e.g. Coop Door Controller"
                            />
                        </Stack>
                    </Box>

                    <Divider />

                    {/* Actions */}
                    <Box sx={{ p: 2, display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
                        <Button
                            variant="text"
                            color="inherit"
                            onClick={() => router.back()}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={register}
                            disabled={!canSubmit}
                        >
                            Register
                        </Button>
                    </Box>
                </Paper>
            </Stack>
        </AppContent>
    )
}
