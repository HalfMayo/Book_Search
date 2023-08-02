import ToggleCheckbox from "./ToggleCheckbox";
import {BookProps} from "../interfaces/InfoProps";

export interface AccordionProps {
    infos: BookProps[] | undefined,
    width?: string,
    compressed?: boolean,
    className?: string,
    checkbox? : boolean,
    checked?: boolean,
    readonly?: boolean,
}

export default function Accordion({infos, width = "600px", className, checked, readonly}: AccordionProps) {


    return(
        <ul className={className} style={{width: `${width}`}}>
            {infos &&
                infos.map((info, i) =>
                    <ToggleCheckbox
                        key={i}
                        info={info}
                        i={i}
                        className="border-b border-surface-low"
                        width="100%"
                        checked={checked}
                        readonly={readonly}
                        />
            )}</ul>
    )
}