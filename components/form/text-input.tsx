import React, {useState} from "react";

export default function TextInput(props:TextInputProps) {

    const [showInvalid, setShowInvalid] = useState(false)

    function handleChange(event) {
        props.onChange(event.target.value, event)
    }

    return (
        <div className="mt-3">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={props.id}>
                    {props.title}
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                id={props.id} 
                type={props.type || "text"}
                name={props.id}
                value={props.value} 
                onChange={handleChange}
                required={props.required}
                onInvalid={() => setShowInvalid(true)}/>
            {showInvalid && <div className="error-text">{props.title} is required.</div>}
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