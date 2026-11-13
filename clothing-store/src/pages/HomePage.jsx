import { products } from "../Javascript/products";
import Hero from "../Components/Hero";
import ProductCard from "../Components/ProductCard";
import Bannerscroll from "../Components/Bannerscroll"
import { category } from "../Javascript/category"
import Card from "../Components/Card";
function HomePage(){
     const Newitems = products.filter(item => item.isnew === true);
  return(
    <>
    <Hero />
      <div className="text-2xl md:text-4xl font-semibold mt-2">
        <h1 className="text-center">Our Category for Collection</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {category.map((items) =>(
            <Card 
              key = {items.id}
              items = {items}
              path={items.path}
            />
          ))}
        </div>
      </div>
    <Bannerscroll/>
    <section>
            <h1 className='text-2xl md:text-4xl font-medium text-center py-4'>New-Items</h1>
            <p className='text-sm md:text-xl text-gray-400 pb-2 text-center'>Explore timeless pieces and elevate your wardrobe.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Newitems.map((item) => (
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
export default HomePage;