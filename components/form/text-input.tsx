import React, {useState} from "react";

export default function TextInput(props:TextInputProps) {

    const [showInvalid, setShowInvalid] = useState(false)

    function handleChange(event) {
        props.onChange(event.target.value, event)
    }

    return (
        <div className=" mb-4">
            <div className="min-h-[48px] background-neutral-100 border-b-2">
                <label className="block text-gray-700 text-xs pt-2 pl-4" htmlFor={props.id}>
                        {props.title}
                </label>
                <input className="appearance-none border-none w-full pl-4 background-neutral-100 text-gray-700 focus:outline-none" 
                    id={props.id} 
                    type={props.type || "text"}
                    name={props.id}
                    value={props.value} 
                    onChange={handleChange}
                    required={props.required}
                    onInvalid={() => setShowInvalid(true)}/>
            </div>
            {showInvalid && <div className="error-text text-xs pl-4">{props.title} is required.</div>}
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