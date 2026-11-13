import { category } from "../Javascript/category";
import {Link} from "react-router-dom"
function Card({items,image,path}){
 return (
    <>
    <Link to={path} className="group">
    <div className="max-w-7xl mx-auto px-5 py-5">
             <div className="rounded overflow-hidden w-full ">
                 <div className="relative">
                     <img src={items.image} className='w-full aspect-[3/4] object-cover' />
               </div>
           </div>
         </div>
       </Link>
    </>
 )
}
export default Card;