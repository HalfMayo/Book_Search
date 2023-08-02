import {BookProps} from "../interfaces/InfoProps"
import { ReactComponent as Dots } from '../assets/svgs/dots-3-horizontal-svgrepo-com.svg'
import { useLibrary } from '../contexts/LibraryContext';


interface ToggleElProps {
    info: BookProps
    i: number;
    className?: string,
    width?: string,
    checked?: boolean,
    readonly?: boolean,
}

export default function ToggleCheckbox({info, i, className, width = "500px", checked, readonly} : ToggleElProps) {

    const{dispatch} = useLibrary()

    return(
        <li className="list-none" style={{width: `${width}`}}>
            <div className={`p-4 bg-white text-base m-0 flex items-center justify-between gap-4 w-full ${className}`}>
                <div className="w-full flex items-center gap-1" key="title">
                    <label className="checkbox-container mb-[14px]" htmlFor={i.toString()}>
                            <input type="checkbox" id={i.toString()} name={i.toString()} onClick={() => dispatch({type:"toggle", payload: i})} checked={checked} readOnly={readonly}/>
                            <span className="checkbox"></span>
                    </label>
                    <span className="ml-2 h-auto" ></span>
                    <div className="flex items-center justify-center gap-4">
                        <img className={`object-cover w-14 h-14 ${info.img ? "" : "hidden"}`} src={info.img}/>
                        <div  className="flex flex-col items-start justify-center" style={{width: `${parseInt(width)-144}px`}}>
                            <h3 className="overflow-hidden text-left brief-title">{info.title}</h3>
                            <p className={`text-sm overflow-hidden text-left brief-subtitle ${info.subtitle ? "" : "hidden"}`}>{info.subtitle}</p>
                        </div>
                    </div>
                </div>
                
                <Dots className="cursor-pointer" width="24px" height="24px" onClick={() => dispatch({type:"book/open", payload: info.id})}/>
            </div>      
        </li>
    )
}