import { products } from "../Javascript/products";
import Menhero from "../Components/Menhero";
import ProductCard from "../Components/ProductCard";
function Men(){
    const menpages = products.filter(item => item.category === "men");
    return(
        <>
         <Menhero/>
            <section>
                <h1 className='text-2xl md:text-4xl font-medium text-center py-4'>New-Items</h1>
                <p className='text-sm md:text-xl text-gray-400 pb-2 text-center'>Explore timeless pieces and elevate your wardrobe.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {menpages.map((item) => (
                        <ProductCard
                            key={item.id}
                            item={item}
                        />
                    ))}
                </div>
            </section>
        </>
    )
}
export default Men;