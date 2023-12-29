import { Children, ReactNode } from "react";

export default function Form(props:FromProps) {
    return (
        <div className="lg:w-1/2">
            <form action={props.onSubmit}>
                {props.children}
                <button className="mt-3 float-right bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                        type="submit" >
                        {props.submitText}
                </button>
            </form>
        </div>
    )
}

export interface FromProps {
    submitText: string;
    onSubmit: () => void;
    children: ReactNode;
}