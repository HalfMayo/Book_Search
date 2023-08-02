import {ReactComponent as Book} from '../assets/svgs/book-education-library-2-svgrepo-com.svg'
export default function Header() {
    return(
        <div className="h-20 flex justify-between items-center w-11/12 fixed left-2/4 translate-x-[-50%]">
            <div className="flex justify-center items-center gap-2">
                <Book width="48px" height="48px"/>
                <p className="font-bold text-2xl pb-1">Personal Library</p>
            </div>
        </div>
    )
}