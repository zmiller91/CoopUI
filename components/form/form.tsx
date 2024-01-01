import { Children, ReactNode } from "react";

export default function Form(props:FromProps) {
    return (
        <div className="lg:w-1/2">
            <form action={props.onSubmit}>
                {props.children}
                <button className="h-[36px] w-full background-accent-500 text-neutral-200 shadow-md rounded-md" 
                        type="submit" >
                            <span className="pr-4 pl-4 flex center-items justify-center">
                                {props.submitText}
                            </span>
                        
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