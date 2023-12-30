export function PageTitle(props:TitleProps) {
    return (
        <div className="pl-4 pt-4 pb-4">
            <span className="text-4xl font-bold neutral-text-900">{props.title}</span>
        </div>
    )
}

export interface TitleProps {
    title:string;
}