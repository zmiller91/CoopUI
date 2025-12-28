import { Children, ReactNode } from "react";

export default function Form(props:FromProps) {
    return (
        <div className="w-full">
            <form action={props.onSubmit}>
                {props.children}
                <button
                    type="submit"
                    disabled={props.disabled}
                    className="
                        h-[40px] w-full
                        px-4
                        rounded-md
                        bg-primary-600
                        text-neutral-50
                        font-medium
                        shadow-sm
                        transition-colors
                        hover:bg-primary-700
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-primary-400
                        focus-visible:ring-offset-2
                        disabled:bg-neutral-300
                        disabled:text-neutral-500
                        disabled:shadow-none
                      ">
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
    disabled?: boolean;
}