'use client'

import React, { useEffect, useState } from "react"
import ConfirmDialog from "../../../components/dialog/confirm"
import Typography from "@mui/material/Typography"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Radio from "@mui/material/Radio"
import SendIcon from "@mui/icons-material/Send"
import contactClient, { Contact } from "../../../client/contact"
import areaClient from "../../../client/area"

export interface ExportDataDialogProps {
    open: boolean
    coopId: string
    areaId: string
    onClose: () => void
}

export default function ExportDataDialog(props: ExportDataDialogProps) {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [selectedContactId, setSelectedContactId] = useState<string>("")
    const [error, setError] = useState<string | undefined>(undefined)

    useEffect(() => {
        if (!props.open) return
        setError(undefined)
        contactClient.list(props.coopId, (r) => setContacts(r.contacts ?? []))
    }, [props.open, props.coopId])

    function close() {
        setSelectedContactId("")
        setError(undefined)
        props.onClose()
    }

    function send() {
        if (!selectedContactId) return
        setError(undefined)
        areaClient.export(
            props.coopId,
            props.areaId,
            { contactId: selectedContactId },
            () => close(),
            () => setError("Couldn't send the export - make sure that contact has an email address, then try again."))
    }

    return (
        <ConfirmDialog
            title="Export Data"
            open={props.open}
            onConfirm={send}
            onCancel={close}
            confirmLabel="Send"
            confirmIcon={<SendIcon />}
            confirmDisabled={!selectedContactId}
        >
            {contacts.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                    No contacts yet - add one on the Contacts page first.
                </Typography>
            ) : (
                <RadioGroup value={selectedContactId} onChange={(e) => setSelectedContactId(e.target.value)}>
                    {contacts.map((c) => (
                        <FormControlLabel
                            key={c.id}
                            value={c.id}
                            control={<Radio />}
                            label={c.email ? `${c.displayName} (${c.email})` : c.displayName}
                        />
                    ))}
                </RadioGroup>
            )}

            {error && (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}
        </ConfirmDialog>
    )
}
