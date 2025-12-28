import React, {useState} from "react";

export default function TextInput(props:TextInputProps) {

    const [showInvalid, setShowInvalid] = useState(false)

    function handleChange(event) {
        if (showInvalid) setShowInvalid(false);
        props.onChange(event.target.value, event)
    }

    return (
        <div className="mb-4">
            <div>
                <label className="block text-xs font-medium mb-1 text-neutral-600" htmlFor={props.id}>
                        {props.title}
                </label>
                <input
                    className={`
                        w-full rounded-md px-3 py-2 text-sm h-[40px]
                        background-neutral-50 text-neutral-900 border-neutral-300
                        border transition-colors
                        focus:outline-none focus:ring-0
                        ${showInvalid 
                            ? "border-error-500 focus:border-error-500"
                            : "border-neutral-300 focus:border-primary-600"
                        }
                    `}
                    id={props.id}
                    type={props.type || "text"}
                    name={props.id}
                    value={props.value}
                    onChange={handleChange}
                    required={props.required}
                    onInvalid={() => setShowInvalid(true)}/>
            </div>
            {showInvalid && <div className="pt-1 error-text text-xs">{props.title} is required.</div>}
        </div>
    )
}

export interface TextInputProps {
    id:string;
    title:string;
    value:any;
    onChange: (value: any, event?:any) => void;
    type?:string;
    required?:boolean;

}