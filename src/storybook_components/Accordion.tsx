import { useState, useEffect, useRef } from 'react'
import Toggle from "./Toggle";
import ToggleWButtons from '../components/ToggleWButtons';
import {BookProps, ToggleProps} from "../interfaces/InfoProps";

export interface AccordionProps {
    infos: ToggleProps[] | BookProps[] | undefined,
    width?: string,
    upperState?: number | null,
    upperSetState?: (i:number) => void
    compressed?: boolean,
    className?: string,
}

export default function Accordion({infos, width = "600px", upperState, upperSetState, compressed = false, className}: AccordionProps) {

    const [isOpen, setIsOpen] = useState<number|null>(null);
    const click = useRef<any>(null);

    function isBook(el: ToggleProps | BookProps): el is BookProps {
        return typeof (el as BookProps).added === "boolean"
    }

    function toggleText(i:number) {
        isOpen === i ? setIsOpen(null) : setIsOpen(i);
    }

    function clickOutside(e: any) {
        if(click.current && !click.current.contains(e.target)) {
            setIsOpen(null);
        }
    }

    useEffect(() => {
        window.addEventListener("mousedown", clickOutside);
        return () => {
            window.removeEventListener("mousedown", clickOutside);
        }
    }, [clickOutside])

    return(
        <ul className={className} ref={click} style={{width: `${width}`}}>
            {infos &&
                infos.map((info, i) =>
                    isBook(info)
                        ? <ToggleWButtons
                        key={i}
                        info={info}
                        i={i}
                        isOpen={typeof upperState === "undefined" ? isOpen : upperState}
                        onClick={upperSetState ? upperSetState : toggleText}
                        className={isOpen === i || i === infos.length - 1 ? "" : "border-b border-surface-low"}
                        width="100%"
                        compressed={compressed}
                        />
                        : <Toggle
                            key={i}
                            info={info}
                            i={i}
                            isOpen={typeof upperState === "undefined" ? isOpen : upperState}
                            onClick={upperSetState ? upperSetState : toggleText}
                            className={isOpen === i || i === infos.length - 1 ? "" : "border-b border-surface-low"}
                            width="100%"
                            compressed={compressed}
                        />
            )}</ul>
    )
}