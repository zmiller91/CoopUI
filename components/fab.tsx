import {ReactNode} from "react";

export interface FloatingActionButtonProps {
    onClick: () => void,
    children:ReactNode
}

export default function FloatingActionButton(props: FloatingActionButtonProps) {
    return (
        <button
            onClick={props.onClick}
            className="
            fixed
            end-4
            bottom-[calc(56px+16px)]
            h-14 w-14
            rounded-full

            bg-primary-600
            text-neutral-50

            shadow-md
            hover:bg-primary-700
            active:bg-primary-800

            focus:outline-none
            focus:ring-2
            focus:ring-primary-600/40
            focus:ring-offset-2
            focus:ring-offset-neutral-100

            transition-colors
            no-highlights
        ">
            {props.children}
        </button>
    );
}
