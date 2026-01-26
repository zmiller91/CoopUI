import {RuleNotification} from "../../../client/rule";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Emphasis from "../../../components/typography/emphasis";
import * as React from "react";

export default function getNotificationSentence(notification: RuleNotification) {

    const contacts = notification.recipients.map(c => c.displayName)
    let contactDescription = contacts.join(" and ");
    if(contacts.length > 2) {
        const shown = contacts.slice(0, 2).join(", ");
        const more = contacts.length - 2;
        contactDescription =  `${shown}, and ${more} others`;
    }

    let action = "";
    if(notification.channel == "PUSH") {
        action = "push notification"
    }

    else if(notification.channel == "INBOX") {
        action = "inbox message"
    }

    else if(notification.channel == "EMAIL") {
        action = "e-mail";
    }

    else if(notification.channel == "TEXT") {
        action = "text message";
    }

    const article = /^[aeiou]/i.test(action) ? "an " : "a ";

    return (
        <Box
            sx={{
                mt: 1,
                px: 2,
                py: 1.25,
                borderRadius: 2,
                bgcolor: "action.hover",
                borderLeft: "4px solid",
                borderLeftColor: "success.main"
            }}
        >
            <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                    {"Send "}
                    {article}
                    <Emphasis>{action}</Emphasis>
                    {contacts.length > 0 ? (
                        <>
                            {" to "}
                            <Emphasis>{contactDescription}</Emphasis>
                        </>
                    ) : ""}
                </Typography>
            </Stack>
        </Box>
    );

}