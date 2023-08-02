import { useLibrary } from '../contexts/LibraryContext'

interface TabsProps {
    className?: string
    tabs: string[],
    state: number,
    onClick?: (i:number) => void,
}

export default function Tabs({className, tabs, state, onClick}: TabsProps) {

    const{dispatch} = useLibrary();

    return(
        <>
        <ul className={`relative flex gap-4 ${className}`}>
            <div className="absolute w-24 h-8 border-solid border-b-[3px] border-primary transition duration-300" style={{transform: `translateX(${state*112}px)`}}></div>
            {tabs.map((tab, i) => 
                <li className="w-24 flex items-center justify-center" key={i}>
                    <button className={state === i ? "font-bold" : "font-normal"} onClick={dispatch? () => dispatch({type: "tab/active", payload: i}) : () => onClick?.(i)}>{tab}</button>
                </li>
            )}
        </ul>
        </>
    )
}