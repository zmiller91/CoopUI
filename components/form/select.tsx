import React, {useEffect, useState} from "react";

export default function SelectInput(props: SelectInputProps) {


    const hasPlaceholder = !!props.placeholder;
    const emptyValue = "";

    // Keep a local value so we can manage invalid state cleanly
    const [localValue, setLocalValue] = useState<any>(emptyValue);

    useEffect(() => {
        if (!hasPlaceholder) {
            const hasValue = props.value && props.value !== emptyValue;
            if (!hasValue && props.options.length > 0) {
                props.onChange(props.options[0].value);
            }
        }
    }, [hasPlaceholder, props.options, props.value]);


    function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const value = event.target.value;
        setLocalValue(value);
        props.onChange(value);
    }

    return (
        <div className="mb-4">
            <div>
                <label className="block text-xs font-medium mb-1 text-neutral-600" htmlFor={props.id}>
                    {props.title}
                </label>

                <select
                    className="w-full rounded-md px-3 py-2 text-sm h-[40px]
                    bg-neutral-50 text-neutral-900 border
                    transition-colors
                    focus:outline-none focus:ring-0"
                    id={props.id}
                    name={props.id}
                    value={localValue}
                    onChange={handleChange}
                    required={props.required}
                    disabled={props.disabled}>
                    {hasPlaceholder && (
                        <option value={emptyValue} disabled>
                            {props.placeholder}
                        </option>
                    )}

                    {props.options.map((opt) => (
                        <option key={String(opt.value)} value={String(opt.value)}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export type SelectOption ={
    label: string;
    value: any;
};

export interface SelectInputProps {
    id: string;
    title: string;
    value: any;
    onChange: (value: any) => void;

    options: SelectOption[];

    required?: boolean;
    disabled?: boolean;

    /** Shown as the first disabled option (defaults to "Select...") */
    placeholder?: string;
}
