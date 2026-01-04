'use client'

import {usePageTitle} from "../../../../components/app-bar";
import {currentCoop} from "../../coop-context";
import {useParams, useRouter} from "next/navigation";
import React, {useEffect, useMemo, useState} from "react";
import ruleClient, {Rule} from "../../../../client/rule";
import {AppContent} from "../../../../components/app-content";
import RuleEditor from "../../../../features/rules/components/rule-editor";
import Button from "@mui/material/Button";
import {DeleteOutline} from "@mui/icons-material";
import { Stack } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import Form from "../../../../components/form/form";
import SelectInput from "../../../../components/form/select";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Emphasis from "../../../../components/typography/emphasis";
import DeleteDialog from "../../../../components/dialog/delete";



export default function Rule() {

    usePageTitle("Update Automation")
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const coopId = currentCoop();
    const ruleId = useParams()["ruleId"] as string;
    const router = useRouter();

    const [hasFetchLoaded, setHasFetchLoaded] = useState(false);
    const [hasRuleEditorLoaded, setHasRuleEditorLoaded] = useState(false);
    const hasLoaded = useMemo<boolean>(() => hasRuleEditorLoaded && hasFetchLoaded,
        [hasRuleEditorLoaded, hasFetchLoaded]);

    const [rule, setRule] = useState({} as Rule);


    const [openDelete, setOpenDelete] = useState(false);

    const submit = (rule: Rule) => {
        console.log("User wants to update rule")
        console.log(rule)
    }

    const deleteRule = () => {
        console.log("Deleting...")
        setOpenDelete(false)
    }

    useEffect(() => {
        ruleClient.getRule(coopId, ruleId, (rule) => {
            setRule(rule)
            setHasFetchLoaded(true)
        })
    }, [coopId, ruleId]);

    return (
        <AppContent hasLoaded={hasLoaded}>
            <Stack spacing={2}>
                <RuleEditor setHasLoaded={setHasRuleEditorLoaded}
                            coopId={coopId}
                            rule={rule}
                            onSubmit={submit}
                            submitText="Update automation"/>

                <Button
                    variant="text"
                    onClick={() => setOpenDelete(true)}
                    fullWidth
                    color="error">
                    Delete Automation
                </Button>

                <DeleteDialog title="Delete automation?"
                              onDelete={deleteRule}
                              onCancel={() => setOpenDelete(false)}
                              open={openDelete}>

                    <Stack spacing={1.75}>
                        <Typography variant="body2" color="text.secondary">
                            This will permanently delete:
                        </Typography>

                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            <Emphasis>{rule.name}</Emphasis>
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            This action cannot be undone.
                        </Typography>
                    </Stack>
                </DeleteDialog>

            </Stack>
        </AppContent>
    )
}