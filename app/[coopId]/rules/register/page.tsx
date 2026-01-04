'use client'

import ruleClient, {Rule} from "../../../../client/rule";
import React, {useState, useEffect, useMemo} from "react";
import {currentCoop} from "../../coop-context"
import { useRouter } from 'next/navigation'
import { AppContent } from "../../../../components/app-content";
import {usePageTitle} from "../../../../components/app-bar";
import RuleEditor from "../../../../features/rules/components/rule-editor";

export default function RegisterRules() {

    usePageTitle("New Automation")

    const coopId = currentCoop();
    const router = useRouter();

    const [hasRuleEditorLoaded, setHasRuleEditorLoaded] = useState(false);
    const hasLoaded = useMemo<boolean>(() => hasRuleEditorLoaded, [hasRuleEditorLoaded]);

    const submit = (rule: Rule) => {
        ruleClient.create(coopId, rule, (rule) => {
            router.push(`/${coopId}/rules`);
        })
    }

    return (
        <AppContent hasLoaded={hasLoaded}>
            <RuleEditor setHasLoaded={setHasRuleEditorLoaded}
                        coopId={coopId}
                        rule={{} as Rule}
                        onSubmit={submit}
                        submitText="Create automation"/>
        </AppContent>
    )
}